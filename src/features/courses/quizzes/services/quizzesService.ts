import type { CreateQuestionDto, CreateQuizDto, Quiz, QuizAttempt, QuizQuestion, SubmitQuizDto } from "@/features/courses/quizzes/types/quiz.types";
import { api } from "@/lib/client";

export const quizzesApi = {
  // Quizzes
  getQuizzesByCourse: async (courseId: string): Promise<Quiz[]> => {
    const { data } = await api.get<Quiz[]>(`/courses/${courseId}/quizzes`);
    return data;
  },

  getQuizById: async (quizId: string): Promise<Quiz> => {
    const { data } = await api.get<Quiz>(`/quizzes/${quizId}`);
    return data;
  },

  createQuiz: async (courseId: string, quizData: CreateQuizDto): Promise<Quiz> => {
    const { data } = await api.post<Quiz>(`/courses/${courseId}/quizzes`, quizData);
    return data;
  },

  updateQuiz: async (quizId: string, quizData: Partial<CreateQuizDto>): Promise<Quiz> => {
    const { data } = await api.patch<Quiz>(`/quizzes/${quizId}`, quizData);
    return data;
  },

  deleteQuiz: async (quizId: string): Promise<void> => {
    await api.delete(`/quizzes/${quizId}`);
  },

  // Questions
  addQuestion: async (quizId: string, questionData: CreateQuestionDto): Promise<QuizQuestion> => {
    const { data } = await api.post<QuizQuestion>(`/quizzes/${quizId}/questions`, questionData);
    return data;
  },

  updateQuestion: async (questionId: string, questionData: Partial<CreateQuestionDto>): Promise<QuizQuestion> => {
    const { data } = await api.patch<QuizQuestion>(`/questions/${questionId}`, questionData);
    return data;
  },

  deleteQuestion: async (questionId: string): Promise<void> => {
    await api.delete(`/questions/${questionId}`);
  },

  // Attempts
  startAttempt: async (quizId: string): Promise<QuizAttempt> => {
    const { data } = await api.post<QuizAttempt>(`/quizzes/${quizId}/attempts`);
    return data;
  },

  submitAttempt: async (attemptId: string, submitData: SubmitQuizDto): Promise<QuizAttempt> => {
    const { data } = await api.post<QuizAttempt>(`/attempts/${attemptId}/submit`, submitData);
    return data;
  },

  getAttempts: async (quizId: string): Promise<QuizAttempt[]> => {
    const { data } = await api.get<QuizAttempt[]>(`/quizzes/${quizId}/attempts`);
    return data;
  },

  getAttemptById: async (attemptId: string): Promise<QuizAttempt> => {
    const { data } = await api.get<QuizAttempt>(`/attempts/${attemptId}`);
    return data;
  },

  // All attempts (instructor only)
  getAllAttemptsByQuiz: async (quizId: string): Promise<QuizAttempt[]> => {
    const { data } = await api.get<QuizAttempt[]>(`/quizzes/${quizId}/all-attempts`);
    return data;
  },

  // Attempt count for single quiz
  getAttemptCount: async (quizId: string): Promise<number> => {
    const { data } = await api.get<{ count: number }>(`/quizzes/${quizId}/attempt-count`);
    return data.count;
  },

  // Batch attempt counts (optimized)
  getAttemptCounts: async (quizIds: string[]): Promise<Record<string, number>> => {
    const { data } = await api.post<Record<string, number>>(`/quizzes/attempt-counts`, { quizIds });
    return data;
  },
};