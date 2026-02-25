import { Button } from "@/components/ui/button";
import { useAssignment, useAssignmentPublish, useAssignmentUnpublish } from "@/features/courses/hooks/use-assignments";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowDownCircle, ArrowUpCircle, ClipboardClock, ClipboardList, PencilLine, Repeat1 } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom"
import { Separator } from "@/components/ui/separator";
import { useCourseAccess } from "@/features/courses/hooks/use-course-access";

export default function AssignmentPage() {
    const { id: courseId, assignmentId } = useParams<string>();

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
    const isOwner = access?.isOwner

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
                            <ArrowDownCircle/> Despublicar
                        </Button>
                    )}
                    {isOwner && !assignment.isPublished && (
                        <Button onClick={() => onPublish(assignmentId)} size={"lg"}>
                            <ArrowUpCircle/> Publicar
                        </Button>
                    )}

                    {/* <div className="flex items-center space-x-4">
                            <Badge variant={timeLeft?.overdue ? "destructive" : "default"}>
                                {timeLeft?.overdue ? 'VENCIDO' : `${assignment.points} puntos`}
                            </Badge>

                            <div className={`flex items-center px-3 py-1.5 rounded-full ${timeLeft?.overdue ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                                <Clock className="h-4 w-4 mr-1.5" />
                                <span className="text-sm font-medium">
                                    {timeLeft?.overdue ? 'Vencido' :
                                        `${timeLeft?.days}d ${timeLeft?.hours}h ${timeLeft?.minutes}m`}
                                </span>
                            </div>
                        </div> */}
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

                    <div className="mt-10">
                        <h1 className="font-bold text-xl">Descripción</h1>
                        <p className="">
                            {assignment.description}
                        </p>
                    </div>
                </TabsContent>
                <TabsContent value="questions">

                </TabsContent>
            </Tabs>


        </div>
    )
}
