import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface LazyWrapperProps {
  children: React.ReactNode;
}

export const LazyWrapper = ({ children }: LazyWrapperProps) => (
  <Suspense fallback={<LoadingSpinner />}>
    {children}
  </Suspense>
);