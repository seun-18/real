// Sample Properties Data with Real Images
const properties = [
    {
        id: 1,
        title: 'Luxury Penthouse',
        location: 'Manhattan, NY',
        price: 850000,
        type: 'buy',
        beds: 3,
        baths: 2,
        area: 2500,
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop'
    },
    {
        id: 2,
        title: 'Modern Apartment',
        location: 'Brooklyn, NY',
        price: 2500,
        type: 'rent',
        beds: 2,
        baths: 1,
        area: 1200,
        image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
        id: 3,
        title: 'Suburban Family Home',
        location: 'Queens, NY',
        price: 650000,
        type: 'buy',
        beds: 4,
        baths: 3,
        area: 3000,
        image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop'
    },
    {
        id: 4,
        title: 'Downtown Studio',
        location: 'Manhattan, NY',
        price: 1800,
        type: 'rent',
        beds: 1,
        baths: 1,
        area: 600,
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop'
    },
    {
        id: 5,
        title: 'Waterfront Villa',
        location: 'Staten Island, NY',
        price: 1200000,
        type: 'sale',
        beds: 5,
        baths: 4,
        area: 4500,
        image: 'https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cmVhbCUyMGVzdGF0ZXxlbnwwfHwwfHx8MA%3D%3D'
    },
    {
        id: 6,
        title: 'Cozy Cottage',
        location: 'Westchester, NY',
        price: 3000,
        type: 'rent',
        beds: 2,
        baths: 2,
        area: 1400,
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop'
    }
];

let cart = [];
let currentFilter = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadProperties();
    loadCartFromStorage();
    setupNavigation();
    updateCartCount();
});

// Load Properties
function loadProperties(filter = 'all') {
    const grid = document.getElementById('properties-grid');
    if (!grid) return;

    grid.innerHTML = '';
    
    const filtered = filter === 'all' 
        ? properties 
        : properties.filter(p => p.type === filter);

    filtered.forEach(property => {
        const card = document.createElement('div');
        card.className = 'property-card';
        card.innerHTML = `
            <div class="property-image" style="background-image: url('${property.image}'); background-size: cover; background-position: center;"></div>
            <div class="property-info">
                <h3 class="property-title">${property.title}</h3>
                <p class="property-location">
                    <i class="fas fa-map-marker-alt"></i> ${property.location}
                </p>
                <div class="property-details">
                    <span><i class="fas fa-bed"></i> ${property.beds} Beds</span>
                    <span><i class="fas fa-bath"></i> ${property.baths} Baths</span>
                    <span><i class="fas fa-ruler"></i> ${property.area} sqft</span>
                </div>
                <p class="property-price">$${property.price.toLocaleString()}</p>
                <div class="property-actions">
                    <button class="btn-view" onclick="viewProperty(${property.id})">View</button>
                    <button class="btn-add-cart" onclick="addToCart(${property.id})">
                        <i class="fas fa-shopping-cart"></i> Add
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Filter Properties
function filterProperties(type) {
    currentFilter = type;
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    loadProperties(type);
}

// View Property
function viewProperty(id) {
    const property = properties.find(p => p.id === id);
    alert(`Viewing: ${property.title}\n\nLocation: ${property.location}\nPrice: $${property.price}\n\nBeds: ${property.beds} | Baths: ${property.baths} | Area: ${property.area} sqft\n\nWould you like to add this to your cart?`);
}

// Cart Functions
function addToCart(id) {
    const property = properties.find(p => p.id === id);
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...property,
            quantity: 1
        });
    }
    
    saveCartToStorage();
    updateCartCount();
    updateCartDisplay();
    showNotification(`${property.title} added to cart!`);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCartToStorage();
    updateCartCount();
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    if (!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: var(--text-muted);">Your cart is empty</p>';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div>
                <strong>${item.title}</strong><br>
                <small>${item.location}</small><br>
                <small>$${item.price.toLocaleString()}</small>
            </div>
            <button onclick="removeFromCart(${item.id})" style="background: var(--secondary); color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer;">Remove</button>
        </div>
    `).join('');

    updateCartTotal();
}

function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const cartTotal = document.getElementById('cart-total');
    if (cartTotal) {
        cartTotal.textContent = total.toLocaleString();
    }
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

function toggleCart() {
    const modal = document.getElementById('cart-modal');
    if (!modal) return;
    
    modal.classList.toggle('active');
    if (modal.classList.contains('active')) {
        updateCartDisplay();
    }
}

function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty. Please add properties before checkout.');
        return;
    }
    
    // Redirect to checkout page
    window.location.href = 'checkout.html';
}

// Storage Functions
function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const saved = localStorage.getItem('cart');
    if (saved) {
        cart = JSON.parse(saved);
    }
}

// Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary);
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Navigation
// Mobile Menu Toggle
function toggleMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle && navMenu) {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    }
}

// Close menu when clicking outside
document.addEventListener('click', function(event) {
    const nav = document.querySelector('nav');
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (nav && !nav.contains(event.target)) {
        if (menuToggle) menuToggle.classList.remove('active');
        if (navMenu) navMenu.classList.remove('active');
    }
});

// Close menu when clicking on a link
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('menuToggle');
    if (hamburger) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMenu();
        });
    }

    const navLinks = document.querySelectorAll('.nav-menu .nav-link');
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (menuToggle) menuToggle.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
        });
    });

    // Rest of your existing code...
});

// [Rest of your existing functions...]

// Geolocation and Real-time Location
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            console.log(`User location: ${lat}, ${lon}`);
        });
    }
}

// Search functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.querySelector('.search-bar button');
    const searchInput = document.querySelector('.search-bar input');
    
    if (searchButton && searchInput) {
        searchButton.addEventListener('click', function() {
            const query = searchInput.value.toLowerCase();
            if (query) {
                loadProperties('all');
            }
        });
    }
});

 loadProperties();
    loadCartFromStorage();
    setupNavigation();
    updateCartCount();