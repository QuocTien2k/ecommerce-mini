import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupUserDto } from './dtos/signup.dto';
import { AuthUserResponseDto } from './dtos/auth-user-response.dto';
import { LoginDto } from './dtos/login.dto';
import { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { getRefreshTokenCookieOptions } from '@common/helpers/cookie.helper';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() data: SignupUserDto): Promise<AuthUserResponseDto> {
    return this.authService.signup(data);
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const { accessToken, refreshToken } = await this.authService.login(
      dto.email,
      dto.password,
    );

    res.cookie(
      'refreshToken',
      refreshToken,
      getRefreshTokenCookieOptions(this.configService),
    );

    return {
      accessToken,
    };
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Không tìm thấy refresh token');
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await this.authService.refresh(refreshToken);

    res.cookie(
      'refreshToken',
      newRefreshToken,
      getRefreshTokenCookieOptions(this.configService),
    );

    return {
      accessToken,
    };
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }

    //clear cookie
    res.clearCookie(
      'refreshToken',
      getRefreshTokenCookieOptions(this.configService),
    );

    return { message: 'Đăng xuất thành công' };
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@CurrentUser('sub') userId: string) {
    return this.authService.getMe(userId);
  }
}
