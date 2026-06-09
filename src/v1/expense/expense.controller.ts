import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  HttpCode,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { ExpenseService }   from './expense.service';
import { JwtAuthGuard }     from '../auth/jwt-auth.guard';
import { AddExpenseDto }    from './dto/add-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { GetExpensesDto }   from './dto/get-expenses.dto';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator';

@Controller({ path: 'expense', version: '1' })
@UseGuards(JwtAuthGuard)
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  @HttpCode(201)
  async addExpense(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: AddExpenseDto,
  ) {
    const data = await this.expenseService.addExpense(String(user.id), dto);
    return { message: 'Expense added successfully', data };
  }

  @Post('list')
  @HttpCode(200)
  async getExpenses(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: GetExpensesDto,
  ) {
    const data = await this.expenseService.getExpenses(String(user.id), dto);
    return { message: 'Expenses fetched successfully', data };
  }

  @Put()
  async updateExpense(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: UpdateExpenseDto,
  ) {
    if (!dto.productID) {
      throw new BadRequestException('productID is required in request body');
    }
    if (dto.price === undefined && dto.description === undefined) {
      throw new BadRequestException('Provide at least one field to update: price or description');
    }
    const data = await this.expenseService.updateExpense(String(user.id), dto);
    return { message: 'Expense updated successfully', data };
  }

  @Delete()
  async deleteExpense(
    @CurrentUser() user: CurrentUserPayload,
    @Body() body: { productID: string },
  ) {
    if (!body?.productID) {
      throw new BadRequestException('productID is required in request body');
    }
    const data = await this.expenseService.deleteExpense(String(user.id), body.productID);
    return { message: 'Expense deleted successfully', data };
  }
}
