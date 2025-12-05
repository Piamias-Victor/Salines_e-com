import { ReactNode } from 'react';
import { Info } from 'lucide-react';

interface FormFieldProps {
    label: string;
    name: string;
    error?: string;
    tooltip?: string;
    required?: boolean;
    children: ReactNode;
}

export function FormField({ label, name, error, tooltip, required, children }: FormFieldProps) {
    return (
        <div className="space-y-2">
            <label htmlFor={name} className="flex items-center gap-2 text-sm font-medium text-foreground">
                {label}
                {required && <span className="text-[#fe0090]">*</span>}
                {tooltip && (
                    <div className="group relative">
                        <Info size={16} className="text-gray-400 cursor-help" />
                        <div className="absolute left-0 top-6 hidden group-hover:block z-10 w-64 p-2 bg-[#3f4c53] text-white text-xs rounded-lg shadow-lg">
                            {tooltip}
                        </div>
                    </div>
                )}
            </label>
            {children}
            {error && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                    {error}
                </p>
            )}
        </div>
    );
}
