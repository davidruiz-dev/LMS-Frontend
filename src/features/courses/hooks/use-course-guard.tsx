import { useCourseAccess } from "@/features/courses/hooks/use-course-access"
import type { CourseAccess } from "@/features/courses/types/course-access.types"

export type GuardState =
  | 'loading'
  | 'allowed'
  | 'forbidden'
  | 'not-found'

export function useCourseGuard(
  courseId: string,
  check: (a: CourseAccess) => boolean
): GuardState {
  const access = useCourseAccess(courseId)

  if (!access) return 'loading'
  if (!access.exists) return 'not-found'
  if (!check(access)) return 'forbidden'
  return 'allowed'
}
