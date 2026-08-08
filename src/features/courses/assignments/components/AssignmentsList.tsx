import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { AlertCircleIcon, ClipboardList } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useAssignments } from "@/features/courses/hooks/use-assignments";
import type { InstructorAssignmentDto, StudentAssignmentDto } from "../types/assignment.types";
import { StudentAssignmentRow } from "./StudentAssignmentRow";
import { InstructorAssignmentRow } from "./InstructorAssignmentRow";

interface GroupedAssignments {
    overdue: StudentAssignmentDto[];
    thisWeek: StudentAssignmentDto[];
    later: StudentAssignmentDto[];
    completed: StudentAssignmentDto[];
}

interface Props {
    courseId: string;
    isOwner?: boolean;
}

const COMPLETED_STATUSES = new Set([
    "graded",
    "submitted",
    "resubmitted",
    "returned",
]);

function groupAssignments(
    assignments: StudentAssignmentDto[]
): GroupedAssignments {
    const now = new Date();
    const weekFromNow = new Date(
        now.getTime() + 7 * 86_400_000
    );

    const groups: GroupedAssignments = {
        overdue: [],
        thisWeek: [],
        later: [],
        completed: [],
    };

    for (const assignment of assignments) {
        if (COMPLETED_STATUSES.has(assignment.status)) {
            groups.completed.push(assignment);
        } else if (assignment.isOverdue) {
            groups.overdue.push(assignment);
        } else if (new Date(assignment.dueDate) <= weekFromNow) {
            groups.thisWeek.push(assignment);
        } else {
            groups.later.push(assignment);
        }
    }

    return groups;
}

export default function AssignmentsList({ courseId, isOwner }: Props) {
    const { data: assignments = [], isLoading, isError, error } = useAssignments(courseId);

    const isInstructor = isOwner;

    if (isError) {
        return (
            <Alert variant="destructive" className="max-w-md">
                <AlertCircleIcon />
                <AlertTitle>Error</AlertTitle>

                <AlertDescription>
                    Error al obtener las asignaciones del curso.
                    Inténtalo de nuevo más tarde.
                    {error instanceof Error && (
                        <span className="block mt-1">
                            {error.message}
                        </span>
                    )}
                </AlertDescription>
            </Alert>
        );
    }

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5].map((index) => (
                    <Skeleton key={index} className="h-18" />
                ))}
            </div>
        );
    }

    if (!assignments.length) {
        return <AssignmentsEmpty />;
    }

    if (isInstructor) {
        return (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
                {(assignments as InstructorAssignmentDto[]).map(
                    (assignment) => (
                        <InstructorAssignmentRow
                            key={assignment.id}
                            assignment={assignment}
                        />
                    )
                )}
            </div>
        );
    }

    const groups = groupAssignments(
        assignments as StudentAssignmentDto[]
    );

    const total = assignments.length;
    const completedCount = groups.completed.length;

    const progressValue = total > 0 ? (completedCount / total) * 100 : 0;

    return (
        <div className="space-y-6">
            <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">
                        Progreso del curso
                    </p>

                    <p className="text-sm text-muted-foreground">
                        {completedCount}/{total} completadas
                    </p>
                </div>
                <Progress value={progressValue} />
            </Card>

            <AssignmentGroup
                title="Atrasadas"
                assignments={groups.overdue}
                urgent
            />

            <AssignmentGroup
                title="Esta semana"
                assignments={groups.thisWeek}
            />

            <AssignmentGroup
                title="Más adelante"
                assignments={groups.later}
            />

            <AssignmentGroup
                title="Completadas"
                assignments={groups.completed}
                muted
            />
        </div>
    );
}

const AssignmentsEmpty = () => {
    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <ClipboardList />
                </EmptyMedia>

                <EmptyTitle>
                    No hay tareas
                </EmptyTitle>

                <EmptyDescription>
                    No hay tareas disponibles.
                </EmptyDescription>
            </EmptyHeader>
        </Empty>
    );
};

export function AssignmentGroup({ title, assignments, urgent, muted }: {
    title: string;
    assignments: StudentAssignmentDto[];
    urgent?: boolean;
    muted?: boolean;
}) {
    if (!assignments.length) {
        return null;
    }

    return (
        <section>
            <h3
                className={cn(
                    "text-sm font-semibold mb-2",
                    urgent && "text-red-600",
                    muted && "text-muted-foreground"
                )}
            >
                {title} ({assignments.length})
            </h3>

            <div className="space-y-2">
                {assignments.map((assignment) => (
                    <StudentAssignmentRow
                        key={assignment.id}
                        assignment={assignment}
                    />
                ))}
            </div>
        </section>
    );
}