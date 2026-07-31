import { Skeleton } from "@/components/ui/skeleton";
import type { Submission } from "../../types/assignment.types";
import { useMemo, useState } from "react";
import { cn } from "@/shared/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ChevronDown, ChevronRight, ChevronsUpDown, ChevronUp, Clock, Download, ExternalLink, Loader2, Pencil, Search, Star, Upload, Users, XCircle } from "lucide-react";
import type { User } from "@/shared/types";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ROUTES } from "@/shared/constants/routes";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAssignment } from "../../../hooks/use-assignments";
import { useEnrollmentsByCourse } from "../../../hooks/use-enrollments";
import { useAssignmentSubmissions, useGradeSubmission } from "../../../hooks/use-submissions";
import { es } from "date-fns/locale";

type SortField = "student" | "submittedAt" | "grade" | "attempts";
type SortDir = "asc" | "desc";
type FilterStatus = "all" | "graded" | "ungraded" | "missing";

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SubmissionsPageSkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            <div className="flex justify-between">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-9 w-32" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 rounded-lg" />
                ))}
            </div>
            <Skeleton className="h-10 w-full rounded-lg" />
            {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
        </div>
    );
}

// ─── Grade cell (inline editable) ─────────────────────────────────────────────

function GradeCell({
    submission,
    maxScore,
    onGrade,
}: {
    submission: Submission;
    maxScore: number;
    onGrade: (submissionId: string, grade: number, feedback: string) => Promise<void>;
}) {
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(submission.grade?.toString() ?? "");
    const [feedback, setFeedback] = useState(submission.feedback ?? "");
    const [saving, setSaving] = useState(false);

    const hasGrade = submission.grade !== undefined && submission.grade !== null;

    const handleSave = async () => {
        const parsed = parseFloat(value);
        if (isNaN(parsed) || parsed < 0 || parsed > maxScore) return;
        setSaving(true);
        await onGrade(submission.id, parsed, feedback);
        setSaving(false);
        setEditing(false);
    };

    if (!editing) {
        return (
            <button
                onClick={() => setEditing(true)}
                className={cn(
                    "flex items-center gap-1.5 text-sm font-medium rounded px-2 py-1 transition-colors hover:bg-muted/60 group",
                    hasGrade ? "text-primary" : "text-muted-foreground"
                )}
            >
                {hasGrade ? (
                    <>
                        <Star className="h-3.5 w-3.5 fill-primary" />
                        {submission.grade} / {maxScore}
                    </>
                ) : (
                    <>
                        <Pencil className="h-3.5 w-3.5 opacity-0 group-hover:opacity-60 transition-opacity" />
                        <span>— / {maxScore}</span>
                    </>
                )}
            </button>
        );
    }

    return (
        <div className="flex flex-col gap-1.5 min-w-[220px]">
            <div className="flex items-center gap-2">
                <Input
                    type="number"
                    min={0}
                    max={maxScore}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="h-7 w-20 text-sm"
                    autoFocus
                />
                <span className="text-xs text-muted-foreground">
                    / {maxScore} pts
                </span>
            </div>
            <Textarea
                placeholder="Comentario (opcional)"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="text-xs min-h-[56px] resize-none"
            />
            <div className="flex items-center gap-1.5">
                <Button
                    size="sm"
                    className="h-6 text-xs px-2"
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                        "Guardar"
                    )}
                </Button>
                <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 text-xs px-2"
                    onClick={() => setEditing(false)}
                    disabled={saving}
                >
                    Cancelar
                </Button>
            </div>
        </div>
    );
}

// ─── Row ──────────────────────────────────────────────────────────────────────

function SubmissionRow({
    row,
    maxScore,
    courseId,
    assignmentId,
    onGrade,
}: {
    row: { student: User; submissions: Submission[]; latestSubmission: Submission | null };
    maxScore: number;
    courseId: string;
    assignmentId: string;
    onGrade: (submissionId: string, grade: number, feedback: string) => Promise<void>;
}) {
    const { student, submissions, latestSubmission } = row;
    const [expanded, setExpanded] = useState(false);
    const attemptsCount = submissions.length;
    const hasSubmitted = attemptsCount > 0;

    return (
        <>
            <tr
                className={cn(
                    "border-b transition-colors hover:bg-muted/30 cursor-pointer",
                    expanded && "bg-muted/20"
                )}
                onClick={() => hasSubmitted && setExpanded((p) => !p)}
            >
                {/* Student */}
                <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0 uppercase">
                            {student.firstName?.[0] ?? "?"}
                        </div>
                        <div>
                            <p className="text-sm font-medium">{student.firstName}</p>
                            <p className="text-xs text-muted-foreground">{student.email}</p>
                        </div>
                    </div>
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                    {!hasSubmitted ? (
                        <Badge variant="outline" className="text-xs border-muted-foreground/30 text-muted-foreground">
                            Sin entregar
                        </Badge>
                    ) : latestSubmission?.grade !== undefined && latestSubmission?.grade !== null ? (
                        <Badge className="text-xs bg-green-600 hover:bg-green-700 text-white border-0">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Calificado
                        </Badge>
                    ) : (
                        <Badge variant="secondary" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            Pendiente
                        </Badge>
                    )}
                </td>

                {/* Submitted at */}
                <td className="px-4 py-3 text-sm text-muted-foreground">
                    {latestSubmission
                        ? format(new Date(latestSubmission.createdAt), "dd MMM yyyy, HH:mm", { locale: es })
                        : "—"}
                </td>

                {/* Attempts */}
                <td className="px-4 py-3 text-center">
                    {hasSubmitted ? (
                        <span className="text-sm font-medium">{attemptsCount}</span>
                    ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                    )}
                </td>

                {/* Grade */}
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    {latestSubmission ? (
                        <GradeCell
                            submission={latestSubmission}
                            maxScore={maxScore}
                            onGrade={onGrade}
                        />
                    ) : (
                        <span className="text-sm text-muted-foreground px-2">—</span>
                    )}
                </td>

                {/* Expand / link */}
                <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                        {latestSubmission && (
                            <Link to={ROUTES.COURSE_SUBMISSION(courseId, assignmentId, latestSubmission.id)}>
                                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                                    <ExternalLink className="h-3.5 w-3.5" />
                                </Button>
                            </Link>
                        )}
                        {hasSubmitted && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2"
                                onClick={() => setExpanded((p) => !p)}
                            >
                                {expanded ? (
                                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                )}
                            </Button>
                        )}
                    </div>
                </td>
            </tr>

            {/* Expanded: attempt history */}
            {expanded && (
                <tr className="border-b bg-muted/10">
                    <td colSpan={6} className="px-6 py-3">
                        <div className="space-y-2 pl-11">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                                Historial de intentos
                            </p>
                            {[...submissions].reverse().map((sub, i) => {
                                const originalIndex = submissions.length - 1 - i;
                                const isLatest = originalIndex === submissions.length - 1;
                                return (
                                    <div
                                        key={sub.id}
                                        className="flex items-center justify-between rounded-md border px-3 py-2 bg-background text-sm"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-muted-foreground w-16">
                                                Intento #{originalIndex + 1}
                                            </span>
                                            {isLatest && (
                                                <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                                                    será calificado
                                                </span>
                                            )}
                                            <span className="text-xs text-muted-foreground">
                                                {format(new Date(sub.createdAt), "dd MMM yyyy, HH:mm", { locale: es })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {sub.grade !== undefined && sub.grade !== null ? (
                                                <span className="text-xs font-semibold text-primary flex items-center gap-1">
                                                    <Star className="h-3 w-3 fill-primary" />
                                                    {sub.grade} pts
                                                </span>
                                            ) : (
                                                <Badge variant="secondary" className="text-xs">Sin calificar</Badge>
                                            )}
                                            <Link to={ROUTES.COURSE_SUBMISSION(courseId, assignmentId, sub.id)}>
                                                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                                    Ver
                                                    <ExternalLink className="h-3 w-3 ml-1" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AssignmentSubmissionsPage() {
    const { id: courseId, assignmentId } = useParams<{ id: string; assignmentId: string }>();
    if (!courseId || !assignmentId) return null;
    const navigate = useNavigate();

    const { data: assignment, isLoading: assignmentLoading } = useAssignment(courseId, assignmentId);
    const { data: allSubmissions = [], isLoading: submissionsLoading } = useAssignmentSubmissions(assignmentId!);
    const { data: enrollments = [], isLoading: enrollmentsLoading } = useEnrollmentsByCourse(courseId!);
    const gradeSubmission = useGradeSubmission();

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<FilterStatus>("all");
    const [sortField, setSortField] = useState<SortField>("submittedAt");
    const [sortDir, setSortDir] = useState<SortDir>("desc");

    const isLoading = assignmentLoading || submissionsLoading || enrollmentsLoading;

    // ── Build per-student rows ────────────────────────────────────────────────

    const rows = useMemo(() => {
        const students = enrollments
            .map((e) => e.user);

        return students.map((student) => {
            const subs = allSubmissions
                .filter((s: Submission) => s.studentId === student.id)
                .sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            const latest = subs[subs.length - 1] ?? null;
            return { student, submissions: subs, latestSubmission: latest };
        });
    }, [enrollments, allSubmissions]);

    // ── Stats ─────────────────────────────────────────────────────────────────

    const stats = useMemo(() => {
        const total = rows.length;
        const submitted = rows.filter((r) => r.submissions.length > 0).length;
        const graded = rows.filter(
            (r) => r.latestSubmission?.grade !== undefined && r.latestSubmission?.grade !== null
        ).length;
        const missing = total - submitted;
        const avgGrade =
            graded > 0
                ? rows
                    .filter((r) => r.latestSubmission?.grade !== undefined && r.latestSubmission?.grade !== null)
                    .reduce((acc, r) => acc + (r.latestSubmission!.grade as number), 0) / graded
                : null;
        return { total, submitted, graded, missing, avgGrade };
    }, [rows]);

    // ── Filter + sort ─────────────────────────────────────────────────────────

    const filtered = useMemo(() => {
        let result = rows;

        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(
                (r) =>
                    r.student.firstName?.toLowerCase().includes(q) ||
                    r.student.email?.toLowerCase().includes(q)
            );
        }

        if (filter === "graded") {
            result = result.filter(
                (r) => r.latestSubmission?.grade !== undefined && r.latestSubmission?.grade !== null
            );
        } else if (filter === "ungraded") {
            result = result.filter(
                (r) =>
                    r.latestSubmission !== null &&
                    (r.latestSubmission.grade === undefined || r.latestSubmission.grade === null)
            );
        } else if (filter === "missing") {
            result = result.filter((r) => r.submissions.length === 0);
        }

        result = [...result].sort((a, b) => {
            let cmp = 0;
            if (sortField === "student") {
                cmp = (a.student.firstName ?? "").localeCompare(b.student.firstName ?? "");
            } else if (sortField === "submittedAt") {
                const aT = a.latestSubmission ? new Date(a.latestSubmission.createdAt).getTime() : 0;
                const bT = b.latestSubmission ? new Date(b.latestSubmission.createdAt).getTime() : 0;
                cmp = aT - bT;
            } else if (sortField === "grade") {
                cmp = (a.latestSubmission?.grade ?? -1) - (b.latestSubmission?.grade ?? -1);
            } else if (sortField === "attempts") {
                cmp = a.submissions.length - b.submissions.length;
            }
            return sortDir === "asc" ? cmp : -cmp;
        });

        return result;
    }, [rows, search, filter, sortField, sortDir]);

    // ── Handlers ──────────────────────────────────────────────────────────────

    const toggleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        } else {
            setSortField(field);
            setSortDir("desc");
        }
    };

    const handleGrade = async (submissionId: string, grade: number, feedback: string) => {
        await gradeSubmission.mutateAsync({ submissionId, grade, feedback });
    };

    const handleExportCsv = () => {
        const header = ["Estudiante", "Email", "Intentos", "Calificación", "Fecha entrega"];
        const rowsCsv = filtered.map((r) => [
            r.student.firstName ?? "",
            r.student.email ?? "",
            r.submissions.length,
            r.latestSubmission?.grade ?? "",
            r.latestSubmission
                ? format(new Date(r.latestSubmission.createdAt), "dd/MM/yyyy HH:mm")
                : "",
        ]);
        const csv = [header, ...rowsCsv].map((r) => r.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `entregas-${assignmentId}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // ── Sort header helper ────────────────────────────────────────────────────

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field)
            return <ChevronsUpDown className="h-3.5 w-3.5 opacity-30" />;
        return sortDir === "asc" ? (
            <ChevronUp className="h-3.5 w-3.5" />
        ) : (
            <ChevronDown className="h-3.5 w-3.5" />
        );
    };

    // ── Early returns ─────────────────────────────────────────────────────────

    if (isLoading) return <SubmissionsPageSkeleton />;
    if (!assignment) return null;

    return (
        <div className="space-y-6 pb-10">

            {/* ── Header ───────────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <button
                            onClick={() => navigate(`/courses/${courseId}/assignments/${assignmentId}`)}
                            className="hover:text-foreground transition-colors"
                        >
                            {assignment.name}
                        </button>
                        <ChevronRight className="h-3.5 w-3.5" />
                        <span>Entregas</span>
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Todas las entregas
                    </h1>
                </div>
                <Button variant="outline" size="sm" onClick={handleExportCsv}>
                    <Download className="h-4 w-4 mr-1.5" />
                    Exportar CSV
                </Button>
            </div>

            {/* ── Stat cards ────────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-muted/40 rounded-lg p-3.5 space-y-1 border">
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" />
                        Total estudiantes
                    </p>
                    <p className="text-2xl font-semibold">{stats.total}</p>
                </div>
                <div
                    className="bg-muted/40 rounded-lg p-3.5 space-y-1 border cursor-pointer hover:bg-muted/60 transition-colors"
                    onClick={() => setFilter(filter === "ungraded" ? "all" : "ungraded")}
                >
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Upload className="h-3.5 w-3.5" />
                        Entregadas
                    </p>
                    <p className="text-2xl font-semibold">{stats.submitted}</p>
                    <p className="text-xs text-muted-foreground">
                        {stats.graded} calificadas
                    </p>
                </div>
                <div
                    className="bg-muted/40 rounded-lg p-3.5 space-y-1 border cursor-pointer hover:bg-muted/60 transition-colors"
                    onClick={() => setFilter(filter === "missing" ? "all" : "missing")}
                >
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <XCircle className="h-3.5 w-3.5" />
                        Sin entregar
                    </p>
                    <p className="text-2xl font-semibold text-destructive">
                        {stats.missing}
                    </p>
                </div>
                <div className="bg-muted/40 rounded-lg p-3.5 space-y-1 border">
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Star className="h-3.5 w-3.5" />
                        Promedio
                    </p>
                    <p className="text-2xl font-semibold">
                        {stats.avgGrade !== null
                            ? `${stats.avgGrade.toFixed(1)}`
                            : "—"}
                    </p>
                    {stats.avgGrade !== null && (
                        <p className="text-xs text-muted-foreground">
                            / {assignment.maxPoints ?? "—"} pts
                        </p>
                    )}
                </div>
            </div>

            {/* ── Filters ───────────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar estudiante..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <div className="flex gap-1 border rounded-lg p-1 bg-muted/20 h-10">
                    {(["all", "graded", "ungraded", "missing"] as FilterStatus[]).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={cn(
                                "px-3 py-1 text-xs rounded-md transition-colors font-medium",
                                filter === f
                                    ? "bg-background shadow-sm text-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {f === "all" && "Todos"}
                            {f === "graded" && "Calificados"}
                            {f === "ungraded" && "Pendientes"}
                            {f === "missing" && "Sin entregar"}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Table ─────────────────────────────────────────────────────── */}
            <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/30 text-xs text-muted-foreground font-medium">
                                <th className="px-4 py-3 text-left">
                                    <button
                                        onClick={() => toggleSort("student")}
                                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                                    >
                                        Estudiante
                                        <SortIcon field="student" />
                                    </button>
                                </th>
                                <th className="px-4 py-3 text-left">Estado</th>
                                <th className="px-4 py-3 text-left">
                                    <button
                                        onClick={() => toggleSort("submittedAt")}
                                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                                    >
                                        Última entrega
                                        <SortIcon field="submittedAt" />
                                    </button>
                                </th>
                                <th className="px-4 py-3 text-center">
                                    <button
                                        onClick={() => toggleSort("attempts")}
                                        className="flex items-center gap-1 hover:text-foreground transition-colors mx-auto"
                                    >
                                        Intentos
                                        <SortIcon field="attempts" />
                                    </button>
                                </th>
                                <th className="px-4 py-3 text-left">
                                    <button
                                        onClick={() => toggleSort("grade")}
                                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                                    >
                                        Calificación
                                        <SortIcon field="grade" />
                                    </button>
                                </th>
                                <th className="px-4 py-3" />
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-4 py-12 text-center text-muted-foreground"
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <Search className="h-8 w-8 opacity-20" />
                                            <p className="text-sm">
                                                No se encontraron resultados
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((row) => (
                                    <SubmissionRow
                                        key={row.student.id}
                                        row={row}
                                        maxScore={Number(assignment.maxPoints) ?? 100}
                                        courseId={courseId!}
                                        assignmentId={assignmentId!}
                                        onGrade={handleGrade}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {filtered.length > 0 && (
                    <div className="px-4 py-2.5 border-t bg-muted/10 text-xs text-muted-foreground">
                        Mostrando {filtered.length} de {rows.length} estudiantes
                    </div>
                )}
            </div>
        </div>
    );
}