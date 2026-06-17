import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  conversationId: string;

  @IsEnum(['text', 'image'], { message: 'type must be text or image' })
  type: 'text' | 'image';

  @IsString()
  @IsNotEmpty()
  encryptedForReceiver: string;

  @IsString()
  @IsNotEmpty()
  encryptedForSender: string;

  @IsString()
  @IsNotEmpty()
  nonce: string;

  @IsOptional()
  @IsString()
  encryptionVersion?: string;
}
