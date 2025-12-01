import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// Error Message Component
// ============================================================================

interface ErrorMessageProps {
    message?: string;
    onRetry?: () => void;
    className?: string;
}

export function ErrorMessage({
    message = 'Une erreur est survenue',
    onRetry,
    className
}: ErrorMessageProps) {
    return (
        <div className={cn('flex flex-col items-center justify-center py-12', className)}>
            <div className="flex items-center gap-3 text-red-600 mb-4">
                <AlertCircle size={24} />
                <p className="text-base font-medium">{message}</p>
            </div>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="px-6 py-2 bg-[#fe0090] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                    Réessayer
                </button>
            )}
        </div>
    );
}
