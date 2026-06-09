import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'emailId is required' })
  emailId: string;

  @IsString()
  @IsNotEmpty({ message: 'password is required' })
  password: string;
}
