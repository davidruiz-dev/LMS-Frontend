import type { Course, SubmissionStatus } from "@/features/courses/types/course.types";


export interface Assignment {
  id: string;
  name: string;
  description: string;
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

export const STATUS_LABEL: Record<Submission['status'], { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  submitted: { label: 'Entregado', variant: 'secondary' },
  graded: { label: 'Calificado', variant: 'default' },
  pending: { label: 'Pendiente', variant: 'outline' },
  late: { label: 'Tarde', variant: 'destructive' },
  resubmitted: { label: 'Reenviado', variant: 'secondary' },
};


// stats
export interface AssignmentWithStats extends Assignment{
  stats: AssignmentStats;
}

type AssignmentStats = {
  status: SubmissionStatus;
  submitted: boolean;
  grade?: number;
  totalSubmissions: number;
  averageGrade: number;
};



// v2

export type StudentAssignmentStatus = SubmissionStatus | 'not_submitted';

export interface StudentAssignmentDto {
  id: string;
  name: string;
  dueDate: string;
  maxPoints: number;
  isAvailable: boolean;
  status: StudentAssignmentStatus;
  isOverdue: boolean;
  submittedAt: string | null;
  attemptNumber: number;
  attemptsLeft: number;
  grade: number | null;
  isLate: boolean;
  courseId: string;
}

export interface InstructorAssignmentDto {
  id: string;
  name: string;
  dueDate: string;
  maxPoints: number;
  isPublished: boolean;
  totalStudents: number;
  submittedCount: number;
  gradedCount: number;
  pendingGradingCount: number;
  courseId: string;
}

export type AssignmentListItem = StudentAssignmentDto | InstructorAssignmentDto;