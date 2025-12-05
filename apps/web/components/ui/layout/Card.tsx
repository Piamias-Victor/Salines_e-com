import { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hover?: boolean;
}

const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
};

export function Card({ children, className = '', padding = 'md', hover = false }: CardProps) {
    const hoverStyles = hover ? 'hover:shadow-lg hover:border-[#fe0090]/20 transition-all duration-200' : '';

    return (
        <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${paddingStyles[padding]} ${hoverStyles} ${className}`}>
            {children}
        </div>
    );
}
