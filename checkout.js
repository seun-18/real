// Get cart data from sessionStorage or localStorage
let cart = [];
let checkoutData = {};

document.addEventListener('DOMContentLoaded', function() {
    loadCheckoutData();
    populateCheckoutItems();
    setupPaymentFormListeners();
});

function loadCheckoutData() {
    // Get cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

function populateCheckoutItems() {
    const checkoutItems = document.getElementById('checkout-items');
    const checkoutTotal = document.getElementById('checkout-total');
    const payAmount = document.getElementById('pay-amount');
    
    checkoutItems.innerHTML = '';
    
    let total = 0;
    
    cart.forEach(item => {
        total += item.price;
        
        const itemDiv = document.createElement('div');
        itemDiv.style.cssText = `
            background: rgba(255, 255, 255, 0.05);
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        
        itemDiv.innerHTML = `
            <div>
                <strong>${item.title}</strong><br>
                <small style="color: var(--text-muted);">${item.location}</small>
            </div>
            <div style="text-align: right;">
                <strong>$${item.price.toLocaleString()}</strong>
            </div>
        `;
        
        checkoutItems.appendChild(itemDiv);
    });
    
    // Add tax
    const tax = Math.round(total * 0.05);
    const finalTotal = total + tax;
    
    checkoutTotal.textContent = finalTotal.toLocaleString();
    payAmount.textContent = finalTotal.toLocaleString();
    
    // Store totals for receipt
    checkoutData.subtotal = total;
    checkoutData.tax = tax;
    checkoutData.total = finalTotal;
}

function setupPaymentFormListeners() {
    // Payment method listeners
    document.querySelectorAll('.payment-method input').forEach(radio => {
        radio.addEventListener('change', function() {
            document.querySelectorAll('.payment-method').forEach(method => {
                method.classList.remove('active');
            });
            this.parentElement.classList.add('active');
        });
    });
}

function formatCardNumber(input) {
    let value = input.value.replace(/\s/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    input.value = formattedValue;
}

function formatExpiry(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    input.value = value;
}

function updateCardPreview() {
    const cardHolder = document.getElementById('card-holder').value || 'Your Name';
    const cardNumber = document.getElementById('card-number').value || '•••• •••• •••• ••••';
    const expiry = document.getElementById('expiry').value || 'MM/YY';
    const cvv = document.getElementById('cvv').value || '•••';
    
    document.getElementById('preview-card-holder').textContent = cardHolder.toUpperCase();
    
    // Get last 4 digits of card number
    const lastFour = cardNumber.replace(/\s/g, '').slice(-4);
    const maskedNumber = '•••• •••• •••• ' + lastFour;
    document.getElementById('preview-card-number').textContent = maskedNumber;
    
    document.getElementById('preview-card-expiry').textContent = expiry;
    document.getElementById('preview-card-cvv').textContent = cvv.replace(/./g, '•');
}

function processPayment(event) {
    event.preventDefault();
    
    // Validate form
    const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
    const expiry = document.getElementById('expiry').value;
    const cvv = document.getElementById('cvv').value;
    
    if (cardNumber.length !== 16) {
        alert('Please enter a valid 16-digit card number');
        return;
    }
    
    if (!expiry.match(/^\d{2}\/\d{2}$/)) {
        alert('Please enter expiry date in MM/YY format');
        return;
    }
    
    if (cvv.length !== 3) {
        alert('Please enter a valid 3-digit CVV');
        return;
    }
    
    // Show processing modal
    const processingModal = document.getElementById('processing-modal');
    processingModal.classList.add('active');
    
    // Simulate payment processing
    setTimeout(() => {
        // Store payment data
        const paymentData = {
            fullname: document.getElementById('fullname').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            cardHolder: document.getElementById('card-holder').value,
            cardLastFour: cardNumber.slice(-4),
            paymentMethod: document.querySelector('input[name="payment-method"]:checked').value,
            amount: checkoutData.total,
            timestamp: new Date().toLocaleString()
        };
        
        // Store in sessionStorage for receipt page
        sessionStorage.setItem('paymentData', JSON.stringify(paymentData));
        sessionStorage.setItem('cartData', JSON.stringify(cart));
        sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));
        
        // Clear cart from localStorage
        localStorage.removeItem('cart');
        
        // Redirect to receipt page
        window.location.href = 'receipt.html';
    }, 2000);
}