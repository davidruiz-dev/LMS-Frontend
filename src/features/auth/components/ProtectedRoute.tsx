import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useAuth } from '@/shared/providers/AuthProvider'
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/login'
}) => {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Si la ruta requiere autenticación pero el usuario no está autenticado
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }


  return <>{children}</>
}