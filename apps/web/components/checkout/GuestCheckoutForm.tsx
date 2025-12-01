import { useState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';

interface GuestCheckoutFormProps {
    onSubmit: (email: string) => void;
}

export function GuestCheckoutForm({ onSubmit }: GuestCheckoutFormProps) {
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) onSubmit(email);
    };

    return (
        <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
            <h2 className="text-2xl font-bold text-[#3f4c53] mb-4">Commander sans compte</h2>
            <p className="text-gray-500 mb-6">
                Vous pourrez créer un compte optionnellement après votre commande pour suivre son statut.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="guest-email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email pour le suivi de commande
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            id="guest-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#fe0090] transition-colors bg-white"
                            placeholder="votre@email.com"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-gray-900/20"
                >
                    <span>Continuer en invité</span>
                    <ArrowRight size={20} />
                </button>
            </form>

            <div className="mt-8">
                <h3 className="font-bold text-gray-900 mb-2">Pourquoi créer un compte ?</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#fe0090]" />
                        Suivi de commande en temps réel
                    </li>
                    <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#fe0090]" />
                        Historique des achats
                    </li>
                    <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#fe0090]" />
                        Sauvegarde de vos adresses
                    </li>
                </ul>
            </div>
        </div>
    );
}
