export interface PublicCategoryTreeItem {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  isActive: boolean;
  variantType: string;
  deletedAt: string | null;
  level: 1 | 2 | 3;
  children: PublicCategoryTreeItem[];
}
