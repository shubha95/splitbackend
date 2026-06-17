import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController }    from './auth.controller';
import { AuthService }       from './auth.service';
import { SocialAuthService } from './social-auth.service';
import { JwtAuthGuard }      from './jwt-auth.guard';
import { User, UserSchema }               from '../../schemas/user.schema';
import { GroupMember, GroupMemberSchema } from '../../schemas/group-member.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name,        schema: UserSchema },
      { name: GroupMember.name, schema: GroupMemberSchema },
    ]),
    JwtModule.registerAsync({
      imports:    [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret:      config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers:   [AuthService, SocialAuthService, JwtAuthGuard],
  exports:     [JwtModule, JwtAuthGuard, MongooseModule, AuthService],
})
export class AuthModule {}
