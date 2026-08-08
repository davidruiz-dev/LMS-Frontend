import { LoadingSpinner } from '@/components/ui/loading-spinner'
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuthContext'

interface PublicRouteProps {
  children: React.ReactNode
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()

  return (
  <>
    {isLoading && (
      <div className="fixed inset-0 flex items-center justify-center bg-background z-10">
        <LoadingSpinner size="lg" />
      </div>
    )}

    {!isAuthenticated && children}

    {isAuthenticated && <Navigate to="/dashboard" replace />}
  </>
)

}