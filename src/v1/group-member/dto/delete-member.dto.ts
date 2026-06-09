import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteMemberDto {
  @IsString({ message: 'memberRecordID is required' })
  @IsNotEmpty({ message: 'memberRecordID is required' })
  memberRecordID: string;
}
