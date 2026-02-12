import { DatePicker } from "@/components/date-picker";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateAssignment } from "@/features/courses/hooks/use-assignments";
import { AssignmentSchema, type AssignmentFormDataCreate } from "@/features/courses/schemas/assignment.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface Props {
    courseId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CreateAssignment({ courseId, open, onOpenChange }: Props) {
    const createAssignment = useCreateAssignment(courseId);
    const form = useForm<AssignmentFormDataCreate>({
        resolver: zodResolver(AssignmentSchema),
        defaultValues: {
            points: '0',
            isPublished: false,
        },
        mode: 'onChange'
    })

    const onSubmit = async (values: AssignmentFormDataCreate) => {
        await createAssignment.mutateAsync(values);
        form.reset();
        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Nueva tarea</DialogTitle>
                    <DialogDescription>Completa todos los campos requeridos.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form className='space-y-3' onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='description'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descripción</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='points'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Puntaje</FormLabel>
                                    <FormControl>
                                        <Input type="number" max={100} min={0} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-3">
                            <FormField
                            control={form.control}
                            name='availableFrom'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Desde</FormLabel>
                                    <FormControl>
                                        <DatePicker
                                            date={field.value}
                                            setDate={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='availableUntil'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Hasta</FormLabel>
                                    <FormControl>
                                        <DatePicker
                                            date={field.value}
                                            setDate={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        </div>
                        <FormField
                            control={form.control}
                            name='dueDate'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Final</FormLabel>
                                    <FormControl>
                                        <DatePicker
                                            date={field.value}
                                            setDate={field.onChange}
                                        />
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

                        <DialogFooter>
                            <Button disabled={createAssignment.isPending || !form.formState.isValid}>{createAssignment.isPending ? 'Guardando...' : 'Guardar'}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
