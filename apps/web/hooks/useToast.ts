import { useState } from 'react';

export function useToast() {
    const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'error' | 'info' }>>([]);

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        const id = Date.now().toString();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    };

    const success = (message: string) => showToast(message, 'success');
    const error = (message: string) => showToast(message, 'error');
    const info = (message: string) => showToast(message, 'info');

    return {
        toasts,
        showToast,
        success,
        error,
        info,
    };
}
