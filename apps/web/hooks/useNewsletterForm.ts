import { useState } from 'react';

export function useNewsletterForm() {
    const [email, setEmail] = useState('');
    const [showRgpd, setShowRgpd] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement newsletter subscription
        console.log('Newsletter subscription:', email);
        alert('Merci pour votre inscription !');
        setEmail('');
        setShowRgpd(false);
    };

    const handleFocus = () => setShowRgpd(true);
    const handleBlur = () => setTimeout(() => setShowRgpd(false), 200);

    return {
        email,
        setEmail,
        showRgpd,
        handleSubmit,
        handleFocus,
        handleBlur,
    };
}
