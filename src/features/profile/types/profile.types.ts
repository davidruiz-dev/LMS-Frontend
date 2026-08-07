import type { Role } from "@/shared/types";

export interface ProfileDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  biography: string | null;
  role: Role;
  createdAt: string;
}

export interface PublicProfileDto {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  biography: string | null;
  role: Role;
}

export interface ProfileStatsDto {
  coursesEnrolled?: number;
  assignmentsSubmitted?: number;
  assignmentsGraded?: number;
  averageGrade?: number | null;
  coursesCreated?: number;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  biography?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}