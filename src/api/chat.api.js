/**
 * chat.api.js
 * 
 * Provides API communication for the Ask ERP Guide chatbot widget.
 * Uses the shared Axios client configured with baseURL and auth interceptors.
 * Preserves HTTP status codes (such as 200 OK, 202 Accepted, 429 Too Many Requests,
 * 503 Service Unavailable) and retry information so caller hooks can react appropriately.
 */

import api from './axios.js';

/**
 * Sends a user question and associated requestId to the /chat endpoint.
 *
 * @param {Object} params
 * @param {string} params.requestId - Unique UUID (crypto.randomUUID) for idempotency and pending retries
 * @param {string} params.question - The question text asked by the user
 * @param {Object} [options] - Additional Axios config options (e.g. signal for AbortController)
 * @returns {Promise<{ status: number, data: any, headers: any }>}
 */
export const sendChatMessage = async ({ requestId, question }, options = {}) => {
  try {
    const response = await api.post(
      '/chat',
      { requestId, question },
      options
    );

    return {
      status: response.status,
      data: response.data,
      headers: response.headers,
    };
  } catch (error) {
    // Preserve request cancellation
    if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED' || error.name === 'AbortError') {
      const cancelErr = new Error('Chat request was cancelled');
      cancelErr.isCancelled = true;
      throw cancelErr;
    }

    // Extract status code and payload if server responded
    const status = error.response?.status;
    const data = error.response?.data;
    const retryAfterHeader = error.response?.headers?.['retry-after'];
    const retryAfter = retryAfterHeader ? parseInt(retryAfterHeader, 10) : (data?.retryAfter || null);

    // Create a meaningful error preserving all status and retry details
    const message = data?.message || data?.error || error.message || 'Failed to send message';
    const enrichedError = new Error(message);
    enrichedError.status = status;
    enrichedError.data = data;
    enrichedError.retryAfter = retryAfter;
    enrichedError.isRateLimited = status === 429;
    enrichedError.isUnavailable = status === 503;
    enrichedError.originalError = error;

    throw enrichedError;
  }
};

export default sendChatMessage;
