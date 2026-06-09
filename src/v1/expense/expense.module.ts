import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ExpenseController } from './expense.controller';
import { ExpenseService }    from './expense.service';
import { Expense, ExpenseSchema } from '../../schemas/expense.schema';
import { AuthModule }        from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Expense.name, schema: ExpenseSchema }]),
    AuthModule,
  ],
  controllers: [ExpenseController],
  providers:   [ExpenseService],
})
export class ExpenseModule {}
