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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcryptjs");
const user_schema_1 = require("../../schemas/user.schema");
const social_auth_service_1 = require("./social-auth.service");
const SALT_ROUNDS = 10;
const TOKEN_EXPIRY_H = 24;
let AuthService = class AuthService {
    constructor(userModel, jwtService, socialAuthService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
        this.socialAuthService = socialAuthService;
    }
    generateToken(payload) {
        return this.jwtService.sign(payload);
    }
    getTokenExpiry() {
        return new Date(Date.now() + TOKEN_EXPIRY_H * 60 * 60 * 1000);
    }
    async register(dto) {
        const email = dto.emailId.trim().toLowerCase();
        const existing = await this.userModel.findOne({ email });
        if (existing) {
            throw new common_1.ConflictException({
                field: 'emailId',
                message: 'An account with this email already exists',
            });
        }
        const hash = await bcrypt.hash(dto.password, SALT_ROUNDS);
        const user = new this.userModel({
            name: dto.userName.trim(),
            email,
            password: hash,
            address: dto.address ? String(dto.address).trim() : '',
        });
        const token = this.generateToken({ user: { id: user.id, email: user.email } });
        const tokenExpiry = this.getTokenExpiry();
        user.awsToken = token;
        user.tokenExpiry = tokenExpiry;
        await user.save();
        return {
            user: { id: user.id, userName: user.name, emailId: user.email, address: user.address },
            token,
            tokenExpiry,
        };
    }
    async login(dto) {
        const email = String(dto.emailId).trim().toLowerCase();
        const user = await this.userModel.findOne({ email });
        if (!user)
            throw new common_1.UnauthorizedException('Invalid email or password');
        const isMatch = await bcrypt.compare(dto.password, user.password);
        if (!isMatch)
            throw new common_1.UnauthorizedException('Invalid email or password');
        const token = this.generateToken({ user: { id: user.id, email: user.email } });
        const tokenExpiry = this.getTokenExpiry();
        user.awsToken = token;
        user.tokenExpiry = tokenExpiry;
        await user.save();
        return {
            user: { id: user.id, userName: user.name, emailId: user.email, address: user.address },
            token,
            tokenExpiry,
        };
    }
    async socialLogin(dto) {
        const verifyFns = {
            google: (t) => this.socialAuthService.verifyGoogleToken(t),
            facebook: (t) => this.socialAuthService.verifyFacebookToken(t),
            twitter: (t) => this.socialAuthService.verifyTwitterToken(t),
            outlook: (t) => this.socialAuthService.verifyOutlookToken(t),
        };
        let profile;
        try {
            profile = await verifyFns[dto.provider](dto.token);
        }
        catch (err) {
            throw new common_1.UnauthorizedException(err.message);
        }
        const user = await this.findOrCreateSocialUser({
            provider: dto.provider,
            providerId: profile.providerId,
            email: profile.email,
            name: profile.name,
            avatar: profile.avatar,
        });
        const token = this.generateToken({ user: { id: user.id, email: user.email } });
        const tokenExpiry = this.getTokenExpiry();
        user.awsToken = token;
        user.tokenExpiry = tokenExpiry;
        await user.save();
        return {
            user: { id: user.id, userName: user.name, emailId: user.email, address: user.address || '' },
            token,
            tokenExpiry,
        };
    }
    async findOrCreateSocialUser(params) {
        const { provider, providerId, email, name, avatar } = params;
        let user = await this.userModel.findOne({
            providers: { $elemMatch: { name: provider, providerId } },
        });
        if (user)
            return user;
        if (email) {
            user = await this.userModel.findOne({ email: email.trim().toLowerCase() });
            if (user) {
                user.providers.push({ name: provider, providerId });
                if (avatar && !user.avatar)
                    user.avatar = avatar;
                await user.save();
                return user;
            }
        }
        const fallbackEmail = email
            ? email.trim().toLowerCase()
            : `${providerId}@${provider}.social`;
        user = new this.userModel({
            name: name || 'Social User',
            email: fallbackEmail,
            providers: [{ name: provider, providerId }],
            avatar: avatar || '',
            address: '',
        });
        await user.save();
        return user;
    }
    async changePassword(dto) {
        const email = String(dto.emailId).trim().toLowerCase();
        const user = await this.userModel.findOne({ email });
        if (!user)
            throw new common_1.NotFoundException('No account found with this email address');
        user.password = await bcrypt.hash(dto.newPassword, SALT_ROUNDS);
        user.awsToken = null;
        user.tokenExpiry = null;
        await user.save();
    }
    async getUsers(dto) {
        const page = Number(dto.pageNumber);
        const limit = Number(dto.itemNumber);
        const skip = (page - 1) * limit;
        const filter = {};
        if (dto.search && String(dto.search).trim()) {
            const regex = new RegExp(String(dto.search).trim(), 'i');
            filter.$or = [{ name: regex }, { email: regex }];
        }
        const [users, total] = await Promise.all([
            this.userModel
                .find(filter)
                .select('-password -awsToken -tokenExpiry -__v')
                .skip(skip)
                .limit(limit)
                .lean(),
            this.userModel.countDocuments(filter),
        ]);
        return {
            total,
            pageNumber: page,
            itemNumber: limit,
            totalPages: Math.ceil(total / limit),
            users: users.map((u) => ({
                id: u._id,
                userName: u.name,
                emailId: u.email,
                address: u.address,
                createdAt: u.date,
            })),
        };
    }
    async logout(userId) {
        const user = await this.userModel.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        user.awsToken = null;
        user.tokenExpiry = null;
        await user.save();
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService,
        social_auth_service_1.SocialAuthService])
], AuthService);
//# sourceMappingURL=auth.service.js.map