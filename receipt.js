document.addEventListener('DOMContentLoaded', function() {
    populateReceiptData();
});

function populateReceiptData() {
    // Get data from sessionStorage
    const paymentData = JSON.parse(sessionStorage.getItem('paymentData') || '{}');
    const cartData = JSON.parse(sessionStorage.getItem('cartData') || '[]');
    const checkoutData = JSON.parse(sessionStorage.getItem('checkoutData') || '{}');
    
    // Generate receipt ID
    const receiptId = 'RCP-' + new Date().getFullYear() + '-' + Math.floor(Math.random() * 1000000);
    const transactionId = 'TXN-' + new Date().getFullYear() + '-' + Math.floor(Math.random() * 10000000000);
    
    // Populate receipt header
    document.getElementById('receipt-id').textContent = receiptId;
    
    // Populate billing information
    document.getElementById('receipt-name').textContent = paymentData.fullname || 'N/A';
    document.getElementById('receipt-email').textContent = paymentData.email || 'N/A';
    document.getElementById('receipt-phone').textContent = paymentData.phone || 'N/A';
    document.getElementById('receipt-address').textContent = paymentData.address || 'N/A';
    
    // Populate transaction details
    document.getElementById('receipt-transaction-id').textContent = transactionId;
    const paymentMethod = paymentData.paymentMethod === 'credit' ? 'Credit Card' : 
                         paymentData.paymentMethod === 'debit' ? 'Debit Card' : 'PayPal';
    document.getElementById('receipt-payment-method').textContent = paymentMethod;
    document.getElementById('receipt-card-last4').textContent = '•••• •••• •••• ' + paymentData.cardLastFour;
    document.getElementById('receipt-date-time').textContent = paymentData.timestamp;
    
    // Populate items
    const receiptItems = document.getElementById('receipt-items');
    receiptItems.innerHTML = '';
    
    cartData.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'receipt-item';
        itemDiv.innerHTML = `
            <div class="receipt-item-name">
                <strong>${item.title}</strong>
                <p class="receipt-item-location">${item.location}</p>
            </div>
            <div class="receipt-item-price">$${item.price.toLocaleString()}</div>
        `;
        receiptItems.appendChild(itemDiv);
    });
    
    // Populate amounts
    document.getElementById('receipt-subtotal').textContent = '$' + (checkoutData.subtotal || 0).toLocaleString();
    document.getElementById('receipt-tax').textContent = '$' + (checkoutData.tax || 0).toLocaleString();
    document.getElementById('receipt-discount').textContent = '-$0.00';
    document.getElementById('receipt-total').textContent = '$' + (checkoutData.total || 0).toLocaleString();
}

function printReceipt() {
    window.print();
}

function downloadReceipt() {
    const receiptContent = document.querySelector('.receipt-card').innerHTML;
    const printWindow = window.open('', '', 'width=800,height=600');
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Receipt</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 40px;
                    color: #333;
                }
                .receipt-card {
                    border: 1px solid #ddd;
                    padding: 20px;
                    border-radius: 8px;
                }
                h3 {
                    color: #6C63FF;
                    margin-top: 20px;
                    margin-bottom: 10px;
                }
                .divider {
                    border: none;
                    border-top: 1px solid #ddd;
                    margin: 20px 0;
                }
                .info-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                    margin-bottom: 15px;
                }
                .amount-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid #eee;
                }
                .amount-row.total {
                    font-weight: bold;
                    border-top: 2px solid #ddd;
                    padding-top: 10px;
                    color: #10B981;
                }
            </style>
        </head>
        <body>
            <div class="receipt-card">
                ${receiptContent}
            </div>
        </body>
        </html>
    `);
    
    printWindow.document.close();
    setTimeout(() => {
        printWindow.print();
    }, 250);
}