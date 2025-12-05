import Mailjet from 'node-mailjet';

const mailjet = Mailjet.apiConnect(
    process.env.MJ_APIKEY_PUBLIC || '',
    process.env.MJ_APIKEY_PRIVATE || ''
);

const SENDER_EMAIL = process.env.MJ_SENDER_EMAIL || 'contact@pharmacie-salines.fr';
const SENDER_NAME = 'Pharmacie des Salines';

interface SendEmailParams {
    to: string;
    subject: string;
    html: string;
    text?: string;
}

export const mailService = {
    /**
     * Send a generic email
     */
    async sendEmail({ to, subject, html, text }: SendEmailParams) {
        try {
            const request = await mailjet.post('send', { version: 'v3.1' }).request({
                Messages: [
                    {
                        From: {
                            Email: SENDER_EMAIL,
                            Name: SENDER_NAME,
                        },
                        To: [
                            {
                                Email: to,
                            },
                        ],
                        Subject: subject,
                        TextPart: text || '',
                        HTMLPart: html,
                    },
                ],
            });
            return request.body;
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    },

    /**
     * Send verification email
     */
    async sendVerificationEmail(to: string, token: string, firstName: string) {
        const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/verify?token=${token}`;

        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #fe0090;">Bienvenue chez Pharmacie des Salines !</h1>
                <p>Bonjour ${firstName},</p>
                <p>Merci de vous être inscrit. Pour activer votre compte, veuillez cliquer sur le lien ci-dessous :</p>
                <p style="text-align: center; margin: 30px 0;">
                    <a href="${verificationUrl}" style="background-color: #fe0090; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Vérifier mon email</a>
                </p>
                <p>Si le bouton ne fonctionne pas, vous pouvez copier ce lien :</p>
                <p><a href="${verificationUrl}">${verificationUrl}</a></p>
                <p>À bientôt,<br/>L'équipe Pharmacie des Salines</p>
            </div>
        `;

        return this.sendEmail({
            to,
            subject: 'Vérifiez votre adresse email - Pharmacie des Salines',
            html,
            text: `Bonjour ${firstName}, veuillez vérifier votre email en cliquant sur ce lien : ${verificationUrl}`,
        });
    },

    /**
     * Send order confirmation email
     */
    async sendOrderConfirmation(to: string, orderNumber: string, firstName: string, total: number) {
        const orderUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/account/orders/${orderNumber}`;

        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #fe0090;">Merci pour votre commande !</h1>
                <p>Bonjour ${firstName},</p>
                <p>Nous avons bien reçu votre commande <strong>${orderNumber}</strong> d'un montant de <strong>${total.toFixed(2)} €</strong>.</p>
                <p>Nous la préparons avec soin et vous informerons dès son expédition.</p>
                <p style="text-align: center; margin: 30px 0;">
                    <a href="${orderUrl}" style="background-color: #3f4c53; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Voir ma commande</a>
                </p>
                <p>À bientôt,<br/>L'équipe Pharmacie des Salines</p>
            </div>
        `;

        return this.sendEmail({
            to,
            subject: `Confirmation de commande ${orderNumber} - Pharmacie des Salines`,
            html,
            text: `Bonjour ${firstName}, merci pour votre commande ${orderNumber} de ${total.toFixed(2)} €. Nous la préparons avec soin.`,
        });
    },
};
