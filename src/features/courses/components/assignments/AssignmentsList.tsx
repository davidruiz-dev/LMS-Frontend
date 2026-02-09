import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Skeleton } from "@/components/ui/skeleton";
import CreateAssignment from "@/features/courses/components/assignments/CreateAssignment";
import { useAssignments } from "@/features/courses/hooks/use-assignments";
import { AlertCircleIcon, ClipboardList, MoreVertical, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { ROUTES } from "@/shared/constants/routes";
import { Separator } from "@/components/ui/separator";

export default function AssignmentsList() {
    const { id } = useParams();
    if (!id) return null;
    const { data: assignments, isLoading, error } = useAssignments(id);
    const [openModal, setOpenModal] = useState(false);
    const navigate = useNavigate()
    const toggle = () => setOpenModal(prev => !prev)

    if (error) {
        <Alert variant="destructive" className="max-w-md">
            <AlertCircleIcon />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
                Error al obtener asignaciones del curso, intentalo denuevo más tarde.
            </AlertDescription>
        </Alert>
    }

    if (isLoading) {
        return (
            <div className="flex w-full flex-col gap-7">
                <div className="flex flex-col gap-3">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-6 w-72" />
                </div>
                <div className="flex flex-col gap-2">
                    {[1, 2, 3, 4, 5, 6, 7].map((index) => (
                        <Skeleton key={index} className="h-16 w-full" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4 flex flex-col items-end">
            <Button onClick={toggle}><Plus /> Agregar tarea</Button>

            <div className="flex w-full flex-col gap-3">
                {assignments?.map((a) => (
                    <Item variant="outline">
                        <ItemMedia variant="icon">
                            <ClipboardList />
                        </ItemMedia>
                        <ItemContent>
                            <ItemTitle>{a.name}</ItemTitle>
                            <ItemDescription className="truncate">{a.description}</ItemDescription>
                        </ItemContent>
                        <ItemContent>
                            <ItemDescription>
                                <span>cierra: </span>
                                {new Date(a.dueDate).toLocaleString("es-ES", {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                })}
                            </ItemDescription>
                        </ItemContent>
                        <ItemActions>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                    <DropdownMenuItem
                                        onClick={() => navigate(ROUTES.COURSE_ASSIGNMENT(id, a.id))}
                                    >
                                        Ver contenido
                                    </DropdownMenuItem>
                                    <Separator/>
                                    <DropdownMenuItem
                                        variant="destructive"
                                    >
                                        Eliminar
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </ItemActions>
                    </Item>
                ))}
            </div>


            <CreateAssignment courseId={id} open={openModal} onOpenChange={setOpenModal} />
        </div>
    )
}
