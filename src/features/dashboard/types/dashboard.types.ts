import type { Course } from "@/features/courses/types/course.types";

export interface StudentDashboardResponse {
    stats: DashboardStatsDto;
    courses: CourseStatDto[];
    upcomingDeadlines: UpcomingDeadlineDto[];
}

export interface DashboardStatsDto {
    totalAssignments: number;
    submittedAssignments: number;
    gradedAssignments: number;
    pendingAssignments: number;
    completionRate: number;
    overdueAssignments: number;
}

export interface CourseStatDto {
    id: string;
    name: string;
    description: string;
    instructor: { id: string, fullName: string, firstName: string, lastName: string, avatar: string }
    progress: number;
    totalModules: number;
    totalAssignments: number
    completedAssignments: number
    gradedAssignments: number
    pendingAssignments: number
    totalAttempts: number;
    nextAssignment: {
        id: string;
        title: string;
        dueDate: string;
    } | null,
    imageUrl: string;
    averageGrade: number;
}

interface UpcomingDeadlineDto {
    id: string;
    title: string;
    courseId: string;
    courseName: string;
    dueDate: Date;
    type: 'assignment' | 'quiz' | 'exam' | 'project';
    priority: 'high' | 'medium' | 'low';
    progress?: number;
}