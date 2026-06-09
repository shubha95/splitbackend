import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GroupDocument = Group & Document;

@Schema({ timestamps: { createdAt: 'createDate', updatedAt: 'updateDate' } })
export class Group {
  @Prop({ required: true, trim: true, minlength: 2, maxlength: 100 })
  groupName: string;

  @Prop({ required: true })
  createdBy: string;

  @Prop({ trim: true, maxlength: 500, default: '' })
  description: string;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
