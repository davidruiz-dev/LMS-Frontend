import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAssignment, useAssignmentPublish, useAssignmentUnpublish } from "@/features/courses/hooks/use-assignments";
import { BookOpen, Calendar, ChevronRight, Clock, Lock, Unlock, User } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom"

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

    if (!assignment) return null;

    return (
        <div className="">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <header className="mb-8 ">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold">{assignment.name}</h1>
                            <p className="text-sm text-muted-foreground">
                                Editado {new Date(assignment.updateAt).toLocaleString("es-ES", {
                                    dateStyle: "medium",
                                })}
                            </p>
                        </div>

                        {assignment.isPublished ? (
                            <Button
                                onClick={() => onUnpublish(assignmentId)}
                                size={"lg"}
                            >
                                <Lock /> Despublicar
                            </Button>
                        ) : (
                            <Button
                                onClick={() => onPublish(assignmentId)}
                                size={"lg"}
                            >
                                <Unlock /> Publicar
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Columna izquierda: Contenido principal */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Tarjeta de información del assignment */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Descripción</CardTitle>
                                <CardDescription className="mt-2">
                                    <div className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-1.5 text-gray-500" />
                                        <p>Fecha límite: {formatDate(assignment.dueDate)} a las 23:59</p>
                                    </div>
                                </CardDescription>
                            </CardHeader>

                            <CardContent>
                                <div className="prose max-w-none text-gray-700 dark:text-gray-300">
                                    {assignment.description}
                                </div>
                            </CardContent>
                        </Card>



                    </div>


                </div>

            </div>
        </div>
    )
}
