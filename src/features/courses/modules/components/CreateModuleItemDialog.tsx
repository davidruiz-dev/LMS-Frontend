import { moduleItemSchema, type ModuleItemFormData } from "@/features/courses/modules/schemas/module.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { type FC } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateModuleItem } from "@/features/courses/hooks/use-modules";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useAssignments } from "@/features/courses/hooks/use-assignments";
import { ModuleItemType } from "@/features/courses/modules/types/module.types";

interface Props {
    moduleId: string;
    courseId: string
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const CreateModuleItemDialog: FC<Props> = ({ open, onOpenChange, moduleId, courseId }) => {
    const moduleForm = useForm<ModuleItemFormData>({
        resolver: zodResolver(moduleItemSchema),
        defaultValues: {
            title: '',
            type: 'page',
            published: false,
            contentId: ''
        },
        mode: 'onChange',
    })

    const createItem = useCreateModuleItem(courseId, moduleId);
    const { data: assignments } = useAssignments(courseId);

    const typeWatch = moduleForm.watch('type');

    const onSubmit = async (values: ModuleItemFormData) => {
        await createItem.mutateAsync(values);
        moduleForm.reset();
        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
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

                        <div className="flex items-end gap-3">
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

                            {typeWatch === 'external_url' && (
                                <FormField
                                    control={moduleForm.control}
                                    name='content'
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel hidden>URL externa</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="url"
                                                    {...field}
                                                    placeholder="https://example.com"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            )}

                            {typeWatch === 'file' && (
                                <FormItem>
                                    <FormLabel hidden>File</FormLabel>
                                    <FormControl>
                                        <Input type="file" />
                                    </FormControl>
                                </FormItem>
                            )}

                            {typeWatch === 'assignment' && (
                                <FormField
                                    control={moduleForm.control}
                                    name="contentId"
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="seleccionar" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {assignments?.map((assignment) => (
                                                    <SelectItem
                                                        key={assignment.id}
                                                        value={assignment.id}
                                                    >
                                                        {assignment.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            )}
                        </div>

                        <Separator />

                        <FormField
                            control={moduleForm.control}
                            name="published"
                            render={({ field }) => (
                                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Publicar</FormLabel>
                                        <FormDescription>
                                            Vuelve público este contenido para tus alumnos.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4"
                                            checked={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button disabled={createItem.isPending || !moduleForm.formState.isValid}>{createItem.isPending ? 'Guardando...' : 'Guardar'}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>

        </Dialog>
    )
}

export default CreateModuleItemDialog