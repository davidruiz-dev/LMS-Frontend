import React from 'react';
import { cn } from '../../lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-1',
    md: 'h-12 w-12 border-2',
    lg: 'h-28 w-28 border-4'
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-current border-t-transparent text-primary',
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};