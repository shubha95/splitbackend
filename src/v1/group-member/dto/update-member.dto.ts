import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateMemberDto {
  @IsString({ message: 'memberRecordID is required' })
  @IsNotEmpty({ message: 'memberRecordID is required' })
  memberRecordID: string;

  @IsString({ message: 'groupID is required' })
  @IsNotEmpty({ message: 'groupID is required' })
  groupID: string;
}
