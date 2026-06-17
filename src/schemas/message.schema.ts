import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Conversation', required: true })
  conversationId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  senderId: MongooseSchema.Types.ObjectId;

  @Prop({ type: String, enum: ['text', 'image'], required: true })
  type: string;

  // E2EE: server stores only ciphertext, never plaintext
  @Prop({ required: true })
  encryptedForReceiver: string;

  @Prop({ required: true })
  encryptedForSender: string;

  @Prop({ required: true })
  nonce: string;

  @Prop({ type: String, default: 'nacl-box-v1' })
  encryptionVersion: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }], default: [] })
  readBy: MongooseSchema.Types.ObjectId[];
}

export const MessageSchema = SchemaFactory.createForClass(Message);

// Fast cursor-paginated history queries
MessageSchema.index({ conversationId: 1, createdAt: -1 });
