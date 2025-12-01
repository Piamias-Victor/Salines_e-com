import { PromotionForm } from '@/components/dashboard/PromotionForm';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditPromotionPage({ params }: PageProps) {
    const { id } = await params;
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/promotions/${id}`, {
        cache: 'no-store'
    });

    if (!res.ok) {
        return <div>Promotion introuvable</div>;
    }

    const promotion = await res.json();

    return <PromotionForm initialData={promotion} />;
}
