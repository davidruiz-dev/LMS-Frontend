import { ROUTES } from "@/shared/constants/routes";
import { useNavigate } from "react-router-dom";
import type { StudentAssignmentDto, StudentAssignmentStatus } from "../types/assignment.types";
import { format } from "date-fns";
import { cn } from "@/shared/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { es } from "date-fns/locale";
import { FileText } from "lucide-react";


const STATUS_CONFIG: Record<StudentAssignmentStatus, { label: string; className: string }> = {
    not_submitted: { label: 'Sin entregar', className: 'bg-gray-100 text-gray-600' },
    submitted: { label: 'Entregado', className: 'bg-blue-100 text-blue-700' },
    graded: { label: 'Calificado', className: 'bg-green-100 text-green-700' },
    late: { label: 'Devuelto', className: 'bg-amber-100 text-amber-700' },
    resubmitted: { label: 'Reenviado', className: 'bg-blue-100 text-blue-700' },
    pending: { label: 'Pendiente', className: 'bg-gray-100 text-gray-600' },
};

export function StudentAssignmentRow({ assignment }: { assignment: StudentAssignmentDto }) {
    const config = STATUS_CONFIG[assignment.status];
    const navigate = useNavigate();

    return (

        <Card onClick={() => navigate(ROUTES.COURSE_ASSIGNMENT(assignment.courseId, assignment.id))}
            className={cn(
                'flex items-center justify-between p-4 hover:border-primary transition-colors',
                assignment.isOverdue && 'border-red-300 bg-red-50/50 dark:bg-red-100/10',
            )}
        >
            <div className="flex items-center gap-3">
                <div className="rounded-full bg-muted p-2">
                    <FileText className="h-4 w-4" />
                </div>
                <div>
                    <p className="font-medium">{assignment.name}</p>
                    <p className="text-sm text-muted-foreground">
                        {format(new Date(assignment.dueDate), 'PPP', { locale: es })}
                        {assignment.attemptsLeft !== -1 &&
                            assignment.status === 'not_submitted' &&
                            ` · ${assignment.attemptsLeft} intento(s)`}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                {assignment.grade !== null && (
                    <span className="text-sm font-semibold">
                        {assignment.grade}/{assignment.maxPoints}
                    </span>
                )}
                {assignment.isLate && <Badge className="bg-red-100 text-red-700">Atrasado</Badge>}
                <Badge className={config.className}>{config.label}</Badge>
            </div>
        </Card>
    );
}