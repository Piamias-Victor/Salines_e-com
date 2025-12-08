'use client';

import { useState } from 'react';
import { FileText, Info, Lightbulb } from 'lucide-react';

interface ProductInfoTabsProps {
    description: string | null;
    composition: string | null;
    usageTips: string | null;
}

type TabType = 'description' | 'composition' | 'usage';

export function ProductInfoTabs({ description, composition, usageTips }: ProductInfoTabsProps) {
    const [activeTab, setActiveTab] = useState<TabType>('description');

    const tabs = [
        {
            id: 'description' as TabType,
            label: 'Description',
            icon: Info,
            content: description,
        },
        {
            id: 'composition' as TabType,
            label: 'Composition',
            icon: FileText,
            content: composition,
        },
        {
            id: 'usage' as TabType,
            label: 'Conseils d\'utilisation',
            icon: Lightbulb,
            content: usageTips,
        },
    ].filter(tab => tab.content); // Only show tabs with content

    if (tabs.length === 0) return null;

    return (
        <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Mobile: Vertical tabs / Desktop: Horizontal tabs */}
            <div className="flex flex-col md:flex-row md:border-b md:border-gray-100">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                flex items-center gap-2 px-6 py-4
                                font-medium text-sm transition-all relative
                                md:flex-1 md:justify-center
                                ${isActive
                                    ? 'text-[#fe0090] bg-pink-50/50 border-l-4 md:border-l-0 md:border-b-2 border-[#fe0090]'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l-4 md:border-l-0 border-transparent'
                                }
                            `}
                        >
                            <Icon size={18} className={isActive ? 'text-[#fe0090]' : 'text-gray-400'} />
                            <span className="whitespace-nowrap">{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            <div className="p-6 md:p-8">
                {tabs.map((tab) => (
                    <div
                        key={tab.id}
                        className={`
                            prose prose-sm md:prose-base max-w-none
                            ${activeTab === tab.id ? 'block' : 'hidden'}
                        `}
                        dangerouslySetInnerHTML={{ __html: tab.content || '' }}
                    />
                ))}
            </div>
        </div>
    );
}
