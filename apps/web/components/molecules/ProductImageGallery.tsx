'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Package } from 'lucide-react';

interface ProductImageGalleryProps {
    images: { id: string; url: string }[];
    mainImage: string | null;
    productName: string;
}

export function ProductImageGallery({ images, mainImage, productName }: ProductImageGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(mainImage);
    const galleryImages = images.length > 0 ? images : (mainImage ? [{ id: 'main', url: mainImage }] : []);

    return (
        <div className="space-y-4 md:sticky md:top-24">
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100">
                {selectedImage ? (
                    <Image
                        src={selectedImage}
                        alt={productName}
                        fill
                        className="object-contain p-8 hover:scale-105 transition-transform duration-500"
                        priority
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                        <Package size={64} className="text-gray-300" />
                    </div>
                )}
            </div>

            {/* Thumbnail Gallery */}
            {galleryImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 md:grid md:grid-cols-5">
                    {galleryImages.map((image, index) => (
                        <button
                            key={image.id || index}
                            onClick={() => setSelectedImage(image.url)}
                            className={`relative flex-shrink-0 w-20 md:w-auto aspect-square rounded-lg overflow-hidden bg-white border transition-all ${selectedImage === image.url ? 'border-[#fe0090] ring-1 ring-[#fe0090]' : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <Image
                                src={image.url}
                                alt={`${productName} - Image ${index + 1}`}
                                fill
                                className="object-contain p-2"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
