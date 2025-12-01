import type { Tab, ShowcaseSubTab, SearchSubTab } from '@/lib/types/showcase';

interface ShowcaseTabsProps {
    activeTab: Tab;
    setActiveTab: (tab: Tab) => void;
}

const tabs = [
    { id: 'mega-menu' as const, label: 'Mega Menu' },
    { id: 'showcase' as const, label: 'Mise en avant (Accueil)' },
    { id: 'search' as const, label: 'Barre de recherche' },
    { id: 'footer' as const, label: 'Footer' },
];

export function ShowcaseTabs({ activeTab, setActiveTab }: ShowcaseTabsProps) {
    return (
        <div className="flex gap-2 mb-8 border-b border-gray-200">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3 font-medium transition-all border-b-2 ${activeTab === tab.id
                            ? 'border-[#fe0090] text-[#fe0090]'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}

interface ShowcaseSubTabsProps {
    activeSubTab: ShowcaseSubTab;
    setActiveSubTab: (tab: ShowcaseSubTab) => void;
}

const showcaseSubTabs = [
    { id: 'univers' as const, label: 'Nos Univers' },
    { id: 'brands' as const, label: 'Nos Marques' },
    { id: 'products' as const, label: 'Sélection Pharmacien' },
];

export function ShowcaseSubTabs({ activeSubTab, setActiveSubTab }: ShowcaseSubTabsProps) {
    return (
        <div className="flex gap-2 mb-6">
            {showcaseSubTabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveSubTab(tab.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeSubTab === tab.id
                            ? 'bg-gray-900 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}

interface SearchSubTabsProps {
    activeSubTab: SearchSubTab;
    setActiveSubTab: (tab: SearchSubTab) => void;
}

const searchSubTabs = [
    { id: 'categories' as const, label: 'Catégories' },
    { id: 'brands' as const, label: 'Marques' },
];

export function SearchSubTabs({ activeSubTab, setActiveSubTab }: SearchSubTabsProps) {
    return (
        <div className="flex gap-2 mb-6">
            {searchSubTabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveSubTab(tab.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeSubTab === tab.id
                            ? 'bg-gray-900 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
