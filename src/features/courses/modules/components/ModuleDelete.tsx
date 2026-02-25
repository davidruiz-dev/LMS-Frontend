import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useDeleteModule } from "@/features/courses/hooks/use-modules";
import { showError, showSuccess } from "@/helpers/alerts";
import { Trash2Icon } from "lucide-react";
import type { FC } from "react";

interface Props {
    courseId: string;
    moduleId: string;
    isOpen: boolean;
    onClose: () => void;
}

const ModuleDeleteDialog: FC<Props> = ({ isOpen, onClose, courseId, moduleId }) => {
    const { mutate: deleteModule, isPending } = useDeleteModule(courseId);
    const handleDeleteModule = async () => {
        deleteModule(moduleId,{
            onSuccess: () => showSuccess("Módulo eliminado correctamente"),
            onError: () => showError("Error al eliminar el módulo")
        })
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent size="sm">
                <AlertDialogHeader>
                    <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                        <Trash2Icon />
                    </AlertDialogMedia>
                    <AlertDialogTitle>¿Eliminar módulo?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción no se puede deshacer.
                        Se eliminará todo el contenido del módulo.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending} variant="outline" onClick={onClose}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction variant="destructive" disabled={isPending} onClick={handleDeleteModule}>
                        {isPending ? "Eliminando..." : "Eliminar"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ModuleDeleteDialog