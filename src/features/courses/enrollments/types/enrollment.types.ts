import type { Course } from "@/features/courses/types/course.types";
import type { User } from "@/shared/types";

export const EnrollmentStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  COMPLETED: 'completed',
} as const

export type EnrollmentStatus = typeof EnrollmentStatus[keyof typeof EnrollmentStatus];

export interface Enrollment {
  id: string;
  course: Course;
  user: User;
  status: EnrollmentStatus;
  createdAt: Date;
  updateAt: Date;
}