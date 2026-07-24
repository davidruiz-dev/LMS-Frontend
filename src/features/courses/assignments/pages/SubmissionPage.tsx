import { useParams } from "react-router-dom"
import { useSubmission } from "../../hooks/use-submissions"
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const STATUS_LABEL: Record<string, string> = {
    draft: 'Borrador',
    submitted: 'Entregado',
    graded: 'Calificado',
    returned: 'Devuelto',
    resubmitted: 'Reentregado',
};

export default function SubmissionPage() {
    const { submissionId } = useParams();
    const { data: submission, isLoading, isError } = useSubmission(submissionId ?? '')
    const [activeFileId, setActiveFileId] = useState<string | null>(null);

    if (isLoading) {
        return <div className="animate-pulse text-sm text-muted-foreground">Cargando entrega...</div>;
    }

    if (isError || !submission) {
        return <div className="text-sm text-destructive">No se pudo cargar la entrega</div>;
    }

    const files = submission.attachmentFiles;
    const activeFile = files.find((f) => f.id === activeFileId) ?? files[0];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <p className="font-medium">Detalles de la entrega</p>
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

            {submission.content && (
                <p className="rounded-md border bg-muted/30 p-3 text-sm">{submission.content}</p>
            )}

            {submission.status === 'graded' && (
                <div className="flex items-center gap-2 rounded-md border p-3 text-sm">
                    <span className="font-semibold">{submission.grade} pts</span>
                    {submission.feedback && <span className="text-muted-foreground">— {submission.feedback}</span>}
                </div>
            )}

            {files.length === 0 && (
                <p className="text-sm text-muted-foreground">Esta entrega no tiene archivos adjuntos.</p>
            )}

            {files.length > 0 && (
                <div className="space-y-3">
                    {files.length > 1 && (
                        <div className="flex flex-wrap gap-2">
                            {files.map((file) => (
                                <button
                                    key={file.id}
                                    onClick={() => setActiveFileId(file.id)}
                                    className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${activeFile?.id === file.id
                                            ? 'border-primary bg-primary/10 text-primary'
                                            : 'text-muted-foreground hover:bg-muted'
                                        }`}
                                >
                                    <FileText className="h-3.5 w-3.5" />
                                    <span className="max-w-[160px] truncate">{file.fileName}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {activeFile && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <p className="truncate text-sm font-medium">{activeFile.fileName}</p>
                                <Button variant="ghost" size="sm" asChild>
                                    <a href={activeFile.fileUrl} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                                        Abrir en pestaña
                                    </a>
                                </Button>
                            </div>
                            <iframe
                                src={activeFile.fileUrl}
                                title={activeFile.fileName}
                                className="h-[70vh] w-full rounded-lg border"
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
