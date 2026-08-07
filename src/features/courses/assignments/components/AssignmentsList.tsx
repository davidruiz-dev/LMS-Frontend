import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useAssignments } from "@/features/courses/hooks/use-assignments";
import { AlertCircleIcon, ClipboardList} from "lucide-react";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { useMemo, useState } from "react";
import { AssignmentType, type InstructorAssignmentDto, type StudentAssignmentDto } from "../types/assignment.types";
import { Card } from "@/components/ui/card";
import { cn } from "@/shared/lib/utils";
import { useAuth } from "@/app/providers/AuthProvider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { StudentAssignmentRow } from "./StudentAssignmentRow";
import { InstructorAssignmentRow } from "./InstructorAssignmentRow";

type TypeFilter = 'all' | AssignmentType;

interface GroupedAssignments {
    overdue: StudentAssignmentDto[];
    thisWeek: StudentAssignmentDto[];
    later: StudentAssignmentDto[];
    completed: StudentAssignmentDto[];
}

const COMPLETED_STATUSES = new Set(['graded', 'submitted', 'resubmitted', 'returned']);

function groupAssignments(assignments: StudentAssignmentDto[]): GroupedAssignments {
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 86_400_000);
    const groups: GroupedAssignments = { overdue: [], thisWeek: [], later: [], completed: [] };

    for (const a of assignments) {
        if (COMPLETED_STATUSES.has(a.status)) {
            groups.completed.push(a);
        } else if (a.isOverdue) {
            groups.overdue.push(a);
        } else if (new Date(a.dueDate) <= weekFromNow) {
            groups.thisWeek.push(a);
        } else {
            groups.later.push(a);
        }
    }
    return groups;
}


interface Props {
    courseId: string;
    canAccess?: boolean;
}

export default function AssignmentsList({ courseId, canAccess }: Props) {
    const { data: assignments = [], isLoading, isError, error } = useAssignments(courseId);

    const { user } = useAuth();
    const isInstructor = user?.role !== 'student';
    const [filter, setFilter] = useState<TypeFilter>('all');
    const filtered = useMemo(() => {
        if (!assignments) return [];
        if (filter === 'all') return assignments;
        return assignments.filter((a) => a.type === filter);
    }, [assignments, filter]);

    const groups = useMemo(
        () => (isInstructor ? null : groupAssignments(filtered as StudentAssignmentDto[])),
        [filtered, isInstructor],
    );

    if (isInstructor) {
        return (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
                {(filtered as InstructorAssignmentDto[]).map((a) => (
                    <InstructorAssignmentRow key={a.id} assignment={a} />
                ))}
            </div>
        );
    }

    const total = assignments.length;
    const completedCount = groups!.completed.length;
    const progressValue = total > 0 ? (completedCount / total) * 100 : 0;

    if (isError) {
        return (
            <Alert variant="destructive" className="max-w-md">
                <AlertCircleIcon />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    Error al obtener asignaciones del curso, intentalo denuevo más tarde.
                    {error.message}
                </AlertDescription>
            </Alert>
        )
    }

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                {[1, 2, 3, 4, 5].map((index) => (
                    <Skeleton key={index} className="h-18" />
                ))}
            </div>
        )
    }

    if (!assignments?.length) return <AssignmentsEmpty />

    return (
        <div className="space-y-6">
            <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">Progreso del curso</p>
                    <p className="text-sm text-muted-foreground">
                        {completedCount}/{total} completadas
                    </p>
                </div>
                <Progress value={progressValue} />
            </Card>

            <Tabs value={filter} onValueChange={(v) => setFilter(v as TypeFilter)}>
                <TabsList>
                    <TabsTrigger value="all">Todas</TabsTrigger>
                    <TabsTrigger value={AssignmentType.ASSIGNMENT}>Tareas</TabsTrigger>
                    <TabsTrigger value={AssignmentType.QUIZ}>Exámenes</TabsTrigger>
                    <TabsTrigger value={AssignmentType.DISCUSSION}>Foros</TabsTrigger>
                </TabsList>
            </Tabs>

            <AssignmentGroup title="Atrasadas" assignments={groups!.overdue} urgent />
            <AssignmentGroup title="Esta semana" assignments={groups!.thisWeek} />
            <AssignmentGroup title="Más adelante" assignments={groups!.later} />
            <AssignmentGroup title="Completadas" assignments={groups!.completed} muted />
        </div>
    )
}

const AssignmentsEmpty = () => {
    return (
        <Empty className="bg-muted/30 h-full">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <ClipboardList />
                </EmptyMedia>
                <EmptyTitle>No hay tareas</EmptyTitle>
                <EmptyDescription className="max-w-xs text-pretty">
                    No hay tareas disponibles.
                </EmptyDescription>
            </EmptyHeader>
        </Empty>
    )
}


export function AssignmentGroup({title, assignments, urgent, muted}: {
    title: string;
    assignments: StudentAssignmentDto[];
    urgent?: boolean;
    muted?: boolean;
}) {
    if (!assignments.length) return null;
    return (
        <div>
            <h3
                className={cn(
                    'text-sm font-semibold mb-2', urgent && 'text-red-600', muted && 'text-muted-foreground',
                )}
            >
                {title} ({assignments.length})
            </h3>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
                {assignments.map((a) => (
                    <StudentAssignmentRow key={a.id} assignment={a} />
                ))}
            </div>
        </div>
    );
}
