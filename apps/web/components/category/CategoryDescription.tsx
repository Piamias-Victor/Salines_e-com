interface CategoryDescriptionProps {
    categoryName: string;
    description: string;
}

export function CategoryDescription({ categoryName, description }: CategoryDescriptionProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-8 lg:p-12">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                    Tout savoir sur {categoryName}
                </h2>
                <div className="prose prose-lg max-w-none">
                    <div className="text-gray-700 leading-relaxed space-y-4">
                        {description.split('\n\n').map((paragraph, index) => (
                            <p key={index} className="text-justify">
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
