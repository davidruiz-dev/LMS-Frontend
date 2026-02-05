import { moduleSchema, type ModuleFormData } from "@/features/courses/schemas/module.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { type FC } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateModule } from "@/features/courses/hooks/use-modules";
import { showError, showSuccess } from "@/helpers/alerts";

interface ModuleFormProps {
    isOpen: boolean;
    onClose: () => void;
    courseId: string;
}


const ModuleForm: FC<ModuleFormProps> = ({ isOpen, onClose, courseId }) => {
    const moduleForm = useForm<ModuleFormData>({
        resolver: zodResolver(moduleSchema),
        mode: 'onChange',
    });

    const { mutate, isPending } = useCreateModule();

    const onSubmit = (values: ModuleFormData) => mutate({ courseId, module: values }, {
        onSuccess: () => {
            onClose(),
                moduleForm.reset();
            showSuccess("Módulo creado exitosamente");
        },
        onError: (error) => {
            showError("Error al crear módulo");
            console.log(error)
        }
    });

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Agregar módulo</DialogTitle>
                    <DialogDescription>Completa todos los campos requeridos.</DialogDescription>
                </DialogHeader>
                <Form {...moduleForm}>
                    <form className='space-y-4' onSubmit={moduleForm.handleSubmit(onSubmit)}>
                        <FormField
                            control={moduleForm.control}
                            name='title'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Título</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Button disabled={isPending}>{isPending ? 'Guardando...' : 'Guardar'}</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default ModuleForm