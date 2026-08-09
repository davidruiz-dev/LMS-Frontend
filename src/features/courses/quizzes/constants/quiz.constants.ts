import { AttemptStatus, QuestionType } from "../types/quiz.types";

export const questionTypeLabel = {
  [QuestionType.ESSAY]: 'redacción',
  [QuestionType.FILL_IN_BLANK]: 'rellenar espacio',
  [QuestionType.MULTIPLE_CHOICE]: 'opción múltiple',
  [QuestionType.SHORT_ANSWER]: 'respuesta breve',
  [QuestionType.TRUE_FALSE]: 'verdadero o falso',
} as const

export const attempStatusTypeLabels = {
  [AttemptStatus.GRADED]: 'calificado',
  [AttemptStatus.IN_PROGRESS]: 'en progreso',
  [AttemptStatus.SUBMITTED]: 'enviado',
} as const