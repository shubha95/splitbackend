import { IsNotEmpty, IsString } from 'class-validator';

export class GetPublicKeyDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}
