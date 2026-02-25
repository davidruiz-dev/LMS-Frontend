import { QuestionType, QuizType } from "@/features/courses/quizzes/types/quiz.types";
import z from "zod";

export const quizFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional(),
  type: z.nativeEnum(QuizType),
  points: z.number().min(0).optional(),
  timeLimit: z.number().min(1).optional(),
  allowedAttempts: z.number().min(-1),
  shuffleQuestions: z.boolean(),
  shuffleAnswers: z.boolean(),
  showCorrectAnswers: z.boolean(),
  dueDate: z.string().optional(),
  published: z.boolean(),
});

export type QuizFormValues = z.infer<typeof quizFormSchema>;


export const questionSchema = z.object({
  questionText: z.string().min(1, 'Question text is required'),
  type: z.nativeEnum(QuestionType),
  points: z.number().min(0, 'Points must be positive'),
  explanation: z.string().optional(),
  options: z.array(
    z.object({
      text: z.string().min(1, 'Option text is required'),
      isCorrect: z.boolean(),
      position: z.number().optional(),
    })
  ).min(1, 'At least one option is required'),
});

export type QuestionFormValues = z.infer<typeof questionSchema>;