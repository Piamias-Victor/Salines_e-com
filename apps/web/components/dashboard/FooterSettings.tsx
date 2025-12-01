'use client';

import { useState, useEffect } from 'react';
import { Facebook, Instagram, Twitter, Linkedin, Music, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface SocialLinks {
    id: string;
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
    tiktok: string;
}

export function FooterSettings() {
    const [links, setLinks] = useState<SocialLinks>({
        id: '',
        facebook: '',
        instagram: '',
        twitter: '',
        linkedin: '',
        tiktok: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchLinks();
    }, []);

    const fetchLinks = async () => {
        try {
            const res = await fetch('/api/social-links');
            const data = await res.json();
            setLinks({
                id: data.id,
                facebook: data.facebook || '',
                instagram: data.instagram || '',
                twitter: data.twitter || '',
                linkedin: data.linkedin || '',
                tiktok: data.tiktok || '',
            });
        } catch (error) {
            console.error('Error fetching social links:', error);
            toast.error('Erreur lors du chargement des liens');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/social-links', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    facebook: links.facebook || null,
                    instagram: links.instagram || null,
                    twitter: links.twitter || null,
                    linkedin: links.linkedin || null,
                    tiktok: links.tiktok || null,
                }),
            });

            if (!res.ok) throw new Error('Failed to save');

            toast.success('Liens sauvegardés avec succès !');
        } catch (error) {
            console.error('Error saving social links:', error);
            toast.error('Erreur lors de la sauvegarde');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#FE0090]" />
            </div>
        );
    }

    return (
        <div className="max-w-3xl">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Liens des réseaux sociaux
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                    Configurez les liens vers vos réseaux sociaux. Seuls les réseaux avec une URL seront affichés dans le footer.
                </p>

                <div className="space-y-4">
                    {/* Facebook */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Facebook className="w-4 h-4 text-[#1877F2]" />
                            Facebook
                        </label>
                        <input
                            type="url"
                            value={links.facebook}
                            onChange={(e) => setLinks({ ...links, facebook: e.target.value })}
                            placeholder="https://facebook.com/votre-page"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE0090] focus:border-transparent"
                        />
                    </div>

                    {/* Instagram */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Instagram className="w-4 h-4 text-[#E4405F]" />
                            Instagram
                        </label>
                        <input
                            type="url"
                            value={links.instagram}
                            onChange={(e) => setLinks({ ...links, instagram: e.target.value })}
                            placeholder="https://instagram.com/votre-compte"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE0090] focus:border-transparent"
                        />
                    </div>

                    {/* Twitter */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Twitter className="w-4 h-4 text-[#1DA1F2]" />
                            Twitter / X
                        </label>
                        <input
                            type="url"
                            value={links.twitter}
                            onChange={(e) => setLinks({ ...links, twitter: e.target.value })}
                            placeholder="https://twitter.com/votre-compte"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE0090] focus:border-transparent"
                        />
                    </div>

                    {/* LinkedIn */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                            LinkedIn
                        </label>
                        <input
                            type="url"
                            value={links.linkedin}
                            onChange={(e) => setLinks({ ...links, linkedin: e.target.value })}
                            placeholder="https://linkedin.com/company/votre-entreprise"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE0090] focus:border-transparent"
                        />
                    </div>

                    {/* TikTok */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Music className="w-4 h-4 text-black" />
                            TikTok
                        </label>
                        <input
                            type="url"
                            value={links.tiktok}
                            onChange={(e) => setLinks({ ...links, tiktok: e.target.value })}
                            placeholder="https://tiktok.com/@votre-compte"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE0090] focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#FE0090] to-[#ff4db8] text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Sauvegarde...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Sauvegarder
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
