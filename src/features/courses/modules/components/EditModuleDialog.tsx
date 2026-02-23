import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { moduleSchema, type ModuleFormData } from '@/features/courses/modules/schemas/module.schema';
import { useUpdateModule } from '@/features/courses/hooks/use-modules';
import { Checkbox } from '@/components/ui/checkbox';
import type { Module } from '@/features/courses/modules/types/module.types';

interface EditModuleDialogProps {
    courseId: string;
    module: Module;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditModuleDialog({
    courseId,
    module,
    open,
    onOpenChange,
}: EditModuleDialogProps) {
    const updateModule = useUpdateModule(courseId, module.id);

    const form = useForm<ModuleFormData>({
        resolver: zodResolver(moduleSchema),
        defaultValues: {
            title: module.title,
            isPublished: module.isPublished
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                title: module.title,
                isPublished: module.isPublished
            });
        }
    }, [open, module, form]);

    const onSubmit = async (data: ModuleFormData) => {
        await updateModule.mutateAsync(data);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Editar módulo</DialogTitle>
                    <DialogDescription>
                        Modifica la configuración del módulo.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre del módulo</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
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

                        {/* <FormField
                            control={form.control}
                            name="unlockAt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Fecha de desbloqueo</FormLabel>
                                    <FormControl>
                                        <DateTimePicker
                                            value={field.value ? new Date(field.value) : undefined}
                                            onChange={(date) => field.onChange(date?.toISOString() || null)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> */}



                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={updateModule.isPending}>
                                {updateModule.isPending ? 'Guardando...' : 'Guardar cambios'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}