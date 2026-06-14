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
exports.ExpenseService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const expense_schema_1 = require("../../schemas/expense.schema");
let ExpenseService = class ExpenseService {
    constructor(expenseModel) {
        this.expenseModel = expenseModel;
    }
    async addExpense(userId, dto) {
        const expense = new this.expenseModel({
            userId,
            price: Number(dto.price),
            description: String(dto.description).trim(),
            groupID: dto.groupID ? String(dto.groupID).trim() : null,
        });
        await expense.save();
        return this.format(expense);
    }
    async updateExpense(userId, dto) {
        const expense = await this.expenseModel.findOne({ _id: dto.productID, userId });
        if (!expense)
            throw new common_1.NotFoundException('Expense not found');
        if (dto.price !== undefined && dto.price !== null)
            expense.price = Number(dto.price);
        if (dto.description !== undefined)
            expense.description = String(dto.description).trim();
        await expense.save();
        return this.format(expense);
    }
    async deleteExpense(userId, productID) {
        const expense = await this.expenseModel.findOneAndDelete({ _id: productID, userId });
        if (!expense)
            throw new common_1.NotFoundException('Expense not found');
        return { id: expense._id };
    }
    async getExpenses(userId, dto) {
        const page = Number(dto.pageNumber);
        const limit = Number(dto.itemNumber);
        const skip = (page - 1) * limit;
        const [expenses, totalItems] = await Promise.all([
            this.expenseModel.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
            this.expenseModel.countDocuments({ userId }),
        ]);
        const totalPages = Math.ceil(totalItems / limit);
        return {
            pagination: {
                totalItems,
                totalPages,
                currentPage: page,
                itemsPerPage: limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
            expenses: expenses.map((e) => ({
                id: e._id,
                userId: e.userId,
                groupID: e.groupID ?? null,
                price: e.price,
                description: e.description,
                createdAt: e.createdAt,
                updatedAt: e.updatedAt,
            })),
        };
    }
    format(e) {
        return {
            id: e._id,
            userId: e.userId,
            groupID: e.groupID ?? null,
            price: e.price,
            description: e.description,
            createdAt: e.createdAt,
            updatedAt: e.updatedAt,
        };
    }
};
exports.ExpenseService = ExpenseService;
exports.ExpenseService = ExpenseService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(expense_schema_1.Expense.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ExpenseService);
//# sourceMappingURL=expense.service.js.map