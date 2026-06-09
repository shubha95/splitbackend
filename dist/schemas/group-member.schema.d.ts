import { Document } from 'mongoose';
export type GroupMemberDocument = GroupMember & Document;
export declare const PERMISSIONS: readonly ["addMember", "removeMember", "editGroup", "deleteGroup", "promoteAdmin", "manageExpenses"];
export type Permission = (typeof PERMISSIONS)[number];
export declare class GroupMember {
    memberID: string;
    groupAddedBy: string;
    groupID: string;
    role: string;
    permissions: string[];
}
export declare const GroupMemberSchema: import("mongoose").Schema<GroupMember, import("mongoose").Model<GroupMember, any, any, any, Document<unknown, any, GroupMember, any, {}> & GroupMember & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, GroupMember, Document<unknown, {}, import("mongoose").FlatRecord<GroupMember>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<GroupMember> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
