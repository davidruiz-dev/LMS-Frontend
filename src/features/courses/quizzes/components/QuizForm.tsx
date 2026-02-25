
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
      points: quiz?.points || 20,
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
        title: quiz?.title || '',
        description: quiz?.description || '',
        type: quiz?.type || QuizType.GRADED,
        points: quiz?.points || 20,
        timeLimit: quiz?.timeLimit,
        allowedAttempts: quiz?.allowedAttempts ?? 1,
        shuffleQuestions: quiz?.shuffleQuestions ?? false,
        shuffleAnswers: quiz?.shuffleAnswers ?? false,
        showCorrectAnswers: quiz?.showCorrectAnswers ?? false,
        dueDate: formatDateForInput(quiz?.dueDate),
        published: quiz?.published ?? false,
      });
    }
  }, [quiz, open]);

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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar cuestionario' : 'Crear nuevo cuestionario'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Actualizar configuración del cuestionario' : 'Configurar nueva configuración de cuestionario'}
          </DialogDescription>
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
                    <Input placeholder="Examen parcial" {...field} />
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
                    <Textarea placeholder="Descripción del cuestionario..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={QuizType.PRACTICE}>Practice</SelectItem>
                        <SelectItem value={QuizType.GRADED}>Graded</SelectItem>
                        <SelectItem value={QuizType.SURVEY}>Survey</SelectItem>
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
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="timeLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timpo límite (minutos)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="No limit"
                        {...field}
                        value={field.value || ''}
                        onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
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
                    <FormLabel>Intentos permitidos (-1 = unlimited)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={e => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de vencimiento</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="shuffleQuestions"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Preguntas aleatorias</FormLabel>
                      <FormDescription>
                        Orden aleatorio de preguntas para cada intento
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shuffleAnswers"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Respuestas aleatorias</FormLabel>
                      <FormDescription>
                        Orden aleatorio de respuestas para cada intento
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="showCorrectAnswers"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Mostrar respuestas correctas</FormLabel>
                      <FormDescription>
                        Mostrar respuestas correctas después de la presentación
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="published"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Publicado</FormLabel>
                      <FormDescription>
                        Hacer disponible el cuestionario a los estudiantes
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Actualizar' : 'Crear'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};