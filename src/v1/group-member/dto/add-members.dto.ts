import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class AddMembersDto {
  @IsArray({ message: 'memberID must be an array e.g. ["id1","id2"]' })
  @ArrayMinSize(1, { message: 'memberID array must not be empty' })
  @IsString({ each: true, message: 'memberID array must not contain empty values' })
  @IsNotEmpty({ each: true, message: 'memberID array must not contain empty values' })
  memberID: string[];

  @IsString({ message: 'groupID is required' })
  @IsNotEmpty({ message: 'groupID is required' })
  groupID: string;
}
