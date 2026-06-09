import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { GroupController }  from './group.controller';
import { GroupService }     from './group.service';
import { Group, GroupSchema }               from '../../schemas/group.schema';
import { GroupMember, GroupMemberSchema }   from '../../schemas/group-member.schema';
import { AuthModule }       from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Group.name,       schema: GroupSchema },
      { name: GroupMember.name, schema: GroupMemberSchema },
    ]),
    AuthModule,
  ],
  controllers: [GroupController],
  providers:   [GroupService],
})
export class GroupModule {}
