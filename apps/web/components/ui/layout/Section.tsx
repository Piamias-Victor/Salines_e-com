import { ReactNode } from 'react';

interface SectionProps {
    children: ReactNode;
    className?: string;
    spacing?: 'none' | 'sm' | 'md' | 'lg';
}

const spacingStyles = {
    none: '',
    sm: 'space-y-4',
    md: 'space-y-6',
    lg: 'space-y-8',
};

export function Section({ children, className = '', spacing = 'md' }: SectionProps) {
    return (
        <section className={`${spacingStyles[spacing]} ${className}`}>
            {children}
        </section>
    );
}
