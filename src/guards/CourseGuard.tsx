import { useCourseGuard } from "@/features/courses/hooks/use-course-guard";
import { useParams } from "react-router-dom";
import { GuardBoundary } from "./GuardBoundary";
import type { CourseAccess } from "@/features/courses/types/course-access.types";

interface CourseGuardProps {
  check: (a: CourseAccess) => boolean;
  children: React.ReactElement;
}

export default function CourseGuard({
  check,
  children,
}: CourseGuardProps) {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    throw new Error("Course id is required.");
  }

  const state = useCourseGuard(id, check);

  return (
    <GuardBoundary state={state}>
      {children}
    </GuardBoundary>
  );
}