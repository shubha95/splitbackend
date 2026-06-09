"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseController = void 0;
const common_1 = require("@nestjs/common");
const expense_service_1 = require("./expense.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const add_expense_dto_1 = require("./dto/add-expense.dto");
const update_expense_dto_1 = require("./dto/update-expense.dto");
const get_expenses_dto_1 = require("./dto/get-expenses.dto");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let ExpenseController = class ExpenseController {
    constructor(expenseService) {
        this.expenseService = expenseService;
    }
    async addExpense(user, dto) {
        const data = await this.expenseService.addExpense(String(user.id), dto);
        return { message: 'Expense added successfully', data };
    }
    async getExpenses(user, dto) {
        const data = await this.expenseService.getExpenses(String(user.id), dto);
        return { message: 'Expenses fetched successfully', data };
    }
    async updateExpense(user, dto) {
        if (!dto.productID) {
            throw new common_1.BadRequestException('productID is required in request body');
        }
        if (dto.price === undefined && dto.description === undefined) {
            throw new common_1.BadRequestException('Provide at least one field to update: price or description');
        }
        const data = await this.expenseService.updateExpense(String(user.id), dto);
        return { message: 'Expense updated successfully', data };
    }
    async deleteExpense(user, body) {
        if (!body?.productID) {
            throw new common_1.BadRequestException('productID is required in request body');
        }
        const data = await this.expenseService.deleteExpense(String(user.id), body.productID);
        return { message: 'Expense deleted successfully', data };
    }
};
exports.ExpenseController = ExpenseController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(201),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, add_expense_dto_1.AddExpenseDto]),
    __metadata("design:returntype", Promise)
], ExpenseController.prototype, "addExpense", null);
__decorate([
    (0, common_1.Post)('list'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, get_expenses_dto_1.GetExpensesDto]),
    __metadata("design:returntype", Promise)
], ExpenseController.prototype, "getExpenses", null);
__decorate([
    (0, common_1.Put)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_expense_dto_1.UpdateExpenseDto]),
    __metadata("design:returntype", Promise)
], ExpenseController.prototype, "updateExpense", null);
__decorate([
    (0, common_1.Delete)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ExpenseController.prototype, "deleteExpense", null);
exports.ExpenseController = ExpenseController = __decorate([
    (0, common_1.Controller)({ path: 'expense', version: '1' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [expense_service_1.ExpenseService])
], ExpenseController);
//# sourceMappingURL=expense.controller.js.map