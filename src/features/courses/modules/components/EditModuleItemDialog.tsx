import { useForm } from "react-hook-form";
import { useUpdateModuleItem } from "../../hooks/use-modules";
import { ModuleItemType, type ModuleItem } from "../types/module.types";
import { moduleItemSchema, type ModuleItemFormData } from "../schemas/module.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAssignments } from "../../hooks/use-assignments";
import { useQuizzes } from "../../quizzes/hooks/use-quizzes";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface EditModuleItemDialogProps {
    courseId: string;
    moduleId: string;
    item: ModuleItem;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function EditModuleItemDialog({ courseId, moduleId, item, open, onOpenChange }: EditModuleItemDialogProps) {
    const updateModuleItem = useUpdateModuleItem(courseId, moduleId, item.id);
    // traer data para enlazar con el contenido del módulo
    const { data: assignments } = useAssignments(courseId);
    const { data: quizzes } = useQuizzes(courseId);
    const form = useForm<ModuleItemFormData>({
        resolver: zodResolver(moduleItemSchema),
        defaultValues: {
            title: item.title ?? '',
            type: item.type,
            content: item.content ?? '',
            contentId: item.contentId,
            moduleId: item.moduleId,
            published: item.published ?? false,
        }
    })

    useEffect(() => {
        if (open) {
            form.reset({
                title: item.title ?? '',
                type: item.type,
                content: item.content ?? '',
                contentId: item.contentId,
                moduleId: item.moduleId,
                published: item.published ?? false,
            })
        }
    }, [open, item, form]);

    const typeWatch = form.watch('type');

    const onSubmit = async (data: ModuleItemFormData) => {
        await updateModuleItem.mutateAsync(data);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar contenido del módulo</DialogTitle>
                    <DialogDescription>Modifica el contenido del módulo a tu gusto.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Título</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex items-end gap-3">
                            <FormField
                                control={form.control}
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
                                    control={form.control}
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


                            {typeWatch === 'assignment' && (
                                <FormField
                                    control={form.control}
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

                            {typeWatch === 'quiz' && (
                                <FormField
                                    control={form.control}
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
                                                {quizzes?.map((quiz) => (
                                                    <SelectItem
                                                        key={quiz.id}
                                                        value={quiz.id}
                                                    >
                                                        {quiz.title}
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
                            control={form.control}
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
                            <Button variant={"outline"} type="reset" onClick={() => onOpenChange(false)}>Cancelar</Button>
                            <Button type="submit" disabled={updateModuleItem.isPending || !form.formState.isValid}>{updateModuleItem.isPending ? 'Guardando...' : 'Guardar'}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
