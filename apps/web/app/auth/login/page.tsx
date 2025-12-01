'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(email, password);
            router.push('/account');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur de connexion');
        } finally {
            setIsLoading(false);
            console.log('test')
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center py-4 md:py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                {/* Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Header */}
                    <div className="text-center mb-6 md:mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#fe0090] to-[#ff6b9d] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-pink-500/30">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#3f4c53] to-[#fe0090] bg-clip-text text-transparent mb-2">Bon retour !</h1>
                        <p className="text-gray-500 text-sm">Connectez-vous pour continuer</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 md:mb-6 p-3 md:p-4 bg-red-50/80 backdrop-blur border border-red-200 rounded-xl text-red-600 text-sm animate-in slide-in-from-top-2">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                        {/* Email */}
                        <div className="group">
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#fe0090] focus:ring-4 focus:ring-pink-500/10 transition-all duration-200 group-hover:border-gray-300"
                                    placeholder="votre@email.com"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="group">
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                Mot de passe
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-11 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#fe0090] focus:ring-4 focus:ring-pink-500/10 transition-all duration-200 group-hover:border-gray-300"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Forgot Password */}
                        <div className="text-right">
                            <Link href="/auth/forgot-password" className="text-sm text-[#fe0090] hover:underline">
                                Mot de passe oublié ?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-[#fe0090] to-[#ff6b9d] text-white font-bold py-3.5 md:py-4 rounded-xl hover:from-[#d4007a] hover:to-[#ff5a8f] transition-all duration-300 shadow-lg shadow-pink-500/40 hover:shadow-xl hover:shadow-pink-500/50 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center gap-2"
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

                    {/* Register Link */}
                    <div className="mt-6 md:mt-8 text-center">
                        <p className="text-gray-600 text-sm">
                            Pas encore de compte ?{' '}
                            <Link href="/auth/register" className="text-[#fe0090] font-semibold hover:underline">
                                Créer un compte
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
