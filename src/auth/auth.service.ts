import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignupUserDto } from './dtos/signup.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup(data: SignupUserDto) {
    let { email, phone, fullname, password } = data;

    email = email.toLowerCase().trim();
    fullname = fullname.trim();
    if (phone) phone = phone.trim();

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          phone,
          fullname,
          password: hashedPassword,
        },
      });

      return {
        id: user.id,
        email: user.email,
        role: user.role,
      };
    } catch (error) {
      // Prisma unique constraint error
      if (error.code === 'P2002') {
        const target = (error.meta?.target as string[]) || undefined;

        if (target?.includes('email')) {
          throw new ConflictException('Email đã tồn tại');
        }

        if (target?.includes('phone')) {
          throw new ConflictException('Số điện thoại đã được dùng');
        }

        // fallback
        throw new ConflictException('Dữ liệu đã tồn tại');
      }

      throw error;
    }
  }

  async login(email: string, password: string) {
    email = email.toLowerCase().trim();

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });

    const refreshToken = crypto.randomBytes(64).toString('hex');

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // SHA256 hash
    const hashedRefreshToken = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    await this.prisma.refreshToken.create({
      data: {
        tokenHash: hashedRefreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string) {
    //hash token từ client
    const hashedRefreshToken = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    //query DB
    const tokenRecord = await this.prisma.refreshToken.findUnique({
      where: { tokenHash: hashedRefreshToken },
      include: { user: true },
    });

    if (!tokenRecord) {
      throw new UnauthorizedException('Refresh token không hợp lệ');
    }

    //validate token
    if (tokenRecord.isRevoked) {
      throw new UnauthorizedException('Refresh token đã bị thu hồi');
    }

    if (tokenRecord.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token đã hết hạn');
    }

    const user = tokenRecord.user;

    //tạo accessToken mới
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const newAccessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });

    //rotate refresh token
    const newRefreshToken = crypto.randomBytes(64).toString('hex');

    const newExpiresAt = new Date();
    newExpiresAt.setDate(newExpiresAt.getDate() + 7);

    const newHashedRefreshToken = crypto
      .createHash('sha256')
      .update(newRefreshToken)
      .digest('hex');

    // transaction để đảm bảo atomic
    await this.prisma.$transaction([
      // xóa token cũ
      this.prisma.refreshToken.delete({
        where: { id: tokenRecord.id },
      }),

      // tạo token mới
      this.prisma.refreshToken.create({
        data: {
          tokenHash: newHashedRefreshToken,
          userId: user.id,
          expiresAt: newExpiresAt,
        },
      }),
    ]);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
