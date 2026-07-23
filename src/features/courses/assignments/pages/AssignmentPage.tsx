import { Button } from "@/components/ui/button";
import { useAssignment, useAssignmentPublish, useAssignmentUnpublish } from "@/features/courses/hooks/use-assignments";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowDownCircle, ArrowUpCircle, ClipboardClock, ClipboardList, Clock, FileText, PencilLine, Repeat1, UploadCloud, UploadIcon, X } from "lucide-react";
import { useCallback, useState, type ChangeEvent, type DragEvent } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { Separator } from "@/components/ui/separator";
import { useCourseAccess } from "@/features/courses/hooks/use-course-access";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useCreateSubmission } from "../../hooks/use-submissions";
import { ROUTES } from "@/shared/constants/routes";

export default function AssignmentPage() {
    const { id: courseId, assignmentId } = useParams<string>();
    const navigate = useNavigate(); 

    if (!courseId || !assignmentId) return null;
    const { data: assignment } = useAssignment(courseId, assignmentId);
    const publishAssignment = useAssignmentPublish(courseId);
    const unpublishAssignment = useAssignmentUnpublish(courseId);

    const onPublish = async (id: string) => {
        await publishAssignment.mutateAsync(id);
    }

    const onUnpublish = async (id: string) => {
        await unpublishAssignment.mutateAsync(id);
    }

    const calculateTimeLeft = () => {
        if (!assignment) return;
        const dueDate = new Date(assignment?.dueDate);
        const now = new Date();
        const difference = dueDate.getTime() - now.getTime();

        if (difference <= 0) {
            return { days: 0, hours: 0, minutes: 0, overdue: true };
        }

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
            overdue: false
        };
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    const formatDate = (dateString: any) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const access = useCourseAccess(courseId);
    const isOwner = access?.isOwner;


    const [content, setContent] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const { mutate, isPending } = useCreateSubmission(courseId, assignmentId);

    const addFiles = useCallback((incoming: FileList | File[]) => {
        const pdfsOnly = Array.from(incoming).filter((f) => f.type === 'application/pdf');
        const validSize = pdfsOnly.filter((f) => f.size <= 20 * 1024 * 1024);

        setFiles((prev) => {
            const merged = [...prev, ...validSize];
            return merged.slice(0, 5);
        });
    }, []);

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        addFiles(e.dataTransfer.files);
    };

    const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) addFiles(e.target.files);
        e.target.value = '';
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        if (!content.trim() && files.length === 0) return;
        mutate(
            { content, files },
            {
                onSuccess: () => {
                    setContent('');
                    setFiles([]);
                },
            },
        );
    };

    if (!assignment) return null;

    return (
        <div className="max-w-6xl mx-auto space-y-4">
            {/* Header */}
            <header>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold">{assignment.name}</h1>

                        <div className="flex gap-6">
                            <div className="flex items-center gap-1.5">
                                <div className="flex aspect-square size-5 items-center justify-center rounded bg-blue-800 text-sidebar-primary-foreground">
                                    <ClipboardList className="size-3" />
                                </div>
                                <span className="text-sm font-medium text-gray-400">Tarea</span>
                            </div>
                            <p className="text-sm text-gray-400">
                                Editado {new Date(assignment.updateAt).toLocaleString("es-ES", {
                                    dateStyle: "medium",
                                })}
                            </p>
                        </div>
                    </div>

                    {isOwner && assignment.isPublished && (
                        <Button onClick={() => onUnpublish(assignmentId)} size={"lg"}>
                            <ArrowDownCircle /> Despublicar
                        </Button>
                    )}
                    {isOwner && !assignment.isPublished && (
                        <Button onClick={() => onPublish(assignmentId)} size={"lg"}>
                            <ArrowUpCircle /> Publicar
                        </Button>
                    )}

                    <div className="flex items-center space-x-4">
                        <Badge variant={timeLeft?.overdue ? "destructive" : "default"}>
                            {timeLeft?.overdue ? 'VENCIDO' : `${assignment.maxPoints} puntos`}
                        </Badge>

                        <div className={`flex items-center px-3 py-1.5 rounded-full ${timeLeft?.overdue ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                            <Clock className="h-4 w-4 mr-1.5" />
                            <span className="text-sm font-medium">
                                {timeLeft?.overdue ? 'Vencido' :
                                    `${timeLeft?.days}d ${timeLeft?.hours}h ${timeLeft?.minutes}m`}
                            </span>
                        </div>
                    </div>

                    {isOwner && assignment.isPublished && (
                        <Button onClick={() => navigate(ROUTES.COURSE_SUBMISSIONS(courseId, assignmentId))}>
                            <ClipboardClock className="mr-2" />
                            Ver entregas
                        </Button>
                    )}

                    {!isOwner && (
                        <Button>
                            <UploadIcon className="mr-2" />
                            Entregar
                        </Button>
                    )}

                </div>
            </header>

            <Separator />

            <Tabs defaultValue="details" >
                <TabsList>
                    <TabsTrigger value="details">Detalles</TabsTrigger>
                    <TabsTrigger value="questions">Preguntas</TabsTrigger>
                </TabsList>
                <TabsContent value="details">
                    <div className="flex gap-10">
                        <div className="space-y-3 py-3 font-medium text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <PencilLine size={15} /> Puntos posibles
                            </div>
                            <div className="flex items-center gap-2">
                                <ClipboardClock size={15} /> Fecha de cierre
                            </div>
                            <div className="flex items-center gap-2">
                                <Repeat1 size={15} />
                                Intentos posibles
                            </div>
                        </div>
                        <div className="space-y-3 py-3 font-medium text-sm">
                            <div>{assignment.maxPoints} puntos</div>
                            <div>{formatDate(assignment.dueDate)} a las 23:59
                            </div>
                            <div>{assignment.maxAttempts} intentos</div>
                        </div>
                    </div>

                    <div className="my-10">
                        <h1 className="font-bold text-xl">Descripción</h1>
                        <p className="">
                            {assignment.description}
                        </p>
                    </div>

                    {/* Submission input */}
                    <div className="space-y-4">
                        <Textarea
                            placeholder="Comentario o contenido de la entrega (opcional si adjuntas PDFs)"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={4}
                        />

                        <div
                            onDragOver={(e) => {
                                e.preventDefault();
                                setIsDragging(true);
                            }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
                                }`}
                        >
                            <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground mb-2">
                                Arrastra tus PDFs aquí o
                            </p>
                            <label className="inline-block">
                                <span className="text-sm text-primary underline cursor-pointer">
                                    selecciona archivos
                                </span>
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    multiple
                                    className="hidden"
                                    onChange={handleFileInput}
                                />
                            </label>
                            <p className="text-xs text-muted-foreground mt-2">
                                Máximo {5} archivos PDF, {20}MB cada uno
                            </p>
                        </div>

                        {files.length > 0 && (
                            <ul className="space-y-2">
                                {files.map((file, index) => (
                                    <li
                                        key={`${file.name}-${index}`}
                                        className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                                    >
                                        <span className="flex items-center gap-2 truncate">
                                            <FileText className="h-4 w-4 shrink-0" />
                                            <span className="truncate">{file.name}</span>
                                            <span className="text-muted-foreground shrink-0">
                                                ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                            </span>
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => removeFile(index)}
                                            className="text-muted-foreground hover:text-destructive shrink-0"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <Button
                            onClick={handleSubmit}
                            disabled={isPending || (!content.trim() && files.length === 0)}
                            className="w-full"
                        >
                            {isPending ? 'Enviando...' : 'Entregar tarea'}
                        </Button>
                    </div>
                </TabsContent>

                <TabsContent value="questions">

                </TabsContent>
            </Tabs>


        </div>
    )
}
