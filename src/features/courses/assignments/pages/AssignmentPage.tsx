import { Button } from "@/components/ui/button";
import { useAssignment, useAssignmentPublish, useAssignmentUnpublish } from "@/features/courses/hooks/use-assignments";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowDownCircle, ArrowUpCircle, ClipboardList, Clock, PencilLine, Repeat1, CheckCircle2, XCircle, AlertCircle, Timer, Award, Users, BarChart3, CalendarClock, FileCheck, Clock as ClockIcon } from "lucide-react";
import { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { Separator } from "@/components/ui/separator";
import { useCourseAccess } from "@/features/courses/hooks/use-course-access";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/shared/constants/routes";
import { SubmissionUploadForm } from "../components/SubmissionUploadForm";
import { formatLongDate } from "@/shared/utils/formatLongDate";
import { useCountdown } from "../../hooks/use-countdown";
import { useMySubmissions } from "../../hooks/use-submissions";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SubmissionCard } from "../submissions/components/SubmissionCard";
import { STATUS_LABEL } from "../types/assignment.types";
 
export default function AssignmentPage() {
    const { id: courseId, assignmentId } = useParams<{ id: string; assignmentId: string }>();
    const navigate = useNavigate();
    const submissionRef = useRef<HTMLDivElement>(null);

    const { data: assignment, isLoading } = useAssignment(courseId ?? '', assignmentId ?? '');
    const { data: mySubmissions, isLoading: isLoadingMySubmissions } = useMySubmissions(assignmentId ?? '');
    const publishAssignment = useAssignmentPublish(courseId ?? '');
    const unpublishAssignment = useAssignmentUnpublish(courseId ?? '');
    const access = useCourseAccess(courseId ?? '');
    const timeLeft = useCountdown(assignment?.dueDate);

    if (!courseId || !assignmentId) return null;

    const isOwner = access?.isOwner;
    const isOverdue = timeLeft.overdue;
    const canSubmit = !isOverdue || assignment?.allowLateSubmissions;

    const onPublish = () => publishAssignment.mutate(assignmentId);
    const onUnpublish = () => unpublishAssignment.mutate(assignmentId);

    // Solo para estudiantes: obtener su última entrega calificada
    const gradedSubmission = !isOwner && mySubmissions
        ?.filter(s => s.status === "graded")
        .sort((a, b) => b.attemptNumber - a.attemptNumber)[0];

    // Solo para estudiantes: última entrega en general
    const latestSubmission = !isOwner && mySubmissions?.[0];

    const getSubmissionStatusDisplay = () => {
        if (!latestSubmission) return null;
        const status = STATUS_LABEL[latestSubmission.status];
        return (
            <Badge variant={status.variant} className="text-xs">
                {status.label}
            </Badge>
        );
    };

    const getGradeDisplay = () => {
        if (!gradedSubmission) return null;
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <Badge variant="default" className="bg-green-700/80 text-white px-3 py-1 ">
                            <Award className="mr-1 h-6 w-6" />
                            {gradedSubmission.grade}/{assignment?.maxPoints} pts
                        </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Calificación del intento {gradedSubmission.attemptNumber}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    };

    if (isLoading || !assignment) {
        return (
            <div className="mx-auto max-w-6xl space-y-6 py-10">
                <div className="space-y-3">
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                </div>
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    return (
        <div className="mx-auto space-y-6">
            {/* Header */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="space-y-2 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-2xl font-bold tracking-tight">{assignment.name}</h1>
                                {isOwner && (
                                    <>
                                        {assignment.isPublished ? (
                                            <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                                Publicado
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary">
                                                <AlertCircle className="mr-1 h-3 w-3" />
                                                Borrador
                                            </Badge>
                                        )}
                                    </>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                    <ClipboardList className="h-4 w-4" />
                                    <span>Tarea</span>
                                </div>
                                <span>• Actualizado {new Date(assignment.updateAt).toLocaleString('es-ES', { dateStyle: 'medium' })}</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            {/* Estado de tiempo */}
                            <div className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${isOverdue
                                    ? 'bg-destructive/10 text-destructive'
                                    : timeLeft.days <= 1
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-blue-100 text-blue-800'
                                }`}>
                                {isOverdue ? (
                                    <>
                                        <XCircle className="h-4 w-4" />
                                        <span>Vencido</span>
                                    </>
                                ) : (
                                    <>
                                        <Timer className="h-4 w-4" />
                                        <span>
                                            {timeLeft.days > 0 && `${timeLeft.days}d `}
                                            {timeLeft.hours > 0 && `${timeLeft.hours}h `}
                                            {timeLeft.minutes > 0 && `${timeLeft.minutes}m`}
                                            {timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && 'Menos de 1 minuto'}
                                        </span>
                                    </>
                                )}
                            </div>

                            {/* Solo para estudiantes: mostrar calificación o estado */}
                            {!isOwner && getGradeDisplay()}
                            {!isOwner && latestSubmission && !gradedSubmission && (
                                <div className="flex items-center gap-2">
                                    {getSubmissionStatusDisplay()}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Acciones del propietario (profesor) */}
                    {isOwner && (
                        <div className="flex flex-wrap items-center gap-3 pt-4 border-t mt-2">
                            {assignment.isPublished ? (
                                <>
                                    <Button
                                        onClick={onUnpublish}
                                        variant="outline"
                                        size="sm"
                                        disabled={unpublishAssignment.isPending}
                                    >
                                        <ArrowDownCircle className="mr-2 h-4 w-4" />
                                        {unpublishAssignment.isPending ? 'Despublicando...' : 'Despublicar'}
                                    </Button>
                                    <Button
                                        variant="default"
                                        onClick={() => navigate(ROUTES.COURSE_SUBMISSIONS(courseId, assignmentId))}
                                        size="sm"
                                    >
                                        <Users className="mr-2 h-4 w-4" />
                                        Ver entregas de estudiantes
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    onClick={onPublish}
                                    size="sm"
                                    disabled={publishAssignment.isPending}
                                >
                                    <ArrowUpCircle className="mr-2 h-4 w-4" />
                                    {publishAssignment.isPending ? 'Publicando...' : 'Publicar tarea'}
                                </Button>
                            )}
                        </div>
                    )}
                </CardHeader>
            </Card>

            <Separator />

            <Tabs defaultValue="details" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="details">Detalles</TabsTrigger>
                    <TabsTrigger value="questions">Preguntas</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Columna principal */}
                        <div className="lg:col-span-8 space-y-6">
                            {/* Información de la tarea */}
                            <Card>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="space-y-1">
                                            <p className="text-muted-foreground flex items-center gap-1">
                                                <PencilLine className="h-3 w-3" /> Puntos posibles
                                            </p>
                                            <p className="font-medium">{assignment.maxPoints} puntos</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-muted-foreground flex items-center gap-1">
                                                <Clock className="h-3 w-3" /> Fecha de cierre
                                            </p>
                                            <p className="font-medium">{formatLongDate(assignment.dueDate)} a las 23:59</p>
                                            {isOverdue && (
                                                <p className="text-xs text-destructive mt-1">⚠️ Esta tarea está vencida</p>
                                            )}
                                        </div>
                                        <div className="space-y-1 col-span-2">
                                            <p className="text-muted-foreground flex items-center gap-1">
                                                <Repeat1 className="h-3 w-3" /> Intentos posibles
                                            </p>
                                            <p className="font-medium">
                                                {assignment.maxAttempts === -1 ? 'Ilimitados' : `${assignment.maxAttempts} intentos`}
                                                {!isOwner && latestSubmission && assignment.maxAttempts !== -1 && (
                                                    <span className="ml-2 text-sm text-muted-foreground">
                                                        (Usado {latestSubmission.attemptNumber} de {assignment.maxAttempts})
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Descripción */}
                            {assignment.description && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Descripción</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                            {assignment.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Formulario de entrega - SOLO PARA ESTUDIANTES */}
                            {!isOwner && (
                                <Card ref={submissionRef} className="scroll-mt-6">
                                    <CardHeader>
                                        <CardTitle className="text-lg">Tu entrega</CardTitle>
                                        <CardDescription>
                                            {canSubmit
                                                ? 'Sube tu trabajo antes de la fecha límite'
                                                : 'La fecha límite ha pasado'}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {!canSubmit && (
                                            <div className="rounded-md bg-destructive/10 p-4 mb-4 text-sm text-destructive">
                                                <XCircle className="inline mr-2 h-4 w-4" />
                                                La fecha límite de entrega ha pasado y no se permiten entregas tardías
                                            </div>
                                        )}
                                        <SubmissionUploadForm
                                            courseId={courseId}
                                            assignmentId={assignmentId}
                                            disabled={!canSubmit}
                                            disabledReason="La fecha límite de entrega ha pasado y no se permiten entregas tardías"
                                        />
                                    </CardContent>
                                </Card>
                            )}

                            {/* Para profesores: Información de gestión */}
                            {isOwner && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <BarChart3 className="h-5 w-5" />
                                            Gestión de la tarea
                                        </CardTitle>
                                        <CardDescription>
                                            Acciones y estadísticas para administrar esta tarea
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            <div className="rounded-lg border p-4 text-center hover:bg-muted/50 transition-colors">
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="rounded-full bg-blue-100 p-3">
                                                        <FileCheck className="h-6 w-6 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">Estado</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {assignment.isPublished ? 'Publicada' : 'En borrador'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="rounded-lg border p-4 text-center hover:bg-muted/50 transition-colors">
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="rounded-full bg-green-100 p-3">
                                                        <CalendarClock className="h-6 w-6 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">Fecha límite</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {isOverdue ? 'Vencida' : 'Activa'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="rounded-lg border p-4 text-center hover:bg-muted/50 transition-colors">
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="rounded-full bg-purple-100 p-3">
                                                        <ClockIcon className="h-6 w-6 text-purple-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">Intentos</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {assignment.maxAttempts === -1 ? 'Ilimitados' : `${assignment.maxAttempts}`}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {assignment.isPublished && (
                                            <Button
                                                className="w-full"
                                                onClick={() => navigate(ROUTES.COURSE_SUBMISSIONS(courseId, assignmentId))}
                                            >
                                                <Users className="mr-2 h-4 w-4" />
                                                Ver todas las entregas de estudiantes
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-4 space-y-4">
                            {/* Solo para estudiantes: Historial de entregas */}
                            {!isOwner && (
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm flex items-center gap-2">
                                            <ClipboardList className="h-4 w-4" />
                                            Historial de entregas
                                            <Badge variant="secondary" className="ml-auto">
                                                {mySubmissions?.length || 0}
                                            </Badge>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {isLoadingMySubmissions ? (
                                            <div className="space-y-3">
                                                <Skeleton className="h-20 w-full" />
                                                <Skeleton className="h-20 w-full" />
                                            </div>
                                        ) : mySubmissions?.length === 0 ? (
                                            <div className="text-center py-8">
                                                <p className="text-sm text-muted-foreground">Aún no has entregado</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3 max-h-125 overflow-y-auto pr-2">
                                                {mySubmissions?.map((submission) => (
                                                    <SubmissionCard courseId={courseId} assignment={assignment} submission={submission} key={submission.id}/>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Solo para estudiantes: Resumen de calificación */}
                            {!isOwner && gradedSubmission && (
                                <Card className="bg-green-50 border-green-200">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm text-green-800 flex items-center gap-2">
                                            <Award className="h-4 w-4" />
                                            Tu calificación
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-center">
                                            <p className="text-3xl font-bold text-green-700">{gradedSubmission.grade}</p>
                                            <p className="text-sm text-green-600">de {assignment.maxPoints} puntos posibles</p>
                                            {gradedSubmission.feedback && (
                                                <p className="text-sm text-green-700 mt-2 border-t border-green-200 pt-2">
                                                    "{gradedSubmission.feedback}"
                                                </p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Para profesores: Información de ayuda */}
                            {isOwner && (
                                <Card className="bg-muted/50">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm flex items-center gap-2">
                                            <AlertCircle className="h-4 w-4" />
                                            Información para profesores
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-sm text-muted-foreground space-y-2">
                                        <p>• Revisa las entregas de los estudiantes desde el botón "Ver entregas"</p>
                                        <p>• Puedes calificar cada entrega individualmente</p>
                                        <p>• Los estudiantes verán sus calificaciones automáticamente</p>
                                        {!assignment.isPublished && (
                                            <p className="text-yellow-600">• La tarea está en borrador. Los estudiantes no pueden verla hasta que la publiques.</p>
                                        )}
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="questions">
                    <Card>
                        <CardContent className="py-8 text-center text-muted-foreground">
                            <p>Las preguntas de la tarea aparecerán aquí</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}