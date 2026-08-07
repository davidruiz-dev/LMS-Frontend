import { useMemo, useState } from 'react';
import { useQuizzes, useAttemptCounts } from '../hooks/use-quizzes';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, FileQuestion, Search, Filter, SortDesc, SortAsc } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Quiz } from '@/features/courses/quizzes/types/quiz.types';
import { QuizCard } from '@/features/courses/quizzes/components/QuizCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface QuizListProps {
  courseId: string;
  setEditingQuiz: (quiz: Quiz | null) => void;
  setDeletingQuiz: (quiz: Quiz | null) => void;
  canManage?: boolean;
}

export const QuizList = ({ courseId, setEditingQuiz, setDeletingQuiz, canManage }: QuizListProps) => {
  const navigate = useNavigate();
  const { data: quizzes = [], isLoading } = useQuizzes(courseId!);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [filterType, setFilterType] = useState<'all' | 'published' | 'draft'>('all');

  const filteredQuizzes = useMemo(() => {
    let filtered = quizzes.filter(quiz => {
      let matchedSearch =
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.description?.toLowerCase().includes(searchTerm.toLowerCase())
      let matchesFilters = true;
      if (filterType === 'published') {
        matchesFilters = quiz.published
      } else if (filterType === 'draft') {
        matchesFilters = !quiz.published
      }
      return matchesFilters && matchedSearch;
    })

    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    })

    return filtered;
  }, [quizzes, searchTerm, sortOrder, filterType])

  const quizIds = useMemo(() => quizzes?.map(q => q.id) || [], [quizzes]);
  const { data: attemptCounts } = useAttemptCounts(quizIds);

  const handleStart = (quiz: Quiz) => {
    navigate(`/courses/${courseId}/quizzes/${quiz.id}/take`);
  };

  const getRemainingAttempts = (quiz: Quiz): number => {
    if (quiz.allowedAttempts === -1) return -1;
    const attempts = attemptCounts?.[quiz.id] || 0;
    return Math.max(0, quiz.allowedAttempts - attempts);
  };

  const hasAttempts = (quiz: Quiz): boolean => {
    return (attemptCounts?.[quiz.id] || 0) > 0;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-wrap gap-3 max-w-2xl ml-auto">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar cuestionarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        {canManage && (
          <Select
            value={filterType}
            onValueChange={(value: any) => setFilterType(value)}
          >
            <SelectTrigger >
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filtrar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="published">Publicados</SelectItem>
              <SelectItem value="draft">Borradores</SelectItem>
            </SelectContent>
          </Select>
        )}

        <Button
          variant="outline"
          size="icon"
          onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
          className="shrink-0"
        >
          {sortOrder === 'newest' ? (
            <SortDesc className="w-4 h-4" />
          ) : (
            <SortAsc className="w-4 h-4" />
          )}
        </Button>
      </div>


      {filteredQuizzes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileQuestion className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">
              {searchTerm || filterType !== 'all' ? 'No se encontraron cuestionarios' : 'No hay cuestionarios aún'}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              {searchTerm || filterType !== 'all'
                ? 'Prueba ajustando los filtros de búsqueda'
                : canManage ? 'Crea tu primer cuestionario' : 'Vuelve más tarde para ver cuestionarios'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes?.map((quiz) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              courseId={courseId!}
              onStart={handleStart}
              onEdit={canManage ? setEditingQuiz : undefined}
              onDelete={canManage ? setDeletingQuiz : undefined}
              canEdit={canManage}
              remainingAttempts={getRemainingAttempts(quiz)}
              hasAttempts={hasAttempts(quiz)}
            />
          ))}
        </div>
      )}
    </>
  );
};