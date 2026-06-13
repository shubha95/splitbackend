import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { GroupMemberController } from './group-member.controller';
import { GroupMemberService }    from './group-member.service';
import { GroupMember, GroupMemberSchema } from '../../schemas/group-member.schema';
import { User, UserSchema }              from '../../schemas/user.schema';
import { AuthModule }                    from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GroupMember.name, schema: GroupMemberSchema },
      { name: User.name,        schema: UserSchema },
    ]),
    AuthModule,
  ],
  controllers: [GroupMemberController],
  providers:   [GroupMemberService],
})
export class GroupMemberModule {}
