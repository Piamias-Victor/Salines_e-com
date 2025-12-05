'use client';

interface ProductStatusProps {
    isActive: boolean;
    onChange: (isActive: boolean) => void;
}

export function ProductStatus({ isActive, onChange }: ProductStatusProps) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">État du produit</h3>
            <label className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all border ${isActive ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                <div>
                    <span className={`block font-medium ${isActive ? 'text-green-700' : 'text-gray-700'}`}>
                        {isActive ? 'En ligne' : 'Hors ligne'}
                    </span>
                    <span className="text-xs text-gray-500">
                        {isActive ? 'Visible par les clients' : 'Caché de la boutique'}
                    </span>
                </div>
                <div className={`w-12 h-7 flex items-center rounded-full p-1 duration-300 ease-in-out ${isActive ? 'bg-green-500' : 'bg-gray-300'}`}>
                    <div className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ease-in-out ${isActive ? 'translate-x-5' : ''}`} />
                </div>
                <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => onChange(e.target.checked)}
                    className="hidden"
                />
            </label>
        </div>
    );
}
