import { LucideIcon } from 'lucide-react';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    icon?: LucideIcon;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = 'primary', size = 'md', icon: Icon, children, className = '', ...props }, ref) => {
        const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

        const variants = {
            primary: 'bg-[#fe0090] text-white hover:bg-[#d0007a] active:scale-95',
            secondary: 'bg-[#fef000] text-[#3f4c53] hover:bg-[#e6d900] active:scale-95',
            ghost: 'bg-transparent text-[#3f4c53] hover:bg-gray-100 active:scale-95',
        };

        const sizes = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-4 py-2 text-base',
            lg: 'px-6 py-3 text-lg',
        };

        return (
            <button
                ref={ref}
                className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
                {...props}
            >
                {Icon && <Icon size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
