// features/submissions/components/submission-upload-form.tsx
import { useCallback, useState, type ChangeEvent, type DragEvent } from 'react';
import { FileText, UploadCloud, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useCreateSubmission } from '../../hooks/use-submissions';

const MAX_FILES = 5;
const MAX_SIZE_MB = 10;

interface Props {
  courseId: string;
  assignmentId: string;
  disabled?: boolean;
  disabledReason?: string;
}

export function SubmissionUploadForm({ courseId, assignmentId, disabled, disabledReason }: Props) {
  const [content, setContent] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [rejected, setRejected] = useState<string | null>(null);
  const { mutate, isPending } = useCreateSubmission(courseId, assignmentId);

  const addFiles = useCallback((incoming: FileList | File[]) => {
    const all = Array.from(incoming);
    const notPdf = all.some((f) => f.type !== 'application/pdf');
    const tooBig = all.some((f) => f.size > MAX_SIZE_MB * 1024 * 1024);

    if (notPdf) {
      setRejected('Solo se aceptan archivos PDF');
    } else if (tooBig) {
      setRejected(`Cada archivo debe pesar menos de ${MAX_SIZE_MB}MB`);
    } else {
      setRejected(null);
    }

    const valid = all.filter((f) => f.type === 'application/pdf' && f.size <= MAX_SIZE_MB * 1024 * 1024);

    setFiles((prev) => [...prev, ...valid].slice(0, MAX_FILES));
  }, []);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (!disabled) addFiles(e.dataTransfer.files);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files);
    e.target.value = '';
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setRejected(null);
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

  if (disabled) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
        {disabledReason ?? 'La entrega no está disponible en este momento'}
      </div>
    );
  }

  const atFileLimit = files.length >= MAX_FILES;

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Comentario o contenido de la entrega (opcional si adjuntas PDFs)"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
      />

      {!atFileLimit && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
            isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
          }`}
        >
          <UploadCloud className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
          <p className="mb-2 text-sm text-muted-foreground">Arrastra tus PDFs aquí o</p>
          <label className="inline-block">
            <span className="cursor-pointer text-sm text-primary underline">selecciona archivos</span>
            <input
              type="file"
              accept="application/pdf"
              multiple
              className="hidden"
              onChange={handleFileInput}
            />
          </label>
          <p className="mt-2 text-xs text-muted-foreground">
            Máximo {MAX_FILES} archivos PDF, {MAX_SIZE_MB}MB cada uno
          </p>
        </div>
      )}

      {rejected && <p className="text-sm text-destructive">{rejected}</p>}

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
                <span className="shrink-0 text-muted-foreground">
                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </span>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="shrink-0 text-muted-foreground hover:text-destructive"
                aria-label={`Quitar ${file.name}`}
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
  );
}