import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemTitle,
} from "@/components/ui/item"
import { Skeleton } from "@/components/ui/skeleton";
import CreateAssignment from "@/features/courses/components/assignments/CreateAssignment";
import { useAssignments } from "@/features/courses/hooks/use-assignments";
import { AlertCircleIcon } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom"

export default function AssignmentsList() {
    const { id } = useParams();
    if (!id) return null;
    const { data: assignments, isLoading, error } = useAssignments(id);
    const [openModal, setOpenModal] = useState(false)
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
        <div>
            {assignments?.length === 0 && (
                <div>
                    no data
                </div>
            )}
            <Button onClick={toggle}>Agregar tarea</Button>

            <div className="flex w-full flex-col gap-3">
                {assignments?.map((a) => (
                    <Item variant="outline">
                        <ItemContent>
                            <ItemTitle>{a.name}</ItemTitle>
                            <ItemDescription>{a.description}</ItemDescription>
                        </ItemContent>
                        <ItemActions>
                            <Button>Action</Button>
                        </ItemActions>
                    </Item>
                ))}
            </div>


            <CreateAssignment courseId={id} open={openModal} onOpenChange={setOpenModal} />
        </div>
    )
}
