import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { AuthService }      from './auth.service';
import { JwtAuthGuard }     from './jwt-auth.guard';
import { RegisterDto }      from './dto/register.dto';
import { LoginDto }         from './dto/login.dto';
import { SocialLoginDto }   from './dto/social-login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { GetUsersDto }      from './dto/get-users.dto';
import { UploadKeyDto }     from './dto/upload-key.dto';
import { GetPublicKeyDto }  from './dto/get-public-key.dto';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(201)
  async register(@Body() dto: RegisterDto) {
    const data = await this.authService.register(dto);
    return { message: 'Account created successfully', data };
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto) {
    const data = await this.authService.login(dto);
    return { message: 'Login successful', data };
  }

  @Post('social')
  @HttpCode(200)
  async socialLogin(@Body() dto: SocialLoginDto) {
    const data = await this.authService.socialLogin(dto);
    return { message: 'Login successful', data };
  }

  @Put('change-password')
  async changePassword(@Body() dto: ChangePasswordDto) {
    await this.authService.changePassword(dto);
    return {
      message: 'Password updated successfully. Please login with your new password.',
      data: null,
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser() user: CurrentUserPayload) {
    return {
      message: 'User fetched successfully',
      data: { id: user.id, userName: user.userName, emailId: user.emailId },
    };
  }

  @Post('logout')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async logout(@CurrentUser() user: CurrentUserPayload) {
    await this.authService.logout(String(user.id), user.token);
    return { message: 'Logged out successfully', data: null };
  }

  @Post('users')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async getUsers(@Body() dto: GetUsersDto) {
    const data = await this.authService.getUsers(dto);
    return { message: 'Users fetched successfully', data };
  }

  @Post('keys')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async uploadKey(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: UploadKeyDto,
  ) {
    await this.authService.uploadKey(String(user.id), dto);
    return { message: 'Public key stored successfully', data: null };
  }

  @Post('public-key')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async getPublicKey(@Body() dto: GetPublicKeyDto) {
    const data = await this.authService.getPublicKey(dto);
    return { message: 'Public key fetched successfully', data };
  }
}
