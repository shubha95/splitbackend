"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.V1Module = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("./auth/auth.module");
const group_module_1 = require("./group/group.module");
const expense_module_1 = require("./expense/expense.module");
const group_member_module_1 = require("./group-member/group-member.module");
let V1Module = class V1Module {
};
exports.V1Module = V1Module;
exports.V1Module = V1Module = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, group_module_1.GroupModule, expense_module_1.ExpenseModule, group_member_module_1.GroupMemberModule],
    })
], V1Module);
//# sourceMappingURL=v1.module.js.map