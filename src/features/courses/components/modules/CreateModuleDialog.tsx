import { moduleSchema, type ModuleFormData } from "@/features/courses/schemas/module.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateModule } from "@/features/courses/hooks/use-modules";
import { Checkbox } from "@/components/ui/checkbox";

interface CreateModuleDialogProps {
    courseId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateModuleDialog({ courseId, open, onOpenChange }: CreateModuleDialogProps) {
    const createModule = useCreateModule(courseId);

    const moduleForm = useForm<ModuleFormData>({
        resolver: zodResolver(moduleSchema),
        defaultValues: {
            title: '',
            isPublished: false,
        },
        mode: 'onChange',
    });

    const onSubmit = async (values: ModuleFormData) => {
        await createModule.mutateAsync(values);
        moduleForm.reset();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
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
                        <FormField
                            control={moduleForm.control}
                            name='isPublished'
                            render={({ field }) => (
                                <FormItem className="flex">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormLabel>publicar</FormLabel>
                                </FormItem>
                            )}
                        />
                        <Button disabled={createModule.isPending}>
                            {createModule.isPending ? 'Guardando...' : 'Guardar'}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}