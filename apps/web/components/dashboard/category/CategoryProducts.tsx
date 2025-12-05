'use client';

import { ProductPicker } from '../ProductPicker';

interface CategoryProductsProps {
    selectedProductIds: string[];
    onChange: (ids: string[]) => void;
}

export function CategoryProducts({ selectedProductIds, onChange }: CategoryProductsProps) {
    return (
        <div className="p-6">
            <ProductPicker
                selectedProductIds={selectedProductIds}
                onChange={onChange}
            />
        </div>
    );
}
