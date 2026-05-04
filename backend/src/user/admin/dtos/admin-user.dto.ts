import { Role } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class AdminUserDto {
  @Expose()
  id!: string;

  @Expose()
  email!: string;

  @Expose()
  phone?: string | null;

  @Expose()
  fullname!: string;

  @Expose()
  avatar?: string | null;

  @Expose()
  avatarPublicId?: string | null;

  @Expose()
  address?: string | null;

  @Expose()
  role!: Role;

  @Expose()
  isActive!: boolean;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}
