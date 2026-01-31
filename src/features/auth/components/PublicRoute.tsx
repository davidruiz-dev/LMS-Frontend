import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useAuth } from '@/shared/providers/AuthProvider'
import React from 'react'
import { Navigate } from 'react-router-dom'

interface PublicRouteProps {
  children: React.ReactNode
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background z-10">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Si el usuario ya está autenticado, redirigir al dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}