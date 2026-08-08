import Layout from '@/app/layouts/Layout';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { PublicRoute } from '@/features/auth/components/PublicRoute';
import CourseLayout from '@/app/layouts/CourseLayout';
import { AssignmentService } from '@/features/courses/assignments/services/assignmentsService';
import { CourseService } from '@/features/courses/services/courseService';
import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LazyWrapper } from '@/components/LazyWrapper';

// Lazy load components
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const NotFoundPage = lazy(() => import('@/components/NotFoundPage'));
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'));
const UsersPage = lazy(() => import('@/features/users/pages/UsersPage'));
const AddUserPage = lazy(() => import('@/features/users/pages/AddUserPage'));
const EditUserPage = lazy(() => import('@/features/users/pages/EditUserPage'));
// courses
const CourseGuard = lazy(() => import('@/guards/CourseGuard'));

const CoursesPage = lazy(() => import('@/features/courses/pages/CoursesPage'));
const AddCoursePage = lazy(() => import('@/features/courses/pages/AddCoursePage'));
const EditCoursePage = lazy(() => import('@/features/courses/pages/EditCoursePage'))
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
const MyAttemptsPage = lazy(() => import('@/features/courses/quizzes/pages/MyAttemptsPage'))
const AllAttemptsPage = lazy(() => import('@/features/courses/quizzes/pages/AllAttemptsPage'))
const ManualGradingPage = lazy(() => import('@/features/courses/quizzes/pages/ManualGradingPages'));


const AssignmentSubmissionsPage = lazy(() => import('@/features/courses/assignments/submissions/pages/AssignmentSubmissionsPage'));
const SubmissionPage = lazy(() => import('@/features/courses/assignments/submissions/pages/SubmissionPage'));

const ProfilePage = lazy(() => import('@/features/profile/pages/ProfilePage'));
const PublicProfilePage = lazy(() => import('@/features/profile/pages/PublicProfilePage'));

interface BreadcrumbMatch {
  data: {
    name: string;
  };
}

export const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <>error page</>,
    children: [
      {
        path: 'login',
        element: <PublicRoute><LoginPage /></PublicRoute>
      },
      {
        element: (
          <LazyWrapper>
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          </LazyWrapper>
        ),
        children: [
          {
            path: 'dashboard',
            element: <DashboardPage />,
            handle: {
              breadcrumb: () => 'Dashboard'
            },
          },
          {
            path: 'profile',
            element: <ProfilePage />,
            handle: {
              breadcrumb: () => 'Mi Perfil'
            }
          },
          {
            path: 'profile/:userId',
            element: <PublicProfilePage />,
            handle: {
              breadcrumb: () => 'Perfil'
            }
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
                element: <CourseGuard check={(a) => a.canEdit}>
                  <EditCoursePage />
                </CourseGuard>,
                handle: {
                  breadcrumb: () => 'Editar'
                }
              },
              {
                path: ':id',
                element: <CourseLayout />,
                handle: {
                  breadcrumb: (match: BreadcrumbMatch) => match.data.name,
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
                          breadcrumb: (match: BreadcrumbMatch) => match.data.name,
                        },
                        loader: async ({ params }) => {
                          return AssignmentService.findOneByCourse(params.id!, params.assignmentId!)
                        },
                      },
                      {
                        path: ':assignmentId/submissions',
                        element: <AssignmentSubmissionsPage />,
                        handle: {
                          breadcrumb: () => 'Entregas'
                        }
                      },
                      {
                        path: ':assignmentId/submissions/:submissionId',
                        element: <SubmissionPage />,
                        handle: {
                          breadcrumb: () => 'Entrega'
                        }
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
                      },
                      {
                        path: ':quizId/manual-grading',
                        element: <ManualGradingPage />,
                        handle: {
                          breadcrumb: () => 'Calificación manual'
                        }
                      },
                      {
                      }
                    ]

                  },

                ]
              },

            ]
          },
          
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