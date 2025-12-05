import { InputHTMLAttributes, forwardRef } from 'react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ label, className = '', ...props }, ref) => {
        const baseStyles = 'w-4 h-4 rounded border-gray-300 text-[#fe0090] focus:ring-2 focus:ring-[#fe0090] focus:ring-offset-0 transition-all duration-200 cursor-pointer';

        if (label) {
            return (
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        ref={ref}
                        type="checkbox"
                        className={`${baseStyles} ${className}`}
                        {...props}
                    />
                    <span className="text-sm text-foreground select-none">{label}</span>
                </label>
            );
        }

        return (
            <input
                ref={ref}
                type="checkbox"
                className={`${baseStyles} ${className}`}
                {...props}
            />
        );
    }
);

Checkbox.displayName = 'Checkbox';
