import type { User } from "@/shared/types";

export type CourseStatus = 'draft' | 'published' | 'archived';

export interface Course {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  short_description: string;
  instructor: User;
  instructorId: string;
  students: User[];
  startDate: string;
  endDate: string;
  isActive: boolean;
  status: CourseStatus;
  createdAt: string;
  updateAt: string;
  deleteAt: string;
}

export const SubmissionStatus = {
  PENDING: 'pending',
  SUBMITTED: 'submitted',
  GRADED: 'graded',
  LATE: 'late',
  RESUBMITTED: 'resubmitted'
} as const;
export type SubmissionStatus = (typeof SubmissionStatus)[keyof typeof SubmissionStatus];


export interface CourseWithStats extends Course{
  assignmentsCount: number;
  enrollmentsCount: number;
  modulesCount: number;
}