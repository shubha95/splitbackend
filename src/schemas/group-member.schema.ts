import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GroupMemberDocument = GroupMember & Document;

export const PERMISSIONS = [
  'addMember',
  'removeMember',
  'editGroup',
  'deleteGroup',
  'promoteAdmin',
  'manageExpenses',
] as const;

export type Permission = (typeof PERMISSIONS)[number];

@Schema({ timestamps: { createdAt: 'createDate', updatedAt: false } })
export class GroupMember {
  @Prop({ required: true })
  memberID: string;

  @Prop({ required: true })
  groupAddedBy: string;

  @Prop({ required: true })
  groupID: string;

  @Prop({ type: String, enum: ['owner', 'admin', 'member'], default: 'member' })
  role: string;

  @Prop({ type: [String], enum: PERMISSIONS, default: [] })
  permissions: string[];
}

export const GroupMemberSchema = SchemaFactory.createForClass(GroupMember);

// Prevent duplicate membership
GroupMemberSchema.index({ memberID: 1, groupID: 1 }, { unique: true });
