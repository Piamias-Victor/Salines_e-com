'use client';

export function AnnouncementBar() {
    const message = "Livraison Offerte dès 49€ d'achats";

    return (
        <div className="bg-[#fe0090] text-white py-2 overflow-hidden">
            <div className="flex whitespace-nowrap">
                <div className="animate-scroll flex gap-8">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <span key={i} className="text-sm font-medium">
                            {message}
                        </span>
                    ))}
                </div>
                <div className="animate-scroll flex gap-8" aria-hidden="true">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <span key={i} className="text-sm font-medium">
                            {message}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
