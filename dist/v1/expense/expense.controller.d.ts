import { ExpenseService } from './expense.service';
import { AddExpenseDto } from './dto/add-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { GetExpensesDto } from './dto/get-expenses.dto';
import { CurrentUserPayload } from '../../common/decorators/current-user.decorator';
export declare class ExpenseController {
    private readonly expenseService;
    constructor(expenseService: ExpenseService);
    addExpense(user: CurrentUserPayload, dto: AddExpenseDto): Promise<{
        message: string;
        data: {
            id: import("mongoose").Types.ObjectId;
            userId: import("mongoose").Schema.Types.ObjectId;
            price: number;
            description: string;
            createdAt: any;
            updatedAt: any;
        };
    }>;
    getExpenses(user: CurrentUserPayload, dto: GetExpensesDto): Promise<{
        message: string;
        data: {
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
                price: number;
                description: string;
                createdAt: Date;
                updatedAt: Date;
            }[];
        };
    }>;
    updateExpense(user: CurrentUserPayload, dto: UpdateExpenseDto): Promise<{
        message: string;
        data: {
            id: import("mongoose").Types.ObjectId;
            userId: import("mongoose").Schema.Types.ObjectId;
            price: number;
            description: string;
            createdAt: any;
            updatedAt: any;
        };
    }>;
    deleteExpense(user: CurrentUserPayload, body: {
        productID: string;
    }): Promise<{
        message: string;
        data: {
            id: import("mongoose").Types.ObjectId;
        };
    }>;
}
