// src/Todo/types.js

// Enum equivalent for Sender
export const Sender = {
  USER: 'user',
  BOT: 'bot',
};

/**
 * @typedef {Object} Message
 * @property {string} id
 * @property {string} text
 * @property {string} sender - Either Sender.USER or Sender.BOT
 * @property {Date} timestamp
 * @property {boolean} [isStreaming]
 */

/**
 * @typedef {Object} ChatState
 * @property {Message[]} messages
 * @property {boolean} isLoading
 * @property {boolean} isOpen
 */
