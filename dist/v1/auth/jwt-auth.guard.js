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
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../../schemas/user.schema");
let JwtAuthGuard = class JwtAuthGuard {
    constructor(jwtService, userModel) {
        this.jwtService = jwtService;
        this.userModel = userModel;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'] || request.headers['x-auth-token'];
        const token = authHeader?.startsWith('Bearer ')
            ? authHeader.slice(7)
            : authHeader;
        if (!token) {
            throw new common_1.UnauthorizedException('Access denied. No token provided.');
        }
        try {
            const decoded = this.jwtService.verify(token);
            const user = await this.userModel
                .findById(decoded.user.id)
                .select('-password')
                .lean();
            if (!user) {
                throw new common_1.UnauthorizedException('Access denied. User no longer exists.');
            }
            const session = user.sessions?.find(s => s.token === token);
            if (!session) {
                throw new common_1.UnauthorizedException('Access denied. Token is invalid or has been replaced.');
            }
            if (!session.tokenExpiry || new Date() > new Date(session.tokenExpiry)) {
                throw new common_1.UnauthorizedException('Access denied. Token has expired. Please login again.');
            }
            request.user = {
                id: user._id,
                userName: user.name,
                emailId: user.email,
                token,
            };
            return true;
        }
        catch (err) {
            if (err instanceof common_1.UnauthorizedException)
                throw err;
            throw new common_1.UnauthorizedException('Access denied. Token is not valid.');
        }
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        mongoose_2.Model])
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map