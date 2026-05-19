import { VariantType } from '@prisma/client';

export interface CategoryTreeNode {
  id: string;
  name: string;
  parentId: string | null;
  isActive: boolean;
  variantType: VariantType;
  level: number;
  children: CategoryTreeNode[];
}

export interface FlatCategoryItem {
  id: string;
  name: string;
  level: number;
  isActive: boolean;
  variantType: VariantType;
}
