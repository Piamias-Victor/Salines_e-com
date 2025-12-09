interface CategoryDescriptionProps {
    categoryName: string;
    description: string;
}

export function CategoryDescription({ categoryName, description }: CategoryDescriptionProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-8 lg:p-12 overflow-hidden">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
                    Tout savoir sur {categoryName}
                </h2>
                <div className="prose prose-lg max-w-none">
                    <div
                        className="text-gray-700 leading-relaxed space-y-4 prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-ul:list-disc prose-ul:pl-5 prose-strong:text-gray-900 break-words max-w-full"
                        dangerouslySetInnerHTML={{ __html: description }}
                    />
                </div>
            </div>
        </div>
    );
}
