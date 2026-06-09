import { IsNotEmpty, IsString } from 'class-validator';

export class PromoteDemoteDto {
  @IsString({ message: 'targetMemberID is required' })
  @IsNotEmpty({ message: 'targetMemberID is required' })
  targetMemberID: string;

  @IsString({ message: 'groupID is required' })
  @IsNotEmpty({ message: 'groupID is required' })
  groupID: string;
}
