export declare const ChatEvent: {
    readonly JOIN_ROOM: "join-room";
    readonly SEND_MESSAGE: "send-message";
    readonly TYPING: "typing";
    readonly READ_RECEIPT: "read-receipt";
    readonly NEW_MESSAGE: "new-message";
    readonly USER_TYPING: "user-typing";
    readonly MESSAGE_READ: "message-read";
    readonly PRESENCE: "presence";
};
export type ChatEventKey = typeof ChatEvent[keyof typeof ChatEvent];
export interface JoinRoomPayload {
    conversationId: string;
}
export interface TypingPayload {
    conversationId: string;
}
export interface ReadReceiptPayload {
    messageId: string;
    conversationId: string;
}
export interface SendMessagePayload {
    conversationId: string;
    type: 'text' | 'image';
    encryptedForReceiver: string;
    encryptedForSender: string;
    nonce: string;
    encryptionVersion?: string;
}
export interface PresencePayload {
    userId: string;
    status: 'online' | 'offline';
}
export interface UserTypingPayload {
    conversationId: string;
    userId: string;
}
export interface MessageReadPayload {
    messageId: string;
    userId: string;
}
export interface SocketEmit<T> {
    event: ChatEventKey;
    payload: T;
}
