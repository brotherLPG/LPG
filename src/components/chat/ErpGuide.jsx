/**
 * ErpGuide.jsx
 *
 * Floating reusable Ask ERP Guide widget.
 * Matches the design with deep green (#005a36) header and launcher,
 * pale sage user question bubble, light gray assistant answer bubble,
 * clean "Your question" input, and "Send" button.
 */

import React, { useRef, useEffect } from 'react';
import { Bot, MessageSquare, X, Loader2, RotateCcw } from 'lucide-react';
import useErpGuide from './useErpGuide.js';

/**
 * Renders instructor response text cleanly.
 * Formats numbered steps, bullet points, and paragraphs.
 */
function FormattedAnswerText({ text }) {
  if (!text) return null;

  const lines = text.split('\n');

  return (
    <div className="space-y-1.5 text-sm leading-relaxed text-slate-800">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        // Bold text parser (**bold**)
        const parts = trimmed.split(/(\*\*[^*]+\*\*)/g);
        const rendered = parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={pIdx} className="font-semibold text-slate-900">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        });

        return (
          <p key={idx} className="leading-snug">
            {rendered}
          </p>
        );
      })}
    </div>
  );
}

function ErpGuide() {
  const {
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
  } = useErpGuide();

  const inputRef = useRef(null);

  // Focus input when the chat panel opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    const trimmed = input.trim();
    if (!trimmed || isSending) return;
    submitQuestion(trimmed);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <>
      {/* Ask Question Launcher button with animated chatbot icon */}
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? 'Close Ask Question' : 'Ask Question'}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full bg-[#005a36] hover:bg-[#00482b] px-4 py-2.5 text-white shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer select-none group"
      >
        {isOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <div className="relative flex items-center justify-center">
            <Bot className="h-5 w-5 text-white animate-bounce transition-transform" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
          </div>
        )}
        <span className="text-sm font-semibold tracking-wide">Ask Question</span>
      </button>

      {/* Ask Question Chat Panel */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Ask Question Chat Panel"
          className="fixed bottom-20 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[82vh] flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all"
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-[#005a36] px-4 py-3 select-none">
            <div className="flex items-center gap-2 text-white">
              <Bot className="h-5 w-5 text-emerald-300 animate-pulse" />
              <h3 className="text-base font-bold text-white tracking-wide">
                Ask Question
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
              className="text-white hover:text-white/80 transition-colors p-1 rounded-md"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages list */}
          <div
            ref={chatListRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-white"
          >
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center p-4 text-slate-400">
                <Bot className="h-10 w-10 text-[#005a36]/60 mb-2 animate-bounce" />
                <p className="text-sm font-semibold text-slate-700">
                  Ask a Question
                </p>
                <p className="text-xs text-slate-400 mt-1 max-w-[260px]">
                  Ask any question to get step-by-step guidance on ERP workflows, forms, and procedures.
                </p>
              </div>
            )}

            {messages.map((msg) => {
              const isHighlighted = highlightedMessageId === msg.id;

              return (
                <div
                  key={msg.id}
                  data-message-id={msg.id}
                  className={`space-y-3 transition-all ${
                    isHighlighted ? 'ring-2 ring-[#005a36] rounded-xl p-1' : ''
                  }`}
                >
                  {/* User question bubble: Right-aligned, pale sage green */}
                  <div className="flex justify-end">
                    <div className="max-w-[85%] rounded-2xl rounded-tr-xs bg-[#d5e7dc] px-4 py-2.5 text-sm text-slate-800 shadow-xs">
                      <p className="whitespace-pre-wrap leading-relaxed">
                        {msg.question}
                      </p>
                    </div>
                  </div>

                  {/* Bot instructor bubble: Left-aligned, light gray */}
                  {msg.status === 'pending' && (
                    <div className="flex justify-start">
                      <div className="max-w-[85%] rounded-2xl rounded-tl-xs bg-[#f2f4f6] px-4 py-3 text-sm text-slate-600 flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-[#005a36]" />
                        <span>Generating explanation...</span>
                      </div>
                    </div>
                  )}

                  {msg.status === 'success' && (
                    <div className="flex justify-start">
                      <div className="max-w-[90%] rounded-2xl rounded-tl-xs bg-[#f2f4f6] p-4 text-sm text-slate-800 shadow-xs">
                        <FormattedAnswerText text={msg.answer} />
                      </div>
                    </div>
                  )}

                  {msg.status === 'timeout' && (
                    <div className="flex justify-start">
                      <div className="max-w-[90%] rounded-2xl rounded-tl-xs bg-amber-50 border border-amber-200 p-3.5 text-xs text-amber-800 space-y-2">
                        <p>{msg.errorMessage}</p>
                        {msg.allowRetry && (
                          <button
                            type="button"
                            onClick={() => retryMessage(msg.id)}
                            disabled={isSending}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#005a36] text-white text-xs font-medium hover:bg-[#00482b] transition-colors"
                          >
                            <RotateCcw className="h-3 w-3" />
                            Retry
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {msg.status === 'error' && (
                    <div className="flex justify-start">
                      <div className="max-w-[90%] rounded-2xl rounded-tl-xs bg-red-50 border border-red-200 p-3.5 text-xs text-red-700 space-y-2">
                        <p className="font-medium">
                          {msg.errorType === 'rate_limit'
                            ? 'Rate limit reached (10 questions per 15 min)'
                            : msg.errorType === 'unavailable'
                            ? 'Service Temporarily Unavailable (503)'
                            : 'Error'}
                        </p>
                        <p>{msg.errorMessage}</p>
                        {msg.allowRetry && (
                          <button
                            type="button"
                            onClick={() => retryMessage(msg.id)}
                            disabled={isSending}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#005a36] text-white text-xs font-medium hover:bg-[#00482b] transition-colors"
                          >
                            <RotateCcw className="h-3 w-3" />
                            Retry
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer input area matching screenshot */}
          <form
            onSubmit={handleSubmit}
            className="p-3 bg-white border-t border-slate-100 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSending}
              placeholder="Your question"
              aria-label="Your question"
              className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#005a36] focus:ring-1 focus:ring-[#005a36] disabled:opacity-60 transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || isSending}
              aria-label="Send"
              className="bg-[#005a36] hover:bg-[#00482b] text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Send'
              )}
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default ErpGuide;
