import Layout from '@/components/layout/Layout';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { PublicRoute } from '@/features/auth/components/PublicRoute';
import CourseLayout from '@/features/courses/components/layout/CourseLayout';
import { AssignmentService } from '@/features/courses/assignments/services/assignmentsService';
import { CourseService } from '@/features/courses/services/courseService';
import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Lazy load components
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const NotFoundPage = lazy(() => import('@/components/NotFoundPage'));
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'));
const UsersPage = lazy(() => import('@/features/users/pages/UsersPage'));
const AddUserPage = lazy(() => import('@/features/users/pages/AddUserPage'));
const EditUserPage = lazy(() => import('@/features/users/pages/EditUserPage'));
// courses
const CoursesPage = lazy(() => import('@/features/courses/pages/CoursesPage'));
const AddCoursePage = lazy(() => import('@/features/courses/pages/AddCoursePage'));
const EditCourseRoute = lazy(() => import('@/router/EditCourseRoute'));
const CoursePage = lazy(() => import('@/features/courses/pages/CoursePage'));
const CourseEnrollmentsPage = lazy(() => import('@/features/courses/enrollments/pages/CourseEnrollmentsPage'));
const CourseModulesPage = lazy(() => import('@/features/courses/modules/pages/CourseModulesPage'));
const CourseAssignmentsPage = lazy(() => import('@/features/courses/assignments/pages/CourseAssignmentsPage'));
const AssignmentPage = lazy(() => import('@/features/courses/assignments/pages/AssignmentPage'))
const CourseAnnouncementsPage = lazy(() => import('@/features/courses/announcements/pages/CourseAnnouncementsPage'))
// Quizzes
const QuizPage = lazy(() => import('@/features/courses/quizzes/pages/QuizPage'));
const QuizBuilderPage = lazy(() => import('@/features/courses/quizzes/pages/QuizBuilderPage'));
const QuizTakePage = lazy(() => import('@/features/courses/quizzes/pages/QuizTakePage'));
const QuizResultsPage = lazy(() => import('@/features/courses/quizzes/pages/QuizResultsPage'))
const MyAttemptsPage = lazy(()=> import('@/features/courses/quizzes/pages/MyAttemptsPage'))
const AllAttemptsPage = lazy(() => import('@/features/courses/quizzes/pages/AllAttemptsPage'))

const GradeLevelsPage = lazy(() => import('@/features/grade-level/pages/GradeLevelsPage'));


const LazyWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <LoadingSpinner size="lg" />
    </div>
  }>
    {children}
  </Suspense>
)


export const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <LazyWrapper><>error</></LazyWrapper>,
    children: [
      {
        path: 'login',
        element: <PublicRoute><LoginPage /></PublicRoute>
      },
      {
        element: <ProtectedRoute><Layout /></ProtectedRoute>,
        children: [
          {
            path: 'dashboard',
            element: <DashboardPage />,
            handle: {
              breadcrumb: () => 'Dashboard'
            },
          },
          {
            path: 'usuarios',
            handle: {
              breadcrumb: () => 'Usuarios'
            },
            children: [
              {
                index: true,
                element: <UsersPage />
              },
              {
                path: 'agregar',
                element: <AddUserPage />,
                handle: {
                  breadcrumb: () => 'Nuevo usuario'
                },
              },
              {
                path: 'editar/:id',
                element: <EditUserPage />,
                handle: {
                  breadcrumb: () => 'Editar'
                },
              }
            ]
          },
          {
            path: 'courses',
            handle: {
              breadcrumb: () => 'Cursos',
            },
            children: [
              {
                index: true,
                element: <CoursesPage />
              },
              {
                path: 'agregar',
                element: <AddCoursePage />,
                handle: {
                  breadcrumb: () => 'Nuevo Curso'
                }
              },
              {
                path: 'editar/:id',
                element: <EditCourseRoute />,
                handle: {
                  breadcrumb: () => 'Editar'
                }
              },
              {
                path: ':id',
                element: <CourseLayout />,
                handle: {
                  breadcrumb: (match: any) => match.data.name,
                },
                loader: async ({ params }) => {
                  return CourseService.getById(params.id!)
                },
                children: [
                  {
                    index: true,
                    element: <CoursePage />
                  },
                  {
                    path: 'enrollments',
                    element: <CourseEnrollmentsPage />,
                    handle: {
                      breadcrumb: () => 'Personas'
                    }
                  },
                  {
                    path: 'modules',
                    element: <CourseModulesPage />,
                    handle: {
                      breadcrumb: () => 'Módulos'
                    }
                  },
                  {
                    path: 'announcements',
                    element: <CourseAnnouncementsPage />,
                    handle: {
                      breadcrumb: () => 'Anuncios'
                    }
                  },
                  {
                    path: 'assignments',
                    handle: {
                      breadcrumb: () => 'Tareas'
                    },
                    children: [
                      {
                        index: true,
                        element: <CourseAssignmentsPage />,
                      },
                      {
                        path: ':assignmentId',
                        element: <AssignmentPage />,
                        handle: {
                          breadcrumb: (match: any) => match.data.name,
                        },
                        loader: async ({ params }) => {
                          return AssignmentService.findOneByCourse(params.id!, params.assignmentId!)
                        },
                      }
                    ]
                  },
                  {
                    path: 'quizzes',
                    handle: {
                      breadcrumb: () => 'Cuestionarios'
                    },
                    children: [
                      {
                        index: true,
                        element: <QuizPage />
                      },
                      {
                        path: ':quizId/build',
                        element: <QuizBuilderPage />
                      },
                      {
                        path: ':quizId/take',
                        element: <QuizTakePage />
                      },
                      {
                        path: ':quizId/results/:attemptId',
                        element: <QuizResultsPage />
                      },
                      {
                        path: ':quizId/my-attempts',
                        element: <MyAttemptsPage />,
                      },
                      {
                        path: ':quizId/attempts',
                        element: <AllAttemptsPage />,
                        handle: {
                          breadcrumb: () => 'Intentos'
                        }
                      }
                    ]

                  },

                ]
              },

            ]
          },
          {
            path: 'grados',
            handle: {
              breadcrumb: () => 'Grados'
            },
            children: [
              {
                index: true,
                element: <GradeLevelsPage />
              }
            ]
          }
        ]
      },
      // Redirecciones
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ]
  },

])