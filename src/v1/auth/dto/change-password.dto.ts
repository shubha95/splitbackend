import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  emailId: string;

  @IsString({ message: 'newPassword is required' })
  @MinLength(8, { message: 'newPassword must be at least 8 characters' })
  @Matches(/[A-Z]/, { message: 'newPassword must contain at least one uppercase letter' })
  @Matches(/[a-z]/, { message: 'newPassword must contain at least one lowercase letter' })
  @Matches(/[0-9]/, { message: 'newPassword must contain at least one number' })
  @Matches(/[@$!%*?&#^()_\-+=]/, {
    message: 'newPassword must contain at least one special character (@$!%*?&)',
  })
  newPassword: string;
}
