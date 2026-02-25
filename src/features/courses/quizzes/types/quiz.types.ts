import type { User } from "@/shared/types";

export const QuizType = {
  PRACTICE: 'practice',
  GRADED: 'graded',
  SURVEY: 'survey',
} as const;
export type QuizType = (typeof QuizType)[keyof typeof QuizType];

export const QuestionType = {
  MULTIPLE_CHOICE: 'multiple_choice',
  TRUE_FALSE: 'true_false',
  SHORT_ANSWER: 'short_answer',
  ESSAY: 'essay',
  FILL_IN_BLANK: 'fill_in_blank',
} as const;
export type QuestionType = (typeof QuestionType)[keyof typeof QuestionType];

export const AttemptStatus = {
  IN_PROGRESS: 'in_progress',
  SUBMITTED: 'submitted',
  GRADED: 'graded',
} as const;
export type AttemptStatus = (typeof AttemptStatus)[keyof typeof AttemptStatus];


export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  position: number;
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  type: QuestionType;
  points: number;
  position: number;
  explanation?: string;
  options: QuestionOption[];
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  type: QuizType;
  points?: number;
  timeLimit?: number;
  allowedAttempts: number;
  shuffleQuestions: boolean;
  shuffleAnswers: boolean;
  showCorrectAnswers: boolean;
  dueDate?: string;
  availableFrom?: string;
  availableUntil?: string;
  published: boolean;
  courseId: string;
  questions?: QuizQuestion[];
  createdAt: string;
  updatedAt: string;
}

export interface QuizAnswer {
  questionId: string;
  answerText?: string;
  selectedOptionIds?: string[];
}

export interface QuizAttempt {
  id: string;
  attemptNumber: number;
  status: AttemptStatus;
  score?: number;
  startedAt: string;
  submittedAt?: string;
  timeSpent?: number;
  quizId: string;
  student: User;
  studentId: string;
  answers: QuizAttemptAnswer[];
}

export interface QuizAttemptAnswer {
  id: string;
  answerText?: string;
  selectedOptionIds?: string[];
  pointsAwarded?: number;
  isCorrect: boolean;
  feedback?: string;
  questionId: string;
  question: QuizQuestion;
}

export interface CreateQuizDto {
  title: string;
  description?: string;
  type?: QuizType;
  points?: number;
  timeLimit?: number;
  allowedAttempts?: number;
  shuffleQuestions?: boolean;
  shuffleAnswers?: boolean;
  showCorrectAnswers?: boolean;
  dueDate?: string;
  availableFrom?: string;
  availableUntil?: string;
  published?: boolean;
}

export interface CreateQuestionDto {
  questionText: string;
  type: QuestionType;
  points: number;
  explanation?: string;
  position?: number;
  options: {
    text: string;
    isCorrect: boolean;
    position?: number;
  }[];
}

export interface SubmitQuizDto {
  answers: QuizAnswer[];
}