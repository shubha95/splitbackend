import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request    = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'] || request.headers['x-auth-token'];
    const token      = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : authHeader;

    if (!token) {
      throw new UnauthorizedException('Access denied. No token provided.');
    }

    request.user = await this.authService.verifyToken(token);
    return true;
  }
}
