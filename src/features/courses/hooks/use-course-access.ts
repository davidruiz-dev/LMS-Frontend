import { useAuth } from "@/features/auth/hooks/useAuthContext";
import { useCourse } from "@/features/courses/hooks/use-courses"
import { useEnrollmentsByCourse } from "@/features/courses/hooks/use-enrollments";
import type { CourseAccess } from "@/features/courses/types/course-access.types";
import { CourseStatus, USER_ROLES } from "@/shared/constants";

export function useCourseAccess(courseId?: string): CourseAccess | null {
  const { user } = useAuth();
  const { data: course, isLoading } = useCourse(courseId);
  const { data: enrollments } = useEnrollmentsByCourse(courseId);

  const enrollment = enrollments?.find(e => e.user.id === user?.id);

  if (!user || isLoading || !course) return null;

  const isOwner = course.instructorId === user.id;
  const isAdmin = user.role === USER_ROLES.ADMIN;
  const isEnrolled = !!enrollment;
  const isPublished = course.status === CourseStatus.PUBLISHED;
  const isArchived = course.status === CourseStatus.ARCHIVED;

  // ----- CAN VIEW -----
  const canView = isAdmin || isOwner || (isPublished && isEnrolled)
  // ----- CAN EDIT -----
  const canEdit = isAdmin || isOwner && !isArchived 
  // ----- CAN MANAGE  -----
  const canManageEnrollments = isAdmin || isOwner && isPublished
  const canAccessContent = isAdmin ||  isOwner || isEnrolled
  const canEditModules = isAdmin || isOwner;

  return {
    exists: true,
    canView: canView,
    canEdit: canEdit,
    canAccessContent: canAccessContent,
    canEnrollUsers: canManageEnrollments,
    canEditModules: canEditModules,
    isOwner: isOwner || isAdmin,

  }
}
