import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Skeleton } from "@/components/ui/skeleton";
import { useAssignments } from "@/features/courses/hooks/use-assignments";
import { AlertCircleIcon, Calendar, ClipboardList, Lock, MoreVertical, Unlock } from "lucide-react";
import { useNavigate } from "react-router-dom"
import { ROUTES } from "@/shared/constants/routes";
import { Separator } from "@/components/ui/separator";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Badge } from "@/components/ui/badge";

interface Props {
    courseId: string;
    canAccess?: boolean;
}

export default function AssignmentsList({ courseId, canAccess }: Props) {
    const navigate = useNavigate();
    const { data: assignments, isLoading, isError, error } = useAssignments(courseId);

    if (isError) {
        <Alert variant="destructive" className="max-w-md">
            <AlertCircleIcon />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
                Error al obtener asignaciones del curso, intentalo denuevo más tarde.
                {error.message}
            </AlertDescription>
        </Alert>
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
    }

    return (
        <div className="space-y-4 flex flex-col items-end">
            <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-3">
                {assignments?.map((assignment) => (
                    <div
                        key={assignment.id}
                        className="p-4 border rounded bg-card space-y-4 cursor-pointer hover:bg-gray-400/5"
                        onClick={() => navigate(ROUTES.COURSE_ASSIGNMENT(courseId, assignment.id))}
                    >
                        {canAccess && (
                            <div className="flex justify-between">
                                <Badge variant={assignment.isPublished ? 'default' : 'destructive'}>
                                    {assignment.isPublished ? (<Unlock />) : (<Lock />)}
                                    {assignment.isPublished ? 'publicado' : 'borrador'}
                                </Badge>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                        <DropdownMenuItem
                                            onClick={() => navigate(ROUTES.COURSE_ASSIGNMENT(courseId, assignment.id))}
                                        >
                                            Ver contenido
                                        </DropdownMenuItem>
                                        <Separator />
                                        <DropdownMenuItem
                                            variant="destructive"
                                        >
                                            Eliminar
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )}
                        <div className="space-y-3">
                            <h1 className="font-bold">{assignment.name}</h1>
                            <p className="text-sm text-muted-foreground truncate">{assignment.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="size-4" />
                            <span className="text-sm text-muted-foreground">Vence: {new Date(assignment.dueDate).toLocaleString("es-ES", {
                                dateStyle: "medium",
                                timeStyle: "short",
                            })}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
