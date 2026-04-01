import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CloudinaryModule } from '@common/cloudinary/cloudinary.module';
import { CategoryControllerUser } from './controller/category-user.controller';
import { CategoryControllerAdmin } from './controller/category-admin.controller';

@Module({
  imports: [AuthModule, PrismaModule, CloudinaryModule],
  providers: [CategoryService],
  controllers: [CategoryControllerUser, CategoryControllerAdmin],
  exports: [CategoryService],
})
export class CategoryModule {}
