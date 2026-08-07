import { Badge } from "@/components/ui/badge";
import type { CourseStatus } from "../types/course.types";

interface CourseStatusBadgeProps {
    status: CourseStatus;
}

export const CourseStatusBadge = ({ status }: CourseStatusBadgeProps) => {
    const statusConfig = {
        draft: { label: "Borrador", variant: "secondary" },
        published: { label: "Publicado", variant: "default" },
        archived: { label: "Archivado", variant: "destructive" },
    };

    const config = statusConfig[status];

    return (
        <Badge variant={config.variant as any}>
            {config.label}
        </Badge>
    );
};