'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Calendar, Save, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
    const { user, updateUser, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        gender: '' as '' | 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY',
        birthDate: '',
        newsletter: false,
    });

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/auth/login');
        }
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                phone: user.phone || '',
                gender: user.gender || '',
                birthDate: user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : '',
                newsletter: user.newsletter || false,
            });
        }
    }, [user, authLoading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            await updateUser({
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone || null,
                gender: formData.gender || null,
                birthDate: formData.birthDate ? new Date(formData.birthDate) : null,
                newsletter: formData.newsletter,
            });
            setSuccess('Profil mis à jour avec succès');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
        } finally {
            setIsLoading(false);
        }
    };

    if (authLoading || !user) {
        return (
            <div className="min-h-screen bg-gray-50 pt-16 md:pt-24 pb-12 flex items-center justify-center">
                <Loader2 size={48} className="animate-spin text-[#fe0090]" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-16 md:pt-24 pb-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <Link
                    href="/account"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-[#fe0090] mb-6 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Retour au compte</span>
                </Link>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-[#3f4c53] mb-2">Mon profil</h1>
                        <p className="text-gray-500">Gérer mes informations personnelles</p>
                    </div>

                    {/* Success Message */}
                    {success && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm">
                            {success}
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                                    Prénom *
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        id="firstName"
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        required
                                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#fe0090] transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                                    Nom *
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        id="lastName"
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        required
                                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#fe0090] transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Email (Read-only) */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                                />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">L'email ne peut pas être modifié</p>
                        </div>

                        {/* Phone & Birth Date */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                    Téléphone
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        id="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#fe0090] transition-colors"
                                        placeholder="06 12 34 56 78"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
                                    Date de naissance
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        id="birthDate"
                                        type="date"
                                        value={formData.birthDate}
                                        onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#fe0090] transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Genre
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                    { value: 'MALE', label: 'Homme' },
                                    { value: 'FEMALE', label: 'Femme' },
                                    { value: 'OTHER', label: 'Autre' },
                                    { value: 'PREFER_NOT_TO_SAY', label: 'Non précisé' },
                                ].map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, gender: option.value as any })}
                                        className={`py-3 px-4 rounded-xl border-2 transition-all ${formData.gender === option.value
                                            ? 'border-[#fe0090] bg-pink-50 text-[#fe0090] font-semibold'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Newsletter */}
                        <div className="flex items-start gap-3 p-4 bg-pink-50 rounded-xl border border-pink-100">
                            <input
                                id="newsletter"
                                type="checkbox"
                                checked={formData.newsletter}
                                onChange={(e) => setFormData({ ...formData, newsletter: e.target.checked })}
                                className="mt-1 w-5 h-5 text-[#fe0090] border-gray-300 rounded focus:ring-[#fe0090]"
                            />
                            <label htmlFor="newsletter" className="text-sm text-gray-700">
                                Je souhaite recevoir les offres et actualités par email
                            </label>
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 bg-[#fe0090] text-white font-bold py-4 rounded-xl hover:bg-[#d4007a] transition-all duration-300 shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        <span>Enregistrement...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save size={20} />
                                        <span>Enregistrer les modifications</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Change Password Link */}
                    <div className="mt-8 pt-8 border-t border-gray-200">
                        <Link
                            href="/account/change-password"
                            className="text-[#fe0090] font-semibold hover:underline"
                        >
                            Modifier mon mot de passe →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
