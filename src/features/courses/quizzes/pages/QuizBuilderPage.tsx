
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
                    Back to Quizzes
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
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/courses/${courseId}/quizzes`)}
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold">{quiz.title}</h1>
                    <p className="text-muted-foreground">Build and manage quiz questions</p>
                </div>
                <Button variant="outline" onClick={() => setIsEditingSettings(true)}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                </Button>
            </div>

            {/* Quiz Info */}
            <Card>
                <CardHeader>
                    <CardTitle>Quiz Overview</CardTitle>
                    <CardDescription>{quiz.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-4 gap-4 text-center">
                        <div>
                            <div className="text-2xl font-bold">{quiz.questions?.length || 0}</div>
                            <div className="text-sm text-muted-foreground">Questions</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{totalPoints}</div>
                            <div className="text-sm text-muted-foreground">Total Points</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold">
                                {quiz.timeLimit ? `${quiz.timeLimit}m` : '∞'}
                            </div>
                            <div className="text-sm text-muted-foreground">Time Limit</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold">
                                {quiz.allowedAttempts === -1 ? '∞' : quiz.allowedAttempts}
                            </div>
                            <div className="text-sm text-muted-foreground">Attempts</div>
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