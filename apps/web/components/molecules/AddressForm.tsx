'use client';

import { useState } from 'react';
import { Loader2, Save, X } from 'lucide-react';

interface Address {
    id?: string;
    firstName: string;
    lastName: string;
    company?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
    isDefault: boolean;
    isBilling: boolean;
    isShipping: boolean;
}

interface AddressFormProps {
    initialData?: Address;
    onSubmit: (data: Address) => Promise<void>;
    onCancel: () => void;
}

export function AddressForm({ initialData, onSubmit, onCancel }: AddressFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<Address>(
        initialData || {
            firstName: '',
            lastName: '',
            company: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            postalCode: '',
            country: 'France',
            phone: '',
            isDefault: false,
            isBilling: false,
            isShipping: true,
        }
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await onSubmit(formData);
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                    <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#fe0090] transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                    <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#fe0090] transition-colors"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Société (optionnel)</label>
                <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#fe0090] transition-colors"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Adresse *</label>
                <input
                    type="text"
                    required
                    value={formData.addressLine1}
                    onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#fe0090] transition-colors"
                    placeholder="Numéro et nom de rue"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Complément d'adresse</label>
                <input
                    type="text"
                    value={formData.addressLine2}
                    onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#fe0090] transition-colors"
                    placeholder="Appartement, étage, code d'accès..."
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Code postal *</label>
                    <input
                        type="text"
                        required
                        value={formData.postalCode}
                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#fe0090] transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ville *</label>
                    <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#fe0090] transition-colors"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pays *</label>
                    <select
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#fe0090] transition-colors bg-white"
                    >
                        <option value="France">France</option>
                        <option value="Belgique">Belgique</option>
                        <option value="Suisse">Suisse</option>
                        <option value="Luxembourg">Luxembourg</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                    <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#fe0090] transition-colors"
                    />
                </div>
            </div>

            <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                        type="checkbox"
                        checked={formData.isDefault}
                        onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                        className="w-5 h-5 text-[#fe0090] border-gray-300 rounded focus:ring-[#fe0090]"
                    />
                    <span className="text-gray-700">Définir comme adresse par défaut</span>
                </label>
            </div>

            <div className="flex gap-4 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-[#fe0090] text-white font-bold py-3 rounded-xl hover:bg-[#d4007a] transition-all duration-300 shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <Loader2 size={20} className="animate-spin" />
                            <span>Enregistrement...</span>
                        </>
                    ) : (
                        <>
                            <Save size={20} />
                            <span>Enregistrer</span>
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
