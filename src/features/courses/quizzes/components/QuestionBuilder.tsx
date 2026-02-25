import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAddQuestion, useDeleteQuestion } from '../hooks/use-quizzes';
import { Plus, Trash2, GripVertical, Check, X, Loader2, FileQuestion } from 'lucide-react';
import { cn } from '@/lib/utils';
import { QuestionType, type QuizQuestion } from '@/features/courses/quizzes/types/quiz.types';
import { questionSchema, type QuestionFormValues } from '@/features/courses/quizzes/schemas/quiz.schema';

interface QuestionBuilderProps {
  quizId: string;
  questions?: QuizQuestion[];
}

export const QuestionBuilder = ({ quizId, questions = [] }: QuestionBuilderProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const addQuestionMutation = useAddQuestion();
  const deleteQuestionMutation = useDeleteQuestion();

  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      questionText: '',
      type: QuestionType.MULTIPLE_CHOICE,
      points: 10,
      explanation: '',
      options: [
        { text: '', isCorrect: false, position: 0 },
        { text: '', isCorrect: false, position: 1 },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'options',
  });

  const questionType = form.watch('type');

  const onSubmit = async (data: QuestionFormValues) => {
    try {
      // Validar que al menos una opción sea correcta para multiple choice y true/false
      if (data.type === QuestionType.MULTIPLE_CHOICE || data.type === QuestionType.TRUE_FALSE) {
        const hasCorrect = data.options.some(opt => opt.isCorrect);
        if (!hasCorrect) {
          form.setError('options', { message: 'At least one option must be correct' });
          return;
        }
      }

      await addQuestionMutation.mutateAsync({ quizId, data });
      form.reset();
      setIsAdding(false);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleDelete = async (questionId: string) => {
    if (confirm('Are you sure you want to delete this question?')) {
      await deleteQuestionMutation.mutateAsync({ questionId, quizId });
    }
  };

  const addOption = () => {
    append({ text: '', isCorrect: false, position: fields.length });
  };

  const renderQuestionTypeFields = () => {
    switch (questionType) {
      case QuestionType.MULTIPLE_CHOICE:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <FormLabel>Opciones</FormLabel>
              <Button type="button" variant="outline" size="sm" onClick={addOption}>
                <Plus className="h-4 w-4 mr-1" />
                Agregar opción
              </Button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-2">
                <div className="flex items-center pt-2">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                </div>

                <FormField
                  control={form.control}
                  name={`options.${index}.isCorrect`}
                  render={({ field }) => (
                    <FormItem className="flex items-center pt-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`options.${index}.text`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder={`Option ${index + 1}`} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {fields.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <FormMessage>{form.formState.errors.options?.message}</FormMessage>
          </div>
        );

      case QuestionType.TRUE_FALSE:
        return (
          <div className="space-y-4">
            <FormLabel>Options</FormLabel>
            
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="options.0.isCorrect"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-3 rounded-lg border p-4 cursor-pointer hover:bg-accent"
                         onClick={() => {
                           form.setValue('options.0.isCorrect', true);
                           form.setValue('options.1.isCorrect', false);
                           form.setValue('options.0.text', 'True');
                           form.setValue('options.1.text', 'False');
                         }}>
                      <FormControl>
                        <Checkbox checked={field.value} />
                      </FormControl>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          <span className="font-medium">Verdadero</span>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="options.1.isCorrect"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-3 rounded-lg border p-4 cursor-pointer hover:bg-accent"
                         onClick={() => {
                           form.setValue('options.0.isCorrect', false);
                           form.setValue('options.1.isCorrect', true);
                           form.setValue('options.0.text', 'True');
                           form.setValue('options.1.text', 'False');
                         }}>
                      <FormControl>
                        <Checkbox checked={field.value} />
                      </FormControl>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <X className="h-4 w-4 text-red-500" />
                          <span className="font-medium">Falso</span>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <FormDescription>Selecciona la respuesta correcta</FormDescription>
          </div>
        );

      case QuestionType.SHORT_ANSWER:
      case QuestionType.ESSAY:
      case QuestionType.FILL_IN_BLANK:
        return (
          <div className="space-y-4">
            <div className="rounded-lg border p-4 bg-muted/50">
              <p className="text-sm text-muted-foreground">
                Este tipo de pregunta requiere calificación manual. Los estudiantes proporcionarán una respuesta de texto.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Preguntas</h3>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Agregar pregunta
          </Button>
        )}
      </div>

      {/* Existing Questions */}
      <div className="space-y-4">
        {questions.map((question, index) => (
          <Card key={question.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      Pregunta {index + 1}
                    </span>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                      {question.type.replace('_', ' ')}
                    </span>
                    <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded">
                      {question.points} pts
                    </span>
                  </div>
                  <CardTitle className="text-base">{question.questionText}</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(question.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {question.options.map((option, optIndex) => (
                  <div
                    key={option.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border",
                      option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950"
                    )}
                  >
                    {option.isCorrect ? (
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 flex-shrink-0" />
                    )}
                    <span className="text-sm">{option.text}</span>
                  </div>
                ))}
              </div>

              {question.explanation && (
                <div className="mt-4 p-3 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Explicación:</span> {question.explanation}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Question Form */}
      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Nueva pregunta</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="questionText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Texto de la pregunta</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ingresa tu pregunta..."
                          className="min-h-[100px]"
                          {...field}
                        />
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
                        <FormLabel>Tipo de pregunta</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value);
                            // Reset options when type changes
                            if (value === QuestionType.TRUE_FALSE) {
                              form.setValue('options', [
                                { text: 'True', isCorrect: false, position: 0 },
                                { text: 'False', isCorrect: false, position: 1 },
                              ]);
                            } else if (value === QuestionType.SHORT_ANSWER || 
                                       value === QuestionType.ESSAY || 
                                       value === QuestionType.FILL_IN_BLANK) {
                              form.setValue('options', [
                                { text: 'Answer', isCorrect: true, position: 0 },
                              ]);
                            }
                          }} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={QuestionType.MULTIPLE_CHOICE}>
                              Multiple Choice
                            </SelectItem>
                            <SelectItem value={QuestionType.TRUE_FALSE}>
                              True/False
                            </SelectItem>
                            <SelectItem value={QuestionType.SHORT_ANSWER}>
                              Short Answer
                            </SelectItem>
                            <SelectItem value={QuestionType.ESSAY}>
                              Essay
                            </SelectItem>
                            <SelectItem value={QuestionType.FILL_IN_BLANK}>
                              Fill in the Blank
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
                        <FormLabel>Puntos</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {renderQuestionTypeFields()}

                <FormField
                  control={form.control}
                  name="explanation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Explicación (Opcional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Explica la respuesta correcta."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Esta explicación se mostrará a los estudiantes después de que respondan la pregunta, para ayudarles a entender el material.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsAdding(false);
                      form.reset();
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={addQuestionMutation.isPending}>
                    {addQuestionMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Agregar pregunta
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {questions.length === 0 && !isAdding && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileQuestion className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No hay preguntas aún</p>
            <p className="text-sm text-muted-foreground mb-4">
              Agrega preguntas para que los estudiantes puedan comenzar el cuestionario
            </p>
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="mr-2 h-4 w-4" />
                Agregar pregunta
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};