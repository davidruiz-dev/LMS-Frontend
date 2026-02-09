import Layout from '@/components/layout/Layout';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { PublicRoute } from '@/features/auth/components/PublicRoute';
import CourseLayout from '@/features/courses/components/CourseLayout';
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
const CourseEnrollmentsPage = lazy(() => import('@/features/courses/pages/CourseEnrollmentsPage'));
const CourseModulesPage = lazy(() => import('@/features/courses/pages/CourseModulesPage'));
const CourseAssignmentsPage = lazy(() => import('@/features/courses/pages/CourseAssignmentsPage'));
const AssignmentPage = lazy(() => import('@/features/courses/pages/AssignmentPage'))

const GradeLevelsPage = lazy(() => import('@/features/grade-level/pages/GradeLevelsPage'));


const LazyWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={
    <div className="fixed inset-0 flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  }>
    {children}
  </Suspense>
)


export const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <LazyWrapper><NotFoundPage /></LazyWrapper>,
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
            element: <DashboardPage />
          },
          {
            path: 'usuarios',
            children: [
              {
                index: true,
                element: <UsersPage />
              },
              {
                path: 'agregar',
                element: <AddUserPage />
              },
              {
                path: 'editar/:id',
                element: <EditUserPage />
              }
            ]
          },
          {
            path: 'courses',
            children: [
              {
                index: true,
                element: <CoursesPage />
              },
              {
                path: 'agregar',
                element: <AddCoursePage />
              },
              {
                path: 'editar/:id',
                element: <EditCourseRoute />
              },
              {
                path: ':id',
                element: <CourseLayout />,
                children: [
                  {
                    index: true,
                    element: <CoursePage />
                  },
                  {
                    path: 'enrollments',
                    element: <CourseEnrollmentsPage />
                  },
                  {
                    path: 'modules',
                    element: <CourseModulesPage />
                  },
                  {
                    path: 'assignments',
                    element: <CourseAssignmentsPage />,
                  },
                  {
                    path: 'assignments/:assignmentId',
                    element: <AssignmentPage />
                  }
                ]
              },

            ]
          },
          {
            path: 'grados',
            children: [
              {
                index: true,
                element: <ProtectedRoute><GradeLevelsPage /></ProtectedRoute>
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