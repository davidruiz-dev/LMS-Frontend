import { moduleItemSchema, type ModuleItemFormData } from "@/features/courses/schemas/module.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { type FC } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateModuleItem } from "@/features/courses/hooks/use-modules";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ModuleItemType } from "@/features/courses/types/course.types";
import { showError, showSuccess } from "@/helpers/alerts";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    moduleId: string;
}

const ModuleItemForm: FC<Props> = ({ isOpen, onClose, moduleId }) => {
    const moduleForm = useForm<ModuleItemFormData>({
        resolver: zodResolver(moduleItemSchema),
        defaultValues: {
            title: '',
            type: 'page',
            published: false,
        },
        mode: 'onChange',
    })

    const { mutate, isPending } = useCreateModuleItem();

    const onSubmit = (values: ModuleItemFormData) => {
        mutate({ moduleId, moduleItem: values },
            {
                onSuccess: () => {
                    moduleForm.reset();
                    onClose();
                    showSuccess('Contenido agregado correctamente')
                },
                onError: (error) => {
                    showError('Error al agregar contenido al módulo')
                    console.error(error);
                }
            })
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>

            <DialogContent>
                <Form {...moduleForm}>
                    <form className='space-y-4' onSubmit={moduleForm.handleSubmit(onSubmit)}>
                        <DialogHeader>
                            <DialogTitle>Agregar Contenido</DialogTitle>
                            <DialogDescription>Completa todos los campos requeridos.</DialogDescription>
                        </DialogHeader>
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
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipo de contenido</FormLabel>
                                    <FormControl>
                                        <Select {...field} onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="selecciona" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={ModuleItemType.ASSIGNMENT}>Assignment</SelectItem>
                                                <SelectItem value={ModuleItemType.DISCUSSION}>Discussion</SelectItem>
                                                <SelectItem value={ModuleItemType.FILE}>File</SelectItem>
                                                <SelectItem value={ModuleItemType.PAGE}>Page</SelectItem>
                                                <SelectItem value={ModuleItemType.QUIZ}>Quiz</SelectItem>
                                                <SelectItem value={ModuleItemType.EXTERNAL_URL}>External URL</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <br />
                        <FormField
                            control={moduleForm.control}
                            name='published'
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
                        <DialogFooter>
                            <Button disabled={isPending || !moduleForm.formState.isValid}>{isPending ? 'Guardando...' : 'Guardar'}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>

        </Dialog>
    )
}

export default ModuleItemForm