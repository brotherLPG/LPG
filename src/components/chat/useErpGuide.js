/**
 * useErpGuide.js
 *
 * Custom React hook managing the state and behavior of the Ask ERP Guide widget:
 * - Message collection & state updates (single entry updated in-place)
 * - UUID generation per new question (using crypto.randomUUID with fallback)
 * - Immediate in-flight guard preventing rapid double-submissions or double Enters
 * - Client-side deduplication within rolling 15-minute window (scrolls to existing answer)
 * - Polling/pending checks for HTTP 202 Accepted responses (reusing UUID & question)
 * - Manual retries with UUID reuse on error or pending check timeout
 * - Request cancellation and automatic cleanup on unmount or user logout
 * - Clearing state when authenticated user changes
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { sendChatMessage } from '../../api/chat.api.js';

// Deduplication window: 15 minutes (matches backend rate-limiting window)
const DEDUPLICATION_WINDOW_MS = 15 * 60 * 1000;

// Maximum duration to poll for HTTP 202 responses before timing out and offering manual retry
const PENDING_TIMEOUT_MS = 45 * 1000;

// Polling interval between 202 pending checks
const PENDING_CHECK_INTERVAL_MS = 2500;

/**
 * Normalizes question text for deduplication matching (trimmed, lowercased, single whitespace).
 */
export function normalizeQuestion(text) {
  if (!text) return '';
  return text.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Safely extracts the AI instructor answer from the backend response,
 * inspecting nested payload wrappers (`data.data`, `data.answer`, etc.)
 * and ignoring generic API success messages like "Response retrieved successfully".
 */
export function extractAnswerText(data) {
  if (!data) return '';
  if (typeof data === 'string') return data;

  const genericMessages = [
    'response retrieved successfully',
    'success',
    'successful',
    'ok',
    'data retrieved successfully',
    'request processed successfully',
    'retrieved successfully',
  ];

  const isGeneric = (str) =>
    typeof str === 'string' && genericMessages.includes(str.trim().toLowerCase());

  // 1. Check nested data payload first (e.g. response.data.data)
  if (data.data !== undefined && data.data !== null) {
    if (typeof data.data === 'string' && !isGeneric(data.data)) {
      return data.data;
    }
    if (typeof data.data === 'object') {
      const nested = data.data;
      if (nested.answer && typeof nested.answer === 'string') return nested.answer;
      if (nested.reply && typeof nested.reply === 'string') return nested.reply;
      if (nested.instructions && typeof nested.instructions === 'string') return nested.instructions;
      if (nested.guidance && typeof nested.guidance === 'string') return nested.guidance;
      if (nested.content && typeof nested.content === 'string') return nested.content;
      if (nested.text && typeof nested.text === 'string') return nested.text;
      if (nested.response && typeof nested.response === 'string') return nested.response;
      if (nested.message && typeof nested.message === 'string' && !isGeneric(nested.message)) {
        return nested.message;
      }
    }
  }

  // 2. Check top-level properties (e.g. response.data.answer)
  if (data.answer && typeof data.answer === 'string') return data.answer;
  if (data.reply && typeof data.reply === 'string') return data.reply;
  if (data.instructions && typeof data.instructions === 'string') return data.instructions;
  if (data.guidance && typeof data.guidance === 'string') return data.guidance;
  if (data.content && typeof data.content === 'string') return data.content;
  if (data.text && typeof data.text === 'string') return data.text;
  if (data.response && typeof data.response === 'string') return data.response;

  // 3. Check message only if it's not a generic API status wrapper
  if (data.message && typeof data.message === 'string' && !isGeneric(data.message)) {
    return data.message;
  }

  return '';
}

/**
 * Generates an RFC4122 v4 UUID with fallback if crypto.randomUUID is unavailable.
 */
export function generateUUID() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Extracts current user identity identifier (ID or token) from localStorage.
 */
function getCurrentUserIdentifier() {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const parsed = JSON.parse(userStr);
      return parsed?._id || parsed?.id || parsed?.email || userStr;
    }
  } catch {
    // fallback to token
  }
  return localStorage.getItem('token') || null;
}

export function useErpGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [highlightedMessageId, setHighlightedMessageId] = useState(null);

  // References to manage guards, abort controllers, timers and DOM scroll
  const isSubmittingRef = useRef(false);
  const activeControllersRef = useRef(new Map()); // requestId -> AbortController
  const pendingTimersRef = useRef(new Map()); // requestId -> timer ID
  const pendingStartTimesRef = useRef(new Map()); // requestId -> timestamp
  const chatListRef = useRef(null);
  const currentUserRef = useRef(getCurrentUserIdentifier());

  /**
   * Smoothly scrolls chat message list to bottom.
   */
  const scrollToBottom = useCallback((smooth = true) => {
    if (!chatListRef.current) return;
    try {
      chatListRef.current.scrollTo({
        top: chatListRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto',
      });
    } catch {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
    }
  }, []);

  /**
   * Scrolls to a specific message element by ID and highlights it.
   */
  const scrollToMessage = useCallback((messageId) => {
    if (!chatListRef.current) return;
    const element = chatListRef.current.querySelector(`[data-message-id="${messageId}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedMessageId(messageId);
      setTimeout(() => setHighlightedMessageId(null), 2500);
    }
  }, []);

  /**
   * Cancels in-flight requests and clears pending check timers for a given requestId (or all).
   */
  const cancelPendingChecks = useCallback((requestId = null) => {
    if (requestId) {
      const controller = activeControllersRef.current.get(requestId);
      if (controller) {
        controller.abort();
        activeControllersRef.current.delete(requestId);
      }
      const timer = pendingTimersRef.current.get(requestId);
      if (timer) {
        clearTimeout(timer);
        pendingTimersRef.current.delete(requestId);
      }
      pendingStartTimesRef.current.delete(requestId);
    } else {
      activeControllersRef.current.forEach((controller) => controller.abort());
      activeControllersRef.current.clear();
      pendingTimersRef.current.forEach((timer) => clearTimeout(timer));
      pendingTimersRef.current.clear();
      pendingStartTimesRef.current.clear();
    }
  }, []);

  /**
   * Clean up pending operations on unmount or logout.
   */
  useEffect(() => {
    return () => {
      cancelPendingChecks();
    };
  }, [cancelPendingChecks]);

  /**
   * Watch for authenticated user changes or logout and clear chat state.
   */
  useEffect(() => {
    const handleStorageChange = () => {
      const latestUser = getCurrentUserIdentifier();
      if (latestUser !== currentUserRef.current) {
        currentUserRef.current = latestUser;
        cancelPendingChecks();
        setMessages([]);
        setInput('');
        setIsSending(false);
        isSubmittingRef.current = false;
      }
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [cancelPendingChecks]);

  /**
   * Performs an API request (initial or pending re-check or retry) for a message entry.
   * Updates that SAME entry in-place.
   */
  const executeChatRequest = useCallback(
    async (requestId, questionText, isCheckOrRetry = false) => {
      // Abort previous controller for this requestId if any
      const existingController = activeControllersRef.current.get(requestId);
      if (existingController) {
        existingController.abort();
      }

      const controller = new AbortController();
      activeControllersRef.current.set(requestId, controller);

      try {
        const response = await sendChatMessage(
          { requestId, question: questionText },
          { signal: controller.signal }
        );

        // Case 1: 200 OK — Answer ready
        if (response.status === 200) {
          cancelPendingChecks(requestId);

          const answerText = extractAnswerText(response.data);

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === requestId
                ? {
                    ...msg,
                    status: 'success',
                    answer: answerText,
                    errorType: null,
                    errorMessage: null,
                    timestamp: Date.now(),
                  }
                : msg
            )
          );

          setIsSending(false);
          isSubmittingRef.current = false;

          // Auto-scroll to bottom with newly received answer
          setTimeout(() => scrollToBottom(true), 50);
          return;
        }

        // Case 2: 202 Accepted — Answer still generating in background
        if (response.status === 202) {
          const startTime =
            pendingStartTimesRef.current.get(requestId) || Date.now();
          if (!pendingStartTimesRef.current.has(requestId)) {
            pendingStartTimesRef.current.set(requestId, startTime);
          }

          const elapsed = Date.now() - startTime;
          if (elapsed >= PENDING_TIMEOUT_MS) {
            // Polling timed out: offer manual retry on the same entry
            cancelPendingChecks(requestId);
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === requestId
                  ? {
                      ...msg,
                      status: 'timeout',
                      errorMessage:
                        'The answer is taking longer than usual to generate. You can check again or retry.',
                      allowRetry: true,
                    }
                  : msg
              )
            );
            setIsSending(false);
            isSubmittingRef.current = false;
            return;
          }

          // Schedule next pending check with the SAME UUID and question
          const timer = setTimeout(() => {
            executeChatRequest(requestId, questionText, true);
          }, PENDING_CHECK_INTERVAL_MS);
          pendingTimersRef.current.set(requestId, timer);
        }
      } catch (error) {
        if (error.isCancelled) {
          // Request was aborted by cleanup or user action
          return;
        }

        cancelPendingChecks(requestId);
        setIsSending(false);
        isSubmittingRef.current = false;

        let errorType = 'generic';
        let errorMessage = error.message || 'Failed to get an answer. Please try again.';

        if (error.isRateLimited || error.status === 429) {
          errorType = 'rate_limit';
          errorMessage =
            error.message ||
            'Rate limit reached: Maximum 10 questions per 15-minute window. Please wait before asking again.';
        } else if (error.isUnavailable || error.status === 503) {
          errorType = 'unavailable';
          errorMessage =
            error.message ||
            'The Ask ERP service is temporarily unavailable. Please try again in a moment.';
        }

        // Update the SAME message entry with error details and retry capability
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === requestId
              ? {
                  ...msg,
                  status: 'error',
                  errorType,
                  errorMessage,
                  retryAfter: error.retryAfter,
                  allowRetry: true,
                }
              : msg
          )
        );

        setTimeout(() => scrollToBottom(true), 50);
      }
    },
    [cancelPendingChecks, scrollToBottom]
  );

  /**
   * Submits a new user question.
   * - Enforces immediate in-flight protection.
   * - Checks client deduplication window; if duplicate found, scrolls to existing answer and skips request.
   * - Generates a new UUID and creates one entry.
   */
  const submitQuestion = useCallback(
    async (text) => {
      const trimmed = (text || '').trim();
      if (!trimmed) return;

      // Immediate in-flight guard: prevent double-clicks or repeated Enter presses
      if (isSubmittingRef.current) {
        return;
      }
      isSubmittingRef.current = true;
      setIsSending(true);

      const normalized = normalizeQuestion(trimmed);
      const now = Date.now();

      // Check for client-side duplicate within deduplication window
      const existingSuccessEntry = messages.find(
        (m) =>
          m.status === 'success' &&
          normalizeQuestion(m.question) === normalized &&
          now - m.timestamp < DEDUPLICATION_WINDOW_MS
      );

      if (existingSuccessEntry) {
        // Scroll to that answer and skip sending an unnecessary network request
        setInput('');
        setIsSending(false);
        isSubmittingRef.current = false;
        scrollToMessage(existingSuccessEntry.id);
        return;
      }

      // Generate a fresh crypto UUID for this new question
      const requestId = generateUUID();

      const newEntry = {
        id: requestId,
        question: trimmed,
        answer: null,
        status: 'pending', // in-flight / generating
        errorType: null,
        errorMessage: null,
        allowRetry: false,
        timestamp: now,
      };

      setMessages((prev) => [...prev, newEntry]);
      setInput('');

      // Auto-scroll down immediately for the user's question
      setTimeout(() => scrollToBottom(true), 30);

      // Execute request
      await executeChatRequest(requestId, trimmed, false);
    },
    [messages, executeChatRequest, scrollToBottom, scrollToMessage]
  );

  /**
   * Manually retries a message entry, reusing the exact same requestId (UUID) and question.
   */
  const retryMessage = useCallback(
    async (requestId) => {
      const entry = messages.find((m) => m.id === requestId);
      if (!entry) return;

      // Immediate in-flight protection
      if (isSubmittingRef.current) return;
      isSubmittingRef.current = true;
      setIsSending(true);

      // Reset pending start time for fresh timeout budget
      pendingStartTimesRef.current.set(requestId, Date.now());

      // Update that same entry to pending state
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === requestId
            ? {
                ...msg,
                status: 'pending',
                errorMessage: null,
                errorType: null,
                allowRetry: false,
              }
            : msg
        )
      );

      await executeChatRequest(requestId, entry.question, true);
    },
    [messages, executeChatRequest]
  );

  /**
   * Clears the entire chat conversation history.
   */
  const clearChat = useCallback(() => {
    cancelPendingChecks();
    setMessages([]);
    setInput('');
    setIsSending(false);
    isSubmittingRef.current = false;
  }, [cancelPendingChecks]);

  return {
    isOpen,
    setIsOpen,
    messages,
    input,
    setInput,
    isSending,
    highlightedMessageId,
    chatListRef,
    submitQuestion,
    retryMessage,
    clearChat,
    scrollToBottom,
  };
}

export default useErpGuide;
