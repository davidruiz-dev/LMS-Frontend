export const USER_ROLES = {
  STUDENT: 'student',
  INSTRUCTOR: 'instructor',
  ADMIN: 'admin',
  TA: 'ta',
} as const

export const ASSIGNMENT_TYPES = {
  ASSIGNMENT: 'assignment',
  QUIZ: 'quiz',
  DISCUSSION: 'discussion',
  EXAM: 'exam',
} as const

export const EVENT_TYPES = {
  ASSIGNMENT: 'assignment',
  EXAM: 'exam',
  CLASS: 'class',
  EVENT: 'event',
  DEADLINE: 'deadline',
} as const

export const NOTIFICATION_TYPES = {
  ASSIGNMENT: 'assignment',
  GRADE: 'grade',
  ANNOUNCEMENT: 'announcement',
  REMINDER: 'reminder',
  MESSAGE: 'message',
} as const

export const GRADE_SCALE = [
  { min: 97, letter: 'A+' },
  { min: 93, letter: 'A' },
  { min: 90, letter: 'A-' },
  { min: 87, letter: 'B+' },
  { min: 83, letter: 'B' },
  { min: 80, letter: 'B-' },
  { min: 77, letter: 'C+' },
  { min: 73, letter: 'C' },
  { min: 70, letter: 'C-' },
  { min: 67, letter: 'D+' },
  { min: 63, letter: 'D' },
  { min: 60, letter: 'D-' },
  { min: 0, letter: 'F' },
]

export const COURSE_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
]

export const COURSE_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const

export const FILE_UPLOAD_CONFIG = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'image/jpeg',
    'image/png',
    'image/gif'
  ]
}

export const API_BASE_URL = 'http://localhost:3001/api';

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  USER: 'user_data',
} as const;

export const QUERY_KEYS = {
  AUTH: {
    USER: ['auth', 'user'],
    LOGIN: ['auth', 'login'],
  },
} as const;