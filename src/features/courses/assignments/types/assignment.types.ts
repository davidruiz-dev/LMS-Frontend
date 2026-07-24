import type { Course, SubmissionStatus } from "@/features/courses/types/course.types";

export const AssignmentType = {
  ASSIGNMENT: 'assignment',
  QUIZ: 'quiz',
  DISCUSSION: 'discussion',
  PROJECT: 'project',
} as const;
export type AssignmentType = (typeof AssignmentType)[keyof typeof AssignmentType];

export interface Assignment {
  id: string;
  name: string;
  description: string;
  type?: AssignmentType;
  maxPoints: string;
  dueDate: Date;
  availableFrom: Date;
  availableUntil: Date;
  isPublished: boolean;
  maxAttempts: number
  allowLateSubmissions: boolean;
  course: Course;
  courseId: string;
  createdAt: Date;
  updateAt: Date;
}

export interface AssignmentFilters {
  type?: AssignmentType;
  isPublished?: boolean;
  fromDate?: string;
  toDate?: string;
  submissionStatus?: SubmissionStatus;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface Submission {
  id: string;
  studentId: string;
  assignmentId: string;
  grade?: number;
  feedback?: string;
  content: string;
  isLate: boolean;
  submittedAt: Date;
  attemptNumber: number;
  status: SubmissionStatus;
  attempts: number;
  attachmentFiles: SubmissionAttachment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SubmissionAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  storagePath: string;
  fileSize: number;
  submissionId: string;
  createdAt: Date;
}