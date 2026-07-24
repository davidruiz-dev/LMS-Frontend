import { Button } from "@/components/ui/button";
import { useAssignment, useAssignmentPublish, useAssignmentUnpublish } from "@/features/courses/hooks/use-assignments";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowDownCircle, ArrowUpCircle, ClipboardClock, ClipboardList, Clock, FileText, PencilLine, Repeat1, } from "lucide-react";
import { useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom"
import { Separator } from "@/components/ui/separator";
import { useCourseAccess } from "@/features/courses/hooks/use-course-access";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/shared/constants/routes";
import { SubmissionUploadForm } from "../components/SubmissionUploadForm";
import { formatLongDate } from "@/utils/formatLongDate";
import { useCountdown } from "../../hooks/use-countdown";
import { useMySubmissions } from "../../hooks/use-submissions";
import { getDistanceToNow } from "@/utils/getDistanceToNow";
import type { Submission } from "../types/assignment.types";

const STATUS_LABEL: Record<Submission['status'], string> = {
    submitted: 'Entregado',
    graded: 'Calificado',
    pending: 'Pendiente',
    late: 'Tarde'
};

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

    const onPublish = () => publishAssignment.mutate(assignmentId);
    const onUnpublish = () => unpublishAssignment.mutate(assignmentId);


    if (isLoading || !assignment) {
        return <div className="mx-auto max-w-6xl animate-pulse py-10 text-sm text-muted-foreground">Cargando tarea...</div>;
    }

    const canSubmit = !timeLeft.overdue || assignment.allowLateSubmissions;

    return (
        <div className="mx-auto space-y-4">
            <header>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold">{assignment.name}</h1>

                        <div className="flex flex-wrap items-center gap-6">
                            <div className="flex items-center gap-1.5">
                                <div className="flex aspect-square size-5 items-center justify-center rounded bg-blue-800 text-sidebar-primary-foreground">
                                    <ClipboardList className="size-3" />
                                </div>
                                <span className="text-sm font-medium text-muted-foreground">Tarea</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Editado {new Date(assignment.updateAt).toLocaleString('es-ES', { dateStyle: 'medium' })}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Badge variant={timeLeft.overdue ? 'destructive' : 'default'}>
                            {timeLeft.overdue ? 'VENCIDO' : `${assignment.maxPoints} puntos posibles`}
                        </Badge>

                        <div
                            className={`flex items-center rounded-full px-3 py-1.5 ${timeLeft.overdue ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                                }`}
                        >
                            <Clock className="mr-1.5 h-4 w-4" />
                            <span className="text-sm font-medium">
                                {timeLeft.overdue ? 'Vencido' : `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m`}
                            </span>
                        </div>

                        {isOwner && assignment.isPublished && (
                            <Button onClick={onUnpublish} size="lg" variant="outline">
                                <ArrowDownCircle className="mr-2 h-4 w-4" /> Despublicar
                            </Button>
                        )}
                        {isOwner && !assignment.isPublished && (
                            <Button onClick={onPublish} size="lg">
                                <ArrowUpCircle className="mr-2 h-4 w-4" /> Publicar
                            </Button>
                        )}
                        {isOwner && assignment.isPublished && (
                            <Button variant="outline" onClick={() => navigate(ROUTES.COURSE_SUBMISSIONS(courseId, assignmentId))}>
                                <ClipboardClock className="mr-2 h-4 w-4" />
                                Ver entregas
                            </Button>
                        )}

                    </div>
                </div>
            </header>

            <Separator />

            <Tabs defaultValue="details">
                <TabsList>
                    <TabsTrigger value="details">Detalles</TabsTrigger>
                    <TabsTrigger value="questions">Preguntas</TabsTrigger>
                </TabsList>

                <TabsContent value="details">
                    <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-9">
                            <div className="flex gap-10">
                                <div className="space-y-3 py-3 text-sm font-medium text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <PencilLine size={15} /> Puntos posibles
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <ClipboardClock size={15} /> Fecha de cierre
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Repeat1 size={15} /> Intentos posibles
                                    </div>
                                </div>
                                <div className="space-y-3 py-3 text-sm font-medium">
                                    <div>{assignment.maxPoints} puntos</div>
                                    <div>{formatLongDate(assignment.dueDate)} a las 23:59</div>
                                    <div>{assignment.maxAttempts === -1 ? 'Ilimitados' : `${assignment.maxAttempts} intentos`}</div>
                                </div>
                            </div>

                            <div className="my-10">
                                <h2 className="text-xl font-bold">Descripción</h2>
                                <p className="text-muted-foreground">{assignment.description}</p>
                            </div>

                            {!isOwner && (
                                <div ref={submissionRef} className="scroll-mt-6 space-y-3">
                                    <h2 className="text-lg font-semibold">Tu entrega</h2>
                                    <SubmissionUploadForm
                                        courseId={courseId}
                                        assignmentId={assignmentId}
                                        disabled={!canSubmit}
                                        disabledReason="La fecha límite de entrega ha pasado y no se permiten entregas tardías"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="col-span-3">
                            {isLoadingMySubmissions && (
                                <div className="mx-auto max-w-xl animate-pulse text-sm text-muted-foreground">Cargando...</div>
                            )}
                            <div className="space-y-2">
                                {mySubmissions?.map((submission) => (
                                    <div className="space-y-3 rounded-lg border p-3">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <p className="text-xs text-muted-foreground">
                                                    Intento {submission.attemptNumber} ·{' '}
                                                    {submission.submittedAt
                                                        ? new Date(submission.submittedAt).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })
                                                        : 'Sin enviar'}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {submission.isLate && <Badge variant="destructive">Tarde</Badge>}
                                                <Badge variant={submission.status === 'graded' ? 'default' : 'secondary'}>
                                                    {STATUS_LABEL[submission.status]}
                                                </Badge>
                                            </div>
                                        </div>

                                        {/* {submission.content && <p className="text-sm">{submission.content}</p>} */}

                                        <ul className="space-y-1.5">
                                            {submission.attachmentFiles.map((file) => (
                                                <li key={file.id}>
                                                    <a
                                                        href={file.fileUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted"
                                                    >
                                                        <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                                                        <span className="truncate">{file.fileName}</span>
                                                        <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                                                            {(file.fileSize / 1024 / 1024).toFixed(2)} MB
                                                        </span>
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>

                                        {submission.status === 'graded' && (
                                            <div className="flex items-center gap-2 border-t pt-3 text-sm">
                                                <span className="font-semibold">{submission.grade} pts</span>
                                                {submission.feedback && <span className="text-muted-foreground">— {submission.feedback}</span>}
                                            </div>
                                        )}

                                        <Button variant={"link"} onClick={()=>navigate(ROUTES.COURSE_SUBMISSION(courseId, assignmentId, submission.id))}>
                                            ver detalles
                                        </Button>

                                        
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="questions" />
            </Tabs>
        </div >
    );
}