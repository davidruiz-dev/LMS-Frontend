import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ROUTES } from "@/shared/constants/routes";
import { getDistanceToNow } from "@/shared/utils/getDistanceToNow";
import { Badge } from "@/components/ui/badge";
import { Award, BarChart3, CalendarOffIcon, FileText, MoreVertical, Pencil, Trash2, Users } from "lucide-react";
import { STATUS_LABEL, type AssignmentWithStats } from "@/features/courses/assignments/types/assignment.types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/shared/lib/utils";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { formatLongDate } from "@/shared/utils/formatLongDate";
import { Tooltip } from "@/components/ui/tooltip";


interface AssignmentCardProps {
    assignment: AssignmentWithStats;
    canAccess?: boolean;
}

export function AssignmentCard({ assignment, canAccess }: AssignmentCardProps) {
    const navigate = useNavigate();
    const isOverdue = new Date(assignment.dueDate) < new Date();
    const timeLeft = getDistanceToNow(assignment.dueDate);

    const getSubmissionStatusDisplay = () => {
        if (!assignment) return null;
        if(!assignment.stats.status) return (
            <Badge variant={"destructive"}>
                Pendiente
            </Badge>
        );
        const status = STATUS_LABEL[assignment.stats.status];
        return (
            <Badge variant={status.variant} className="text-xs">
                {status.label}
            </Badge>
        );
    };

    return (
        <Card
            className={cn(
                "cursor-pointer transition-all hover:shadow-lg",
                !assignment.isPublished && "opacity-75"
            )}
            onClick={() => navigate(ROUTES.COURSE_ASSIGNMENT(assignment.courseId, assignment.id))}
        >
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold line-clamp-1">{assignment.name}</h3>
                            
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                <span>{assignment.maxPoints} pts</span>
                            </div>
                            <Badge variant={new Date() > new Date(assignment.dueDate) ? 'destructive' : 'default'}>
                                <div className="flex items-center gap-1">
                                    <CalendarOffIcon className="h-3 w-3" />
                                    <span>{formatLongDate(assignment.dueDate)}</span>
                                </div>
                            </Badge>
                        </div>
                    </div>

                    {canAccess && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Opciones</DropdownMenuLabel>
                                <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation();
                                    // Editar tarea
                                }}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation();
                                    // Ver estadísticas
                                }}>
                                    <BarChart3 className="mr-2 h-4 w-4" />
                                    Estadísticas
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // Eliminar tarea
                                    }}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Eliminar
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-3">
  
                <div className="flex items-center justify-between text-sm">

                    {!canAccess && assignment.stats.grade && (
                        <Badge variant={"secondary"}><Award/> {assignment.stats.grade} / {assignment.maxPoints} ptos</Badge>
                    )}

                    {!canAccess && (
                        getSubmissionStatusDisplay()
                    )}

                    

                    {canAccess && assignment.isPublished && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Badge variant="secondary">
                                        <Users className="mr-1 h-3 w-3" />
                                        {assignment.stats.totalSubmissions || 0} entregadas
                                    </Badge>
                                </TooltipTrigger>
                            </Tooltip>
                        </TooltipProvider>
                    )}

                </div>

                
            </CardContent>
        </Card>
    )
}
