import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CloudinaryModule } from '@common/cloudinary/cloudinary.module';

import { CategoryControllerAdmin } from './category-admin.controller';

@Module({
  imports: [AuthModule, PrismaModule, CloudinaryModule],
  providers: [CategoryService],
  controllers: [CategoryControllerAdmin],
  exports: [CategoryService],
})
export class CategoryModule {}
