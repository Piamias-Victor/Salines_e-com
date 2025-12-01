import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ fullWidth = false, className = '', ...props }, ref) => {
        const baseStyles = 'px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#fe0090] focus:border-transparent transition-all duration-200';
        const widthClass = fullWidth ? 'w-full' : '';

        return (
            <input
                ref={ref}
                className={`${baseStyles} ${widthClass} ${className}`}
                {...props}
            />
        );
    }
);

Input.displayName = 'Input';
