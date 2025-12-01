import { memo } from 'react';
import { User, Phone, MapPin, Building } from 'lucide-react';
import { type Address } from '@/contexts/CheckoutContext';

interface AddressFormProps {
    formData: Address;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AddressForm = memo(function AddressForm({ formData, onChange }: AddressFormProps) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-xl font-bold text-[#3f4c53] mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#fe0090] text-white flex items-center justify-center text-sm">
                    1
                </span>
                Vos coordonnées
            </h2>

            <div className="space-y-6">
                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={onChange}
                                required
                                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#fe0090] transition-colors"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={onChange}
                                required
                                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#fe0090] transition-colors"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={onChange}
                            required
                            className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#fe0090] transition-colors"
                            placeholder="06 12 34 56 78"
                        />
                    </div>
                </div>

                {/* Shipping Address */}
                <div className="pt-4 border-t border-gray-100">
                    <h3 className="font-medium text-gray-900 mb-4">Adresse de livraison</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Adresse *</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    name="addressLine1"
                                    value={formData.addressLine1}
                                    onChange={onChange}
                                    required
                                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#fe0090] transition-colors"
                                    placeholder="123 rue de la Paix"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Complément d'adresse</label>
                            <div className="relative">
                                <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    name="addressLine2"
                                    value={formData.addressLine2}
                                    onChange={onChange}
                                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#fe0090] transition-colors"
                                    placeholder="Bâtiment B, Étage 2..."
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Code postal *</label>
                                <input
                                    type="text"
                                    name="postalCode"
                                    value={formData.postalCode}
                                    onChange={onChange}
                                    required
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#fe0090] transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Ville *</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={onChange}
                                    required
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#fe0090] transition-colors"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});
