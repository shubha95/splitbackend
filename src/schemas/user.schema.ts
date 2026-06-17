import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ _id: false })
export class Provider {
  @Prop({ enum: ['google', 'facebook', 'twitter', 'outlook'] })
  name: string;

  @Prop()
  providerId: string;
}

export const ProviderSchema = SchemaFactory.createForClass(Provider);

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: null })
  password: string;

  @Prop({ default: Date.now })
  date: Date;

  @Prop({ default: '' })
  address: string;

  @Prop({ type: [{ token: String, tokenExpiry: Date, _id: false }], default: [] })
  sessions: { token: string; tokenExpiry: Date }[];

  @Prop({ type: [ProviderSchema], default: [] })
  providers: Provider[];

  @Prop({ default: '' })
  avatar: string;

  @Prop({ type: String, default: null })
  publicKey: string | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
