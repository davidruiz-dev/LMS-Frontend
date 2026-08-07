import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { quizzesApi } from '@/features/courses/quizzes/services/quizzesService';
import type { QuizAnswer } from '../types/quiz.types';


export const quizKeys = {
  all: ['quizzes'] as const,
  lists: () => [...quizKeys.all, 'list'] as const,
  listByCourse: (courseId: string) => [...quizKeys.lists(), courseId] as const,
  details: () => [...quizKeys.all, 'detail'] as const,
  detail: (id: string) => [...quizKeys.details(), id] as const,
  attempts: (quizId: string) => [...quizKeys.all, 'attempts', quizId] as const,
  attempt: (attemptId: string) => [...quizKeys.all, 'attempt', attemptId] as const,
};

// Get quizzes by course
export const useQuizzes = (courseId: string) => {
  return useQuery({
    queryKey: quizKeys.listByCourse(courseId),
    queryFn: () => quizzesApi.getQuizzesByCourse(courseId),
    enabled: !!courseId,
  });
};

// Get quiz by ID
export const useQuiz = (quizId: string) => {
  return useQuery({
    queryKey: quizKeys.detail(quizId),
    queryFn: () => quizzesApi.getQuizById(quizId),
    enabled: !!quizId,
  });
};

// Create quiz
export const useCreateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, data }: { courseId: string; data: any }) =>
      quizzesApi.createQuiz(courseId, data),
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: quizKeys.listByCourse(courseId) });
      toast.success('Quiz created successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create quiz');
    },
  });
};

// Update quiz
export const useUpdateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ quizId, data }: { quizId: string; data: any }) =>
      quizzesApi.updateQuiz(quizId, data),
    onSuccess: (updatedQuiz) => {
      queryClient.invalidateQueries({ queryKey: quizKeys.detail(updatedQuiz.id) });
      queryClient.invalidateQueries({ queryKey: quizKeys.lists() });
      toast.success('Quiz updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update quiz');
    },
  });
};

// Delete quiz
export const useDeleteQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (quizId: string) => quizzesApi.deleteQuiz(quizId),
    onSuccess: (_, quizId) => {
      queryClient.invalidateQueries({ queryKey: quizKeys.lists() });
      queryClient.removeQueries({ queryKey: quizKeys.detail(quizId) });
      toast.success('Quiz deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete quiz');
    },
  });
};

// Add question
export const useAddQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ quizId, data }: { quizId: string; data: any }) =>
      quizzesApi.addQuestion(quizId, data),
    onSuccess: (_, { quizId }) => {
      queryClient.invalidateQueries({ queryKey: quizKeys.detail(quizId) });
      toast.success('Question added successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to add question');
    },
  });
};

// Delete question
export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ questionId, quizId }: { questionId: string; quizId: string }) =>
      quizzesApi.deleteQuestion(questionId),
    onSuccess: (_, { quizId }) => {
      queryClient.invalidateQueries({ queryKey: quizKeys.detail(quizId) });
      toast.success('Question deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete question');
    },
  });
};

// Start attempt
export const useStartAttempt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (quizId: string) => quizzesApi.startAttempt(quizId),
    onSuccess: (attempt) => {
      queryClient.invalidateQueries({ queryKey: quizKeys.attempts(attempt.quizId) });
      toast.success('Quiz started');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to start quiz');
    },
  });
};

// Submit attempt
export const useSubmitAttempt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ attemptId, data }: { attemptId: string; data: any }) =>
      quizzesApi.submitAttempt(attemptId, data),
    onSuccess: (attempt) => {
      queryClient.invalidateQueries({ queryKey: quizKeys.attempts(attempt.quizId) });
      queryClient.invalidateQueries({ queryKey: quizKeys.attempt(attempt.id) });
      toast.success('Quiz submitted successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to submit quiz');
    },
  });
};

// Get attempts
export const useAttempts = (quizId: string) => {
  return useQuery({
    queryKey: quizKeys.attempts(quizId),
    queryFn: () => quizzesApi.getAttempts(quizId),
    enabled: !!quizId,
  });
};

// Get attempt
export const useAttempt = (attemptId: string) => {
  return useQuery({
    queryKey: quizKeys.attempt(attemptId),
    queryFn: () => quizzesApi.getAttemptById(attemptId),
    enabled: !!attemptId,
  });
};


// Get all attempts for a quiz (instructor only)
export const useAllAttempts = (quizId: string) => {
  return useQuery({
    queryKey: [...quizKeys.all, 'all-attempts', quizId],
    queryFn: () => quizzesApi.getAllAttemptsByQuiz(quizId),
    enabled: !!quizId,
  });
};


// Get attempt count for a single quiz
export const useAttemptCount = (quizId: string) => {
  return useQuery({
    queryKey: [...quizKeys.all, 'attempt-count', quizId],
    queryFn: () => quizzesApi.getAttemptCount(quizId),
    enabled: !!quizId,
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Get attempt counts for multiple quizzes (optimized batch query)
export const useAttemptCounts = (quizIds: string[]) => {
  return useQuery({
    queryKey: [...quizKeys.all, 'attempt-counts', quizIds.sort().join(',')],
    queryFn: () => quizzesApi.getAttemptCounts(quizIds),
    enabled: quizIds.length > 0,
    staleTime: 30 * 1000, // 30 seconds
  });
};


// Get pending grading attempts
export const usePendingGrading = (quizId: string, enabled = true) => {
  return useQuery({
    queryKey: [...quizKeys.all, 'pending-grading', quizId],
    queryFn: () => quizzesApi.getPendingGrading(quizId),
    enabled: !!quizId && enabled,
  });
};


// Grade manual answer
export const useGradeAnswer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ answerId, points, feedback }: { 
      answerId: string; 
      points: number; 
      feedback?: string;
    }) => quizzesApi.gradeManualAnswer(answerId, points, feedback),
    onSuccess: (_, { answerId }) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: quizKeys.all });
      toast.success('Calificado correctamente');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to grade answer');
    },
  });
};


// Get in-progress attempt
export const useInProgressAttempt = (quizId: string, canEdit = true) => {
  return useQuery({
    queryKey: [...quizKeys.all, 'in-progress', quizId],
    queryFn: () => quizzesApi.getInProgressAttempt(quizId),
    enabled: !!quizId && !canEdit,
    staleTime: 0, // Always fetch fresh
  });
};

// Save progress (no toast, silent operation)
export const useSaveProgress = () => {
  return useMutation({
    mutationFn: ({ attemptId, answers }: { attemptId: string; answers: QuizAnswer[] }) =>
      quizzesApi.saveProgress(attemptId, answers),
    // Silent save, no success toast
    onError: (error) => {
      console.error('Failed to save progress:', error.message);
      // No toast para no molestar al usuario
    }, 
  });
};

// Abandon attempt
export const useAbandonAttempt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (attemptId: string) => quizzesApi.abandonAttempt(attemptId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quizKeys.all });
      toast.success('Quiz abandoned');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to abandon quiz');
    },
  });
};