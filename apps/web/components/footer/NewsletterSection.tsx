import { Mail } from 'lucide-react';
import { useNewsletterForm } from '@/hooks/useNewsletterForm';
import { RgpdNotice } from './RgpdNotice';

export function NewsletterSection() {
    const {
        email,
        setEmail,
        showRgpd,
        handleSubmit,
        handleFocus,
        handleBlur,
    } = useNewsletterForm();

    return (
        <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FE0090] to-[#ff4db8] flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Newsletter</h3>
            </div>
            <p className="text-lg font-semibold text-gray-900 mb-2">
                Votre dose quotidienne de bien-être !
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
                Inscrivez-vous à notre newsletter pour recevoir en exclusivité nos dernières nouveautés,
                conseils beauté et offres spéciales. Profitez d'une sélection personnalisée rien que pour vous !
            </p>

            <form onSubmit={handleSubmit} className="max-w-2xl">
                <div className="flex flex-col sm:flex-row gap-3 mb-3">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        placeholder="Votre adresse email"
                        required
                        className="flex-1 px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FE0090] focus:ring-2 focus:ring-[#FE0090]/20 transition-all"
                    />
                    <button
                        type="submit"
                        className="px-8 py-3 bg-gradient-to-r from-[#FE0090] to-[#ff4db8] text-white rounded-lg font-semibold hover:shadow-lg transition-all hover:scale-105 whitespace-nowrap"
                    >
                        S'inscrire
                    </button>
                </div>

                <RgpdNotice show={showRgpd} />
            </form>
        </div>
    );
}
