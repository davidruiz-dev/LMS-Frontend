import { Badge, badgeVariants } from "@/components/ui/badge";
import type { VariantProps } from "class-variance-authority";
import type { CourseStatus } from "../types/course.types";

interface CourseStatusBadgeProps {
  status: CourseStatus;
}

type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];

export const CourseStatusBadge = ({ status }: CourseStatusBadgeProps) => {
  const statusConfig: Record<CourseStatus, { label: string; variant: BadgeVariant }> = {
    draft: {
      label: "Borrador",
      variant: "secondary",
    },
    published: {
      label: "Publicado",
      variant: "default",
    },
    archived: {
      label: "Archivado",
      variant: "destructive",
    },
  };

  const config = statusConfig[status];

  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
};