import { Module } from '@nestjs/common';
import { AuthModule }        from './auth/auth.module';
import { GroupModule }       from './group/group.module';
import { ExpenseModule }     from './expense/expense.module';
import { GroupMemberModule } from './group-member/group-member.module';

@Module({
  imports: [AuthModule, GroupModule, ExpenseModule, GroupMemberModule],
})
export class V1Module {}
