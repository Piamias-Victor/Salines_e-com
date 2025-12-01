import { BannerForm } from '@/components/dashboard/BannerForm';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditBannerPage({ params }: PageProps) {
    const { id } = await params;

    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/banners/${id}`, {
        cache: 'no-store'
    });

    if (!res.ok) {
        return <div>Bannière non trouvée</div>;
    }

    const banner = await res.json();

    return <BannerForm initialData={banner} />;
}
