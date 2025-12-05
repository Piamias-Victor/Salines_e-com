import { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    fullWidth?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ fullWidth = false, className = '', ...props }, ref) => {
        const baseStyles = 'px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#fe0090] focus:border-transparent transition-all duration-200 resize-vertical';
        const widthClass = fullWidth ? 'w-full' : '';

        return (
            <textarea
                ref={ref}
                className={`${baseStyles} ${widthClass} ${className}`}
                {...props}
            />
        );
    }
);

Textarea.displayName = 'Textarea';
