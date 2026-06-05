import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { toSlug } from '@common/utils/slug';
import { CloudinaryService } from '@common/cloudinary/cloudinary.service';
import { CategoryTreeNode, FlatCategoryItem } from './dtos/tree-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import {
  AdminCategoryQueryDto,
  CategoryDetailDto,
} from './dtos/admin-category.dto';
import {
  buildPaginatedResponse,
  getPagination,
} from '@common/utils/pagination';
import { Prisma, VariantType } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  private readonly adminCategorySelect = {
    id: true,
    name: true,
    slug: true,
    image: true,
    description: true,
    parentId: true,
    parent: {
      select: {
        id: true,
        name: true,
        parentId: true,
        parent: {
          select: {
            id: true,
          },
        },
      },
    },
    variantType: true,
    _count: {
      select: {
        children: true,
        products: true,
      },
    },
    isActive: true,
    deletedAt: true,
    createdAt: true,
  };

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

  //check circular
  async isDescendant(parentId: string, currentId: string): Promise<boolean> {
    let current = await this.prisma.category.findUnique({
      where: { id: parentId },
      select: { parentId: true },
    });

    while (current?.parentId) {
      if (current.parentId === currentId) return true;

      current = await this.prisma.category.findUnique({
        where: { id: current.parentId },
        select: { parentId: true },
      });
    }

    return false;
  }

  //get subtree
  async getAllDescendantIds(categoryId: string): Promise<string[]> {
    const result: string[] = [categoryId];

    const traverse = async (parentId: string) => {
      const children = await this.prisma.category.findMany({
        where: {
          parentId,
          deletedAt: null,
        },
        select: { id: true },
      });

      for (const child of children) {
        result.push(child.id);
        await traverse(child.id);
      }
    };

    await traverse(categoryId);

    return result;
  }

  //breadcrum
  async getAncestors(categoryId: string) {
    const ancestors: Array<{
      id: string;
      name: string;
      parentId: string | null;
    }> = [];

    let current = await this.prisma.category.findUnique({
      where: { id: categoryId },
      select: {
        id: true,
        name: true,
        parentId: true,
      },
    });

    while (current) {
      ancestors.unshift(current);

      if (!current.parentId) break;

      current = await this.prisma.category.findUnique({
        where: { id: current.parentId },
        select: {
          id: true,
          name: true,
          parentId: true,
        },
      });
    }

    return ancestors;
  }

  //check product in tree
  async countActiveProductsInTree(categoryId: string): Promise<number> {
    const descendants = await this.getAllDescendantIds(categoryId);

    const ids = [categoryId, ...descendants];

    return this.prisma.product.count({
      where: {
        categoryId: { in: ids },
        isActive: true,
      },
    });
  }

  //check children
  async hasChildren(categoryId: string): Promise<boolean> {
    const count = await this.prisma.category.count({
      where: {
        parentId: categoryId,
        deletedAt: null,
      },
    });

    // console.log('hasChildren count', {
    //   categoryId,
    //   count,
    // });

    // const children = await this.prisma.category.findMany({
    //   where: {
    //     parentId: categoryId,
    //     deletedAt: null,
    //   },
    //   select: {
    //     id: true,
    //     name: true,
    //     parentId: true,
    //   },
    // });

    // console.log('children', children);

    return count > 0;
  }

  //validate variant type with parent category
  private async validateVariantTypeWithParent(
    parentId: string | null | undefined,
    variantType: VariantType,
  ) {
    // root category => allow
    if (!parentId) return;

    const parent = await this.prisma.category.findUnique({
      where: { id: parentId },
      select: {
        id: true,
        variantType: true,
      },
    });

    if (!parent) {
      throw new BadRequestException('Không tìm thấy danh mục cha');
    }

    if (parent.variantType !== variantType) {
      throw new BadRequestException('Variant type phải giống danh mục cha');
    }
  }

  // kiểm tra danh mục có được phép đổi variant type
  private async canChangeVariantType(categoryId: string): Promise<boolean> {
    const hasChildren = await this.hasChildren(categoryId);

    // console.log('hasChildren', {
    //   categoryId,
    //   hasChildren,
    // });

    if (hasChildren) {
      return false;
    }

    const hasProducts = await this.prisma.product.count({
      where: {
        categoryId,
      },
    });

    // console.log('hasProducts', {
    //   categoryId,
    //   hasProducts,
    // });

    return hasProducts === 0;
  }

  // validate việc thay đổi variant type, chặn khi đã có sản phẩm hoặc danh mục con
  private async validateVariantTypeChange(
    categoryId: string,
    currentVariantType: VariantType,
    nextVariantType: VariantType,
  ) {
    // console.log('validateVariantTypeChange', {
    //   categoryId,
    //   currentVariantType,
    //   nextVariantType,
    // });
    if (currentVariantType === nextVariantType) {
      return;
    }

    const canChange = await this.canChangeVariantType(categoryId);
    //console.log('canChange', canChange);

    if (!canChange) {
      throw new BadRequestException(
        'Không thể đổi variant type khi danh mục đã có sản phẩm hoặc danh mục con',
      );
    }
  }

  async create(dto: CreateCategoryDto, file: Express.Multer.File) {
    let slug = toSlug(dto.name);
    let uniqueSlug = slug;
    let counter = 1;
    let variantType = dto.variantType;

    while (
      await this.prisma.category.findUnique({ where: { slug: uniqueSlug } })
    ) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    if (dto.parentId) {
      const parent = await this.prisma.category.findUnique({
        where: { id: dto.parentId },
        select: {
          id: true,
          variantType: true,
        },
      });

      if (!parent) {
        throw new BadRequestException('Không tìm thấy danh mục cha');
      }

      const parentLevel = await this.getCategoryLevel(dto.parentId);
      if (parentLevel >= 3) {
        throw new BadRequestException('Category con vượt quá level 3');
      }

      variantType = parent.variantType;
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
        variantType,
      },
    });
  }

  async getCategoryTreeWithLevel(options?: {
    isActive?: boolean;
    includeDeleted?: boolean;
    maxLevel?: number;
  }): Promise<CategoryTreeNode[]> {
    const { isActive, includeDeleted, maxLevel } = options || {};

    const categories = await this.prisma.category.findMany({
      where: {
        ...(isActive !== undefined && { isActive }),

        ...(includeDeleted
          ? {}
          : {
              deletedAt: null,
            }),
      },

      select: {
        id: true,
        name: true,
        slug: true,
        parentId: true,
        isActive: true,
        variantType: true,
        deletedAt: true,
      },

      orderBy: { createdAt: 'asc' },
    });

    const map = new Map<string, CategoryTreeNode>();

    const roots: CategoryTreeNode[] = [];

    // build node
    for (const cat of categories) {
      map.set(cat.id, {
        ...cat,
        level: 1,
        children: [],
      });
    }

    // build tree
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

        if (maxLevel && level >= maxLevel) {
          node.children = [];

          continue;
        }

        if (node.children.length > 0) {
          setLevel(node.children, level + 1);
        }
      }
    };

    setLevel(roots, 1);

    return roots;
  }

  private getCategoryLevelFromTree(category: any): number {
    if (!category.parent) return 1;

    if (!category.parent.parent) return 2;

    return 3;
  }

  //UI
  async getFlatCategoryTree(
    includeDeleted = false,
  ): Promise<FlatCategoryItem[]> {
    const tree = await this.getCategoryTreeWithLevel({ includeDeleted });
    const result: FlatCategoryItem[] = [];

    const traverse = (nodes: CategoryTreeNode[]): void => {
      for (const node of nodes) {
        result.push({
          id: node.id,
          name: `${node.level > 1 ? '--'.repeat(node.level - 1) + ' ' : ''}${node.name}`,
          level: node.level,
          isActive: node.isActive,
          variantType: node.variantType,
        });

        if (node.children.length > 0) {
          traverse(node.children);
        }
      }
    };

    traverse(tree);

    return result;
  }

  async update(id: string, dto: UpdateCategoryDto, file?: Express.Multer.File) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new BadRequestException('Không tìm thấy danh mục');
    }

    const finalParentId =
      dto.parentId !== undefined ? dto.parentId : category.parentId;

    const finalVariantType =
      dto.variantType !== undefined ? dto.variantType : category.variantType;

    // HANDLE PARENT
    if (dto.parentId !== undefined) {
      if (dto.parentId === id) {
        throw new BadRequestException('Không thể set parent là chính nó');
      }

      if (dto.parentId) {
        const parent = await this.prisma.category.findUnique({
          where: { id: dto.parentId },
        });

        if (!parent) {
          throw new BadRequestException('Không tìm thấy danh mục cha');
        }

        // check circular
        const isCircular = await this.isDescendant(dto.parentId, id);
        if (isCircular) {
          throw new BadRequestException('Không thể chọn danh mục con làm cha');
        }

        // check level
        const parentLevel = await this.getCategoryLevel(dto.parentId);
        if (parentLevel >= 3) {
          throw new BadRequestException('Category con vượt quá level 3');
        }
      }
    }

    await this.validateVariantTypeWithParent(finalParentId, finalVariantType);

    await this.validateVariantTypeChange(
      id,
      category.variantType,
      finalVariantType,
    );

    // HANDLE IMAGE
    let imageUrl = category.image;
    let publicId = category.imagePublicId;

    if (file) {
      if (!file.mimetype.startsWith('image/')) {
        throw new BadRequestException('File phải là hình ảnh');
      }

      // upload mới
      const result = await this.cloudinaryService.uploadImage(
        file,
        'categories/images',
      );

      // xóa ảnh cũ
      if (category.imagePublicId) {
        await this.cloudinaryService.deleteImage(category.imagePublicId);
      }

      imageUrl = result.secure_url;
      publicId = result.public_id;
    }

    // UPDATE DATA
    return this.prisma.category.update({
      where: { id },
      data: {
        name: dto.name ?? category.name,
        description: dto.description ?? category.description,
        parentId: dto.parentId !== undefined ? dto.parentId : category.parentId,
        isActive: dto.isActive ?? category.isActive,
        image: imageUrl,
        imagePublicId: publicId,
        variantType:
          dto.variantType !== undefined
            ? dto.variantType
            : category.variantType,
      },
    });
  }

  //list public level 2
  async getPublicCategoryTree(): Promise<CategoryTreeNode[]> {
    return this.getCategoryTreeWithLevel({
      isActive: true,
      maxLevel: 2,
    });
  }

  //list for admin
  async getAdminCategories(query: AdminCategoryQueryDto) {
    const { search, isActive, parentId, isDeleted } = query;

    const { page, limit, skip } = getPagination(query);

    const where: Prisma.CategoryWhereInput = {};

    //search
    if (search?.trim()) {
      where.name = {
        contains: search.trim(),
        mode: 'insensitive',
      };
    }

    //filter
    if (typeof isActive === 'boolean') {
      where.isActive = isActive;
    }

    if (parentId === 'null') {
      where.parentId = null;
    } else if (parentId) {
      where.parentId = parentId;
    }

    if (typeof isDeleted === 'boolean') {
      where.deletedAt = isDeleted ? { not: null } : null;
    }

    const [categories, total] = await Promise.all([
      this.prisma.category.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: this.adminCategorySelect,
      }),

      this.prisma.category.count({ where }),
    ]);

    const data = categories.map((category) => ({
      id: category.id,

      name: category.name,

      slug: category.slug,

      image: category.image,

      level: this.getCategoryLevelFromTree(category),

      //level: this.getCategoryLevel(category.id),

      description: category.description,

      parentId: category.parentId,

      parentName: category.parent?.name ?? null,

      variantType: category.variantType,

      canChangeVariantType:
        category._count.children === 0 && category._count.products === 0,

      isActive: category.isActive,

      deletedAt: category.deletedAt,

      createdAt: category.createdAt,
    }));

    return buildPaginatedResponse(data, total, page, limit);
  }

  //list detail for admin
  async getDetail(id: string): Promise<CategoryDetailDto> {
    const category = await this.prisma.category.findUnique({
      where: { id },

      select: {
        id: true,
        name: true,
        slug: true,

        description: true,

        image: true,
        imagePublicId: true,

        parentId: true,

        parent: {
          select: {
            id: true,
            name: true,
            parentId: true,

            parent: {
              select: {
                id: true,
              },
            },
          },
        },

        variantType: true,

        isActive: true,

        createdAt: true,
        updatedAt: true,
      },
    });

    if (!category) {
      throw new BadRequestException('Không tìm thấy danh mục');
    }

    return {
      id: category.id,
      name: category.name,
      slug: category.slug,

      description: category.description,

      image: category.image,
      imagePublicId: category.imagePublicId,

      parentId: category.parentId,
      parentName: category.parent?.name ?? null,

      level: this.getCategoryLevelFromTree(category),

      variantType: category.variantType,

      isActive: category.isActive,

      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      canChangeVariantType: await this.canChangeVariantType(category.id),
    };
  }

  //soft delete
  async softDeleteCategory(categoryId: string) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category || category.deletedAt) {
      throw new NotFoundException('Danh mục không tìm thấy!');
    }

    //check children
    const hasChildren = await this.hasChildren(categoryId);
    if (hasChildren) {
      throw new BadRequestException(
        'Không thể xóa vì danh mục vẫn còn danh mục con',
      );
    }

    //check product active
    const activeProductCount = await this.countActiveProductsInTree(categoryId);

    if (activeProductCount > 0) {
      throw new BadRequestException({
        message: 'Danh mục có sản phẩm hoạt động',
        meta: {
          activeProductCount,
        },
      });
    }

    //soft delete
    return this.prisma.category.update({
      where: { id: categoryId },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  //restore
  async restoreCategory(categoryId: string) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category || !category.deletedAt) {
      throw new BadRequestException('Danh mục chưa bị xóa!');
    }

    //check parent có bị delete không
    if (category.parentId) {
      const parent = await this.prisma.category.findUnique({
        where: { id: category.parentId },
      });

      if (parent?.deletedAt) {
        throw new BadRequestException(
          'Không thể khôi phục vì danh mục cha đã bị xóa',
        );
      }
    }

    return this.prisma.category.update({
      where: { id: categoryId },
      data: {
        deletedAt: null,
      },
    });
  }
}
