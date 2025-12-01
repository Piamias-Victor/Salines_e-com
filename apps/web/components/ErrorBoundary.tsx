'use client';

import { Component, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: any) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                    <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="text-red-600" size={32} />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Oups !</h1>
                        <p className="text-gray-600 mb-6">
                            Une erreur inattendue s'est produite. Veuillez rafraîchir la page.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-[#fe0090] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#d4007a] transition-colors"
                        >
                            Rafraîchir la page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
