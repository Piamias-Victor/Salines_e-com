'use client';

import { CheckoutProvider } from '@/contexts/CheckoutContext';
import { usePathname } from 'next/navigation';
import { Check, ChevronRight } from 'lucide-react';

const steps = [
    { id: 1, name: 'Identification', path: '/checkout/login' },
    { id: 2, name: 'Livraison', path: '/checkout/delivery' },
    { id: 3, name: 'Paiement', path: '/checkout/payment' },
];

function CheckoutSteps() {
    const pathname = usePathname();

    // Hide steps on success page
    if (pathname.includes('/checkout/success')) {
        return null;
    }

    // Determine current step based on path
    const currentStepIndex = steps.findIndex(step => pathname.includes(step.path));
    const currentStepId = currentStepIndex !== -1 ? steps[currentStepIndex].id : 1;

    return (
        <div className="py-8">
            <div className="max-w-4xl mx-auto px-4">
                <nav aria-label="Progress">
                    <ol role="list" className="flex items-center justify-center">
                        {steps.map((step, stepIdx) => (
                            <li key={step.name} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
                                {step.id < currentStepId ? (
                                    <>
                                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                            <div className="h-0.5 w-full bg-[#fe0090]" />
                                        </div>
                                        <div className="relative flex flex-col items-center">
                                            <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[#fe0090] hover:bg-[#d4007a]">
                                                <Check className="h-5 w-5 text-white" aria-hidden="true" />
                                                <span className="sr-only">{step.name}</span>
                                            </div>
                                            <div className="absolute top-10 w-32 text-center hidden sm:block">
                                                <span className="text-xs font-medium text-gray-900">
                                                    {step.name}
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                ) : step.id === currentStepId ? (
                                    <>
                                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                            <div className="h-0.5 w-full bg-gray-200" />
                                        </div>
                                        <div className="relative flex flex-col items-center">
                                            <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#fe0090] bg-white" aria-current="step">
                                                <span className="h-2.5 w-2.5 rounded-full bg-[#fe0090]" aria-hidden="true" />
                                                <span className="sr-only">{step.name}</span>
                                            </div>
                                            <div className="absolute top-10 w-32 text-center hidden sm:block">
                                                <span className="text-xs font-medium text-[#fe0090]">
                                                    {step.name}
                                                </span>
                                            </div>
                                            {/* Mobile: Only show current step label */}
                                            <div className="absolute top-10 w-max text-center sm:hidden block">
                                                <span className="text-[10px] font-medium text-[#fe0090]">
                                                    {step.name}
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                            <div className="h-0.5 w-full bg-gray-200" />
                                        </div>
                                        <div className="relative flex flex-col items-center">
                                            <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white hover:border-gray-400">
                                                <span className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300" aria-hidden="true" />
                                                <span className="sr-only">{step.name}</span>
                                            </div>
                                            <div className="absolute top-10 w-32 text-center hidden sm:block">
                                                <span className="text-xs font-medium text-gray-500">
                                                    {step.name}
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </li>
                        ))}
                    </ol>
                </nav>
            </div>
        </div>
    );
}

export default function CheckoutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <CheckoutProvider>
            <div className="min-h-screen bg-gray-50 pt-20 pb-12">
                <CheckoutSteps />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                    {children}
                </main>
            </div>
        </CheckoutProvider>
    );
}
