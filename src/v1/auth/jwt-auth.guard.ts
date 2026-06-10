import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../schemas/user.schema';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request    = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'] || request.headers['x-auth-token'];
    const token      = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : authHeader;

    if (!token) {
      throw new UnauthorizedException('Access denied. No token provided.');
    }

    try {
      const decoded = this.jwtService.verify<{ user: { id: string; email: string } }>(token);

      const user = await this.userModel
        .findById(decoded.user.id)
        .select('-password')
        .lean();

      if (!user) {
        throw new UnauthorizedException('Access denied. User no longer exists.');
      }

      const session = user.sessions?.find(s => s.token === token);
      if (!session) {
        throw new UnauthorizedException('Access denied. Token is invalid or has been replaced.');
      }

      if (!session.tokenExpiry || new Date() > new Date(session.tokenExpiry)) {
        throw new UnauthorizedException('Access denied. Token has expired. Please login again.');
      }

      request.user = {
        id:       user._id,
        userName: user.name,
        emailId:  user.email,
        token,
      };

      return true;
    } catch (err) {
      if (err instanceof UnauthorizedException) throw err;
      throw new UnauthorizedException('Access denied. Token is not valid.');
    }
  }
}
