import { useNavigate } from "react-router-dom";
import type { AssignmentType, InstructorAssignmentDto } from "../types/assignment.types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ClipboardCheck, FileText, HelpCircle, MessageSquare, type LucideIcon } from "lucide-react";
import { ROUTES } from "@/shared/constants/routes";

const TYPE_ICON: Record<AssignmentType, LucideIcon> = {
    assignment: FileText,
    quiz: HelpCircle,
    discussion: MessageSquare,
    project: ClipboardCheck,
};

export function InstructorAssignmentRow({ assignment }: { assignment: InstructorAssignmentDto }) {
    const Icon = TYPE_ICON[assignment.type];
    const navigate = useNavigate();

    return (
        <Card className="flex items-center justify-between p-4 hover:border-primary transition-colors"
            onClick={() => navigate(ROUTES.COURSE_ASSIGNMENT(assignment.courseId, assignment.id))}>
            <div className="flex items-center gap-3">
                <div className="rounded-full bg-muted p-2">
                    <Icon className="h-4 w-4" />
                </div>
                <div>
                    <p className="font-medium">{assignment.name}</p>
                    <p className="text-sm text-muted-foreground">
                        {format(new Date(assignment.dueDate), 'PPP', { locale: es })}
                        {!assignment.isPublished && ' · Sin publicar'}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
                <span>
                    {assignment.submittedCount}/{assignment.totalStudents} entregadas
                </span>
                {assignment.pendingGradingCount > 0 && (
                    <Badge className="bg-amber-100 text-amber-700">
                        {assignment.pendingGradingCount} por calificar
                    </Badge>
                )}
            </div>
        </Card>
    );
}
