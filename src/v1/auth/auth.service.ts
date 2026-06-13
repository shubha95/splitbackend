import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';

import { User, UserDocument }               from '../../schemas/user.schema';
import { GroupMember, GroupMemberDocument } from '../../schemas/group-member.schema';
import { SocialAuthService, SocialProfile } from './social-auth.service';
import { RegisterDto }       from './dto/register.dto';
import { LoginDto }          from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { GetUsersDto }       from './dto/get-users.dto';
import { SocialLoginDto }    from './dto/social-login.dto';

const SALT_ROUNDS    = 10;
const TOKEN_EXPIRY_H = 24;

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)        private readonly userModel: Model<UserDocument>,
    @InjectModel(GroupMember.name) private readonly groupMemberModel: Model<GroupMemberDocument>,
    private readonly jwtService: JwtService,
    private readonly socialAuthService: SocialAuthService,
  ) {}

  // ── helpers ──────────────────────────────────────────────────────────────

  private generateToken(payload: { user: { id: string; email: string } }): string {
    return this.jwtService.sign(payload);
  }

  private getTokenExpiry(): Date {
    return new Date(Date.now() + TOKEN_EXPIRY_H * 60 * 60 * 1000);
  }

  // ── register ─────────────────────────────────────────────────────────────

  async register(dto: RegisterDto) {
    const email = dto.emailId.trim().toLowerCase();

    const existing = await this.userModel.findOne({ email });
    if (existing) {
      throw new ConflictException({
        field:   'emailId',
        message: 'An account with this email already exists',
      });
    }

    const hash = await bcrypt.hash(dto.password, SALT_ROUNDS);

    const user = new this.userModel({
      name:     dto.userName.trim(),
      email,
      password: hash,
      address:  dto.address ? String(dto.address).trim() : '',
    });

    const token       = this.generateToken({ user: { id: user.id, email: user.email } });
    const tokenExpiry = this.getTokenExpiry();

    user.sessions.push({ token, tokenExpiry });
    await user.save();

    return {
      user: { id: user.id, userName: user.name, emailId: user.email, address: user.address },
      token,
      tokenExpiry,
    };
  }

  // ── login ─────────────────────────────────────────────────────────────────

  async login(dto: LoginDto) {
    const email = String(dto.emailId).trim().toLowerCase();

    const user = await this.userModel.findOne({ email });
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid email or password');

    const token       = this.generateToken({ user: { id: user.id, email: user.email } });
    const tokenExpiry = this.getTokenExpiry();

    // remove expired sessions, then add the new one
    const now = new Date();
    (user.sessions as any) = user.sessions.filter(s => new Date(s.tokenExpiry) > now);
    user.sessions.push({ token, tokenExpiry });
    await user.save();

    return {
      user: { id: user.id, userName: user.name, emailId: user.email, address: user.address },
      token,
      tokenExpiry,
    };
  }

  // ── social login ─────────────────────────────────────────────────────────

  async socialLogin(dto: SocialLoginDto) {
    const verifyFns: Record<string, (t: string) => Promise<SocialProfile>> = {
      google:   (t) => this.socialAuthService.verifyGoogleToken(t),
      facebook: (t) => this.socialAuthService.verifyFacebookToken(t),
      twitter:  (t) => this.socialAuthService.verifyTwitterToken(t),
      outlook:  (t) => this.socialAuthService.verifyOutlookToken(t),
    };

    let profile: SocialProfile;
    try {
      profile = await verifyFns[dto.provider](dto.token);
    } catch (err: any) {
      throw new UnauthorizedException(err.message);
    }

    const user = await this.findOrCreateSocialUser({
      provider:   dto.provider,
      providerId: profile.providerId,
      email:      profile.email,
      name:       profile.name,
      avatar:     profile.avatar,
    });

    const token       = this.generateToken({ user: { id: user.id, email: user.email } });
    const tokenExpiry = this.getTokenExpiry();

    const now = new Date();
    (user.sessions as any) = user.sessions.filter(s => new Date(s.tokenExpiry) > now);
    user.sessions.push({ token, tokenExpiry });
    await user.save();

    return {
      user: { id: user.id, userName: user.name, emailId: user.email, address: user.address || '' },
      token,
      tokenExpiry,
    };
  }

  // ── find or create social user ───────────────────────────────────────────

  private async findOrCreateSocialUser(params: {
    provider: string;
    providerId: string;
    email: string;
    name: string;
    avatar: string;
  }): Promise<UserDocument> {
    const { provider, providerId, email, name, avatar } = params;

    // 1. Existing user with this provider + providerId
    let user = await this.userModel.findOne({
      providers: { $elemMatch: { name: provider, providerId } },
    });
    if (user) return user;

    // 2. Existing user with matching email — link new provider
    if (email) {
      user = await this.userModel.findOne({ email: email.trim().toLowerCase() });
      if (user) {
        user.providers.push({ name: provider, providerId } as any);
        if (avatar && !user.avatar) user.avatar = avatar;
        await user.save();
        return user;
      }
    }

    // 3. Brand-new user created from social profile
    const fallbackEmail = email
      ? email.trim().toLowerCase()
      : `${providerId}@${provider}.social`;

    user = new this.userModel({
      name:      name || 'Social User',
      email:     fallbackEmail,
      providers: [{ name: provider, providerId }],
      avatar:    avatar || '',
      address:   '',
    });
    await user.save();
    return user;
  }

  // ── change password ──────────────────────────────────────────────────────

  async changePassword(dto: ChangePasswordDto) {
    const email = String(dto.emailId).trim().toLowerCase();
    const user  = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException('No account found with this email address');

    user.password = await bcrypt.hash(dto.newPassword, SALT_ROUNDS);
    (user.sessions as any) = [];
    await user.save();
  }

  // ── get users (paginated + search) ──────────────────────────────────────

  async getUsers(dto: GetUsersDto) {
    const page  = Number(dto.pageNumber);
    const limit = Number(dto.itemNumber);
    const skip  = (page - 1) * limit;

    const filter: any = {};
    if (dto.search && String(dto.search).trim()) {
      const regex = new RegExp(String(dto.search).trim(), 'i');
      filter.$or  = [{ name: regex }, { email: regex }];
    }

    if (dto.groupID && String(dto.groupID).trim()) {
      const members = await this.groupMemberModel
        .find({ groupID: String(dto.groupID).trim() })
        .select('memberID')
        .lean();
      const excludeIds = members
        .map(m => { try { return new Types.ObjectId(m.memberID); } catch { return null; } })
        .filter(Boolean);
      filter._id = { $nin: excludeIds };
    }

    const [users, total] = await Promise.all([
      this.userModel
        .find(filter)
        .select('-password -sessions -__v')
        .skip(skip)
        .limit(limit)
        .lean(),
      this.userModel.countDocuments(filter),
    ]);

    return {
      total,
      pageNumber:  page,
      itemNumber:  limit,
      totalPages:  Math.ceil(total / limit),
      users: users.map((u) => ({
        id:        u._id,
        userName:  u.name,
        emailId:   u.email,
        address:   u.address,
        createdAt: u.date,
      })),
    };
  }

  // ── logout ───────────────────────────────────────────────────────────────

  async logout(userId: string, token: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    (user.sessions as any) = user.sessions.filter(s => s.token !== token);
    await user.save();
  }
}
