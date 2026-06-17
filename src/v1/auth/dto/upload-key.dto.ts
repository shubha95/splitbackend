import { IsNotEmpty, IsString } from 'class-validator';

export class UploadKeyDto {
  @IsString()
  @IsNotEmpty()
  publicKey: string;
}
