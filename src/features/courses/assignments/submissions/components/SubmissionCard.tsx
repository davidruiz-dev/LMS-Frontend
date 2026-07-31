import { Badge } from "@/components/ui/badge";
import { STATUS_LABEL, type Assignment, type Submission } from "../../types/assignment.types"
import { Award, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/shared/constants/routes";

interface SubmissionCardProps {
    submission: Submission;
    courseId: string;
    assignment: Assignment;
}

export const SubmissionCard = ({ submission, courseId, assignment }: SubmissionCardProps) => {
    const navigate = useNavigate();
    const status = STATUS_LABEL[submission.status];
    const isGraded = submission.status === 'graded';

    return (
        <div
            key={submission.id}
            className={`space-y-3 rounded-lg border p-4 hover:bg-muted/50 transition-colors 
                ${isGraded ? 'border-green-200 bg-green-50/50 dark:bg-green-50/5 dark:border-green-200/30' : ''
                }`}
        >
            <div className="flex items-start justify-between">
                <div className="space-y-0.5">
                    <p className="text-sm font-medium">
                        Intento {submission.attemptNumber}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {submission.submittedAt
                            ? new Date(submission.submittedAt).toLocaleString('es-ES', {
                                dateStyle: 'medium',
                                timeStyle: 'short'
                            })
                            : 'Sin enviar'}
                    </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                    {submission.isLate && (
                        <Badge variant="destructive" className="text-[10px]">
                            Tarde
                        </Badge>
                    )}
                    <Badge variant={status.variant} className="text-xs">
                        {status.label}
                    </Badge>
                </div>
            </div>

            {submission.attachmentFiles.length > 0 && (
                <ul className="space-y-1.5">
                    {submission.attachmentFiles.slice(0, 2).map((file) => (
                        <li key={file.id}>
                            <a
                                href={file.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted transition-colors"
                            >
                                <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                                <span className="truncate text-xs">{file.fileName}</span>
                                <span className="ml-auto shrink-0 text-[10px] text-muted-foreground">
                                    {(file.fileSize / 1024 / 1024).toFixed(2)} MB
                                </span>
                            </a>
                        </li>
                    ))}
                    {submission.attachmentFiles.length > 2 && (
                        <p className="text-xs text-muted-foreground">
                            +{submission.attachmentFiles.length - 2} archivos más
                        </p>
                    )}
                </ul>
            )}

            {isGraded && (
                <div className="flex items-center gap-2 border-t pt-3">
                    <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white">
                        <Award className="mr-1 h-3 w-3" />
                        {submission.grade} / {assignment.maxPoints} pts
                    </Badge>
                    {submission.feedback && (
                        <span className="text-xs text-muted-foreground truncate flex-1">
                            "{submission.feedback}"
                        </span>
                    )}
                </div>
            )}

            <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs"
                onClick={() => navigate(ROUTES.COURSE_SUBMISSION(courseId, assignment.id, submission.id))}
            >
                Ver detalles
            </Button>
        </div>
    )
}
