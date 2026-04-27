import {
  BadRequestException,
  ConflictException,
  GoneException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignupUserDto } from './dtos/signup.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private readonly mailService: MailService,
    private configService: ConfigService,
  ) {}

  async signup(data: SignupUserDto) {
    let { email, phone, fullname, password, address } = data;

    email = email.toLowerCase().trim();
    fullname = fullname.trim();
    if (phone) phone = phone.trim();
    if (address) address = address.trim();

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          phone,
          fullname,
          password: hashedPassword,
          address,
        },
      });

      await this.mailService.sendMail(user.email, 'Đăng ký thành công', {
        text: `Chào ${user.fullname}, bạn đã đăng ký tài khoản thành công.`,
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

    // revoke toàn bộ token cũ của user
    await this.prisma.refreshToken.updateMany({
      where: {
        userId: user.id,
        isRevoked: false,
      },
      data: {
        isRevoked: true,
      },
    });

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

  async logout(refreshToken: string) {
    const hashedRefreshToken = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    const tokenRecord = await this.prisma.refreshToken.findUnique({
      where: { tokenHash: hashedRefreshToken },
    });

    if (!tokenRecord) {
      return { message: 'Đăng xuất thành công!' };
    }

    await this.prisma.refreshToken.delete({
      where: { tokenHash: hashedRefreshToken },
    });

    return { message: 'Đăng xuất thành công!' };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // tránh lộ email tồn tại hay không
      return { message: 'Nếu email tồn tại, chúng tôi đã gửi hướng dẫn' };
    }

    // tạo token random
    const token = crypto.randomBytes(32).toString('hex');

    // hash token trước khi lưu DB
    const tokenHash = await bcrypt.hash(token, 10);

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 phút

    await this.prisma.passwordResetToken.create({
      data: {
        tokenHash,
        userId: user.id,
        expiresAt,
      },
    });

    const frontendUrl = this.configService.get<string>('FRONTEND_URL');

    const resetLink = `${frontendUrl}/reset-password?token=${token}`;

    await this.mailService.sendMail(user.email, 'Đặt lại mật khẩu', {
      text: `Copy link này để đặt lại mật khẩu: ${resetLink}`,
      html: `
      <p>Bạn đã yêu cầu đặt lại mật khẩu.</p>
      <p>
        <a href="${resetLink}">Click vào đây để đặt lại mật khẩu</a>
      </p>
      <p>Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>
    `,
    });

    return { message: 'Nếu email tồn tại, chúng tôi đã gửi hướng dẫn' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const { token, newPassword } = dto;

    const tokens = await this.prisma.passwordResetToken.findMany({
      where: { isUsed: false },
      include: { user: true },
    });

    let validTokenRecord: (typeof tokens)[number] | null = null;

    for (const record of tokens) {
      const isMatch = await bcrypt.compare(token, record.tokenHash);

      if (isMatch) {
        validTokenRecord = record;
        break;
      }
    }

    if (!validTokenRecord) {
      throw new BadRequestException('Token không hợp lệ');
    }

    if (validTokenRecord.expiresAt < new Date()) {
      throw new GoneException('Token đã hết hạn');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: validTokenRecord.userId },
      data: { password: hashedPassword },
    });

    await this.prisma.passwordResetToken.update({
      where: { id: validTokenRecord.id },
      data: { isUsed: true },
    });

    return { message: 'Đặt lại mật khẩu thành công!' };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullname: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User không tồn tại');
    }

    return user;
  }
}
