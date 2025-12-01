import { Facebook, Instagram, Twitter, Linkedin, Music, LucideIcon } from 'lucide-react';
import { useSocialLinks } from '@/hooks/useSocialLinks';

interface SocialMediaConfig {
    name: string;
    icon: LucideIcon;
    url: string | null;
    color: string;
}

export function SocialMediaSection() {
    const { socialLinks, loading } = useSocialLinks();

    if (loading) return null;

    const socialMedia: SocialMediaConfig[] = [
        { name: 'Facebook', icon: Facebook, url: socialLinks.facebook, color: '#1877F2' },
        { name: 'Instagram', icon: Instagram, url: socialLinks.instagram, color: '#E4405F' },
        { name: 'Twitter', icon: Twitter, url: socialLinks.twitter, color: '#1DA1F2' },
        { name: 'LinkedIn', icon: Linkedin, url: socialLinks.linkedin, color: '#0A66C2' },
        { name: 'TikTok', icon: Music, url: socialLinks.tiktok, color: '#000000' },
    ].filter(social => social.url);

    if (socialMedia.length === 0) return null;

    return (
        <div className="lg:col-span-1">
            <h4 className="text-xl font-bold text-gray-900 mb-4">Suivez-nous</h4>
            <p className="text-gray-600 mb-6">
                Rejoignez notre communauté sur les réseaux sociaux !
            </p>
            <div className="flex gap-3 flex-wrap">
                {socialMedia.map((social) => {
                    const Icon = social.icon;
                    return (
                        <a
                            key={social.name}
                            href={social.url!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 rounded-lg bg-white border border-gray-200 text-gray-600 flex items-center justify-center hover:border-[#FE0090] hover:text-[#FE0090] hover:shadow-md transition-all hover:scale-110"
                            aria-label={social.name}
                        >
                            <Icon className="w-5 h-5" />
                        </a>
                    );
                })}
            </div>
        </div>
    );
}
