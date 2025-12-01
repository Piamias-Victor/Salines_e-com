import { useState } from 'react';
import { User, Lock, Loader2, UserPlus } from 'lucide-react';
import Link from 'next/link';

interface LoginFormProps {
    onSubmit: (email: string, password: string) => Promise<void>;
    error?: string;
}

export function LoginForm({ onSubmit, error }: LoginFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await onSubmit(email, password);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-[#3f4c53] mb-4">Déjà client ?</h2>
            <p className="text-gray-500 mb-6">Connectez-vous pour retrouver vos adresses et gagner du temps.</p>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            id="login-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#fe0090] transition-colors"
                            placeholder="votre@email.com"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-2">
                        Mot de passe
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            id="login-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#fe0090] transition-colors"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <div className="text-right">
                    <Link href="/auth/forgot-password" className="text-sm text-[#fe0090] hover:underline">
                        Mot de passe oublié ?
                    </Link>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#fe0090] text-white font-bold py-4 rounded-xl hover:bg-[#d4007a] transition-all duration-300 shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <Loader2 size={20} className="animate-spin" />
                            <span>Connexion...</span>
                        </>
                    ) : (
                        <span>Se connecter</span>
                    )}
                </button>
            </form>

            <div className="mt-8 pt-8 border-t border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Pas encore de compte ?</h3>
                <Link
                    href="/auth/register?redirect=/checkout/delivery"
                    className="w-full bg-white border-2 border-gray-200 text-gray-700 font-bold py-4 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 flex items-center justify-center gap-2"
                >
                    <UserPlus size={20} />
                    <span>Créer un compte</span>
                </Link>
            </div>
        </div>
    );
}
