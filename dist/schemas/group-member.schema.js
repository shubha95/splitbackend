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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupMemberSchema = exports.GroupMember = exports.PERMISSIONS = void 0;
const mongoose_1 = require("@nestjs/mongoose");
exports.PERMISSIONS = [
    'addMember',
    'removeMember',
    'editGroup',
    'deleteGroup',
    'promoteAdmin',
    'manageExpenses',
];
let GroupMember = class GroupMember {
};
exports.GroupMember = GroupMember;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], GroupMember.prototype, "memberID", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], GroupMember.prototype, "groupAddedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], GroupMember.prototype, "groupID", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: ['owner', 'admin', 'member'], default: 'member' }),
    __metadata("design:type", String)
], GroupMember.prototype, "role", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], enum: exports.PERMISSIONS, default: [] }),
    __metadata("design:type", Array)
], GroupMember.prototype, "permissions", void 0);
exports.GroupMember = GroupMember = __decorate([
    (0, mongoose_1.Schema)({ timestamps: { createdAt: 'createDate', updatedAt: false } })
], GroupMember);
exports.GroupMemberSchema = mongoose_1.SchemaFactory.createForClass(GroupMember);
exports.GroupMemberSchema.index({ memberID: 1, groupID: 1 }, { unique: true });
//# sourceMappingURL=group-member.schema.js.map