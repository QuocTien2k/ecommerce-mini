import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { pickUpdatedFields } from '@common/utils/pick-update-fields';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { CloudinaryService } from '@common/cloudinary/cloudinary.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

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
      throw new NotFoundException('Người dùng không tồn tại!');
    }

    //check phone
    if (dto.phone) {
      const existingPhone = await this.prisma.user.findUnique({
        where: { phone: dto.phone },
      });

      if (existingPhone && existingPhone.id !== userId) {
        throw new ConflictException({
          message: 'Số điện thoại đã được sử dụng',
          errors: { phone: 'duplicated' },
        });
      }
    }

    //check email
    if (dto.email) {
      const existingEmail = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (existingEmail && existingEmail.id !== userId) {
        throw new ConflictException({
          message: 'Email đã được sử dụng',
          errors: { email: 'duplicated' },
        });
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

  //password
  async updatePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.findById(userId);

    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại!');
    }

    //Check old password
    const isMatch = await bcrypt.compare(dto.oldPassword, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Mật khẩu cũ không chính xác');
    }

    //Check new password != old password
    const isSame = await bcrypt.compare(dto.newPassword, user.password);
    if (isSame) {
      throw new BadRequestException(
        'Mật khẩu mới không được trùng mật khẩu cũ',
      );
    }

    //Hash new password
    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    // 4. Update DB
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });

    return {
      message: 'Cập nhật mật khẩu thành công',
    };
  }

  //upload avatar
  async uploadAvatar(userId: string, file: Express.Multer.File) {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại!');
    }

    if (!file) {
      throw new BadRequestException('Vui lòng chọn ảnh');
    }

    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('File phải là hình ảnh');
    }

    const result: any = await this.cloudinaryService.uploadImage(
      file,
      'users/avatars',
    );

    const imageUrl = result.secure_url;

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        avatar: imageUrl,
      },
    });

    return {
      message: 'Cập nhật avatar thành công',
      avatar: updatedUser.avatar,
    };
  }
}
