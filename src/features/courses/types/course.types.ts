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
  createdAt: string;
  updateAt: string;
}

export const SubmissionStatus = {
  PENDING: 'pending',
  SUBMITTED: 'submitted',
  GRADED: 'graded',
  LATE: 'late',
} as const;
export type SubmissionStatus = (typeof SubmissionStatus)[keyof typeof SubmissionStatus];