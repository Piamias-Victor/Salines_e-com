'use client';

import { useState, useEffect } from 'react';
import { useCartContext } from '@/components/providers/CartProvider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { AlertCircle, Scale, Ruler, FileText, Phone } from 'lucide-react';

interface MedicalInfo {
    height: number;
    weight: number;
    agreement: boolean;
}

interface MedicalAssessmentModalProps {
    isOpen: boolean;
    onConfirm: (info: MedicalInfo) => void;
    onCancel: () => void;
}

export function MedicalAssessmentModal({ isOpen, onConfirm, onCancel }: MedicalAssessmentModalProps) {
    const { cart } = useCartContext();
    const [hasMedicines, setHasMedicines] = useState(false);

    // Form state
    const [height, setHeight] = useState<string>(''); // in cm
    const [weight, setWeight] = useState<string>(''); // in kg
    const [agreement, setAgreement] = useState(false);

    useEffect(() => {
        if (cart) {
            const medicineItems = cart.items.filter(item => item.product.isMedicament);
            setHasMedicines(medicineItems.length > 0);
        }
    }, [cart]);

    const handleConfirm = () => {
        if (!height || !weight || !agreement) return;

        onConfirm({
            height: parseInt(height),
            weight: parseInt(weight),
            agreement
        });
    };

    const isValid = height && weight && agreement && parseInt(height) > 0 && parseInt(weight) > 0;

    // Build mailto link
    const mailtoLink = "mailto:contact@grandepharmaciedessalines.com?subject=Demande de conseil pharmaceutique&body=Bonjour, je souhaite avoir un conseil concernant ma commande...";

    return (
        <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onCancel()}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-2 text-amber-600 mb-2">
                        <AlertCircle size={24} />
                        <span className="font-bold">Validation Pharmaceutique</span>
                    </div>
                    <DialogTitle className="text-xl">Informations requises</DialogTitle>
                    <DialogDescription>
                        Votre panier contient des médicaments. Pour valider votre commande et assurer votre sécurité, nous avons besoin de quelques informations complémentaires.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Medical Inputs */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Ruler size={16} />
                                Taille (cm)
                            </label>
                            <input
                                type="number"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                placeholder="ex: 175"
                                className="w-full p-2 border rounded-md focus:ring-[#fe0090] focus:border-[#fe0090]"
                                min="0"
                                max="300"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Scale size={16} />
                                Poids (kg)
                            </label>
                            <input
                                type="number"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                placeholder="ex: 70"
                                className="w-full p-2 border rounded-md focus:ring-[#fe0090] focus:border-[#fe0090]"
                                min="0"
                                max="500"
                            />
                        </div>
                    </div>

                    {/* Actions / Information */}
                    <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-sm text-gray-900">Besoin d'aide ?</h4>

                        <div className="flex flex-col gap-2">
                            <a
                                href={mailtoLink}
                                className="flex items-center gap-2 text-sm text-[#fe0090] hover:underline font-medium"
                            >
                                <Phone size={16} />
                                Contacter un pharmacien
                            </a>


                            <p className="text-xs text-gray-500">
                                Vous pouvez consulter les notices des médicaments directement sur les pages produits ou via les liens ci-dessous :
                            </p>

                            <ul className="mt-2 space-y-1">
                                {cart?.items
                                    .filter(item => item.product.isMedicament)
                                    .map(item => (
                                        <li key={item.id} className="text-xs flex items-center gap-2">
                                            <span className="text-gray-700">• {item.product.name}</span>
                                            {(item.product as any).notice && (
                                                <a
                                                    href={(item.product as any).notice}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[#fe0090] hover:underline"
                                                >
                                                    (Voir la notice)
                                                </a>
                                            )}
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>

                    {/* Agreement */}
                    <div className="flex items-start gap-3 pt-2">
                        <input
                            id="agreement"
                            type="checkbox"
                            checked={agreement}
                            onChange={(e) => setAgreement(e.target.checked)}
                            className="mt-1 w-4 h-4 text-[#fe0090] focus:ring-[#fe0090] border-gray-300 rounded cursor-pointer"
                        />
                        <label htmlFor="agreement" className="text-sm text-gray-700 cursor-pointer">
                            Je certifie que les informations renseignées sont exactes et j'ai pris connaissance des notices d'utilisation des médicaments présents dans mon panier.
                        </label>
                    </div>
                </div>

                <DialogFooter>
                    <button
                        onClick={handleConfirm}
                        disabled={!isValid}
                        className="w-full bg-[#fe0090] text-white font-bold py-3 rounded-xl hover:bg-[#d4007a] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Valider et passer au paiement
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
