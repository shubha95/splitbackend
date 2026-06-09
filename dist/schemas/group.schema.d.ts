import { Document } from 'mongoose';
export type GroupDocument = Group & Document;
export declare class Group {
    groupName: string;
    createdBy: string;
    description: string;
}
export declare const GroupSchema: import("mongoose").Schema<Group, import("mongoose").Model<Group, any, any, any, Document<unknown, any, Group, any, {}> & Group & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Group, Document<unknown, {}, import("mongoose").FlatRecord<Group>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Group> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
