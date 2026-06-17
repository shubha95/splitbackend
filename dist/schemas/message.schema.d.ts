import { Document, Schema as MongooseSchema } from 'mongoose';
export type MessageDocument = Message & Document;
export declare class Message {
    conversationId: MongooseSchema.Types.ObjectId;
    senderId: MongooseSchema.Types.ObjectId;
    type: string;
    encryptedForReceiver: string;
    encryptedForSender: string;
    nonce: string;
    encryptionVersion: string;
    readBy: MongooseSchema.Types.ObjectId[];
}
export declare const MessageSchema: MongooseSchema<Message, import("mongoose").Model<Message, any, any, any, Document<unknown, any, Message, any, {}> & Message & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Message, Document<unknown, {}, import("mongoose").FlatRecord<Message>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Message> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
