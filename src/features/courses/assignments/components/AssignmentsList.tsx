import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useAssignments } from "@/features/courses/hooks/use-assignments";
import { AlertCircleIcon, ClipboardList } from "lucide-react";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AssignmentCard } from "@/features/courses/assignments/components/AssignmentCard";

interface Props {
    courseId: string;
    canAccess?: boolean;
}

export default function AssignmentsList({ courseId, canAccess }: Props) {
    const [filterType, setFilterType] = useState<string>('all');
    //const [filters, setFilters] = useState<AssignmentFilters>({});

    const { data: assignments = [], isLoading, isError, error } = useAssignments(courseId, {
        isPublished: filterType === 'all' ? undefined : filterType === 'published' ? true : false
    });


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

    if (!assignments?.length) {
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

    return (
        <div className="space-y-4">
            {canAccess && (
                <div className="flex">
                    <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger >
                            <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas las tareas</SelectItem>
                            <SelectItem value="published">Publicadas</SelectItem>
                            <SelectItem value="draft">Borradores</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}
            <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-2">
                {assignments.map((assignment) => (
                    <AssignmentCard assignment={assignment} canAccess={canAccess} />
                ))}
            </div>
        </div>
    )
}
