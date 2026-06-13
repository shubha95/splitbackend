import { IsNotEmpty, IsString } from 'class-validator';

export class GetGroupMembersDto {
  @IsString()
  @IsNotEmpty()
  groupID: string;
}
