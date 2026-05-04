import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { AdminUserQuery } from './types/admin-user.type';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import {
  buildPaginatedResponse,
  getPagination,
} from '@common/utils/pagination';
import { AdminUserDto } from './dtos/admin-user.dto';
import { UserFilters } from './types/user-filter.type';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  private parseBoolean(value?: boolean | string): boolean | undefined {
    if (value === undefined) return undefined;
    if (typeof value === 'boolean') return value;
    return value === 'true' ? true : value === 'false' ? false : undefined;
  }

  private extractFilters(query: AdminUserQuery): UserFilters {
    return {
      id: query.id?.trim(),
      keyword: query.keyword?.trim(),
      isActive: this.parseBoolean(query.isActive),
      role: query.role,
    };
  }

  private buildUserWhere(filters: UserFilters): Prisma.UserWhereInput {
    const { id, keyword, isActive, role } = filters;

    const where: Prisma.UserWhereInput = {};

    if (id) {
      where.id = id;
    }

    if (keyword) {
      where.OR = [
        { email: { contains: keyword, mode: 'insensitive' } },
        { phone: { contains: keyword, mode: 'insensitive' } },
      ];
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (role) {
      where.role = role;
    }

    return where;
  }

  async getUsers(query: AdminUserQuery) {
    const { page, limit, skip } = getPagination({
      ...query,
      limit: query.limit ?? 6, // default 6
    });

    const filters = this.extractFilters(query);
    const where = this.buildUserWhere(filters);

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    const data = plainToInstance(AdminUserDto, users, {
      excludeExtraneousValues: true,
    });

    return buildPaginatedResponse(data, total, page, limit);
  }

  async setUserActiveStatus(
    userId: string,
    isActive: boolean,
    currentAdminId: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('không tìm thấy người dùng!');
    }

    if (userId === currentAdminId && isActive === false) {
      throw new BadRequestException('Không tự khóa chính mình!');
    }

    if (user.isActive === isActive) {
      return plainToInstance(AdminUserDto, user, {
        excludeExtraneousValues: true,
      });
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { isActive },
    });

    return plainToInstance(AdminUserDto, updatedUser, {
      excludeExtraneousValues: true,
    });
  }
}
