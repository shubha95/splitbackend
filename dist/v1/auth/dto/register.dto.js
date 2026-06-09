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
exports.RegisterDto = void 0;
const class_validator_1 = require("class-validator");
class RegisterDto {
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'userName is required' }),
    (0, class_validator_1.MinLength)(2, { message: 'userName must be at least 2 characters' }),
    (0, class_validator_1.MaxLength)(30, { message: 'userName must not exceed 30 characters' }),
    (0, class_validator_1.Matches)(/^[a-zA-Z0-9_ ]+$/, {
        message: 'userName can only contain letters, numbers, spaces, and underscores',
    }),
    __metadata("design:type", String)
], RegisterDto.prototype, "userName", void 0);
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Please provide a valid email address' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "emailId", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'password is required' }),
    (0, class_validator_1.MinLength)(8, { message: 'password must be at least 8 characters' }),
    (0, class_validator_1.Matches)(/[A-Z]/, { message: 'password must contain at least one uppercase letter' }),
    (0, class_validator_1.Matches)(/[a-z]/, { message: 'password must contain at least one lowercase letter' }),
    (0, class_validator_1.Matches)(/[0-9]/, { message: 'password must contain at least one number' }),
    (0, class_validator_1.Matches)(/[@$!%*?&#^()_\-+=]/, {
        message: 'password must contain at least one special character (@$!%*?&)',
    }),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "address", void 0);
//# sourceMappingURL=register.dto.js.map