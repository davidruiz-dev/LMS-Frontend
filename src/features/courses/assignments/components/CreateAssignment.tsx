import { DatePicker } from "@/components/date-picker";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useCreateAssignment } from "@/features/courses/hooks/use-assignments";
import { AssignmentSchema, type AssignmentFormDataCreate } from "@/features/courses/assignments/schemas/assignment.schema";
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
            <DialogContent className="w-[95vw] !max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Nueva tarea</DialogTitle>
                    <DialogDescription>
                        Configura la información, evaluación y disponibilidad de la tarea.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* Información */}
                        <section className="space-y-4">
                            <div>
                                <h3 className="text-sm font-semibold">
                                    Información de la tarea
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Define el nombre y las instrucciones para tus alumnos.
                                </p>
                            </div>

                            <div className="rounded-lg border p-4 space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombre</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Ej. Tarea de investigación"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Descripción</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Describe las instrucciones de la tarea..."
                                                    className="min-h-28 resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </section>

                        {/* Evaluación */}
                        <section className="space-y-4">
                            <div>
                                <h3 className="text-sm font-semibold">
                                    Evaluación
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Define el puntaje y la cantidad de intentos permitidos.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-lg border p-4">
                                <FormField
                                    control={form.control}
                                    name="maxPoints"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Puntaje máximo</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    max={100}
                                                    placeholder="20"
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            e.target.value
                                                                ? Number(e.target.value)
                                                                : undefined
                                                        )
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="maxAttempts"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Intentos permitidos</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min={1}
                                                    max={100}
                                                    placeholder="2"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </section>

                        {/* Fechas */}
                        <section className="space-y-4">
                            <div>
                                <h3 className="text-sm font-semibold">
                                    Disponibilidad
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Define cuándo los alumnos podrán acceder y entregar la tarea.
                                </p>
                            </div>

                            <div className="rounded-lg border p-4 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="availableFrom"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Disponible desde</FormLabel>
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
                                        name="dueDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Fecha de entrega</FormLabel>
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
                                    name="availableUntil"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Disponible hasta</FormLabel>
                                            <FormControl>
                                                <DatePicker
                                                    date={field.value}
                                                    setDate={field.onChange}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Después de esta fecha los alumnos no podrán acceder a la tarea.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </section>

                        {/* Opciones */}
                        <section className="space-y-4">
                            <div>
                                <h3 className="text-sm font-semibold">
                                    Opciones
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Controla la entrega y visibilidad de la tarea.
                                </p>
                            </div>

                            <div className="overflow-hidden rounded-lg border">
                                <FormField
                                    control={form.control}
                                    name="allowLateSubmissions"
                                    render={({ field }) => (
                                        <Item className="rounded-none border-0 p-4">
                                            <ItemMedia>
                                                <BadgeCheckIcon className="size-5 text-muted-foreground" />
                                            </ItemMedia>

                                            <ItemContent>
                                                <ItemTitle>
                                                    Permitir entregas tardías
                                                </ItemTitle>
                                                <ItemDescription>
                                                    Los alumnos podrán entregar la tarea después
                                                    de la fecha de entrega.
                                                </ItemDescription>
                                            </ItemContent>

                                            <ItemContent className="flex-none">
                                                <FormItem>
                                                    <FormLabel className="sr-only">
                                                        Permitir entregas tardías
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Switch
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            </ItemContent>
                                        </Item>
                                    )}
                                />

                                <Separator />

                                <FormField
                                    control={form.control}
                                    name="isPublished"
                                    render={({ field }) => (
                                        <Item className="rounded-none border-0 p-4">
                                            <ItemMedia>
                                                <Unlock className="size-5 text-muted-foreground" />
                                            </ItemMedia>

                                            <ItemContent>
                                                <ItemTitle>
                                                    Publicar tarea
                                                </ItemTitle>
                                                <ItemDescription>
                                                    Los alumnos podrán acceder a esta tarea.
                                                </ItemDescription>
                                            </ItemContent>

                                            <ItemContent className="flex-none">
                                                <FormItem>
                                                    <FormLabel className="sr-only">
                                                        Publicar tarea
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Switch
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            </ItemContent>
                                        </Item>
                                    )}
                                />
                            </div>
                        </section>

                        {/* Footer */}
                        <DialogFooter className="border-t pt-4">
                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => onOpenChange(false)}
                                disabled={createAssignment.isPending}
                            >
                                Cancelar
                            </Button>

                            <Button
                                type="submit"
                                disabled={
                                    createAssignment.isPending ||
                                    !form.formState.isValid
                                }
                            >
                                {createAssignment.isPending
                                    ? "Guardando..."
                                    : "Guardar tarea"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
