export declare class SendMessageDto {
    conversationId: string;
    type: 'text' | 'image';
    encryptedForReceiver: string;
    encryptedForSender: string;
    nonce: string;
    encryptionVersion?: string;
}
