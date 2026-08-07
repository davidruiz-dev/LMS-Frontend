export type Role = 'admin' | 'student' | 'instructor';

export type CourseRelation = | { type: 'OWNER' } | { type: 'ENROLLED' } | { type: 'NONE' };

// Entidad Usuario
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  biography?: string;
  role: Role;
  isActive: boolean
  createdAt?: Date;
  updateAt?: Date;
}

/*
// Entidad Calificación
export interface Grade {
  id: string;
  assignmentId: string;
  studentId: string;
  grade: number;
  feedback?: string;
  gradedBy: string;
  gradedAt: string;
}

*/

// API Response Types
// export interface ApiResponse<T> {
//   data: T
//   message?: string
//   success: boolean
// }


export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number; // total de items
    page: number; // page actual
    limit: number;  // limite de items por pagina
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    links: MetaLink[];
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  }
}

interface MetaLink {
  url: string | null,
  label: string
  page: string | null;
  active: boolean
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  statusCode: number
}


export interface PaginationFilters {
  search?: string;
  page?: number;
  limit?: number;
  orderBy?: string;
  order?: 'ASC' | 'DESC';
}