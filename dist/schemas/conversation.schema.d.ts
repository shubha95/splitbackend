import { Document, Schema as MongooseSchema } from 'mongoose';
export type ConversationDocument = Conversation & Document;
export declare class Conversation {
    type: string;
    participants: MongooseSchema.Types.ObjectId[];
    groupID: string | null;
    lastMessage: MongooseSchema.Types.ObjectId | null;
}
export declare const ConversationSchema: MongooseSchema<Conversation, import("mongoose").Model<Conversation, any, any, any, Document<unknown, any, Conversation, any, {}> & Conversation & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Conversation, Document<unknown, {}, import("mongoose").FlatRecord<Conversation>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Conversation> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
