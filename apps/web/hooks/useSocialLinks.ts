import { useState, useEffect } from 'react';

interface SocialLinks {
    facebook: string | null;
    instagram: string | null;
    twitter: string | null;
    linkedin: string | null;
    tiktok: string | null;
}

export function useSocialLinks() {
    const [socialLinks, setSocialLinks] = useState<SocialLinks>({
        facebook: null,
        instagram: null,
        twitter: null,
        linkedin: null,
        tiktok: null,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        fetch('/api/social-links')
            .then(res => res.json())
            .then(data => setSocialLinks(data))
            .catch(err => {
                console.error('Error fetching social links:', err);
                setError(err);
            })
            .finally(() => setLoading(false));
    }, []);

    return { socialLinks, loading, error };
}
