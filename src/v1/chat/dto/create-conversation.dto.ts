import { IsEnum, IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class CreateConversationDto {
  @IsEnum(['direct', 'group'], { message: 'type must be direct or group' })
  type: 'direct' | 'group';

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  participantId?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  groupID?: string;
}
