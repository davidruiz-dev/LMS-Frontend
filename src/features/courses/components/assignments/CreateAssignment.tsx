import { DatePicker } from "@/components/date-picker";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useCreateAssignment } from "@/features/courses/hooks/use-assignments";
import { AssignmentSchema, type AssignmentFormDataCreate } from "@/features/courses/schemas/assignment.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { BadgeCheckIcon, Unlock } from "lucide-react";
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
            allowLateSubmissions: false,
            maxAttempts: '2',
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
            <DialogContent className="sm:max-w-2xl h-auto max-h-[700px] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Nueva tarea</DialogTitle>
                    <DialogDescription>Completa todos los campos requeridos.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form className='space-y-2' onSubmit={form.handleSubmit(onSubmit)}>
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <FormField
                                control={form.control}
                                name='maxPoints'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Puntaje máximo</FormLabel>
                                        <FormControl>
                                            <Input type="number" max={100} min={0} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='maxAttempts'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Intentos posibles</FormLabel>
                                        <FormControl>
                                            <Input type="number" max={100} min={0} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                                name='dueDate'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fecha entrega</FormLabel>
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
                            name='availableUntil'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Disponible hasta</FormLabel>
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

                        <Separator />

                        <div className="space-y-1">
                            <Item variant={'outline'}>
                                <ItemMedia>
                                    <BadgeCheckIcon className="size-5" />
                                </ItemMedia>
                                <ItemContent>
                                    <ItemTitle>Permitir entregas tardías</ItemTitle>
                                    <ItemDescription>Podrás modificar la fecha de entrega después de la fecha establecida por tí.</ItemDescription>
                                </ItemContent>
                                <ItemContent>
                                    <FormField
                                        control={form.control}
                                        name='allowLateSubmissions'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="sr-only">Allow late submissions</FormLabel>
                                                <FormControl>
                                                    <Switch checked={field.value}
                                                        onCheckedChange={field.onChange} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </ItemContent>
                            </Item>

                            <Item variant={'outline'}>
                                <ItemMedia>
                                    <Unlock className="size-5" />
                                </ItemMedia>
                                <ItemContent>
                                    <ItemTitle>Publicar</ItemTitle>
                                    <ItemDescription>Todos tus alumnos podrán acceder a este recurso.</ItemDescription>
                                </ItemContent>
                                <ItemContent>
                                    <FormField
                                        control={form.control}
                                        name='isPublished'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="sr-only">Publicar</FormLabel>
                                                <FormControl>
                                                    <Switch checked={field.value}
                                                        onCheckedChange={field.onChange} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </ItemContent>
                            </Item>
                        </div>
                        <DialogFooter>
                            <Button variant={"outline"} type="reset" onClick={() => onOpenChange(false)}>Cancelar</Button>
                            <Button type="submit" disabled={createAssignment.isPending || !form.formState.isValid}>{createAssignment.isPending ? 'Guardando...' : 'Guardar tarea'}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
