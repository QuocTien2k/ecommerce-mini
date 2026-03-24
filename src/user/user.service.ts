import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { pickUpdatedFields } from '@common/utils/pick-update-fields';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findById(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }

  //test lấy thông tin
  async getMe(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        phone: true,
        fullname: true,
        role: true,
        createdAt: true,
      },
    });
  }

  //thông tin
  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.findById(userId);

    if (!user) {
      throw new Error('Người dùng không tồn tại!');
    }

    //check phone
    if (dto.phone) {
      const existingPhone = await this.prisma.user.findUnique({
        where: { phone: dto.phone },
      });

      if (existingPhone && existingPhone.id !== userId) {
        throw new Error('Số điện thoại đã được sử dụng');
      }
    }

    //check email
    if (dto.email) {
      const existingEmail = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (existingEmail && existingEmail.id !== userId) {
        throw new Error('Email đã được sử dụng');
      }
    }

    const updateUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        fullname: dto.fullname,
        phone: dto.phone,
        email: dto.email,
      },
    });

    return pickUpdatedFields(dto, updateUser);
  }
}
