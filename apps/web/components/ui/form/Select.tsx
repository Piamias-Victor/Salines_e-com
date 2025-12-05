import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    fullWidth?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ fullWidth = false, className = '', children, ...props }, ref) => {
        const baseStyles = 'px-4 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#fe0090] focus:border-transparent transition-all duration-200 cursor-pointer';
        const widthClass = fullWidth ? 'w-full' : '';

        return (
            <select
                ref={ref}
                className={`${baseStyles} ${widthClass} ${className}`}
                {...props}
            >
                {children}
            </select>
        );
    }
);

Select.displayName = 'Select';
