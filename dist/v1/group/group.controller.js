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
exports.GroupController = void 0;
const common_1 = require("@nestjs/common");
const group_service_1 = require("./group.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const create_group_dto_1 = require("./dto/create-group.dto");
const update_group_dto_1 = require("./dto/update-group.dto");
const get_my_groups_dto_1 = require("./dto/get-my-groups.dto");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let GroupController = class GroupController {
    constructor(groupService) {
        this.groupService = groupService;
    }
    async createGroup(user, dto) {
        const data = await this.groupService.createGroup(String(user.id), dto);
        return { message: 'Group created successfully', data };
    }
    async getMyGroups(user, dto) {
        const data = await this.groupService.getMyGroups(String(user.id), dto);
        return { message: 'Groups fetched successfully', data };
    }
    async updateGroup(user, dto) {
        if (dto.groupName === undefined && dto.description === undefined) {
            throw new common_1.BadRequestException('Provide at least one field to update: groupName or description');
        }
        const data = await this.groupService.updateGroup(String(user.id), dto);
        return { message: 'Group updated successfully', data };
    }
    async deleteGroup(user, body) {
        if (!body?.groupID) {
            throw new common_1.BadRequestException('groupID is required in request body');
        }
        const data = await this.groupService.deleteGroup(String(user.id), body.groupID);
        return { message: 'Group deleted successfully', data };
    }
};
exports.GroupController = GroupController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(201),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_group_dto_1.CreateGroupDto]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "createGroup", null);
__decorate([
    (0, common_1.Post)('my-groups'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, get_my_groups_dto_1.GetMyGroupsDto]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "getMyGroups", null);
__decorate([
    (0, common_1.Put)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_group_dto_1.UpdateGroupDto]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "updateGroup", null);
__decorate([
    (0, common_1.Delete)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "deleteGroup", null);
exports.GroupController = GroupController = __decorate([
    (0, common_1.Controller)({ path: 'group', version: '1' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [group_service_1.GroupService])
], GroupController);
//# sourceMappingURL=group.controller.js.map