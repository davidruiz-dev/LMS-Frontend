import CourseCard from '@/features/courses/components/CourseCard';
import { useStudentDashboard } from '../hooks/useDashboard';
import { useAuth } from '@/app/providers/AuthProvider';
import { Award, CalendarOff, CheckCircle, Clock } from 'lucide-react';
import { StatCard } from './StatCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const StudentDashboard = () => {
    const { user } = useAuth();
    const { data: studentDashboard } = useStudentDashboard();

    if (!studentDashboard) return null;

    const { stats, courses } = studentDashboard;

    return (
        <div className='space-y-6'>
            <Tabs defaultValue='courses'>
                <TabsList>
                    <TabsTrigger value='overview'>Resumen</TabsTrigger>
                    <TabsTrigger value='courses'>Courses</TabsTrigger>
                </TabsList>
                <TabsContent value='overview'>
                    <div className='space-y-4'>
                        <h1 className="text-3xl font-bold tracking-tight">¡Bienvenido {`${user?.firstName} ${user?.lastName}!`}</h1>
                        <p className="text-muted-foreground">
                            {stats.pendingAssignments === 0
                                ? '¡Excelente trabajo! Todas tus tareas están completas.'
                                : `Tienes ${stats.pendingAssignments || 0} tareas pendientes por completar.`}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:grid-cols-4">
                            <StatCard
                                icon={<CheckCircle className="h-5 w-5" />}
                                label="Tareas Completadas"
                                value={`${stats?.submittedAssignments || 0}`}
                                description={`${stats?.totalAssignments || 0} totales`}
                                progress={stats.totalAssignments > 0 ? ((stats.submittedAssignments / stats.totalAssignments) * 100) : 0}
                                color="green"
                            />
                            <StatCard
                                icon={<Award className="h-5 w-5" />}
                                label="Tareas Calificadas"
                                value={stats?.gradedAssignments || 0}
                                description={`${stats?.totalAssignments || 0} totales`}
                                progress={stats.totalAssignments > 0 ? ((stats.gradedAssignments / stats.totalAssignments) * 100) : 0}
                                color="purple"
                            />
                            <StatCard
                                icon={<Clock className="h-5 w-5" />}
                                label="Pendientes"
                                value={stats?.pendingAssignments || 0}
                                description={stats?.pendingAssignments === 0 ? "¡Todo al día!" : "Por entregar"}
                                color="yellow"
                            />
                            <StatCard
                                icon={<CalendarOff className="h-5 w-5" />}
                                label="Tareas atrasadas"
                                value={stats?.overdueAssignments || 0}
                                description={stats?.overdueAssignments === 0 ? "¡Todo al día! No debes tareas" : "Tareas vencidas sin completar."}
                                color="red"
                            />
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value='courses'>
                    <div className='space-y-2'>
                        <h1 className="text-3xl font-bold tracking-tight">Mis Cursos</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                            {courses.map((course) => (
                                <CourseCard key={course.id} course={course} />
                            ))}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

        </div>
    )
}

export default StudentDashboard;