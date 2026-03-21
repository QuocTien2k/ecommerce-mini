import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignupUserDto } from './dtos/signup.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async singup(data: SignupUserDto) {
    let { email, phone, fullname, password } = data;

    email = email.toLowerCase().trim();

    if (phone) {
      phone = phone.trim();
    }

    fullname = fullname.trim();

    //check email exists
    const existingEmail = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      throw new ConflictException('Email đã tồn tại');
    }

    const emailNormalized = email.toLowerCase().trim();

    //check phone
    if (phone) {
      const existingPhone = await this.prisma.user.findUnique({
        where: { phone },
      });

      if (existingPhone) {
        throw new ConflictException('Số điện thoại đã được dùng');
      }
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Create user
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
  }
}
