import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ExpenseDocument = Expense & Document & { createdAt: Date; updatedAt: Date };

@Schema({ timestamps: true })
export class Expense {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true, trim: true, maxlength: 500 })
  description: string;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
