import { Model } from 'mongoose';
import { ExpenseDocument } from '../../schemas/expense.schema';
import { GroupMemberDocument } from '../../schemas/group-member.schema';
import { AddExpenseDto } from './dto/add-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { GetExpensesDto } from './dto/get-expenses.dto';
export declare class ExpenseService {
    private readonly expenseModel;
    private readonly groupMemberModel;
    constructor(expenseModel: Model<ExpenseDocument>, groupMemberModel: Model<GroupMemberDocument>);
    addExpense(userId: string, dto: AddExpenseDto): Promise<{
        id: import("mongoose").Types.ObjectId;
        userId: import("mongoose").Schema.Types.ObjectId;
        groupID: string;
        price: number;
        description: string;
        createdAt: any;
        updatedAt: any;
    }>;
    updateExpense(userId: string, dto: UpdateExpenseDto): Promise<{
        id: import("mongoose").Types.ObjectId;
        userId: import("mongoose").Schema.Types.ObjectId;
        groupID: string;
        price: number;
        description: string;
        createdAt: any;
        updatedAt: any;
    }>;
    deleteExpense(userId: string, productID: string): Promise<{
        id: import("mongoose").Types.ObjectId;
    }>;
    getExpenses(userId: string, dto: GetExpensesDto): Promise<{
        pagination: {
            totalItems: number;
            totalPages: number;
            currentPage: number;
            itemsPerPage: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
        };
        expenses: {
            id: import("mongoose").Types.ObjectId;
            userId: import("mongoose").FlattenMaps<import("mongoose").Schema.Types.ObjectId>;
            groupID: string;
            price: number;
            description: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>;
    private format;
}
