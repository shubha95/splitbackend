import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Expense, ExpenseDocument } from '../../schemas/expense.schema';
import { AddExpenseDto }    from './dto/add-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { GetExpensesDto }   from './dto/get-expenses.dto';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectModel(Expense.name) private readonly expenseModel: Model<ExpenseDocument>,
  ) {}

  async addExpense(userId: string, dto: AddExpenseDto) {
    const expense = new this.expenseModel({
      userId,
      price:       Number(dto.price),
      description: String(dto.description).trim(),
      groupID:     dto.groupID ? String(dto.groupID).trim() : null,
    });
    await expense.save();
    return this.format(expense);
  }

  async updateExpense(userId: string, dto: UpdateExpenseDto) {
    const expense = await this.expenseModel.findOne({ _id: dto.productID, userId });
    if (!expense) throw new NotFoundException('Expense not found');

    if (dto.price !== undefined && dto.price !== null) expense.price       = Number(dto.price);
    if (dto.description !== undefined)                  expense.description = String(dto.description).trim();

    await expense.save();
    return this.format(expense);
  }

  async deleteExpense(userId: string, productID: string) {
    const expense = await this.expenseModel.findOneAndDelete({ _id: productID, userId });
    if (!expense) throw new NotFoundException('Expense not found');
    return { id: expense._id };
  }

  async getExpenses(userId: string, dto: GetExpensesDto) {
    const page  = Number(dto.pageNumber);
    const limit = Number(dto.itemNumber);
    const skip  = (page - 1) * limit;

    const [expenses, totalItems] = await Promise.all([
      this.expenseModel.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      this.expenseModel.countDocuments({ userId }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      pagination: {
        totalItems,
        totalPages,
        currentPage:  page,
        itemsPerPage: limit,
        hasNextPage:  page < totalPages,
        hasPrevPage:  page > 1,
      },
      expenses: expenses.map((e) => ({
        id:          e._id,
        userId:      e.userId,
        groupID:     e.groupID ?? null,
        price:       e.price,
        description: e.description,
        createdAt:   e.createdAt,
        updatedAt:   e.updatedAt,
      })),
    };
  }

  private format(e: ExpenseDocument) {
    return {
      id:          e._id,
      userId:      e.userId,
      groupID:     e.groupID ?? null,
      price:       e.price,
      description: e.description,
      createdAt:   (e as any).createdAt,
      updatedAt:   (e as any).updatedAt,
    };
  }
}
