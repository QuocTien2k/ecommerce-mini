import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CloudinaryModule } from '@common/cloudinary/cloudinary.module';
import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';

@Module({
  imports: [AuthModule, PrismaModule, CloudinaryModule],
  controllers: [UserController, AdminController],
  providers: [UserService, AdminService],
  exports: [UserService],
})
export class UserModule {}
