import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface FormSectionProps {
    icon: LucideIcon;
    title: string;
    description?: string;
    children: ReactNode;
}

export function FormSection({ icon: Icon, title, description, children }: FormSectionProps) {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
            <div className="flex items-start gap-3 pb-4 border-b border-gray-200">
                <div className="p-2 bg-[#fef9fc] rounded-lg">
                    <Icon size={24} className="text-[#fe0090]" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                    {description && (
                        <p className="text-sm text-gray-600 mt-1">{description}</p>
                    )}
                </div>
            </div>
            <div className="space-y-4">
                {children}
            </div>
        </div>
    );
}
