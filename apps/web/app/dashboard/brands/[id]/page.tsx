import { BrandForm } from '@/components/dashboard/BrandForm';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditBrandPage({ params }: PageProps) {
    const { id } = await params;

    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/brands/${id}`, {
        cache: 'no-store'
    });

    if (!res.ok) {
        return <div>Marque non trouvée</div>;
    }

    const brand = await res.json();

    return <BrandForm initialData={brand} />;
}
