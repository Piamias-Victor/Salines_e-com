export const generateDeliveryNoteHTML = (order: any) => {
    const customerName = order.user
        ? `${order.user.firstName} ${order.user.lastName}`
        : order.guestEmail;

    const address = order.shippingAddress || {
        street: 'Adresse non renseignée',
        postalCode: '',
        city: '',
        country: ''
    };

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Bon de Livraison - ${order.orderNumber}</title>
            <style>
                @media print {
                    body { margin: 0; }
                    .no-print { display: none; }
                }
                body {
                    font-family: Arial, sans-serif;
                    padding: 20mm;
                    line-height: 1.5;
                    color: #333;
                }
                .header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 50px;
                    border-bottom: 2px solid #eee;
                    padding-bottom: 20px;
                }
                .logo {
                    font-size: 24px;
                    font-weight: bold;
                    color: #fe0090;
                }
                .document-title {
                    text-align: right;
                }
                .addresses {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 50px;
                }
                .address-box {
                    width: 45%;
                }
                .address-box h3 {
                    border-bottom: 1px solid #eee;
                    padding-bottom: 5px;
                    margin-bottom: 10px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 30px;
                }
                th {
                    background-color: #f9f9f9;
                    text-align: left;
                    padding: 12px;
                    border-bottom: 2px solid #eee;
                }
                td {
                    padding: 12px;
                    border-bottom: 1px solid #eee;
                }
                .footer {
                    margin-top: 50px;
                    text-align: center;
                    font-size: 12px;
                    color: #666;
                    border-top: 1px solid #eee;
                    padding-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="logo">Pharmacie des Salines</div>
                <div class="document-title">
                    <h1>BON DE LIVRAISON</h1>
                    <p>N° ${order.orderNumber}</p>
                    <p>Date: ${new Date(order.createdAt).toLocaleDateString('fr-FR')}</p>
                </div>
            </div>

            <div class="addresses">
                <div class="address-box">
                    <h3>Expéditeur</h3>
                    <p><strong>Pharmacie des Salines</strong></p>
                    <p>123 Rue de la Pharmacie</p>
                    <p>75000 Paris</p>
                    <p>France</p>
                </div>
                <div class="address-box">
                    <h3>Destinataire</h3>
                    <p><strong>${customerName}</strong></p>
                    <p>${address.street}</p>
                    <p>${address.postalCode} ${address.city}</p>
                    <p>${address.country}</p>
                    ${order.user?.phone ? `<p>Tél: ${order.user.phone}</p>` : ''}
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Référence</th>
                        <th>Désignation</th>
                        <th>Qté</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.items.map((item: any) => `
                        <tr>
                            <td>${item.product.sku || '-'}</td>
                            <td>${item.product.name}</td>
                            <td>${item.quantity}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <div class="footer">
                <p>Merci de votre confiance !</p>
                <p>Pharmacie des Salines - SAS au capital de 1000€ - SIRET 12345678900000</p>
            </div>
        </body>
        </html>
    `;
};

export const printDeliveryNote = (order: any) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(generateDeliveryNoteHTML(order));
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 500);
    }
};
