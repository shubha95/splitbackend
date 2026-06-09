import { IsIn, IsString, IsNotEmpty } from 'class-validator';

export class SocialLoginDto {
  @IsString()
  @IsIn(['google', 'facebook', 'twitter', 'outlook'], {
    message: 'Invalid provider. Must be one of: google, facebook, twitter, outlook',
  })
  provider: 'google' | 'facebook' | 'twitter' | 'outlook';

  @IsString()
  @IsNotEmpty({ message: 'token is required' })
  token: string;
}
