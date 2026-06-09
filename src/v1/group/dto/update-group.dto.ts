import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateGroupDto {
  @IsString({ message: 'groupID is required' })
  groupID: string;

  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'groupName must be at least 2 characters' })
  @MaxLength(100, { message: 'groupName must not exceed 100 characters' })
  groupName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'description must not exceed 500 characters' })
  description?: string;
}
