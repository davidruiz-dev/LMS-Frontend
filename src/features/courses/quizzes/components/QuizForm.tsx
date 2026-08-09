import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useCreateQuiz, useUpdateQuiz } from '../hooks/use-quizzes';
import { Loader2 } from 'lucide-react';
import { QuizType, type Quiz } from '@/features/courses/quizzes/types/quiz.types';
import { quizFormSchema, type QuizFormValues } from '@/features/courses/quizzes/schemas/quiz.schema';
import { useEffect } from 'react';

interface QuizFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quiz?: Quiz | null;
  courseId: string;
}

export const QuizFormDialog = ({ open, onOpenChange, quiz, courseId }: QuizFormDialogProps) => {
  const createMutation = useCreateQuiz();
  const updateMutation = useUpdateQuiz();
  const isEditing = !!quiz;

  const formatDateForInput = (date?: string | Date) => {
    if (!date) return '';

    const d = new Date(date);
    const pad = (n: number) => n.toString().padStart(2, '0');

    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: {
      title: quiz?.title || '',
      description: quiz?.description || '',
      type: quiz?.type || QuizType.GRADED,
      points: Number(quiz?.points ?? 20),
      timeLimit: quiz?.timeLimit,
      allowedAttempts: quiz?.allowedAttempts ?? 1,
      shuffleQuestions: quiz?.shuffleQuestions ?? false,
      shuffleAnswers: quiz?.shuffleAnswers ?? false,
      showCorrectAnswers: quiz?.showCorrectAnswers ?? false,
      dueDate: quiz?.dueDate || '',
      published: quiz?.published ?? false,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        title: quiz?.title ?? '',
        description: quiz?.description ?? '',
        type: quiz?.type ?? QuizType.GRADED,
        points: Number(quiz?.points ?? 20),
        timeLimit: quiz?.timeLimit,
        allowedAttempts: quiz?.allowedAttempts ?? 1,
        shuffleQuestions: quiz?.shuffleQuestions ?? false,
        shuffleAnswers: quiz?.shuffleAnswers ?? false,
        showCorrectAnswers: quiz?.showCorrectAnswers ?? false,
        dueDate: formatDateForInput(quiz?.dueDate),
        published: quiz?.published ?? false,
      });
    }
  }, [quiz, open, form]);

  const onSubmit = async (data: QuizFormValues) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ quizId: quiz.id, data });
      } else {
        await createMutation.mutateAsync({ courseId, data });
      }
      onOpenChange(false);
      form.reset();
    } catch (error) {
      // Error handled by mutation
      console.log(error)
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
      <DialogTitle>
        {isEditing ? "Editar cuestionario" : "Crear cuestionario"}
      </DialogTitle>

      <DialogDescription>
        {isEditing
          ? "Modifica la configuración y opciones del cuestionario."
          : "Configura los detalles, evaluación y opciones del nuevo cuestionario."}
      </DialogDescription>
    </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            {/* Información básica */}
            <section className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold">Información básica</h3>
                <p className="text-sm text-muted-foreground">
                  Define la información principal del cuestionario.
                </p>
              </div>

              <div className="rounded-lg border bg-card p-4 space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej. Examen parcial de Matemáticas"
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
                          placeholder="Describe brevemente el objetivo de este cuestionario..."
                          className="min-h-24 resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            {/* Configuración */}
            <section className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold">Configuración</h3>
                <p className="text-sm text-muted-foreground">
                  Define cómo será evaluado el cuestionario.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 rounded-lg border bg-card p-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de cuestionario</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder="Selecciona un tipo" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          <SelectItem value={QuizType.PRACTICE}>
                            Práctica
                          </SelectItem>
                          <SelectItem value={QuizType.GRADED}>
                            Evaluación
                          </SelectItem>
                          <SelectItem value={QuizType.SURVEY}>
                            Encuesta
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="points"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Puntos totales</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          placeholder="100"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseFloat(e.target.value)
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
                  name="timeLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiempo límite</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="number"
                            min={1}
                            placeholder="Sin límite"
                            className="pr-20"
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? parseInt(e.target.value)
                                  : undefined
                              )
                            }
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                            minutos
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="allowedAttempts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Intentos permitidos</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={-1}
                          placeholder="-1 = ilimitados"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseInt(e.target.value)
                                : undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Usa -1 para permitir intentos ilimitados.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            {/* Fecha */}
            <section className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold">Disponibilidad</h3>
                <p className="text-sm text-muted-foreground">
                  Define cuándo estará disponible el cuestionario.
                </p>
              </div>

              <div className="rounded-lg border bg-card p-4">
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de vencimiento</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormDescription>
                        Los estudiantes no podrán realizar el cuestionario
                        después de esta fecha.
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
                <h3 className="text-sm font-semibold">Opciones</h3>
                <p className="text-sm text-muted-foreground">
                  Personaliza el comportamiento del cuestionario.
                </p>
              </div>

              <div className="overflow-hidden rounded-lg border">

                <FormField
                  control={form.control}
                  name="shuffleQuestions"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between gap-4 p-4">
                      <div className="space-y-1">
                        <FormLabel className="text-sm font-medium">
                          Preguntas aleatorias
                        </FormLabel>
                        <FormDescription>
                          Cambiar el orden de las preguntas en cada intento.
                        </FormDescription>
                      </div>

                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="border-t" />

                <FormField
                  control={form.control}
                  name="shuffleAnswers"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between gap-4 p-4">
                      <div className="space-y-1">
                        <FormLabel className="text-sm font-medium">
                          Respuestas aleatorias
                        </FormLabel>
                        <FormDescription>
                          Cambiar el orden de las respuestas en cada intento.
                        </FormDescription>
                      </div>

                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="border-t" />

                <FormField
                  control={form.control}
                  name="showCorrectAnswers"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between gap-4 p-4">
                      <div className="space-y-1">
                        <FormLabel className="text-sm font-medium">
                          Mostrar respuestas correctas
                        </FormLabel>
                        <FormDescription>
                          Mostrar las respuestas correctas después de completar el cuestionario.
                        </FormDescription>
                      </div>

                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="border-t" />

                <FormField
                  control={form.control}
                  name="published"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between gap-4 p-4">
                      <div className="space-y-1">
                        <FormLabel className="text-sm font-medium">
                          Publicado
                        </FormLabel>
                        <FormDescription>
                          Hacer disponible el cuestionario para los estudiantes.
                        </FormDescription>
                      </div>

                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

              </div>
            </section>

            {/* Footer */}
            <DialogFooter className="border-t pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>

              <Button type="submit" disabled={isLoading}>
                {isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}

                {isEditing ? "Actualizar cuestionario" : "Crear cuestionario"}
              </Button>
            </DialogFooter>

          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};