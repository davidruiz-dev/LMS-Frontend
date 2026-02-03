import type { GradeLevel } from "@/features/grade-level/types";
import type { User } from "@/shared/types";

export type CourseStatus = 'draft' | 'published' | 'archived';

export interface Course {
  id: string;
  name: string;
  code: string;
  imageUrl: string;
  description: string;
  short_description: string;
  gradeLevel: GradeLevel;
  instructor: User;
  instructorId: string;
  students: User[];
  startDate: string;
  endDate: string;
  syllabus?: string;
  isActive: boolean;
  status: CourseStatus;
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  position?: number;
  courseId?: string;
  items: ModuleItem[];
  isPublished?: boolean;
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
  published: boolean;
  moduleId: string;
}

export type ModuleItemType = 'assignment' | 'discussion' | 'file' | 'page' | 'quiz' | 'external_url';
export const ModuleItemType = {
  ASSIGNMENT: 'assignment',
  DISCUSSION: 'discussion',
  FILE: 'file',
  PAGE: 'page',
  QUIZ: 'quiz',
  EXTERNAL_URL: 'external_url'
}

export interface Enrollment {
  id: string;
  course: Course;
  user: User;
  createdAt: Date;
  updateAt: Date;
}