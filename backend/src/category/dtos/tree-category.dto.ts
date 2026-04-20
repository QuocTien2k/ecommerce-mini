export interface CategoryTreeNode {
  id: string;
  name: string;
  parentId: string | null;
  isActive: boolean;
  level: number;
  children: CategoryTreeNode[];
}

export interface FlatCategoryItem {
  id: string;
  name: string;
  level: number;
  isActive: boolean;
}
