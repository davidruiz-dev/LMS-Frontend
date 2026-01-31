import { moduleSchema, type ModuleFormData } from "@/features/courses/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { type FC } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateModule } from "@/features/courses/hooks/use-modules";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    courseId: string;
}

const ModuleForm: FC<Props> = ({ isOpen, onClose, courseId }) => {
    const moduleForm = useForm<ModuleFormData>({
        resolver: zodResolver(moduleSchema),
        defaultValues: {
            title: '',
            description: '',
        },
        mode: 'onChange',
    })

    const createModule = useCreateModule();

    const onSubmit = (values: ModuleFormData) => {
        try {
            const response = createModule.mutate({ courseId, module: values });
            return response
        } catch (error) {
            console.error('Error al guardar el modulo:', error);
            throw error;
        }
    }


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

                        <Button disabled={createModule.isPending}>{createModule.isPending ? 'Guardando...' : 'Guardar'}</Button>
                    </form>
                </Form>
            </DialogContent>

        </Dialog>
    )
}

export default ModuleForm