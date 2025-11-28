// ============================================
// FASHION FORWARD - PREMIUM T-SHIRT STORE
// Modern ES6+ JavaScript with Enhanced Features
// ============================================

// ============================================
// PRODUCT DATA STORE
// ============================================

const products = [
    {
        id: 1,
        name: "Classic White Tee",
        price: 499,
        originalPrice: 699,
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFXkCP9qhmSYybPd5etFPW3CoeaCIaQoVWDDyuQd8I-1lFrmNFDaZfl9pYECwpXXZ3mRg&usqp=CAU",
        badge: "Bestseller",
        description: "Premium cotton blend with perfect fit"
    },
    {
        id: 2,
        name: "Premium Black Classic",
        price: 599,
        originalPrice: 799,
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRi9PF-1u2Dw1w7iWBCD1u_OiTO-UwWpboNiA&s",
        badge: "New",
        description: "Sleek black design for any occasion"
    },
    {
        id: 3,
        name: "Graphic Statement Tee",
        price: 699,
        originalPrice: 899,
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX6WFZ-KrnGy2rIDFmNNIJbsEz02H-LZIYwQ6_Wby7Ad1L2-s9BIHA9UbeMa_7eD3F7EA&usqp=CAU",
        badge: "Hot",
        description: "Bold graphics that make a statement"
    },
    {
        id: 4,
        name: "Navy Blue Essential",
        price: 549,
        originalPrice: 749,
        img: "https://m.media-amazon.com/images/I/610qUTIcavL._SX569_.jpg",
        badge: "Limited",
        description: "Essential wardrobe piece in navy"
    },
    {
        id: 5,
        name: "Charcoal Premium",
        price: 649,
        originalPrice: 849,
        img: "https://i.pinimg.com/736x/56/86/d1/5686d14ae33045a3a9d4984d4b3e323a.jpg",
        badge: "Premium",
        description: "Luxury feel with premium materials"
    },
    {
        id: 6,
        name: "Urban Street Style",
        price: 749,
        originalPrice: 999,
        img: "https://img.thecdn.in/454640/SKU-0007_0-1753517120641.png?width=600&format=webp",
        badge: "Trending",
        description: "Street-inspired design for the bold"
    }
];

// ============================================
// CART MANAGEMENT CLASS
// ============================================

class CartManager {
    constructor() {
        this.cart = this.loadCart();
        this.init();
    }

    init() {
        this.updateCartCount();
        this.renderCart();
    }

    loadCart() {
        try {
            const saved = localStorage.getItem('fashionForwardCart');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading cart:', error);
            return [];
        }
    }

    saveCart() {
        try {
            localStorage.setItem('fashionForwardCart', JSON.stringify(this.cart));
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }

    addItem(productId, quantity = 1) {
        const product = products.find(p => p.id === productId);
        if (!product) return false;

        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                id: productId,
                quantity: quantity,
                ...product
            });
        }

        this.saveCart();
        this.updateCartCount();
        this.showToast(`${product.name} added to cart!`);
        return true;
    }

    removeItem(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
        this.renderCart();
        this.showToast('Item removed from cart');
    }

    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.saveCart();
            this.renderCart();
        }
    }

    getTotal() {
        return this.cart.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }

    getItemCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }

    updateCartCount() {
        const countElement = document.getElementById('cart-count');
        if (countElement) {
            const count = this.getItemCount();
            countElement.textContent = count;
            countElement.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    renderCart() {
        const cartItemsElement = document.getElementById('cart-items');
        const cartTotalElement = document.getElementById('cart-total');
        
        if (!cartItemsElement) return;

        if (this.cart.length === 0) {
            cartItemsElement.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">🛍️</div>
                    <p>Your cart is empty</p>
                    <small>Add some items to get started!</small>
                </div>
            `;
            if (cartTotalElement) {
                cartTotalElement.textContent = '₹0';
            }
            return;
        }

        cartItemsElement.innerHTML = this.cart.map(item => `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.name}" class="cart-item-image" 
                     onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23ddd%22 width=%22200%22 height=%22200%22/%3E%3Ctext fill=%22%23999%22 font-family=%22sans-serif%22 font-size=%2218%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22%3E${item.name}%3C/text%3E%3C/svg%3E'">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">₹${item.price} × ${item.quantity}</div>
                    <div style="display: flex; gap: 10px; margin-top: 8px; align-items: center;">
                        <button onclick="cartManager.updateQuantity(${item.id}, ${item.quantity - 1})" 
                                style="background: #e5e7eb; border: none; width: 28px; height: 28px; border-radius: 50%; cursor: pointer;">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="cartManager.updateQuantity(${item.id}, ${item.quantity + 1})" 
                                style="background: #e5e7eb; border: none; width: 28px; height: 28px; border-radius: 50%; cursor: pointer;">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="cartManager.removeItem(${item.id})" title="Remove">
                    ×
                </button>
            </div>
        `).join('');

        if (cartTotalElement) {
            cartTotalElement.textContent = `₹${this.getTotal().toLocaleString()}`;
        }
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartCount();
        this.renderCart();
    }

    showToast(message) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toast-message');
        
        if (!toast || !toastMessage) return;

        toastMessage.textContent = message;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// ============================================
// PRODUCT RENDERING
// ============================================

class ProductRenderer {
    constructor(cartManager) {
        this.cartManager = cartManager;
    }

    renderProducts() {
        const container = document.getElementById('product-list');
        if (!container) return;

        // Remove loading spinner
        container.innerHTML = '';

        // Render products with staggered animation
        products.forEach((product, index) => {
            const card = this.createProductCard(product, index);
            container.appendChild(card);
        });
    }

    createProductCard(product, index) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.animationDelay = `${index * 0.1}s`;

        const hasDiscount = product.originalPrice > product.price;
        const discountPercent = hasDiscount 
            ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
            : 0;

        card.innerHTML = `
            <div class="product-image-wrapper">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                ${hasDiscount ? `<span class="product-badge" style="top: 15px; right: auto; left: 15px; background: #10b981;">-${discountPercent}%</span>` : ''}
                <img src="${product.img}" 
                     alt="${product.name}" 
                     class="product-image"
                     onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22480%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22400%22 height=%22480%22/%3E%3Ctext fill=%22%23999%22 font-family=%22sans-serif%22 font-size=%2224%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22%3E${encodeURIComponent(product.name)}%3C/text%3E%3C/svg%3E'">
                <button class="quick-view-btn" onclick="productRenderer.quickView(${product.id})">
                    Quick View
                </button>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div style="display: flex; align-items: baseline; gap: 10px; margin-bottom: 15px;">
                    <span class="product-price">
                        <span class="currency">₹</span>${product.price}
                    </span>
                    ${hasDiscount ? `
                        <span style="color: #9ca3af; text-decoration: line-through; font-size: 1rem;">
                            ₹${product.originalPrice}
                        </span>
                    ` : ''}
                </div>
                <p style="font-size: 0.9rem; color: #6b7280; margin-bottom: 15px;">
                    ${product.description}
                </p>
                <button class="add-to-cart-btn" onclick="productRenderer.addToCart(${product.id}, this)">
                    <span>Add to Cart</span>
                </button>
            </div>
        `;

        return card;
    }

    addToCart(productId, button) {
        const success = this.cartManager.addItem(productId, 1);
        
        if (success && button) {
            button.classList.add('added');
            setTimeout(() => {
                button.classList.remove('added');
            }, 2000);
        }
    }

    quickView(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        // Simple alert for quick view (can be enhanced with a modal)
        alert(`${product.name}\n\n${product.description}\n\nPrice: ₹${product.price}\n\n${product.originalPrice > product.price ? `Was: ₹${product.originalPrice}` : ''}`);
    }
}

// ============================================
// CART MODAL MANAGEMENT
// ============================================

class CartModal {
    constructor(cartManager) {
        this.cartManager = cartManager;
        this.init();
    }

    init() {
        // Close modal on overlay click
        const overlay = document.querySelector('.cart-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => this.close());
        }

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.close();
            }
        });
    }

    open() {
        const modal = document.getElementById('cart');
        if (modal) {
            this.cartManager.renderCart();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    close() {
        const modal = document.getElementById('cart');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
}

// ============================================
// SMOOTH SCROLLING & INITIALIZATION
// ============================================

class App {
    constructor() {
        this.cartManager = new CartManager();
        this.productRenderer = new ProductRenderer(this.cartManager);
        this.cartModal = new CartModal(this.cartManager);
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.productRenderer.renderProducts();
        this.setupSmoothScrolling();
        this.setupNavHighlighting();
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupNavHighlighting() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('section[id]');

        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (pageYOffset >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }
}

// ============================================
// GLOBAL FUNCTIONS FOR HTML ONCLICK
// ============================================

let app;
let cartManager;
let productRenderer;
let cartModal;

// Initialize app when DOM is ready
function initializeApp() {
    app = new App();
    cartManager = app.cartManager;
    productRenderer = app.productRenderer;
    cartModal = app.cartModal;
}

// Global functions for inline onclick handlers
function openCart() {
    if (cartModal) {
        cartModal.open();
    }
}

function closeCart() {
    if (cartModal) {
        cartModal.close();
    }
}

function checkout() {
    if (cartManager && cartManager.getItemCount() > 0) {
        const total = cartManager.getTotal();
        alert(`Checkout initiated!\n\nTotal: ₹${total.toLocaleString()}\n\nThank you for shopping with Fashion Forward! 🎉`);
        cartManager.clearCart();
        closeCart();
    } else {
        alert('Your cart is empty!');
    }
}

// ============================================
// START APPLICATION
// ============================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
