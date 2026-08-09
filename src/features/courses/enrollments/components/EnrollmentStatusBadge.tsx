import { Badge, badgeVariants } from "@/components/ui/badge";
import type { VariantProps } from "class-variance-authority";
import type { EnrollmentStatus } from "../types/enrollment.types";

interface EnrollmentStatusBadgeProps {
  status: EnrollmentStatus;
}

type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];

export const EnrollmentStatusBadge = ({ status }: EnrollmentStatusBadgeProps) => {
  const statusConfig: Record<EnrollmentStatus, { label: string; variant: BadgeVariant }> = {
    active: {
      label: "Activo",
      variant: "default",
    },
    completed: {
      label: "Completado",
      variant: "outline",
    },
    inactive: {
      label: "Inactivo",
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