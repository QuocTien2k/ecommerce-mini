import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { toSlug } from '@common/utils/slug';
import { CloudinaryService } from '@common/cloudinary/cloudinary.service';
import { CategoryTreeNode, FlatCategoryItem } from './dtos/tree-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  //check level category
  async getCategoryLevel(categoryId: string): Promise<number> {
    let level = 1;
    let current = await this.prisma.category.findUnique({
      where: { id: categoryId },
      select: { parentId: true },
    });

    while (current?.parentId) {
      level++;
      current = await this.prisma.category.findUnique({
        where: { id: current.parentId },
        select: { parentId: true },
      });
    }

    return level;
  }

  async create(dto: CreateCategoryDto, file: Express.Multer.File) {
    let slug = toSlug(dto.slug || dto.name);
    let uniqueSlug = slug;
    let counter = 1;

    while (
      await this.prisma.category.findUnique({ where: { slug: uniqueSlug } })
    ) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    if (dto.parentId) {
      const parent = await this.prisma.category.findUnique({
        where: { id: dto.parentId },
      });

      if (!parent) {
        throw new BadRequestException('Không tìm thấy danh mục cha');
      }

      const parentLevel = await this.getCategoryLevel(dto.parentId);
      if (parentLevel >= 3) {
        throw new BadRequestException('Category con vượt quá level 3');
      }
    }

    let imageUrl: string | null = null;
    let publicId: string | null = null;

    if (file) {
      if (!file.mimetype.startsWith('image/')) {
        throw new BadRequestException('File phải là hình ảnh');
      }

      const result = await this.cloudinaryService.uploadImage(
        file,
        'categories/images', // folder cho category
      );

      imageUrl = result.secure_url;
      publicId = result.public_id;
    }

    return this.prisma.category.create({
      data: {
        name: dto.name,
        slug: uniqueSlug,
        description: dto.description,
        image: imageUrl,
        imagePublicId: publicId,
        parentId: dto.parentId ?? null,
        isActive: dto.isActive ?? true,
      },
    });
  }

  async getCategoryTreeWithLevel(): Promise<CategoryTreeNode[]> {
    const categories = await this.prisma.category.findMany({
      select: {
        id: true,
        name: true,
        parentId: true,
        isActive: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    const map = new Map<string, CategoryTreeNode>();
    const roots: CategoryTreeNode[] = [];

    //build node
    for (const cat of categories) {
      map.set(cat.id, {
        ...cat,
        level: 1,
        children: [],
      });
    }

    //build tree
    for (const cat of categories) {
      const node = map.get(cat.id)!;

      if (cat.parentId && map.has(cat.parentId)) {
        map.get(cat.parentId)!.children.push(node);
      } else {
        roots.push(node);
      }
    }

    const setLevel = (nodes: CategoryTreeNode[], level: number): void => {
      for (const node of nodes) {
        node.level = level;
        if (node.children.length > 0) {
          setLevel(node.children, level + 1);
        }
      }
    };

    setLevel(roots, 1);

    return roots;
  }

  //UI
  async getFlatCategoryTree(): Promise<FlatCategoryItem[]> {
    const tree = await this.getCategoryTreeWithLevel();
    const result: FlatCategoryItem[] = [];

    const traverse = (nodes: CategoryTreeNode[]): void => {
      for (const node of nodes) {
        result.push({
          id: node.id,
          name: `${node.level > 1 ? '--'.repeat(node.level - 1) + ' ' : ''}${node.name}`,
          level: node.level,
          isActive: node.isActive,
        });

        if (node.children.length > 0) {
          traverse(node.children);
        }
      }
    };

    traverse(tree);

    return result;
  }
}
