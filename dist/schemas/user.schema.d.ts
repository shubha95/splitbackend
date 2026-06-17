import { Document } from 'mongoose';
export type UserDocument = User & Document;
export declare class Provider {
    name: string;
    providerId: string;
}
export declare const ProviderSchema: import("mongoose").Schema<Provider, import("mongoose").Model<Provider, any, any, any, Document<unknown, any, Provider, any, {}> & Provider & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Provider, Document<unknown, {}, import("mongoose").FlatRecord<Provider>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Provider> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export declare class User {
    name: string;
    email: string;
    password: string;
    date: Date;
    address: string;
    sessions: {
        token: string;
        tokenExpiry: Date;
    }[];
    providers: Provider[];
    avatar: string;
    publicKey: string | null;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User, any, {}> & User & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<User> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
