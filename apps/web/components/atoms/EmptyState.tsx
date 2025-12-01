import { Package } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// Empty State Component
// ============================================================================

interface EmptyStateProps {
    message?: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

export function EmptyState({
    message = 'Aucun élément trouvé',
    description,
    action,
    className
}: EmptyStateProps) {
    return (
        <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
            <Package size={48} className="text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-[#3f4c53] mb-2">{message}</h3>
            {description && (
                <p className="text-sm text-gray-600 mb-6 max-w-md">{description}</p>
            )}
            {action && (
                <button
                    onClick={action.onClick}
                    className="px-6 py-2 bg-[#fe0090] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
}
