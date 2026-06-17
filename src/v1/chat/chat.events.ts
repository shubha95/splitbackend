// Event name constants — single source of truth for gateway + clients
export const ChatEvent = {
  // client → server
  JOIN_ROOM:    'join-room',
  SEND_MESSAGE: 'send-message',
  TYPING:       'typing',
  READ_RECEIPT: 'read-receipt',
  // server → client
  NEW_MESSAGE:  'new-message',
  USER_TYPING:  'user-typing',
  MESSAGE_READ: 'message-read',
  PRESENCE:     'presence',
} as const;

export type ChatEventKey = typeof ChatEvent[keyof typeof ChatEvent];

// ── Payload interfaces ─────────────────────────────────────────────────────

export interface JoinRoomPayload     { conversationId: string; }
export interface TypingPayload       { conversationId: string; }
export interface ReadReceiptPayload  { messageId: string; conversationId: string; }

export interface SendMessagePayload {
  conversationId:       string;
  type:                 'text' | 'image';
  encryptedForReceiver: string;
  encryptedForSender:   string;
  nonce:                string;
  encryptionVersion?:   string;
}

// server → client
export interface PresencePayload    { userId: string; status: 'online' | 'offline'; }
export interface UserTypingPayload  { conversationId: string; userId: string; }
export interface MessageReadPayload { messageId: string; userId: string; }

// Consistent server-emit envelope for all socket events
export interface SocketEmit<T> {
  event:   ChatEventKey;
  payload: T;
}
