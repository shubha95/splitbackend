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
exports.GroupMemberService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const group_member_schema_1 = require("../../schemas/group-member.schema");
const user_schema_1 = require("../../schemas/user.schema");
let GroupMemberService = class GroupMemberService {
    constructor(groupMemberModel, userModel) {
        this.groupMemberModel = groupMemberModel;
        this.userModel = userModel;
    }
    async addMembers(requesterId, dto) {
        const requester = await this.groupMemberModel.findOne({
            memberID: String(requesterId),
            groupID: String(dto.groupID),
        });
        const canAdd = requester &&
            (requester.role === 'owner' ||
                (requester.role === 'admin' && requester.permissions.includes('addMember')));
        if (!canAdd) {
            throw new common_1.ForbiddenException('You do not have permission to add members to this group');
        }
        const docs = dto.memberID.map((id) => ({
            memberID: String(id).trim(),
            groupID: String(dto.groupID).trim(),
            groupAddedBy: String(requesterId),
            role: 'member',
            permissions: [],
        }));
        let insertedDocs = [];
        let skippedCount = 0;
        try {
            insertedDocs = await this.groupMemberModel.insertMany(docs, { ordered: false });
        }
        catch (err) {
            if (err.code === 11000 || err.writeErrors) {
                insertedDocs = err.insertedDocs || [];
                skippedCount = (err.writeErrors || []).length;
            }
            else {
                throw err;
            }
        }
        return {
            totalRequested: dto.memberID.length,
            added: insertedDocs.length,
            skipped: skippedCount,
            members: insertedDocs.map(this.format),
        };
    }
    async updateMember(requesterId, dto) {
        const member = await this.groupMemberModel.findOne({
            _id: dto.memberRecordID,
            groupAddedBy: String(requesterId),
        });
        if (!member) {
            throw new common_1.NotFoundException('Member record not found or you do not have permission');
        }
        member.groupID = String(dto.groupID).trim();
        await member.save();
        return this.format(member);
    }
    async deleteMember(requesterId, dto) {
        const memberDoc = await this.groupMemberModel.findById(dto.memberRecordID).lean();
        if (!memberDoc)
            throw new common_1.NotFoundException('Member record not found');
        if (memberDoc.role === 'owner') {
            throw new common_1.ForbiddenException('The group owner cannot be removed');
        }
        const requester = await this.groupMemberModel.findOne({
            memberID: String(requesterId),
            groupID: memberDoc.groupID,
        });
        const canRemove = requester &&
            (requester.role === 'owner' ||
                (requester.role === 'admin' && requester.permissions.includes('removeMember')));
        if (!canRemove) {
            throw new common_1.ForbiddenException('You do not have permission to remove members from this group');
        }
        await this.groupMemberModel.findByIdAndDelete(dto.memberRecordID);
        return { memberRecordID: memberDoc._id };
    }
    async promoteToAdmin(requesterId, dto) {
        const requester = await this.groupMemberModel.findOne({
            memberID: String(requesterId),
            groupID: String(dto.groupID),
        });
        if (!requester || requester.role !== 'owner') {
            throw new common_1.ForbiddenException('Only the group owner can promote members to admin');
        }
        const member = await this.groupMemberModel.findOneAndUpdate({ memberID: String(dto.targetMemberID), groupID: String(dto.groupID), role: 'member' }, { role: 'admin', permissions: [] }, { new: true });
        if (!member) {
            throw new common_1.NotFoundException('Member not found or is already an admin/owner');
        }
        return this.format(member);
    }
    async demoteToMember(requesterId, dto) {
        const requester = await this.groupMemberModel.findOne({
            memberID: String(requesterId),
            groupID: String(dto.groupID),
        });
        if (!requester || requester.role !== 'owner') {
            throw new common_1.ForbiddenException('Only the group owner can demote admins');
        }
        const member = await this.groupMemberModel.findOneAndUpdate({ memberID: String(dto.targetMemberID), groupID: String(dto.groupID), role: 'admin' }, { role: 'member', permissions: [] }, { new: true });
        if (!member) {
            throw new common_1.NotFoundException('Member not found or is not an admin');
        }
        return this.format(member);
    }
    async updatePermissions(requesterId, dto) {
        const requester = await this.groupMemberModel.findOne({
            memberID: String(requesterId),
            groupID: String(dto.groupID),
        });
        if (!requester || requester.role !== 'owner') {
            throw new common_1.ForbiddenException('Only the group owner can manage permissions');
        }
        const member = await this.groupMemberModel.findOneAndUpdate({ memberID: String(dto.targetMemberID), groupID: String(dto.groupID), role: 'admin' }, { permissions: dto.permissions }, { new: true });
        if (!member) {
            throw new common_1.NotFoundException('Admin member not found in this group');
        }
        return this.format(member);
    }
    async getGroupMembers(requesterId, dto) {
        const requester = await this.groupMemberModel.findOne({
            memberID: String(requesterId),
            groupID: String(dto.groupID),
        });
        if (!requester) {
            throw new common_1.ForbiddenException('You are not a member of this group');
        }
        const members = await this.groupMemberModel
            .find({ groupID: String(dto.groupID) })
            .lean();
        const userObjectIds = members
            .map(m => { try {
            return new mongoose_2.Types.ObjectId(m.memberID);
        }
        catch {
            return null;
        } })
            .filter(Boolean);
        const users = await this.userModel
            .find({ _id: { $in: userObjectIds } })
            .select('name email avatar')
            .lean();
        const userMap = new Map(users.map(u => [String(u._id), u]));
        return members.map(m => {
            const u = userMap.get(m.memberID);
            return {
                memberRecordID: m._id,
                memberID: m.memberID,
                groupID: m.groupID,
                groupAddedBy: m.groupAddedBy,
                role: m.role,
                permissions: m.permissions,
                createDate: m.createDate,
                userName: u?.name ?? null,
                emailId: u?.email ?? null,
                avatar: u?.avatar ?? null,
            };
        });
    }
    format(member) {
        return {
            memberRecordID: member._id,
            memberID: member.memberID,
            groupID: member.groupID,
            groupAddedBy: member.groupAddedBy,
            role: member.role,
            permissions: member.permissions,
            createDate: member.createDate,
        };
    }
};
exports.GroupMemberService = GroupMemberService;
exports.GroupMemberService = GroupMemberService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(group_member_schema_1.GroupMember.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], GroupMemberService);
//# sourceMappingURL=group-member.service.js.map