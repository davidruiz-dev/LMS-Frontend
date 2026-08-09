
import { useParams, useNavigate } from 'react-router-dom';
import { useQuiz } from '../hooks/use-quizzes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Settings, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { QuestionBuilder } from '@/features/courses/quizzes/components/QuestionBuilder';
import { QuizFormDialog } from '@/features/courses/quizzes/components/QuizForm';

export default function QuizBuilderPage() {
    const { id: courseId, quizId } = useParams<{ id: string; quizId: string }>();
    const navigate = useNavigate();
    const { data: quiz, isLoading } = useQuiz(quizId!);
    const [isEditingSettings, setIsEditingSettings] = useState(false);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!quiz) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <p className="text-lg font-medium mb-2">Quiz not found</p>
                <Button onClick={() => navigate(`/courses/${courseId}/quizzes`)}>
                    Volver a los cuestionarios
                </Button>
            </div>
        );
    }

    const totalPoints = quiz.questions?.reduce(
        (sum, q) => sum + Number(q.points),
        0
    ) || 0;

    return (
        <div className="container space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <h1 className="text-3xl font-bold first-letter:capitalize">{quiz.title}</h1>
                    <p className="text-muted-foreground">Crea y gestiona preguntas de cuestionarios.</p>
                </div>
                <Button variant="outline" onClick={() => setIsEditingSettings(true)}>
                    <Settings className="mr-2 h-4 w-4" />
                    Ajustes
                </Button>
            </div>

            {/* Quiz Info */}
            <Card>
                <CardHeader>
                    <CardTitle>Resumen del Cuestionario</CardTitle>
                    <CardDescription>{quiz.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-4 gap-4 text-center">
                        <div>
                            <div className="text-2xl font-bold">{quiz.questions?.length || 0}</div>
                            <div className="text-sm text-muted-foreground">Preguntas</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{totalPoints}</div>
                            <div className="text-sm text-muted-foreground">Puntos Totales</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold">
                                {quiz.timeLimit ? `${quiz.timeLimit}m` : '∞'}
                            </div>
                            <div className="text-sm text-muted-foreground">Límite de Tiempo</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold">
                                {quiz.allowedAttempts === -1 ? '∞' : quiz.allowedAttempts}
                            </div>
                            <div className="text-sm text-muted-foreground">Intentos</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Question Builder */}
            <QuestionBuilder quizId={quiz.id} questions={quiz.questions} />

            {/* Settings Dialog */}
            <QuizFormDialog
                open={isEditingSettings}
                onOpenChange={setIsEditingSettings}
                quiz={quiz}
                courseId={courseId!}
            />
        </div>
    );
};