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
exports.UpdatePermissionsDto = void 0;
const class_validator_1 = require("class-validator");
const group_member_schema_1 = require("../../../schemas/group-member.schema");
class UpdatePermissionsDto {
}
exports.UpdatePermissionsDto = UpdatePermissionsDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'targetMemberID is required' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'targetMemberID is required' }),
    __metadata("design:type", String)
], UpdatePermissionsDto.prototype, "targetMemberID", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'groupID is required' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'groupID is required' }),
    __metadata("design:type", String)
], UpdatePermissionsDto.prototype, "groupID", void 0);
__decorate([
    (0, class_validator_1.IsArray)({ message: 'permissions must be an array' }),
    (0, class_validator_1.IsIn)(group_member_schema_1.PERMISSIONS, {
        each: true,
        message: `Each permission must be one of: ${group_member_schema_1.PERMISSIONS.join(', ')}`,
    }),
    __metadata("design:type", Array)
], UpdatePermissionsDto.prototype, "permissions", void 0);
//# sourceMappingURL=update-permissions.dto.js.map