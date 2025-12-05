import { ReactNode } from 'react';

interface TooltipProps {
    content: string;
    children: ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
}

const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

export function Tooltip({ content, children, position = 'top' }: TooltipProps) {
    return (
        <div className="group relative inline-block">
            {children}
            <div className={`absolute ${positionStyles[position]} hidden group-hover:block z-50 w-max max-w-xs px-3 py-2 bg-[#3f4c53] text-white text-xs rounded-lg shadow-lg pointer-events-none`}>
                {content}
            </div>
        </div>
    );
}
