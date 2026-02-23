export interface Module {
  id: string;
  title: string;
  description?: string;
  position?: number;
  courseId?: string;
  items: ModuleItem[];
  isPublished?: boolean;
  createdAt: string;
  updateAt: string;
}

export interface ReorderModulesDto {
  moduleIds: string[];
}

export interface ReorderModuleItemsDto {
  itemIds: string[];
}

export interface ModuleItem {
  id: string;
  title: string;
  type: ModuleItemType
  contentId: string;
  content: string;
  externalUrl: string;
  moduleId: string;
  published: boolean;
  createdAt: string;
  updateAt: string;
}

export const ModuleItemType = {
  ASSIGNMENT: 'assignment',
  DISCUSSION: 'discussion',
  FILE: 'file',
  PAGE: 'page',
  QUIZ: 'quiz',
  EXTERNAL_URL: 'external_url',
} as const;
export type ModuleItemType = typeof ModuleItemType[keyof typeof ModuleItemType];