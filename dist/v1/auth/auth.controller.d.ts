import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SocialLoginDto } from './dto/social-login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { CurrentUserPayload } from '../../common/decorators/current-user.decorator';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        message: string;
        data: {
            user: {
                id: any;
                userName: string;
                emailId: string;
                address: string;
            };
            token: string;
            tokenExpiry: Date;
        };
    }>;
    login(dto: LoginDto): Promise<{
        message: string;
        data: {
            user: {
                id: any;
                userName: string;
                emailId: string;
                address: string;
            };
            token: string;
            tokenExpiry: Date;
        };
    }>;
    socialLogin(dto: SocialLoginDto): Promise<{
        message: string;
        data: {
            user: {
                id: any;
                userName: string;
                emailId: string;
                address: string;
            };
            token: string;
            tokenExpiry: Date;
        };
    }>;
    changePassword(dto: ChangePasswordDto): Promise<{
        message: string;
        data: any;
    }>;
    getMe(user: CurrentUserPayload): Promise<{
        message: string;
        data: {
            id: string;
            userName: string;
            emailId: string;
        };
    }>;
    logout(user: CurrentUserPayload): Promise<{
        message: string;
        data: any;
    }>;
    getUsers(dto: GetUsersDto): Promise<{
        message: string;
        data: {
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
        };
    }>;
}
