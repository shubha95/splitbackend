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
exports.GroupMemberController = void 0;
const common_1 = require("@nestjs/common");
const group_member_service_1 = require("./group-member.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const add_members_dto_1 = require("./dto/add-members.dto");
const update_member_dto_1 = require("./dto/update-member.dto");
const delete_member_dto_1 = require("./dto/delete-member.dto");
const promote_demote_dto_1 = require("./dto/promote-demote.dto");
const update_permissions_dto_1 = require("./dto/update-permissions.dto");
const get_group_members_dto_1 = require("./dto/get-group-members.dto");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let GroupMemberController = class GroupMemberController {
    constructor(groupMemberService) {
        this.groupMemberService = groupMemberService;
    }
    async addMembers(user, dto) {
        const data = await this.groupMemberService.addMembers(String(user.id), dto);
        return { message: 'Members added successfully', data };
    }
    async updateMember(user, dto) {
        const data = await this.groupMemberService.updateMember(String(user.id), dto);
        return { message: 'Member updated successfully', data };
    }
    async deleteMember(user, dto) {
        const data = await this.groupMemberService.deleteMember(String(user.id), dto);
        return { message: 'Member removed successfully', data };
    }
    async promoteToAdmin(user, dto) {
        const data = await this.groupMemberService.promoteToAdmin(String(user.id), dto);
        return { message: 'Member promoted to admin successfully', data };
    }
    async demoteToMember(user, dto) {
        const data = await this.groupMemberService.demoteToMember(String(user.id), dto);
        return { message: 'Admin demoted to member successfully', data };
    }
    async updatePermissions(user, dto) {
        const data = await this.groupMemberService.updatePermissions(String(user.id), dto);
        return { message: 'Permissions updated successfully', data };
    }
    async getGroupMembers(user, dto) {
        const data = await this.groupMemberService.getGroupMembers(String(user.id), dto);
        return { message: 'Group members fetched successfully', data };
    }
};
exports.GroupMemberController = GroupMemberController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(201),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, add_members_dto_1.AddMembersDto]),
    __metadata("design:returntype", Promise)
], GroupMemberController.prototype, "addMembers", null);
__decorate([
    (0, common_1.Put)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_member_dto_1.UpdateMemberDto]),
    __metadata("design:returntype", Promise)
], GroupMemberController.prototype, "updateMember", null);
__decorate([
    (0, common_1.Delete)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, delete_member_dto_1.DeleteMemberDto]),
    __metadata("design:returntype", Promise)
], GroupMemberController.prototype, "deleteMember", null);
__decorate([
    (0, common_1.Put)('promote'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, promote_demote_dto_1.PromoteDemoteDto]),
    __metadata("design:returntype", Promise)
], GroupMemberController.prototype, "promoteToAdmin", null);
__decorate([
    (0, common_1.Put)('demote'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, promote_demote_dto_1.PromoteDemoteDto]),
    __metadata("design:returntype", Promise)
], GroupMemberController.prototype, "demoteToMember", null);
__decorate([
    (0, common_1.Put)('permissions'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_permissions_dto_1.UpdatePermissionsDto]),
    __metadata("design:returntype", Promise)
], GroupMemberController.prototype, "updatePermissions", null);
__decorate([
    (0, common_1.Post)('members'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, get_group_members_dto_1.GetGroupMembersDto]),
    __metadata("design:returntype", Promise)
], GroupMemberController.prototype, "getGroupMembers", null);
exports.GroupMemberController = GroupMemberController = __decorate([
    (0, common_1.Controller)({ path: 'group-member', version: '1' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [group_member_service_1.GroupMemberService])
], GroupMemberController);
//# sourceMappingURL=group-member.controller.js.map