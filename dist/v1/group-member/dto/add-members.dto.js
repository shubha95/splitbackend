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
exports.AddMembersDto = void 0;
const class_validator_1 = require("class-validator");
class AddMembersDto {
}
exports.AddMembersDto = AddMembersDto;
__decorate([
    (0, class_validator_1.IsArray)({ message: 'memberID must be an array e.g. ["id1","id2"]' }),
    (0, class_validator_1.ArrayMinSize)(1, { message: 'memberID array must not be empty' }),
    (0, class_validator_1.IsString)({ each: true, message: 'memberID array must not contain empty values' }),
    (0, class_validator_1.IsNotEmpty)({ each: true, message: 'memberID array must not contain empty values' }),
    __metadata("design:type", Array)
], AddMembersDto.prototype, "memberID", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'groupID is required' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'groupID is required' }),
    __metadata("design:type", String)
], AddMembersDto.prototype, "groupID", void 0);
//# sourceMappingURL=add-members.dto.js.map