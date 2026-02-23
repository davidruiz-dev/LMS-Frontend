import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ROUTES } from "@/shared/constants/routes";
import { getDistanceToNow } from "@/utils/getDistanceToNow";
import { Badge } from "@/components/ui/badge";
import { Calendar, MoreVertical } from "lucide-react";
import { getShortDate } from "@/utils/formatDate";
import { Separator } from "@/components/ui/separator";
import type { Assignment } from "@/features/courses/assignments/types/assignment.types";

interface AssignmentCardProps {
    assignment: Assignment;
    canAccess?: boolean;
}

export function AssignmentCard({ assignment, canAccess }: AssignmentCardProps) {
    const navigate = useNavigate();
    return (
        <div
            key={assignment.id}
            className="p-4 border rounded bg-card cursor-pointer hover:bg-sky-100/20 dark:hover:bg-sky-100/10 space-y-2"
            onClick={() => navigate(ROUTES.COURSE_ASSIGNMENT(assignment.courseId, assignment.id))}
        >
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <h1 className="font-bold">{assignment.name}</h1>
                    <span className="text-xs text-muted-foreground">
                        publicado {getDistanceToNow(assignment.createdAt)}
                    </span>
                    {canAccess && (
                        <Badge variant={assignment.isPublished ? 'default' : 'destructive'}>
                            {assignment.isPublished ? 'publicado' : 'borrador'}
                        </Badge>
                    )}
                </div>
                {canAccess && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => navigate(ROUTES.COURSE_ASSIGNMENT(assignment.courseId, assignment.id))}
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
                )}
            </div>
            <p className="text-sm text-muted-foreground truncate">{assignment.description}</p>
            <div className="flex">
                <div className="flex items-center gap-1 p-1.5 bg-amber-200/50 rounded">
                    <Calendar className="size-3" />
                    <span className="text-xs">Vence {getShortDate(new Date(assignment.dueDate))}</span>
                </div>
            </div>
        </div>
    )
}
