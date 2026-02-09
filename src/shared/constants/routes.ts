export const ROUTES = {
  DASHBOARD: '/dashboard',
  LOGIN: '/login',
  // Cursos
  COURSES: '/courses',
  COURSE_DETAIL: (courseId: string) => `/courses/${courseId}`,
  COURSE_MEMBERS: (courseId: string) => `/courses/${courseId}/enrollments`,
  LESSON_PLAYER: (courseId: string, lessonId: string) => `/learn/${courseId}/${lessonId}`,
  COURSE_MODULES: (courseId: string) => `/courses/${courseId}/modules`,
  COURSE_ANNOUNCEMENTS: (courseId: string) => `/courses/${courseId}/announsments`,
  COURSE_ASSIGNMENTS: (courseId: string) => `/courses/${courseId}/assignments`,
  COURSE_ASSIGNMENT: (courseId: string, assignmentId: string) => `/courses/${courseId}/assignments/${assignmentId}`,
  
  // Usuarios
  CREATE_USER: '/usuarios/agregar',
  USERS: '/usuarios',
  EDIT_USER: (userId: string) => `/usuarios/editar/${userId}`,

  // Grados
  GRADE_LEVELS: '/grados',
  
  // Estudiante
  STUDENT_DASHBOARD: '/student/dashboard',
  MY_COURSES: '/student/my-courses',
  STUDENT_PROFILE: '/student/profile',
  
  // Instructor
  INSTRUCTOR_DASHBOARD: '/instructor/dashboard',
  INSTRUCTOR_COURSES: '/instructor/courses',
  CREATE_COURSE: '/cursos/agregar',
  EDIT_COURSE: (courseId: string) => `/cursos/editar/${courseId}`,
  COURSE_ANALYTICS: (courseId: string) => `/cursos/${courseId}/analytics`,
  
  // Admin
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_COURSES: '/admin/courses',
  
  // Errores
  UNAUTHORIZED: '/unauthorized',
  NOT_FOUND: '/404',
} as const;

// Hook para navegación tipada
export const useAppRouter = () => {
  return {
    routes: ROUTES,
  };
};