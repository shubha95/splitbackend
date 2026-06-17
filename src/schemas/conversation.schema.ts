import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ConversationDocument = Conversation & Document;

@Schema({ timestamps: { createdAt: 'createDate', updatedAt: 'updateDate' } })
export class Conversation {
  @Prop({ type: String, enum: ['direct', 'group'], required: true })
  type: string;

  // direct: the two user ObjectIds
  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }], default: [] })
  participants: MongooseSchema.Types.ObjectId[];

  // group: references the existing Group document (membership derived from GroupMember)
  @Prop({ type: String, default: null })
  groupID: string | null;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Message', default: null })
  lastMessage: MongooseSchema.Types.ObjectId | null;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
