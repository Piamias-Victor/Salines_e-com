import { auth } from "@/lib/auth/auth";
import { Package, FolderTree, Tag, Percent } from "lucide-react";

export default async function DashboardPage() {
    const session = await auth();

    const stats = [
        {
            name: "Produits",
            value: "0",
            icon: Package,
            color: "bg-blue-500",
        },
        {
            name: "Catégories",
            value: "13",
            icon: FolderTree,
            color: "bg-green-500",
        },
        {
            name: "Marques",
            value: "10",
            icon: Tag,
            color: "bg-purple-500",
        },
        {
            name: "Promotions",
            value: "4",
            icon: Percent,
            color: "bg-pink-500",
        },
    ];

    return (
        <div>
            {/* Welcome */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#3f4c53] mb-2">
                    Bienvenue, {session?.user?.name || "Admin"} 👋
                </h1>
                <p className="text-gray-600">
                    Voici un aperçu de votre pharmacie
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.name}
                            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                                    <Icon size={24} className="text-white" />
                                </div>
                            </div>
                            <h3 className="text-gray-600 text-sm font-medium mb-1">
                                {stat.name}
                            </h3>
                            <p className="text-3xl font-bold text-[#3f4c53]">
                                {stat.value}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-[#3f4c53] mb-4">
                    Actions rapides
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <a
                        href="/dashboard/products/new"
                        className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#fe0090] hover:bg-pink-50 transition-all text-center"
                    >
                        <Package size={32} className="mx-auto mb-2 text-gray-400" />
                        <p className="font-medium text-gray-700">Ajouter un produit</p>
                    </a>
                    <a
                        href="/dashboard/categories/new"
                        className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#fe0090] hover:bg-pink-50 transition-all text-center"
                    >
                        <FolderTree size={32} className="mx-auto mb-2 text-gray-400" />
                        <p className="font-medium text-gray-700">Ajouter une catégorie</p>
                    </a>
                    <a
                        href="/dashboard/promotions/new"
                        className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#fe0090] hover:bg-pink-50 transition-all text-center"
                    >
                        <Percent size={32} className="mx-auto mb-2 text-gray-400" />
                        <p className="font-medium text-gray-700">Créer une promotion</p>
                    </a>
                </div>
            </div>
        </div>
    );
}
