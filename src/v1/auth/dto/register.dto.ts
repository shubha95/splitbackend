import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsString({ message: 'userName is required' })
  @MinLength(2, { message: 'userName must be at least 2 characters' })
  @MaxLength(30, { message: 'userName must not exceed 30 characters' })
  @Matches(/^[a-zA-Z0-9_ ]+$/, {
    message: 'userName can only contain letters, numbers, spaces, and underscores',
  })
  userName: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  emailId: string;

  @IsString({ message: 'password is required' })
  @MinLength(8, { message: 'password must be at least 8 characters' })
  @Matches(/[A-Z]/, { message: 'password must contain at least one uppercase letter' })
  @Matches(/[a-z]/, { message: 'password must contain at least one lowercase letter' })
  @Matches(/[0-9]/, { message: 'password must contain at least one number' })
  @Matches(/[@$!%*?&#^()_\-+=]/, {
    message: 'password must contain at least one special character (@$!%*?&)',
  })
  password: string;

  @IsOptional()
  @IsString()
  address?: string;
}
