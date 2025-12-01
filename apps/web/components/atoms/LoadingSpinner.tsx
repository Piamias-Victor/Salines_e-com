import { cn } from '@/lib/utils';

// ============================================================================
// Loading Spinner Component
// ============================================================================

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4',
    };

    return (
        <div
            className={cn(
                'animate-spin rounded-full border-[#fe0090] border-t-transparent',
                sizeClasses[size],
                className
            )}
            role="status"
            aria-label="Chargement"
        >
            <span className="sr-only">Chargement...</span>
        </div>
    );
}

// ============================================================================
// Loading Container Component
// ============================================================================

interface LoadingContainerProps {
    message?: string;
    className?: string;
}

export function LoadingContainer({ message = 'Chargement...', className }: LoadingContainerProps) {
    return (
        <div className={cn('flex flex-col items-center justify-center py-12', className)}>
            <LoadingSpinner size="lg" />
            {message && (
                <p className="mt-4 text-[#3f4c53] text-sm font-medium">{message}</p>
            )}
        </div>
    );
}
