import Link from 'next/link';

interface RgpdNoticeProps {
    show: boolean;
}

export function RgpdNotice({ show }: RgpdNoticeProps) {
    return (
        <div
            className={`overflow-hidden transition-all duration-300 ${show ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
        >
            <div className="text-xs text-gray-500 leading-relaxed space-y-2 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                <p className="font-medium text-gray-700">Protection de vos données personnelles</p>
                <p>
                    Les données transmises sont destinées à <strong>Salines Parapharmacie</strong>, responsable de traitement.
                    Elles sont traitées avec votre consentement pour vous envoyer des informations commerciales personnalisées par e-mail.
                </p>
                <p>
                    Vous pouvez retirer votre consentement via les liens de désabonnement dans chaque email.
                    Vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, de portabilité
                    et d'opposition aux données vous concernant.
                </p>
                <p>
                    Pour exercer ces droits : {' '}
                    <a href="mailto:donneespersonnelles@salines-parapharmacie.com" className="text-[#FE0090] hover:underline font-medium">
                        donneespersonnelles@salines-parapharmacie.com
                    </a>
                    {' '}ou par courrier à : Salines Parapharmacie - DPO - Ajaccio - Corse - France.{' '}
                    <Link href="/privacy" className="text-[#FE0090] hover:underline font-medium">
                        En savoir plus
                    </Link>
                </p>
            </div>
        </div>
    );
}
