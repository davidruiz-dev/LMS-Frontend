import { useCourse, usePublishCourse } from "@/features/courses/hooks/use-courses";
import { useNavigate, useParams } from "react-router-dom";
import { AvatarUser } from "@/components/AvatarUser";
import { useUpcomingAssignments } from "@/features/courses/hooks/use-assignments";
import { Calendar, Users, BookOpen, Award, Heart, ChevronRight, AlertCircle, FileText, Bell, Settings, Play, Layers, MessageSquare, Zap, BookMarked, Maximize2, CheckCircle, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/shared/constants/routes";
import { useCourseAccess } from "@/features/courses/hooks/use-course-access";
import { getDistanceToNow } from "@/shared/utils/getDistanceToNow";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// Componente para Quick Access Grid
const QuickAccessCard = ({
    icon: Icon,
    label,
    count,
    onClick,
    color = "blue",
    badge
}: {
    icon: any,
    label: string,
    count?: number,
    onClick: () => void,
    color?: 'blue' | 'green' | 'purple' | 'orange' | 'pink',
    badge?: string
}) => {
    const colors = {
        blue: "bg-blue-50 text-blue-600 hover:bg-blue-100",
        green: "bg-green-50 text-green-600 hover:bg-green-100",
        purple: "bg-purple-50 text-purple-600 hover:bg-purple-100",
        orange: "bg-orange-50 text-orange-600 hover:bg-orange-100",
        pink: "bg-pink-50 text-pink-600 hover:bg-pink-100",
    };

    return (
        <div
            className={`p-4 rounded-lg cursor-pointer transition-all ${colors[color]} group`}
            onClick={onClick}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/50 rounded-lg group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-sm font-medium">{label}</p>
                        {count !== undefined && (
                            <p className="text-2xl font-bold">{count}</p>
                        )}
                    </div>
                </div>
                {badge && (
                    <Badge variant="secondary" className="text-xs">
                        {badge}
                    </Badge>
                )}
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
        </div>
    );
};

// Componente para Activity Feed
const ActivityItem = ({
    icon: Icon,
    title,
    description,
    time,
    type = "info"
}: {
    icon: any,
    title: string,
    description: string,
    time: string,
    type?: 'info' | 'success' | 'warning' | 'error'
}) => {
    const colors = {
        info: "bg-blue-50 text-blue-600",
        success: "bg-green-50 text-green-600",
        warning: "bg-yellow-50 text-yellow-600",
        error: "bg-red-50 text-red-600",
    };

    return (
        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <div className={`p-2 rounded-full ${colors[type]} flex-shrink-0`}>
                <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{title}</p>
                <p className="text-sm text-muted-foreground">{description}</p>
                <p className="text-xs text-muted-foreground mt-1">{time}</p>
            </div>
        </div>
    );
};

const CoursePage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    if (!id) return null;

    const { data: courseDetail, isLoading, error } = useCourse(id);
    const { data: upcomingAssignments = [] } = useUpcomingAssignments(id);
    const publishCourse = usePublishCourse();
    const access = useCourseAccess(id);
    const [showImagePreview, setShowImagePreview] = useState(false);

    const onPublish = () => {
        publishCourse.mutate(id, {
            onSuccess: () => {
                toast.success("Curso publicado exitosamente");
            },
            onError: () => {
                toast.error("Error al publicar el curso");
            }
        });
    };

    // Estadísticas calculadas
    const stats = useMemo(() => {
        if (!courseDetail) return null;
        return {
            totalStudents: courseDetail.enrollmentsCount || 0,
            totalModules: courseDetail.modulesCount || 0,
            totalAssignments: courseDetail.assignmentsCount || 0,
        };
    }, [courseDetail]);

    // Actividades recientes (mock)
    const recentActivities = [
        {
            icon: Users,
            title: "Nuevo estudiante inscrito",
            description: "María González se ha inscrito al curso",
            time: "Hace 2 horas",
            type: "success" as const
        },
        {
            icon: FileText,
            title: "Tarea entregada",
            description: "Carlos Ruiz entregó el proyecto final",
            time: "Hace 5 horas",
            type: "info" as const
        },
        {
            icon: MessageSquare,
            title: "Nuevo comentario",
            description: "Ana Martínez comentó en la lección 3",
            time: "Hace 1 día",
            type: "warning" as const
        },
    ];

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-10 w-32" />
                </div>
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-full xl:col-span-8 space-y-4">
                        <Skeleton className="w-full h-80 rounded-md" />
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-24 w-full" />
                        <div className="grid grid-cols-2 gap-4">
                            <Skeleton className="h-32 w-full" />
                            <Skeleton className="h-32 w-full" />
                        </div>
                    </div>
                    <div className="col-span-full xl:col-span-4 space-y-4">
                        <Skeleton className="h-64 w-full rounded-lg" />
                        <Skeleton className="h-48 w-full rounded-lg" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !courseDetail) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <AlertCircle className="w-16 h-16 text-red-500" />
                <h2 className="text-2xl font-bold text-gray-700">Error al cargar el curso</h2>
                <p className="text-gray-500 text-center max-w-md">
                    {error instanceof Error ? error.message : "No se pudo cargar la información del curso"}
                </p>
                <Button onClick={() => navigate(ROUTES.COURSES)} variant="outline">
                    Volver a cursos
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header con Thumbnail - Versión mejorada */}
            <div className="relative">
                {/* Imagen de fondo (thumbnail) */}
                <div className="relative h-[300px] md:h-[300px] lg:h-[350px] w-full overflow-hidden rounded-xl">
                    <img
                        src={courseDetail.imageUrl}
                        alt={courseDetail.name}
                        className="w-full h-full object-cover"
                    />

                    {/* Overlay gradiente para mejorar legibilidad */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/40 to-transparent" />
                    <div className="absolute inset-0 bg-linear-to-r from-black/50 to-transparent" />

                    {/* Botón para ver imagen completa */}
                    <button
                        onClick={() => setShowImagePreview(true)}
                        className="absolute bottom-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-lg text-white transition-colors backdrop-blur-sm"
                    >
                        <Maximize2 className="w-4 h-4" />
                    </button>

                    {/* Contenido superpuesto */}
                    <div className="absolute top-10 left-0 right-0 p-6 md:p-8 lg:p-10 text-white">
                        <div className="max-w-7xl mx-auto">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div className="space-y-3 max-w-3xl">

                                    {/* Título */}
                                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight drop-shadow-lg first-letter:capitalize">
                                        {courseDetail.name}
                                    </h1>

                                    {/* Descripción corta */}
                                    {courseDetail.short_description && (
                                        <p className="text-white/90 text-sm md:text-base max-w-2xl line-clamp-2 drop-shadow first-letter:capitalize">
                                            {courseDetail.short_description}
                                        </p>
                                    )}

                                    {/* Métricas */}
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-white/90">
                                        <span className="flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            {stats?.totalStudents || 0} estudiantes
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <BookOpen className="w-4 h-4" />
                                            {stats?.totalModules || 0} módulos
                                        </span>
                                        {courseDetail.gradeLevel && (
                                            <span className="flex items-center gap-1 capitalize">
                                                <Award className="w-4 h-4" />
                                                {courseDetail.gradeLevel.name}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Acciones */}
                                <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                                    {access?.isOwner ? (
                                        <>
                                            <Button
                                                onClick={onPublish}
                                                disabled={courseDetail.status === 'published'}
                                                variant="secondary"
                                                className="bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-sm"
                                            >
                                                {courseDetail.status === 'published' ? (
                                                    <>
                                                        <CheckCircle className="w-4 h-4 mr-2" />
                                                        Publicado
                                                    </>
                                                ) : (
                                                    <>
                                                        <Megaphone className="w-4 h-4 mr-2" />
                                                        Publicar
                                                    </>
                                                )}
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                className="bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-sm"
                                                onClick={() => { }}
                                            >
                                                <Settings className="w-4 h-4 mr-2" />
                                                Configurar
                                            </Button>
                                        </>
                                    ) : (
                                        <Button
                                            variant="secondary"
                                            className="bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-sm"
                                            onClick={() => navigate(ROUTES.COURSE_MODULES(id))}
                                        >
                                            <Play className="w-4 h-4 mr-2" />
                                            Continuar curso
                                        </Button>
                                    )}

                                    <Button
                                        variant="secondary"
                                        className="bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-sm"
                                        size="icon"
                                        onClick={() => toast.success("Agregado a favoritos")}
                                    >
                                        <Heart className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-12 gap-6">
                {/* Columna principal */}
                <div className="col-span-full xl:col-span-8 space-y-6">
                    {/* Descripción */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BookMarked className="w-5 h-5" />
                                Acerca de este curso
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div
                                className="text-muted-foreground prose prose-sm max-w-none dark:prose-invert first-letter:capitalize"
                                dangerouslySetInnerHTML={{ __html: courseDetail.description }}
                            />
                        </CardContent>
                    </Card>

                    {/* Quick Access Grid - Navegación principal */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <QuickAccessCard
                            icon={Layers}
                            label="Módulos"
                            count={stats?.totalModules || 0}
                            onClick={() => navigate(ROUTES.COURSE_MODULES(id))}
                            color="blue"
                            badge={stats?.totalModules ? `${stats.totalModules} módulos` : undefined}
                        />
                        <QuickAccessCard
                            icon={FileText}
                            label="Tareas"
                            count={stats?.totalAssignments || 0}
                            onClick={() => navigate(ROUTES.COURSE_ASSIGNMENTS(id))}
                            color="green"
                            badge={upcomingAssignments?.length ? `${upcomingAssignments.length} próximas` : undefined}
                        />
                        <QuickAccessCard
                            icon={Users}
                            label="Estudiantes"
                            count={stats?.totalStudents || 0}
                            onClick={() => navigate(ROUTES.COURSE_MEMBERS(id))}
                            color="purple"
                        />

                    </div>

                    {/* Instructor */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Award className="w-5 h-5" />
                                Tu Instructor
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <AvatarUser
                                        src={courseDetail.instructor.avatarUrl}
                                        firstName={courseDetail.instructor.firstName}
                                        lastName={courseDetail.instructor.lastName}
                                    />
                                    <div>
                                        <p className="font-medium text-lg hover:underline cursor-pointer" onClick={()=>navigate(ROUTES.USER_PROFILE(courseDetail.instructorId))}>
                                            {courseDetail.instructor.firstName} {courseDetail.instructor.lastName}
                                        </p>
                                        <p className="text-sm text-muted-foreground">{courseDetail.instructor.email}</p>
                                    </div>
                                </div>
                                {courseDetail.instructor.biography && (
                                    <p className="text-muted-foreground line-clamp-2">
                                        {courseDetail.instructor.biography}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                </div>

                {/* Sidebar */}
                <div className="col-span-full xl:col-span-4 space-y-4">
                    {/* Próximas tareas */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Bell className="w-4 h-4" />
                                Próximas tareas
                            </CardTitle>
                            <Button
                                variant="link"
                                className="text-sm h-auto p-0"
                                onClick={() => navigate(ROUTES.COURSE_ASSIGNMENTS(id))}
                            >
                                ver todas
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {upcomingAssignments?.length > 0 ? (
                                <div className="space-y-2">
                                    {upcomingAssignments.slice(0, 3).map((assignment) => (
                                        <div
                                            key={assignment.id}
                                            className="p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                                            onClick={() => navigate(ROUTES.COURSE_ASSIGNMENT(id, assignment.id))}
                                        >
                                            <div className="space-y-1">
                                                <p className="font-medium text-sm line-clamp-1">{assignment.name}</p>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>
                                                        {new Date(assignment.dueDate).toLocaleDateString()}
                                                        {getDistanceToNow(new Date(assignment.dueDate)) &&
                                                            ` (${getDistanceToNow(new Date(assignment.dueDate))})`
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {upcomingAssignments.length > 3 && (
                                        <Button
                                            variant="ghost"
                                            className="w-full text-xs"
                                            onClick={() => navigate(ROUTES.COURSE_ASSIGNMENTS(id))}
                                        >
                                            Ver {upcomingAssignments.length - 3} tareas más
                                            <ChevronRight className="w-3 h-3 ml-1" />
                                        </Button>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-6 text-center">
                                    <Calendar className="w-8 h-8 text-muted-foreground mb-2" />
                                    <p className="text-sm text-muted-foreground">No hay tareas próximas</p>
                                    <p className="text-xs text-muted-foreground">Todas las tareas están completadas</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Actividad reciente */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Zap className="w-4 h-4" />
                                Actividad reciente
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="max-h-64 overflow-y-auto">
                            {access?.isOwner ? (
                                <div className="space-y-1">
                                    {recentActivities.map((activity, index) => (
                                        <ActivityItem key={index} {...activity} />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-6 text-center">
                                    <MessageSquare className="w-8 h-8 text-muted-foreground mb-2" />
                                    <p className="text-sm text-muted-foreground">Sin actividad reciente</p>
                                    <p className="text-xs text-muted-foreground">Comienza a explorar el curso</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Acciones de administración */}
                    {access?.isOwner && (
                        <Card>
                            <CardContent className="pt-4 space-y-2">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => { }}
                                >
                                    <Settings className="w-4 h-4 mr-2" />
                                    Editar curso
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => {
                                        // Implementar archivar curso
                                        toast.warning("Función de archivar en desarrollo");
                                    }}
                                >
                                    <AlertCircle className="w-4 h-4 mr-2" />
                                    Archivar curso
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Modal para vista previa de imagen */}
            <Dialog open={showImagePreview} onOpenChange={setShowImagePreview}>
                <DialogContent className="max-w-4xl p-0  border-none">
                    <div className="relative bg-black/95">
                        <img
                            src={courseDetail.imageUrl}
                            alt={courseDetail.name}
                            className="w-full h-auto max-h-[100vh] object-contain"
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CoursePage;