'use client';

import { Calendar } from 'lucide-react';

interface CategoryStatusProps {
    formData: {
        isActive: boolean;
        startDate: string;
        endDate: string;
    };
    onChange: (field: string, value: string | boolean) => void;
}

export function CategoryStatus({ formData, onChange }: CategoryStatusProps) {
    return (
        <>
            <label className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all border mb-6 ${formData.isActive ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                <div>
                    <span className={`block font-medium ${formData.isActive ? 'text-green-700' : 'text-gray-700'}`}>
                        {formData.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-xs text-gray-500">
                        {formData.isActive ? 'Visible sur le site' : 'Cachée du site'}
                    </span>
                </div>
                <div className={`w-12 h-7 flex items-center rounded-full p-1 duration-300 ease-in-out ${formData.isActive ? 'bg-green-500' : 'bg-gray-300'}`}>
                    <div className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ease-in-out ${formData.isActive ? 'translate-x-5' : ''}`} />
                </div>
                <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => onChange('isActive', e.target.checked)}
                    className="hidden"
                />
            </label>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Date de début (Optionnel)</label>
                    <div className="relative">
                        <input
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => onChange('startDate', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090]"
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Date de fin (Optionnel)</label>
                    <div className="relative">
                        <input
                            type="date"
                            value={formData.endDate}
                            onChange={(e) => onChange('endDate', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#fe0090]/20 focus:border-[#fe0090]"
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                </div>
            </div>
        </>
    );
}
