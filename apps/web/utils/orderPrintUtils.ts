export const generatePreparationSheetHTML = (data: any) => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Bon de Préparation</title>
            <style>
                @media print {
                    body { margin: 0; }
                    .no-print { display: none; }
                }
                body {
                    font-family: Arial, sans-serif;
                    padding: 20mm;
                }
                h1 { text-align: center; margin-bottom: 30px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                th { background-color: #f5f5f5; font-weight: bold; }
                .header { margin-bottom: 30px; }
                .footer { margin-top: 50px; border-top: 2px solid #000; padding-top: 20px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>📋 BON DE PRÉPARATION</h1>
                <p><strong>Date:</strong> ${new Date(data.generatedAt).toLocaleString('fr-FR')}</p>
                <p><strong>Nombre de commandes:</strong> ${data.orders.length}</p>
                <p><strong>Total articles:</strong> ${data.totalItems}</p>
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th>☐</th>
                        <th>Produit</th>
                        <th>Quantité</th>
                        <th>Commandes</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.groupedProducts.map((p: any) => `
                        <tr>
                            <td style="width: 30px; text-align: center;">☐</td>
                            <td>
                                <strong>${p.productName}</strong><br>
                                <small>SKU: ${p.sku || 'N/A'}</small>
                            </td>
                            <td style="font-size: 18px; font-weight: bold;">${p.totalQuantity}</td>
                            <td><small>${p.orders.join(', ')}</small></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <div class="footer">
                <p><strong>Préparé par:</strong> _______________________</p>
                <p><strong>Date et heure:</strong> _______________________</p>
                <p><strong>Signature:</strong> _______________________</p>
            </div>
            
            <button class="no-print" onclick="window.print()" style="margin-top: 20px; padding: 10px 20px; background: #fe0090; color: white; border: none; border-radius: 5px; cursor: pointer;">
                Imprimer
            </button>
        </body>
        </html>
    `;
};

export const generateDeliveryNotesHTML = (ordersList: any[]) => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Bons de Livraison</title>
            <style>
                @media print {
                    body { margin: 0; }
                    .no-print { display: none; }
                    .delivery-note { page-break-after: always; }
                    .delivery-note:last-child { page-break-after: auto; }
                }
                body {
                    font-family: Arial, sans-serif;
                    padding: 20mm;
                    line-height: 1.5;
                    color: #333;
                }
                .delivery-note {
                    margin-bottom: 50px;
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
            ${ordersList.map(order => {
        const customerName = order.user
            ? `${order.user.firstName} ${order.user.lastName}`
            : order.guestEmail;

        const address = (order as any).shippingAddress || {
            street: 'Adresse non renseignée',
            postalCode: '',
            city: '',
            country: ''
        };

        return `
                    <div class="delivery-note">
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
                    </div>
                    `;
    }).join('')}
            
            <button class="no-print" onclick="window.print()" style="position: fixed; bottom: 20px; right: 20px; padding: 10px 20px; background: #fe0090; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
                Imprimer tout
            </button>
        </body>
        </html>
    `;
};

export const printPreparationSheet = async (orderIds: string[]) => {
    try {
        const response = await fetch('/api/admin/orders/preparation-sheet', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderIds }),
        });

        const data = await response.json();

        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(generatePreparationSheetHTML(data));
            printWindow.document.close();
            setTimeout(() => printWindow.print(), 500);
        }
    } catch (error) {
        console.error('Error generating preparation sheet:', error);
        throw error;
    }
};

export const printDeliveryNotes = (orders: any[]) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(generateDeliveryNotesHTML(orders));
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 500);
    }
};
