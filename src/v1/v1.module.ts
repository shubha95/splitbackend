import { Module } from '@nestjs/common';
import { AuthModule }        from './auth/auth.module';
import { GroupModule }       from './group/group.module';
import { ExpenseModule }     from './expense/expense.module';
import { GroupMemberModule } from './group-member/group-member.module';
import { ChatModule }        from './chat/chat.module';

@Module({
  imports: [AuthModule, GroupModule, ExpenseModule, GroupMemberModule, ChatModule],
})
export class V1Module {}
