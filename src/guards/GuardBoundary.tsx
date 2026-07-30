import { Navigate } from 'react-router-dom'
import type { JSX } from 'react'
import type { GuardState } from '@/features/courses/hooks/use-course-guard'

export function GuardBoundary({
  state,
  children,
}: {
  state: GuardState
  children: JSX.Element
}) {
  if (state === 'loading') return null
  if (state === 'not-found') return <Navigate to="/" replace />
  if (state === 'forbidden') return <Navigate to="/" replace />
  return children
}
