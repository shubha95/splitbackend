import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { UserDocument } from '../../schemas/user.schema';
export declare class JwtAuthGuard implements CanActivate {
    private readonly jwtService;
    private readonly userModel;
    constructor(jwtService: JwtService, userModel: Model<UserDocument>);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
