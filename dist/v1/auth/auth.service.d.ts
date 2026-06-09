import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { UserDocument } from '../../schemas/user.schema';
import { SocialAuthService } from './social-auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { SocialLoginDto } from './dto/social-login.dto';
export declare class AuthService {
    private readonly userModel;
    private readonly jwtService;
    private readonly socialAuthService;
    constructor(userModel: Model<UserDocument>, jwtService: JwtService, socialAuthService: SocialAuthService);
    private generateToken;
    private getTokenExpiry;
    register(dto: RegisterDto): Promise<{
        user: {
            id: any;
            userName: string;
            emailId: string;
            address: string;
        };
        token: string;
        tokenExpiry: Date;
    }>;
    login(dto: LoginDto): Promise<{
        user: {
            id: any;
            userName: string;
            emailId: string;
            address: string;
        };
        token: string;
        tokenExpiry: Date;
    }>;
    socialLogin(dto: SocialLoginDto): Promise<{
        user: {
            id: any;
            userName: string;
            emailId: string;
            address: string;
        };
        token: string;
        tokenExpiry: Date;
    }>;
    private findOrCreateSocialUser;
    changePassword(dto: ChangePasswordDto): Promise<void>;
    getUsers(dto: GetUsersDto): Promise<{
        total: number;
        pageNumber: number;
        itemNumber: number;
        totalPages: number;
        users: {
            id: import("mongoose").Types.ObjectId;
            userName: string;
            emailId: string;
            address: string;
            createdAt: Date;
        }[];
    }>;
    logout(userId: string): Promise<void>;
}
