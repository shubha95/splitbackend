import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class GetMessagesDto {
  @IsString()
  @IsNotEmpty()
  conversationID: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number;

  // Cursor: return messages older than this message ID (newest-first pagination)
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  beforeMessageID?: string;
}
