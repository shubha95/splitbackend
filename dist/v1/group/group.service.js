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
exports.GroupService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const group_schema_1 = require("../../schemas/group.schema");
const group_member_schema_1 = require("../../schemas/group-member.schema");
let GroupService = class GroupService {
    constructor(groupModel, groupMemberModel) {
        this.groupModel = groupModel;
        this.groupMemberModel = groupMemberModel;
    }
    async createGroup(userId, dto) {
        const group = new this.groupModel({
            groupName: String(dto.groupName).trim(),
            createdBy: userId,
            description: dto.description ? String(dto.description).trim() : '',
        });
        await group.save();
        await this.groupMemberModel.create({
            memberID: userId,
            groupID: String(group._id),
            groupAddedBy: userId,
            role: 'owner',
            permissions: [],
        });
        return this.format(group);
    }
    async updateGroup(userId, dto) {
        const membership = await this.groupMemberModel.findOne({
            memberID: userId,
            groupID: String(dto.groupID),
        });
        const canEdit = membership &&
            (membership.role === 'owner' ||
                (membership.role === 'admin' && membership.permissions.includes('editGroup')));
        if (!canEdit) {
            throw new common_1.NotFoundException('Group not found or you do not have permission to edit');
        }
        const group = await this.groupModel.findById(dto.groupID);
        if (!group)
            throw new common_1.NotFoundException('Group not found');
        if (dto.groupName !== undefined)
            group.groupName = String(dto.groupName).trim();
        if (dto.description !== undefined)
            group.description = String(dto.description).trim();
        await group.save();
        return this.format(group);
    }
    async deleteGroup(userId, groupID) {
        const membership = await this.groupMemberModel.findOne({
            memberID: userId,
            groupID,
        });
        const canDelete = membership &&
            (membership.role === 'owner' ||
                (membership.role === 'admin' && membership.permissions.includes('deleteGroup')));
        if (!canDelete) {
            throw new common_1.NotFoundException('Group not found or you do not have permission to delete');
        }
        const memberCount = await this.groupMemberModel.countDocuments({ groupID });
        if (memberCount > 1) {
            throw new common_1.BadRequestException('Cannot delete group while it still has members. Remove all members first.');
        }
        const group = await this.groupModel.findByIdAndDelete(groupID);
        if (!group)
            throw new common_1.NotFoundException('Group not found');
        await this.groupMemberModel.deleteMany({ groupID });
        return { groupID: group._id };
    }
    async getMyGroups(userId, dto) {
        const limit = Number(dto.itemNumber);
        const skip = (Number(dto.pageNumber) - 1) * limit;
        const [result] = await this.groupMemberModel.aggregate([
            { $match: { memberID: userId } },
            {
                $facet: {
                    total: [{ $count: 'count' }],
                    members: [
                        { $skip: skip },
                        { $limit: limit },
                        {
                            $lookup: {
                                from: 'groups',
                                let: { gid: '$groupID' },
                                pipeline: [
                                    { $match: { $expr: { $eq: ['$_id', { $toObjectId: '$$gid' }] } } },
                                ],
                                as: 'groupData',
                            },
                        },
                        { $unwind: '$groupData' },
                        { $replaceRoot: { newRoot: '$groupData' } },
                    ],
                },
            },
        ]);
        const total = result.total[0]?.count ?? 0;
        return {
            total,
            pageNumber: Number(dto.pageNumber),
            itemNumber: limit,
            totalPages: Math.ceil(total / limit),
            groups: result.members.map(this.format),
        };
    }
    format(group) {
        return {
            groupID: group._id,
            groupName: group.groupName,
            createdBy: group.createdBy,
            description: group.description,
            createDate: group.createDate,
            updateDate: group.updateDate,
        };
    }
};
exports.GroupService = GroupService;
exports.GroupService = GroupService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(group_schema_1.Group.name)),
    __param(1, (0, mongoose_1.InjectModel)(group_member_schema_1.GroupMember.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], GroupService);
//# sourceMappingURL=group.service.js.map