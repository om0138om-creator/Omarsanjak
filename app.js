/**
 * ========================================
 * تِرياق الجمال - Taryaq Beauty
 * Professional E-Commerce Application
 * ========================================
 */

// ==================== CONFIGURATION ====================
const CONFIG = {
    // Supabase Configuration
    SUPABASE_URL: 'https://vhqrbrlosqnzpqtxhypc.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZocXJicmxvc3FuenBxdHhoeXBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNDc0NTAsImV4cCI6MjA4ODYyMzQ1MH0.B8BWhTZ6ZjDeN6JOyuV6kOvwjGV9aWA9g3TvdcrYe_s',
    
    // Admin Email
    ADMIN_EMAIL: 'om011013om@gmail.com',
    
    // Chargily Pay Configuration
    CHARGILY_API_URL: 'https://pay.chargily.net/api/v2',
    CHARGILY_PUBLIC_KEY: 'test_pk_WzDrci0tIHnCNSY5IKxbEjxeSAeC0AelLkYP0LIn',
    
    // App Settings
    CURRENCY: 'دج',
    CURRENCY_CODE: 'DZD',
    PRODUCTS_PER_PAGE: 12,
    
    // Storage Bucket
    STORAGE_BUCKET: 'products',

    
    // Algeria Wilayas
    WILAYAS: [
        { code: '01', name: 'أدرار' },
        { code: '02', name: 'الشلف' },
        { code: '03', name: 'الأغواط' },
        { code: '04', name: 'أم البواقي' },
        { code: '05', name: 'باتنة' },
        { code: '06', name: 'بجاية' },
        { code: '07', name: 'بسكرة' },
        { code: '08', name: 'بشار' },
        { code: '09', name: 'البليدة' },
        { code: '10', name: 'البويرة' },
        { code: '11', name: 'تمنراست' },
        { code: '12', name: 'تبسة' },
        { code: '13', name: 'تلمسان' },
        { code: '14', name: 'تيارت' },
        { code: '15', name: 'تيزي وزو' },
        { code: '16', name: 'الجزائر' },
        { code: '17', name: 'الجلفة' },
        { code: '18', name: 'جيجل' },
        { code: '19', name: 'سطيف' },
        { code: '20', name: 'سعيدة' },
        { code: '21', name: 'سكيكدة' },
        { code: '22', name: 'سيدي بلعباس' },
        { code: '23', name: 'عنابة' },
        { code: '24', name: 'قالمة' },
        { code: '25', name: 'قسنطينة' },
        { code: '26', name: 'المدية' },
        { code: '27', name: 'مستغانم' },
        { code: '28', name: 'المسيلة' },
        { code: '29', name: 'معسكر' },
        { code: '30', name: 'ورقلة' },
        { code: '31', name: 'وهران' },
        { code: '32', name: 'البيض' },
        { code: '33', name: 'إليزي' },
        { code: '34', name: 'برج بوعريريج' },
        { code: '35', name: 'بومرداس' },
        { code: '36', name: 'الطارف' },
        { code: '37', name: 'تندوف' },
        { code: '38', name: 'تيسمسيلت' },
        { code: '39', name: 'الوادي' },
        { code: '40', name: 'خنشلة' },
        { code: '41', name: 'سوق أهراس' },
        { code: '42', name: 'تيبازة' },
        { code: '43', name: 'ميلة' },
        { code: '44', name: 'عين الدفلى' },
        { code: '45', name: 'النعامة' },
        { code: '46', name: 'عين تموشنت' },
        { code: '47', name: 'غرداية' },
        { code: '48', name: 'غليزان' },
        { code: '49', name: 'تيميمون' },
        { code: '50', name: 'برج باجي مختار' },
        { code: '51', name: 'أولاد جلال' },
        { code: '52', name: 'بني عباس' },
        { code: '53', name: 'عين صالح' },
        { code: '54', name: 'عين قزام' },
        { code: '55', name: 'توقرت' },
        { code: '56', name: 'جانت' },
        { code: '57', name: 'المغير' },
        { code: '58', name: 'المنيعة' }
    ]
};

// ==================== SUPABASE CLIENT ====================
if (typeof window.supabase !== 'undefined' && typeof window.supabase.createClient === 'function') {
    window.supabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
}

// كود طوارئ لضمان اختفاء شاشة التحميل مهما كانت سرعة الإنترنت
setTimeout(() => {
    const loader = document.getElementById('page-loader');
    if (loader) loader.classList.add('hidden');
}, 2000);

// ==================== GLOBAL STATE ====================
const Store = {
    user: null,
    cart: [],
    wishlist: [],
    categories: [],
    products: [],
    settings: {},
    shippingRates: [],
    
    // Initialize state from localStorage
    init() {
        this.cart = JSON.parse(localStorage.getItem('taryaq_cart')) || [];
        this.wishlist = JSON.parse(localStorage.getItem('taryaq_wishlist')) || [];
        this.updateCartUI();
        this.updateWishlistUI();
    },
    
    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('taryaq_cart', JSON.stringify(this.cart));
        this.updateCartUI();
    },
    
    // Save wishlist to localStorage
    saveWishlist() {
        localStorage.setItem('taryaq_wishlist', JSON.stringify(this.wishlist));
        this.updateWishlistUI();
    },
    
    // Update cart UI
    updateCartUI() {
        const count = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelectorAll('#cart-count, #cart-items-count').forEach(el => {
            if (el.id === 'cart-items-count') {
                el.textContent = `(${count})`;
            } else {
                el.textContent = count;
            }
        });
    },
    
    // Update wishlist UI
    updateWishlistUI() {
        const count = this.wishlist.length;
        document.querySelectorAll('#wishlist-count').forEach(el => {
            el.textContent = count;
        });
    }
};

// ==================== UTILITY FUNCTIONS ====================
const Utils = {
    formatPrice(price) {
        return new Intl.NumberFormat('ar-DZ').format(price) + ' ' + CONFIG.CURRENCY;
    },
    
    formatDate(date) {
        return new Intl.DateTimeFormat('ar-DZ', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    },
    
    formatRelativeTime(date) {
        const now = new Date();
        const diff = now - new Date(date);
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) return `منذ ${days} يوم`;
        if (hours > 0) return `منذ ${hours} ساعة`;
        if (minutes > 0) return `منذ ${minutes} دقيقة`;
        return 'الآن';
    },
    
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },
    
    generateOrderNumber() {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `TB${year}${month}${random}`;
    },
    
    isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },
    
    isValidPhone(phone) {
        const regex = /^(0)(5|6|7)[0-9]{8}$/;
        return regex.test(phone.replace(/\s/g, ''));
    },
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    sanitizeHTML(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    },
    
    calculateDiscount(originalPrice, salePrice) {
        return Math.round((1 - salePrice / originalPrice) * 100);
    },
    
    getUrlParams() {
        const params = {};
        const searchParams = new URLSearchParams(window.location.search);
        for (const [key, value] of searchParams) {
            params[key] = value;
        }
        return params;
    },
    
    setUrlParams(params) {
        const url = new URL(window.location.href);
        Object.entries(params).forEach(([key, value]) => {
            if (value) {
                url.searchParams.set(key, value);
            } else {
                url.searchParams.delete(key);
            }
        });
        
        try {
            window.history.pushState({}, '', url);
        } catch (error) {
            console.warn("تغيير الروابط لا يعمل على مسار file:// ولكن الموقع سيستمر بالعمل");
        }
    }
};

// ==================== TOAST NOTIFICATIONS ====================
const Toast = {
    container: null,

    
    init() {
        this.container = document.getElementById('toast-container');
    },
    
    show(message, type = 'info', title = '', duration = 5000) {
        const icons = {
            success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
            error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
            warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
            info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`
        };
        
        const titles = {
            success: title || 'تم بنجاح',
            error: title || 'خطأ',
            warning: title || 'تنبيه',
            info: title || 'معلومة'
        };
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-icon">${icons[type]}</div>
            <div class="toast-content">
                <div class="toast-title">${titles[type]}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
            <div class="toast-progress"></div>
        `;
        
        this.container.appendChild(toast);
        
        // Close button
        toast.querySelector('.toast-close').addEventListener('click', () => {
            this.remove(toast);
        });
        
        // Auto remove
        setTimeout(() => {
            this.remove(toast);
        }, duration);
    },
    
    remove(toast) {
        toast.classList.add('removing');
        setTimeout(() => {
            toast.remove();
        }, 300);
    },
    
    success(message, title) {
        this.show(message, 'success', title);
    },
    
    error(message, title) {
        this.show(message, 'error', title);
    },
    
    warning(message, title) {
        this.show(message, 'warning', title);
    },
    
    info(message, title) {
        this.show(message, 'info', title);
    }
};

// ==================== MODAL MANAGER ====================
const Modal = {
    open(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.classList.add('no-scroll');
        }
    },
    
    close(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    },
    
    closeAll() {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.classList.remove('no-scroll');
    },
    
    init() {
        // Close on overlay click
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', () => {
                this.closeAll();
            });
        });
        
        // Close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeAll();
            });
        });
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAll();
            }
        });
    }
};

// ==================== THEME MANAGER ====================
const ThemeManager = {
    init() {
        const savedTheme = localStorage.getItem('taryaq_theme') || 'light';
        this.setTheme(savedTheme);
        
        const toggle = document.getElementById('theme-toggle');
        if (toggle) {
            toggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                this.setTheme(newTheme);
            });
        }
    },
    
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('taryaq_theme', theme);
        
        // Update meta theme color
        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) {
            metaTheme.setAttribute('content', theme === 'dark' ? '#0d0d14' : '#ffffff');
        }
    }
};

// ==================== ROUTER ====================
const Router = {
    currentPage: 'home',
    
    init() {
        // Handle navigation clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('[data-page]');
            if (link) {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                const section = link.getAttribute('data-section');
                const filter = link.getAttribute('data-filter');
                const id = link.getAttribute('data-id');
                
                this.navigate(page, { section, filter, id });
            }
        });
        
        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            const params = Utils.getUrlParams();
            this.navigate(params.page || 'home', params, false);
        });
        
        // Initial route
        const params = Utils.getUrlParams();
        this.navigate(params.page || 'home', params, false);
    },
    
    navigate(page, options = {}, pushState = true) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
        });
        
        // Show target page
        const targetPage = document.getElementById(`page-${page}`);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = page;
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Update URL
            if (pushState) {
                Utils.setUrlParams({ page, ...options });
            }
            
            // Page-specific logic
            this.onPageChange(page, options);
            
            // Close mobile menu
            MobileMenu.close();
        }
    },
    
    onPageChange(page, options) {
        switch (page) {
            case 'home':
                HomePage.init();
                break;
            case 'products':
                ProductsPage.init(options);
                break;
            case 'product-detail':
                ProductDetailPage.init(options.id);
                break;
            case 'cart':
                CartPage.init();
                break;
            case 'checkout':
                CheckoutPage.init();
                break;
            case 'auth':
                AuthPage.init();
                break;
            case 'account':
                AccountPage.init(options.section);
                break;
            case 'order-success':
                OrderSuccessPage.init(options.orderId);
                break;
        }
    }
};

// ==================== MOBILE MENU ====================
const MobileMenu = {
    menu: null,
    overlay: null,
    toggle: null,
    
    init() {
        this.menu = document.getElementById('mobile-menu');
        this.overlay = document.getElementById('mobile-menu-overlay');
        this.toggle = document.getElementById('mobile-menu-toggle');
        const closeBtn = document.getElementById('mobile-menu-close');
        
        if (this.toggle) {
            this.toggle.addEventListener('click', () => this.open());
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }
        
        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.close());
        }
        
        this.buildMenu();
    },
    
    buildMenu() {
        const nav = document.getElementById('mobile-nav');
        if (!nav) return;
        
        nav.innerHTML = `
            <a href="#" data-page="home">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                الرئيسية
            </a>
            <a href="#" data-page="products">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="7" height="7"/>
                    <rect x="14" y="3" width="7" height="7"/>
                    <rect x="14" y="14" width="7" height="7"/>
                    <rect x="3" y="14" width="7" height="7"/>
                </svg>
                المنتجات
            </a>
            <a href="#" data-page="about">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="16" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                من نحن
            </a>
            <a href="#" data-page="contact">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                </svg>
                اتصل بنا
            </a>
        `;
    },
    
    open() {
        this.menu?.classList.add('active');
        this.overlay?.classList.add('active');
        this.toggle?.classList.add('active');
        document.body.classList.add('no-scroll');
    },
    
    close() {
        this.menu?.classList.remove('active');
        this.overlay?.classList.remove('active');
        this.toggle?.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
};

// ==================== CART SIDEBAR ====================
const CartSidebar = {
    sidebar: null,
    overlay: null,
    
    init() {
        this.sidebar = document.getElementById('cart-sidebar');
        this.overlay = document.getElementById('cart-overlay');
        
        const cartBtn = document.getElementById('cart-btn');
        const closeBtn = document.getElementById('cart-close');
        const checkoutBtn = document.getElementById('checkout-btn');
        
        if (cartBtn) {
            cartBtn.addEventListener('click', () => this.open());
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }
        
        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.close());
        }
        
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                this.close();
                if (Store.cart.length > 0) {
                    if (Store.user) {
                        Router.navigate('checkout');
                    } else {
                        Toast.warning('يرجى تسجيل الدخول أولاً');
                        Router.navigate('auth');
                    }
                } else {
                    Toast.warning('السلة فارغة');
                }
            });
        }
        
        this.render();
    },
    
    open() {
        this.sidebar?.classList.add('active');
        this.overlay?.classList.add('active');
        document.body.classList.add('no-scroll');
        this.render();
    },
    
    close() {
        this.sidebar?.classList.remove('active');
        this.overlay?.classList.remove('active');
        document.body.classList.remove('no-scroll');
    },
    
    render() {
        const content = document.getElementById('cart-sidebar-content');
        const footer = document.getElementById('cart-sidebar-footer');
        
        if (!content) return;
        
        if (Store.cart.length === 0) {
            content.innerHTML = `
                <div class="cart-empty">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                        <circle cx="9" cy="21" r="1"/>
                        <circle cx="20" cy="21" r="1"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
                    </svg>
                    <h4>السلة فارغة</h4>
                    <p>لم تقم بإضافة أي منتجات بعد</p>
                    <button class="btn btn-primary" data-page="products">تسوق الآن</button>
                </div>
            `;
            if (footer) footer.style.display = 'none';
            return;
        }
        
        if (footer) footer.style.display = 'block';
        
        content.innerHTML = Store.cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image || '/placeholder.jpg'}" alt="${Utils.sanitizeHTML(item.name)}">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${Utils.sanitizeHTML(item.name)}</h4>
                    <div class="cart-item-price">${Utils.formatPrice(item.price)}</div>
                    <div class="cart-item-controls">
                        <div class="quantity-control">
                            <button class="quantity-btn" onclick="Cart.updateQuantity('${item.id}', ${item.quantity - 1})">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="5" y1="12" x2="19" y2="12"/>
                                </svg>
                            </button>
                            <span class="quantity-value">${item.quantity}</span>
                            <button class="quantity-btn" onclick="Cart.updateQuantity('${item.id}', ${item.quantity + 1})">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="12" y1="5" x2="12" y2="19"/>
                                    <line x1="5" y1="12" x2="19" y2="12"/>
                                </svg>
                            </button>
                        </div>
                        <button class="cart-item-remove" onclick="Cart.remove('${item.id}')">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        this.updateTotals();
    },
    
    updateTotals() {
        const subtotal = Store.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        document.getElementById('cart-subtotal')?.textContent && 
            (document.getElementById('cart-subtotal').textContent = Utils.formatPrice(subtotal));
        document.getElementById('cart-total')?.textContent && 
            (document.getElementById('cart-total').textContent = Utils.formatPrice(subtotal));
    }
};

// ==================== CART OPERATIONS ====================
const Cart = {
    add(product, quantity = 1) {
        const existingItem = Store.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            Store.cart.push({
                id: product.id,
                name: product.name,
                price: product.sale_price || product.price,
                originalPrice: product.price,
                image: product.images?.[0] || product.image,
                quantity: quantity
            });
        }
        
        Store.saveCart();
        CartSidebar.render();
        Toast.success('تمت إضافة المنتج إلى السلة');
        
        // Track add to cart
        this.trackEvent('add_to_cart', product);
    },
    
    remove(productId) {
        Store.cart = Store.cart.filter(item => item.id !== productId);
        Store.saveCart();
        CartSidebar.render();
        CartPage.render();
        Toast.info('تم حذف المنتج من السلة');
    },
    
    updateQuantity(productId, quantity) {
        if (quantity < 1) {
            this.remove(productId);
            return;
        }
        
        const item = Store.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            Store.saveCart();
            CartSidebar.render();
            CartPage.render();
        }
    },
    
    clear() {
        Store.cart = [];
        Store.saveCart();
        CartSidebar.render();
        CartPage.render();
    },
    
    getTotal() {
        return Store.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    
    getItemsCount() {
        return Store.cart.reduce((sum, item) => sum + item.quantity, 0);
    },
    
    trackEvent(event, product) {
        // Analytics tracking (can be connected to Google Analytics, Facebook Pixel, etc.)
        console.log('Cart Event:', event, product);
    }
};

// ==================== WISHLIST OPERATIONS ====================
const Wishlist = {
    toggle(product) {
        const index = Store.wishlist.findIndex(item => item.id === product.id);
        
        if (index > -1) {
            Store.wishlist.splice(index, 1);
            Toast.info('تم إزالة المنتج من المفضلة');
        } else {
            Store.wishlist.push({
                id: product.id,
                name: product.name,
                price: product.price,
                sale_price: product.sale_price,
                image: product.images?.[0] || product.image
            });
            Toast.success('تمت إضافة المنتج إلى المفضلة');
        }
        
        Store.saveWishlist();
        this.updateButtons(product.id);
    },
    
    isInWishlist(productId) {
        return Store.wishlist.some(item => item.id === productId);
    },
    
    remove(productId) {
        Store.wishlist = Store.wishlist.filter(item => item.id !== productId);
        Store.saveWishlist();
        AccountPage.renderWishlist();
    },
    
    updateButtons(productId) {
        const isInWishlist = this.isInWishlist(productId);
        document.querySelectorAll(`[data-wishlist-id="${productId}"]`).forEach(btn => {
            btn.classList.toggle('active', isInWishlist);
        });
    }
};

// ==================== AUTHENTICATION ====================
const Auth = {
    async init() {
        // Check current session
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            Store.user = session.user;
            this.updateUI();
        }
        
        // Listen for auth changes
        supabase.auth.onAuthStateChange((event, session) => {
            Store.user = session?.user || null;
            this.updateUI();
            
            if (event === 'SIGNED_IN') {
                Toast.success('تم تسجيل الدخول بنجاح');
                Router.navigate('home');
            } else if (event === 'SIGNED_OUT') {
                Toast.info('تم تسجيل الخروج');
            }
        });
    },
    
    async login(email, password) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            
            if (error) throw error;
            
            return { success: true, user: data.user };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    },
    
    async register(userData) {
        try {
            const { email, password, firstName, lastName, phone } = userData;
            
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        first_name: firstName,
                        last_name: lastName,
                        phone: phone,
                        full_name: `${firstName} ${lastName}`
                    }
                }
            });
            
            if (error) throw error;
            
            return { success: true, user: data.user };
        } catch (error) {
            console.error('Register error:', error);
            return { success: false, error: error.message };
        }
    },
    
    async logout() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            
            Store.user = null;
            this.updateUI();
            Router.navigate('home');
        } catch (error) {
            console.error('Logout error:', error);
            Toast.error('حدث خطأ أثناء تسجيل الخروج');
        }
    },
    
    async resetPassword(email) {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}?page=reset-password`
            });
            
            if (error) throw error;
            
            return { success: true };
        } catch (error) {
            console.error('Reset password error:', error);
            return { success: false, error: error.message };
        }
    },
    
    async loginWithGoogle() {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin
                }
            });
            
            if (error) throw error;
        } catch (error) {
            console.error('Google login error:', error);
            Toast.error('حدث خطأ أثناء تسجيل الدخول بـ Google');
        }
    },
    
    isAdmin() {
        return Store.user?.email?.toLowerCase() === CONFIG.ADMIN_EMAIL.toLowerCase();
    },
    
    isLoggedIn() {
        return !!Store.user;
    },
    
    isEmailConfirmed() {
        return Store.user?.email_confirmed_at != null;
    },
    
    updateUI() {
        const userDropdownMenu = document.getElementById('user-dropdown-menu');
        const mobileUserSection = document.getElementById('mobile-user-section');
        
        if (Store.user) {
            const userData = Store.user.user_metadata || {};
            const name = userData.full_name || userData.first_name || Store.user.email.split('@')[0];
            const initial = name.charAt(0).toUpperCase();
            
            // Update avatar initial
            document.querySelectorAll('#user-avatar-initial').forEach(el => {
                el.textContent = initial;
            });
            
            // Update user name
            document.querySelectorAll('#user-name').forEach(el => {
                el.textContent = name;
            });
            
            // Update email
            document.querySelectorAll('#user-email').forEach(el => {
                el.textContent = Store.user.email;
            });
            
            // Desktop dropdown
            if (userDropdownMenu) {
                userDropdownMenu.innerHTML = `
                    <div class="user-dropdown-header">
                        <h4>${Utils.sanitizeHTML(name)}</h4>
                        <p>${Utils.sanitizeHTML(Store.user.email)}</p>
                    </div>
                    <a href="#" data-page="account" data-section="overview">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                        </svg>
                        حسابي
                    </a>
                    <a href="#" data-page="account" data-section="orders">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                            <line x1="3" y1="6" x2="21" y2="6"/>
                            <path d="M16 10a4 4 0 01-8 0"/>
                        </svg>
                        طلباتي
                    </a>
                    <a href="#" data-page="account" data-section="wishlist">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                        </svg>
                        المفضلة
                    </a>
                    ${this.isAdmin() ? `
                        <a href="admin.html" class="admin-link">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                            </svg>
                            لوحة التحكم
                        </a>
                    ` : ''}
                    <button class="logout-btn" onclick="Auth.logout()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                            <polyline points="16 17 21 12 16 7"/>
                            <line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                        تسجيل الخروج
                    </button>
                `;
            }
            
            // Mobile section
            if (mobileUserSection) {
                mobileUserSection.innerHTML = `
                    <div class="mobile-user-info">
                        <div class="user-avatar">${initial}</div>
                        <div>
                            <h4>${Utils.sanitizeHTML(name)}</h4>
                            <p>${Utils.sanitizeHTML(Store.user.email)}</p>
                        </div>
                    </div>
                    ${this.isAdmin() ? `
                        <a href="admin.html" class="btn btn-primary btn-block" style="margin-bottom: 10px;">
                            لوحة التحكم
                        </a>
                    ` : ''}
                    <button class="btn btn-outline btn-block" onclick="Auth.logout()">
                        تسجيل الخروج
                    </button>
                `;
            }
        } else {
            // Not logged in
            if (userDropdownMenu) {
                userDropdownMenu.innerHTML = `
                    <a href="#" data-page="auth">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/>
                            <polyline points="10 17 15 12 10 7"/>
                            <line x1="15" y1="12" x2="3" y2="12"/>
                        </svg>
                        تسجيل الدخول
                    </a>
                    <a href="#" data-page="auth">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                            <circle cx="8.5" cy="7" r="4"/>
                            <line x1="20" y1="8" x2="20" y2="14"/>
                            <line x1="23" y1="11" x2="17" y2="11"/>
                        </svg>
                        حساب جديد
                    </a>
                `;
            }
            
            if (mobileUserSection) {
                mobileUserSection.innerHTML = `
                    <button class="btn btn-primary btn-block" data-page="auth">
                        تسجيل الدخول
                    </button>
                `;
            }
        }
    }
};

// ==================== DATABASE OPERATIONS ====================
const DB = {
    // Categories
    async getCategories() {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .eq('is_active', true)
                .order('sort_order');
            
            if (error) throw error;
            
            Store.categories = data || [];
            return data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    },
    
    // Products
    async getProducts(options = {}) {
        try {
            let query = supabase
                .from('products')
                .select(`
                    *,
                    category:categories(id, name, slug)
                `)
                .eq('is_active', true); // ✅ التعديل هنا: استخدام is_active

            
            // Filters
            if (options.category) {
                query = query.eq('category_id', options.category);
            }
            
            if (options.minPrice) {
                query = query.gte('price', options.minPrice);
            }
            
            if (options.maxPrice) {
                query = query.lte('price', options.maxPrice);
            }
            
            // التعديل هنا ليتوافق مع compare_price بدلاً من sale_price
            if (options.onSale) {
                query = query.not('compare_price', 'is', null);
            }
            
            if (options.inStock) {
                query = query.gt('stock', 0);
            }
            
            if (options.search) {
                query = query.ilike('name', `%${options.search}%`);
            }
            
            // التعديل هنا ليتوافق مع is_featured بدلاً من featured
            if (options.featured) {
                query = query.eq('is_featured', true);
            }

            
            // Sorting
            switch (options.sort) {
                case 'price-low':
                    query = query.order('price', { ascending: true });
                    break;
                case 'price-high':
                    query = query.order('price', { ascending: false });
                    break;
                case 'name':
                    query = query.order('name');
                    break;
                case 'newest':
                default:
                    query = query.order('created_at', { ascending: false });
            }
            
            // Pagination
            const page = options.page || 1;
            const limit = options.limit || CONFIG.PRODUCTS_PER_PAGE;
            const from = (page - 1) * limit;
            const to = from + limit - 1;
            
            query = query.range(from, to);
            
            const { data, error, count } = await query;
            
            if (error) throw error;
            
            return { products: data || [], total: count };
        } catch (error) {
            console.error('Error fetching products:', error);
            return { products: [], total: 0 };
        }
    },
    
    async getProductById(id) {
        try {
            const { data, error } = await supabase
                .from('products')
                .select(`
                    *,
                    category:categories(id, name, slug)
                `)
                .eq('id', id)
                .single();
            
            if (error) throw error;
            
            return data;
        } catch (error) {
            console.error('Error fetching product:', error);
            return null;
        }
    },
    
    async getRelatedProducts(productId, categoryId, limit = 4) {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('category_id', categoryId)
                .neq('id', productId)
                .eq('is_active', true)
                .limit(limit);
            
            if (error) throw error;
            
            return data || [];
        } catch (error) {
            console.error('Error fetching related products:', error);
            return [];
        }
    },
    
    // Reviews
    async getProductReviews(productId) {
        try {
            const { data, error } = await supabase
                .from('reviews')
                .select(`
                    *,
                    user:users(id, full_name)
                `)
                .eq('product_id', productId)
                .eq('approved', true)
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            
            return data || [];
        } catch (error) {
            console.error('Error fetching reviews:', error);
            return [];
        }
    },
    
    async addReview(reviewData) {
        try {
            const { data, error } = await supabase
                .from('reviews')
                .insert([{
                    ...reviewData,
                    user_id: Store.user.id,
                    approved: false // Needs admin approval
                }])
                .select();
            
            if (error) throw error;
            
            return { success: true, review: data[0] };
        } catch (error) {
            console.error('Error adding review:', error);
            return { success: false, error: error.message };
        }
    },
    
    // Orders
    async createOrder(orderData) {
        try {
            const { data, error } = await supabase
                .from('orders')
                .insert([orderData])
                .select();
            
            if (error) throw error;
            
            return { success: true, order: data[0] };
        } catch (error) {
            console.error('Error creating order:', error);
            return { success: false, error: error.message };
        }
    },
    
    async getUserOrders() {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select(`
                    *,
                    items:order_items(*)
                `)
                .eq('user_id', Store.user.id)
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            
            return data || [];
        } catch (error) {
            console.error('Error fetching orders:', error);
            return [];
        }
    },
    
    async getOrderById(orderId) {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select(`
                    *,
                    items:order_items(*)
                `)
                .eq('id', orderId)
                .single();
            
            if (error) throw error;
            
            return data;
        } catch (error) {
            console.error('Error fetching order:', error);
            return null;
        }
    },
    
    // Support Tickets
    async createTicket(ticketData) {
        try {
            const { data, error } = await supabase
                .from('tickets')
                .insert([{
                    ...ticketData,
                    user_id: Store.user.id,
                    status: 'open'
                }])
                .select();
            
            if (error) throw error;
            
            return { success: true, ticket: data[0] };
        } catch (error) {
            console.error('Error creating ticket:', error);
            return { success: false, error: error.message };
        }
    },
    
    async getUserTickets() {
        try {
            const { data, error } = await supabase
                .from('tickets')
                .select('*')
                .eq('user_id', Store.user.id)
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            
            return data || [];
        } catch (error) {
            console.error('Error fetching tickets:', error);
            return [];
        }
    },
    
    // Settings
    async getSettings() {
        try {
            const { data, error } = await supabase
                .from('settings')
                .select('*')
                .single();
            
            if (error) throw error;
            
            Store.settings = data || {};
            return data;
        } catch (error) {
            console.error('Error fetching settings:', error);
            return {};
        }
    },
    
    // Shipping Rates
    async getShippingRates() {
        try {
            const { data, error } = await supabase
                .from('shipping_rates')
                .select('*')
                .eq('active', true);
            
            if (error) throw error;
            
            Store.shippingRates = data || [];
            return data;
        } catch (error) {
            console.error('Error fetching shipping rates:', error);
            return [];
        }
    },
    
    // Customer Reviews (for homepage)
    async getCustomerReviews(limit = 6) {
        try {
            const { data, error } = await supabase
                .from('reviews')
                .select(`
                    *,
                    user:users(full_name),
                    product:products(name)
                `)
                .eq('approved', true)
                .gte('rating', 4)
                .order('created_at', { ascending: false })
                .limit(limit);
            
            if (error) throw error;
            
            return data || [];
        } catch (error) {
            console.error('Error fetching customer reviews:', error);
            return [];
        }
    },
    
    // User Addresses
    async getUserAddresses() {
        try {
            const { data, error } = await supabase
                .from('addresses')
                .select('*')
                .eq('user_id', Store.user.id)
                .order('is_default', { ascending: false });
            
            if (error) throw error;
            
            return data || [];
        } catch (error) {
            console.error('Error fetching addresses:', error);
            return [];
        }
    },
    
    async saveAddress(addressData) {
        try {
            if (addressData.id) {
                // Update existing
                const { data, error } = await supabase
                    .from('addresses')
                    .update(addressData)
                    .eq('id', addressData.id)
                    .select();
                
                if (error) throw error;
                return { success: true, address: data[0] };
            } else {
                // Create new
                const { data, error } = await supabase
                    .from('addresses')
                    .insert([{
                        ...addressData,
                        user_id: Store.user.id
                    }])
                    .select();
                
                if (error) throw error;
                return { success: true, address: data[0] };
            }
        } catch (error) {
            console.error('Error saving address:', error);
            return { success: false, error: error.message };
        }
    },
    
    async deleteAddress(addressId) {
        try {
            const { error } = await supabase
                .from('addresses')
                .delete()
                .eq('id', addressId);
            
            if (error) throw error;
            
            return { success: true };
        } catch (error) {
            console.error('Error deleting address:', error);
            return { success: false, error: error.message };
        }
    }
};

// ==================== SEARCH ====================
const Search = {
    input: null,
    suggestions: null,
    clearBtn: null,
    
    init() {
        this.input = document.getElementById('search-input');
        this.suggestions = document.getElementById('search-suggestions');
        this.clearBtn = document.getElementById('search-clear');
        
        if (this.input) {
            this.input.addEventListener('input', Utils.debounce((e) => {
                this.search(e.target.value);
            }, 300));
            
            this.input.addEventListener('focus', () => {
                if (this.input.value.length >= 2) {
                    this.suggestions?.classList.add('active');
                }
            });
            
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.search-container')) {
                    this.suggestions?.classList.remove('active');
                }
            });
        }
        
        if (this.clearBtn) {
            this.clearBtn.addEventListener('click', () => {
                this.input.value = '';
                this.suggestions?.classList.remove('active');
                this.input.focus();
            });
        }
        
        // Search form submission
        const form = document.getElementById('search-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const query = this.input.value.trim();
                if (query) {
                    Router.navigate('products', { search: query });
                    this.suggestions?.classList.remove('active');
                }
            });
        }
    },
    
    async search(query) {
        if (query.length < 2) {
            this.suggestions?.classList.remove('active');
            return;
        }
        
        try {
            const { data, error } = await supabase
                .from('products')
                .select('id, name, price, sale_price, images')
                .eq('is_active', true)
                .ilike('name', `%${query}%`)
                .limit(5);
            
            if (error) throw error;
            
            this.renderSuggestions(data || []);
        } catch (error) {
            console.error('Search error:', error);
        }
    },
    
    renderSuggestions(products) {
        if (!this.suggestions) return;
        
        if (products.length === 0) {
            this.suggestions.innerHTML = `
                <div class="search-no-results">
                    <p>لا توجد نتائج</p>
                </div>
            `;
        } else {
            this.suggestions.innerHTML = products.map(product => `
                <div class="search-suggestion-item" data-page="product-detail" data-id="${product.id}">
                    <img src="${product.images?.[0] || '/placeholder.jpg'}" alt="${Utils.sanitizeHTML(product.name)}">
                    <div class="search-suggestion-info">
                        <h4>${Utils.sanitizeHTML(product.name)}</h4>
                        <span>${Utils.formatPrice(product.sale_price || product.price)}</span>
                    </div>
                </div>
            `).join('');
        }
        
        this.suggestions.classList.add('active');
    }
};
// ==================== HOME PAGE ====================
const HomePage = {
    async init() {
        await this.loadCategories();
        await this.loadNewProducts();
        await this.loadFeaturedProducts();
        await this.loadFlashSale();
        await this.loadCustomerReviews();
        this.initHeroSlider();
    },
    
    async loadCategories() {
        const container = document.getElementById('home-categories');
        if (!container) return;
        
        const categories = await DB.getCategories();
        
        if (categories.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>لا توجد تصنيفات حالياً</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = categories.slice(0, 8).map(category => `
            <div class="category-card" data-page="products" data-category="${category.id}">
                <div class="category-icon">${category.icon || '📦'}</div>
                <h3 class="category-name">${Utils.sanitizeHTML(category.name)}</h3>
                <span class="category-count">${category.products_count || 0} منتج</span>
            </div>
        `).join('');
        
        // Update categories nav
        this.updateCategoriesNav(categories);
    },
    
    updateCategoriesNav(categories) {
        const nav = document.getElementById('categories-nav');
        if (!nav) return;
        
        const allBtn = nav.querySelector('[data-category="all"]');
        const existingCategories = nav.querySelectorAll('[data-category]:not([data-category="all"])');
        existingCategories.forEach(el => el.remove());
        
        categories.forEach(category => {
            const btn = document.createElement('button');
            btn.className = 'category-nav-item';
            btn.setAttribute('data-category', category.id);
            btn.innerHTML = `
                <span>${category.icon || '📦'}</span>
                <span>${Utils.sanitizeHTML(category.name)}</span>
            `;
            btn.addEventListener('click', () => {
                Router.navigate('products', { category: category.id });
            });
            nav.appendChild(btn);
        });
    },
    
    async loadNewProducts() {
        const container = document.getElementById('new-products');
        if (!container) return;
        
        const { products } = await DB.getProducts({ 
            sort: 'newest', 
            limit: 8 
        });
        
        this.renderProducts(container, products);
    },
    
    async loadFeaturedProducts() {
        const container = document.getElementById('featured-products');
        if (!container) return;
        
        const { products } = await DB.getProducts({ 
            featured: true, 
            limit: 8 
        });
        
        this.renderProducts(container, products);
    },
    
    async loadFlashSale() {
        const section = document.getElementById('flash-sale-section');
        const container = document.getElementById('flash-sale-products');
        if (!section || !container) return;
        
        const { products } = await DB.getProducts({ 
            onSale: true, 
            limit: 8 
        });
        
        if (products.length === 0) {
            section.style.display = 'none';
            return;
        }
        
        section.style.display = 'block';
        this.renderProducts(container, products);
        this.initFlashSaleTimer();
    },
    
    initFlashSaleTimer() {
        // Set end time to midnight
        const now = new Date();
        const endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
        
        const updateTimer = () => {
            const diff = endTime - new Date();
            
            if (diff <= 0) {
                // Reset for next day
                endTime.setDate(endTime.getDate() + 1);
                return;
            }
            
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            document.getElementById('timer-hours')?.textContent && 
                (document.getElementById('timer-hours').textContent = hours.toString().padStart(2, '0'));
            document.getElementById('timer-minutes')?.textContent && 
                (document.getElementById('timer-minutes').textContent = minutes.toString().padStart(2, '0'));
            document.getElementById('timer-seconds')?.textContent && 
                (document.getElementById('timer-seconds').textContent = seconds.toString().padStart(2, '0'));
        };
        
        updateTimer();
        setInterval(updateTimer, 1000);
    },
    
    async loadCustomerReviews() {
        const container = document.getElementById('customer-reviews');
        const noReviewsMsg = document.getElementById('no-reviews-message');
        if (!container) return;
        
        const reviews = await DB.getCustomerReviews();
        
        if (reviews.length === 0) {
            if (noReviewsMsg) noReviewsMsg.style.display = 'block';
            return;
        }
        
        if (noReviewsMsg) noReviewsMsg.style.display = 'none';
        
        container.innerHTML = reviews.map(review => `
            <div class="review-card">
                <div class="review-header">
                    <div class="review-avatar">${review.user?.full_name?.charAt(0) || 'U'}</div>
                    <div class="review-author">
                        <h4>${Utils.sanitizeHTML(review.user?.full_name || 'عميل')}</h4>
                        <span>${Utils.formatRelativeTime(review.created_at)}</span>
                    </div>
                </div>
                <div class="review-rating">
                    <div class="stars">
                        ${this.renderStars(review.rating)}
                    </div>
                    <span class="verified-badge">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                            <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                        مشتري موثق
                    </span>
                </div>
                <p class="review-text">${Utils.sanitizeHTML(review.comment)}</p>
            </div>
        `).join('');
    },
    
    renderStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
            } else {
                stars += '<svg viewBox="0 0 24 24" fill="currentColor" class="empty"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
            }
        }
        return stars;
    },
    
    renderProducts(container, products) {
        if (products.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1;">
                    <p>لا توجد منتجات حالياً</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = products.map(product => this.createProductCard(product)).join('');
    },
    
    createProductCard(product) {
        const isInWishlist = Wishlist.isInWishlist(product.id);
        const hasDiscount = product.sale_price && product.sale_price < product.price;
        const discountPercentage = hasDiscount ? Utils.calculateDiscount(product.price, product.sale_price) : 0;
        const isOutOfStock = product.stock <= 0;
        const isLowStock = product.stock > 0 && product.stock <= 5;
        
        return `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.images?.[0] || '/placeholder.jpg'}" alt="${Utils.sanitizeHTML(product.name)}" loading="lazy">
                    
                    <div class="product-badges">
                        ${hasDiscount ? `<span class="product-badge badge-sale">-${discountPercentage}%</span>` : ''}
                        ${product.is_new ? '<span class="product-badge badge-new">جديد</span>' : ''}
                        ${isOutOfStock ? '<span class="product-badge badge-outofstock">نفذ المخزون</span>' : ''}
                    </div>
                    
                    <div class="product-actions">
                        <button class="product-action-btn ${isInWishlist ? 'active' : ''}" 
                                data-wishlist-id="${product.id}"
                                onclick="Wishlist.toggle(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                            <svg viewBox="0 0 24 24" fill="${isInWishlist ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                            </svg>
                        </button>
                        <button class="product-action-btn" onclick="ProductsPage.quickView('${product.id}')">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                <circle cx="12" cy="12" r="3"/>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <div class="product-info">
                    <span class="product-category">${product.category?.name || ''}</span>
                    <h3 class="product-name">
                        <a href="#" data-page="product-detail" data-id="${product.id}">${Utils.sanitizeHTML(product.name)}</a>
                    </h3>
                    
                    <div class="product-rating">
                        <div class="stars">
                            ${this.renderStars(product.rating || 0)}
                        </div>
                        <span class="rating-count">(${product.reviews_count || 0})</span>
                    </div>
                    
                    <div class="product-price">
                        <span class="current-price">${Utils.formatPrice(product.sale_price || product.price)}</span>
                        ${hasDiscount ? `<span class="original-price">${Utils.formatPrice(product.price)}</span>` : ''}
                    </div>
                    
                    <div class="product-stock">
                        <span class="stock-indicator ${isOutOfStock ? 'out-of-stock' : isLowStock ? 'low-stock' : 'in-stock'}"></span>
                        <span>${isOutOfStock ? 'نفذ المخزون' : isLowStock ? `${product.stock} قطع متبقية` : 'متوفر'}</span>
                    </div>
                    
                    <button class="product-add-btn" 
                            ${isOutOfStock ? 'disabled' : ''}
                            onclick="Cart.add(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="9" cy="21" r="1"/>
                            <circle cx="20" cy="21" r="1"/>
                            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
                        </svg>
                        ${isOutOfStock ? 'نفذ المخزون' : 'أضف للسلة'}
                    </button>
                </div>
            </div>
        `;
    },
    
    initHeroSlider() {
        // Hero slider logic if multiple slides
        const slider = document.getElementById('hero-slider');
        const indicators = document.getElementById('hero-indicators');
        if (!slider) return;
        
        const slides = slider.querySelectorAll('.hero-slide');
        if (slides.length <= 1) return;
        
        let currentSlide = 0;
        
        // Create indicators
        indicators.innerHTML = slides.map((_, i) => 
            `<button class="hero-indicator ${i === 0 ? 'active' : ''}" data-slide="${i}"></button>`
        ).join('');
        
        // Auto slide
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            indicators.children[currentSlide].classList.remove('active');
            
            currentSlide = (currentSlide + 1) % slides.length;
            
            slides[currentSlide].classList.add('active');
            indicators.children[currentSlide].classList.add('active');
        }, 5000);
        
        // Click indicators
        indicators.addEventListener('click', (e) => {
            const indicator = e.target.closest('.hero-indicator');
            if (!indicator) return;
            
            const slideIndex = parseInt(indicator.dataset.slide);
            
            slides[currentSlide].classList.remove('active');
            indicators.children[currentSlide].classList.remove('active');
            
            currentSlide = slideIndex;
            
            slides[currentSlide].classList.add('active');
            indicators.children[currentSlide].classList.add('active');
        });
    }
};

// ==================== PRODUCTS PAGE ====================
const ProductsPage = {
    currentPage: 1,
    filters: {},
    
    async init(options = {}) {
        this.filters = {
            category: options.category || null,
            search: options.search || null,
            minPrice: null,
            maxPrice: null,
            onSale: options.filter === 'sale',
            inStock: false,
            sort: 'newest'
        };
        
        this.currentPage = 1;
        
        await this.loadCategories();
        await this.loadProducts();
        this.initFilters();
        this.initViewToggle();
    },
    
    async loadCategories() {
        const container = document.getElementById('filter-categories');
        if (!container) return;
        
        const categories = await DB.getCategories();
        
        container.innerHTML = `
            <label class="filter-checkbox">
                <input type="radio" name="category" value="" ${!this.filters.category ? 'checked' : ''}>
                <span class="checkmark"></span>
                <span>جميع التصنيفات</span>
            </label>
            ${categories.map(cat => `
                <label class="filter-checkbox">
                    <input type="radio" name="category" value="${cat.id}" ${this.filters.category === cat.id ? 'checked' : ''}>
                    <span class="checkmark"></span>
                    <span>${Utils.sanitizeHTML(cat.name)}</span>
                </label>
            `).join('')}
        `;
    },
    
    async loadProducts() {
        const container = document.getElementById('products-grid');
        const countText = document.getElementById('products-count-text');
        const pagination = document.getElementById('products-pagination');
        
        if (!container) return;
        
        // Show loading
        container.innerHTML = Array(8).fill('<div class="product-skeleton"></div>').join('');
        
        const { products, total } = await DB.getProducts({
            ...this.filters,
            page: this.currentPage,
            limit: CONFIG.PRODUCTS_PER_PAGE
        });
        
        // Update count
        if (countText) {
            countText.textContent = `عرض ${products.length} من ${total || 0} منتج`;
        }
        
        // Render products
        if (products.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1;">
                    <div class="empty-state-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                            <circle cx="11" cy="11" r="8"/>
                            <path d="M21 21l-4.35-4.35"/>
                        </svg>
                    </div>
                    <h3>لا توجد منتجات</h3>
                    <p>جرب تغيير معايير البحث أو الفلاتر</p>
                    <button class="btn btn-primary" onclick="ProductsPage.clearFilters()">مسح الفلاتر</button>
                </div>
            `;
            if (pagination) pagination.innerHTML = '';
            return;
        }
        
        container.innerHTML = products.map(product => HomePage.createProductCard(product)).join('');
        
        // Render pagination
        this.renderPagination(total || 0);
    },
    
    renderPagination(total) {
        const container = document.getElementById('products-pagination');
        if (!container) return;
        
        const totalPages = Math.ceil(total / CONFIG.PRODUCTS_PER_PAGE);
        
        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }
        
        let html = `
            <button class="pagination-btn" ${this.currentPage === 1 ? 'disabled' : ''} onclick="ProductsPage.goToPage(${this.currentPage - 1})">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"/>
                </svg>
            </button>
        `;
        
        // Page numbers
        const maxVisiblePages = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        if (startPage > 1) {
            html += `<button class="pagination-btn" onclick="ProductsPage.goToPage(1)">1</button>`;
            if (startPage > 2) {
                html += `<span class="pagination-dots">...</span>`;
            }
        }
        
        for (let i = startPage; i <= endPage; i++) {
            html += `
                <button class="pagination-btn ${i === this.currentPage ? 'active' : ''}" 
                        onclick="ProductsPage.goToPage(${i})">${i}</button>
            `;
        }
        
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                html += `<span class="pagination-dots">...</span>`;
            }
            html += `<button class="pagination-btn" onclick="ProductsPage.goToPage(${totalPages})">${totalPages}</button>`;
        }
        
        html += `
            <button class="pagination-btn" ${this.currentPage === totalPages ? 'disabled' : ''} onclick="ProductsPage.goToPage(${this.currentPage + 1})">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="15 18 9 12 15 6"/>
                </svg>
            </button>
        `;
        
        container.innerHTML = html;
    },
    
    goToPage(page) {
        this.currentPage = page;
        this.loadProducts();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    
    initFilters() {
        // Sort
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.value = this.filters.sort;
            sortSelect.addEventListener('change', (e) => {
                this.filters.sort = e.target.value;
                this.currentPage = 1;
                this.loadProducts();
            });
        }
        
        // Price range
        const priceMin = document.getElementById('price-min');
        const priceMax = document.getElementById('price-max');
        const priceRange = document.getElementById('price-range');
        
        if (priceRange) {
            priceRange.addEventListener('input', (e) => {
                if (priceMax) priceMax.value = e.target.value;
            });
        }
        
        // Apply filters button
        const applyBtn = document.getElementById('apply-filters');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                this.filters.minPrice = priceMin?.value ? parseInt(priceMin.value) : null;
                this.filters.maxPrice = priceMax?.value ? parseInt(priceMax.value) : null;
                this.filters.onSale = document.getElementById('filter-sale')?.checked || false;
                this.filters.inStock = document.getElementById('filter-stock')?.checked || false;
                
                // Category
                const selectedCategory = document.querySelector('input[name="category"]:checked');
                this.filters.category = selectedCategory?.value || null;
                
                this.currentPage = 1;
                this.loadProducts();
                
                // Close mobile filters
                document.getElementById('filters-sidebar')?.classList.remove('active');
                document.getElementById('filters-overlay')?.classList.remove('active');
            });
        }
        
        // Clear filters
        const clearBtn = document.getElementById('filters-clear');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearFilters());
        }
        
        // Mobile filter toggle
        const filterToggle = document.getElementById('filter-toggle-mobile');
        const filtersSidebar = document.getElementById('filters-sidebar');
        const filtersOverlay = document.getElementById('filters-overlay');
        
        if (filterToggle) {
            filterToggle.addEventListener('click', () => {
                filtersSidebar?.classList.add('active');
                filtersOverlay?.classList.add('active');
            });
        }
        
        if (filtersOverlay) {
            filtersOverlay.addEventListener('click', () => {
                filtersSidebar?.classList.remove('active');
                filtersOverlay?.classList.remove('active');
            });
        }
    },
    
    clearFilters() {
        this.filters = {
            category: null,
            search: null,
            minPrice: null,
            maxPrice: null,
            onSale: false,
            inStock: false,
            sort: 'newest'
        };
        
        // Reset form inputs
        document.getElementById('price-min')?.value && (document.getElementById('price-min').value = '');
        document.getElementById('price-max')?.value && (document.getElementById('price-max').value = '');
        document.getElementById('filter-sale')?.checked && (document.getElementById('filter-sale').checked = false);
        document.getElementById('filter-stock')?.checked && (document.getElementById('filter-stock').checked = false);
        
        const allCategoryRadio = document.querySelector('input[name="category"][value=""]');
        if (allCategoryRadio) allCategoryRadio.checked = true;
        
        this.currentPage = 1;
        this.loadProducts();
    },
    
    initViewToggle() {
        const toggles = document.querySelectorAll('.view-toggle');
        const grid = document.getElementById('products-grid');
        
        toggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                toggles.forEach(t => t.classList.remove('active'));
                toggle.classList.add('active');
                
                const view = toggle.dataset.view;
                if (view === 'list') {
                    grid?.classList.add('list-view');
                } else {
                    grid?.classList.remove('list-view');
                }
            });
        });
    },
    
    async quickView(productId) {
        const product = await DB.getProductById(productId);
        if (!product) return;
        
        const content = document.getElementById('quick-view-content');
        if (!content) return;
        
        const hasDiscount = product.sale_price && product.sale_price < product.price;
        
        content.innerHTML = `
            <div class="quick-view-image">
                <img src="${product.images?.[0] || '/placeholder.jpg'}" alt="${Utils.sanitizeHTML(product.name)}">
            </div>
            <div class="quick-view-details">
                <span class="product-category">${product.category?.name || ''}</span>
                <h2 class="product-name">${Utils.sanitizeHTML(product.name)}</h2>
                
                <div class="product-rating">
                    <div class="stars">${HomePage.renderStars(product.rating || 0)}</div>
                    <span class="rating-count">(${product.reviews_count || 0} تقييم)</span>
                </div>
                
                <div class="product-price">
                    <span class="current-price">${Utils.formatPrice(product.sale_price || product.price)}</span>
                    ${hasDiscount ? `<span class="original-price">${Utils.formatPrice(product.price)}</span>` : ''}
                </div>
                
                <p class="quick-view-description">${Utils.sanitizeHTML(product.description || '')}</p>
                
                <div class="product-quantity">
                    <span>الكمية:</span>
                    <div class="quantity-control">
                        <button class="quantity-btn" id="qv-qty-minus">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>
                        </button>
                        <span class="quantity-value" id="qv-qty-value">1</span>
                        <button class="quantity-btn" id="qv-qty-plus">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="12" y1="5" x2="12" y2="19"/>
                                <line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <div class="product-actions-detail">
                    <button class="btn btn-primary btn-lg" id="qv-add-cart" ${product.stock <= 0 ? 'disabled' : ''}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="9" cy="21" r="1"/>
                            <circle cx="20" cy="21" r="1"/>
                            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
                        </svg>
                        ${product.stock <= 0 ? 'نفذ المخزون' : 'أضف للسلة'}
                    </button>
                    <button class="btn btn-outline" data-page="product-detail" data-id="${product.id}">
                        عرض التفاصيل
                    </button>
                </div>
            </div>
        `;
        
        // Quantity controls
        let quantity = 1;
        const qtyValue = document.getElementById('qv-qty-value');
        
        document.getElementById('qv-qty-minus')?.addEventListener('click', () => {
            if (quantity > 1) {
                quantity--;
                qtyValue.textContent = quantity;
            }
        });
        
        document.getElementById('qv-qty-plus')?.addEventListener('click', () => {
            if (quantity < product.stock) {
                quantity++;
                qtyValue.textContent = quantity;
            }
        });
        
        // Add to cart
        document.getElementById('qv-add-cart')?.addEventListener('click', () => {
            Cart.add(product, quantity);
            Modal.close('quick-view-modal');
        });
        
        Modal.open('quick-view-modal');
    }
};

// ==================== PRODUCT DETAIL PAGE ====================
const ProductDetailPage = {
    product: null,
    selectedQuantity: 1,
    
    async init(productId) {
        if (!productId) {
            Router.navigate('404');
            return;
        }
        
        this.product = await DB.getProductById(productId);
        
        if (!this.product) {
            Router.navigate('404');
            return;
        }
        
        this.selectedQuantity = 1;
        this.render();
        await this.loadReviews();
        await this.loadRelatedProducts();
    },
    
    render() {
        const container = document.getElementById('product-detail');
        const breadcrumbName = document.getElementById('product-breadcrumb-name');
        
        if (!container || !this.product) return;
        
        if (breadcrumbName) {
            breadcrumbName.textContent = this.product.name;
        }
        
        const hasDiscount = this.product.sale_price && this.product.sale_price < this.product.price;
        const discountPercentage = hasDiscount ? Utils.calculateDiscount(this.product.price, this.product.sale_price) : 0;
        const isOutOfStock = this.product.stock <= 0;
        const isInWishlist = Wishlist.isInWishlist(this.product.id);
        
        container.innerHTML = `
            <div class="product-gallery custom-side-by-side">
                ${(this.product.images && this.product.images.length > 0 ? this.product.images : ['/placeholder.jpg']).map(img => `
                    <img src="${img}" alt="${Utils.sanitizeHTML(this.product.name)}" class="side-image">
                `).join('')}
            </div>
            
            <div class="product-details">
                <span class="product-category">${this.product.category?.name || ''}</span>
                <h1 class="product-name">${Utils.sanitizeHTML(this.product.name)}</h1>
                
                <div class="product-rating">
                    <div class="stars">${HomePage.renderStars(this.product.rating || 0)}</div>
                    <span class="rating-count">(${this.product.reviews_count || 0} تقييم)</span>
                </div>
                
                <div class="product-price">
                    <span class="current-price">${Utils.formatPrice(this.product.sale_price || this.product.price)}</span>
                    ${hasDiscount ? `
                        <span class="original-price">${Utils.formatPrice(this.product.price)}</span>
                        <span class="discount-percentage">-${discountPercentage}%</span>
                    ` : ''}
                </div>
                
                <div class="product-description">
                    <h4>وصف المنتج</h4>
                    <p>${Utils.sanitizeHTML(this.product.description || 'لا يوجد وصف متاح')}</p>
                </div>
                
                ${this.product.options ? this.renderOptions() : ''}
                
                <div class="product-quantity">
                    <span>الكمية:</span>
                    <div class="quantity-control">
                        <button class="quantity-btn" id="detail-qty-minus">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>
                        </button>
                        <span class="quantity-value" id="detail-qty-value">1</span>
                        <button class="quantity-btn" id="detail-qty-plus">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="12" y1="5" x2="12" y2="19"/>
                                <line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>
                        </button>
                    </div>
                    <span class="stock-info">${isOutOfStock ? 'نفذ المخزون' : `${this.product.stock} قطعة متوفرة`}</span>
                </div>
                
                <div class="product-actions-detail">
                    <button class="btn btn-primary btn-lg" id="add-to-cart-detail" ${isOutOfStock ? 'disabled' : ''}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="9" cy="21" r="1"/>
                            <circle cx="20" cy="21" r="1"/>
                            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
                        </svg>
                        ${isOutOfStock ? 'نفذ المخزون' : 'أضف للسلة'}
                    </button>
                    <button class="btn btn-outline btn-lg ${isInWishlist ? 'active' : ''}" id="add-to-wishlist-detail">
                        <svg viewBox="0 0 24 24" fill="${isInWishlist ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                        </svg>
                    </button>
                </div>
                
                <div class="product-meta">
                    <div class="meta-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="1" y="3" width="15" height="13"/>
                            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                            <circle cx="5.5" cy="18.5" r="2.5"/>
                            <circle cx="18.5" cy="18.5" r="2.5"/>
                        </svg>
                        <span>توصيل لجميع ولايات الجزائر</span>
                    </div>
                    <div class="meta-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        </svg>
                        <span>ضمان جودة المنتج</span>
                    </div>
                    <div class="meta-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="23 4 23 10 17 10"/>
                            <polyline points="1 20 1 14 7 14"/>
                            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
                        </svg>
                        <span>إمكانية الإرجاع والاستبدال</span>
                    </div>
                    ${this.product.sku ? `
                        <div class="meta-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                <line x1="3" y1="9" x2="21" y2="9"/>
                                <line x1="9" y1="21" x2="9" y2="9"/>
                            </svg>
                            <span>رمز المنتج: ${this.product.sku}</span>
                        </div>
                    ` : ''}
                </div>
                
                <div class="social-share">
                    <span class="social-share-label">مشاركة:</span>
                    <button class="share-btn facebook" onclick="ProductDetailPage.share('facebook')">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                        </svg>
                    </button>
                    <button class="share-btn twitter" onclick="ProductDetailPage.share('twitter')">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                        </svg>
                    </button>
                    <button class="share-btn whatsapp" onclick="ProductDetailPage.share('whatsapp')">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
        
        this.initGallery();
        this.initQuantityControls();
        this.initActions();
    },
    
    renderOptions() {
        // If product has options like size, color, etc.
        return '';
    },
    
    initGallery() {
        const mainImage = document.getElementById('main-product-image');
        const thumbnails = document.querySelectorAll('.product-thumbnail');
        
        if (!mainImage) return; // 🌟 سطر الحماية لمنع الأخطاء بعد حذف الصورة الكبيرة

        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                thumbnails.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
                mainImage.src = thumb.dataset.image;
            });
        });
    },
    
    initQuantityControls() {
        const qtyValue = document.getElementById('detail-qty-value');
        const minusBtn = document.getElementById('detail-qty-minus');
        const plusBtn = document.getElementById('detail-qty-plus');
        
        minusBtn?.addEventListener('click', () => {
            if (this.selectedQuantity > 1) {
                this.selectedQuantity--;
                qtyValue.textContent = this.selectedQuantity;
            }
        });
        
        plusBtn?.addEventListener('click', () => {
            if (this.selectedQuantity < this.product.stock) {
                this.selectedQuantity++;
                qtyValue.textContent = this.selectedQuantity;
            }
        });
    },
    
    initActions() {
        const addToCartBtn = document.getElementById('add-to-cart-detail');
        const addToWishlistBtn = document.getElementById('add-to-wishlist-detail');
        
        addToCartBtn?.addEventListener('click', () => {
            Cart.add(this.product, this.selectedQuantity);
        });
        
        addToWishlistBtn?.addEventListener('click', () => {
            Wishlist.toggle(this.product);
            const isInWishlist = Wishlist.isInWishlist(this.product.id);
            addToWishlistBtn.classList.toggle('active', isInWishlist);
            const svg = addToWishlistBtn.querySelector('svg');
            if (svg) {
                svg.setAttribute('fill', isInWishlist ? 'currentColor' : 'none');
            }
        });
    },

    
    async loadReviews() {
        const reviewsCount = document.getElementById('product-reviews-count');
        const reviewsSummary = document.getElementById('reviews-summary');
        const reviewsList = document.getElementById('product-reviews-list');
        const writeReviewSection = document.getElementById('write-review-section');
        
        const reviews = await DB.getProductReviews(this.product.id);
        
        if (reviewsCount) {
            reviewsCount.textContent = `(${reviews.length})`;
        }
        
        if (reviews.length === 0) {
            if (reviewsSummary) reviewsSummary.style.display = 'none';
            if (reviewsList) {
                reviewsList.innerHTML = `
                    <div class="empty-state">
                        <p>لا توجد تقييمات لهذا المنتج بعد</p>
                    </div>
                `;
            }
        } else {
            // Calculate summary
            const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
            const ratingCounts = [0, 0, 0, 0, 0];
            reviews.forEach(r => ratingCounts[r.rating - 1]++);
            
            if (reviewsSummary) {
                reviewsSummary.innerHTML = `
                    <div class="reviews-average">
                        <span class="average-value">${avgRating.toFixed(1)}</span>
                        <div class="stars">${HomePage.renderStars(Math.round(avgRating))}</div>
                        <span class="total-reviews">${reviews.length} تقييم</span>
                    </div>
                    <div class="reviews-breakdown">
                        ${[5, 4, 3, 2, 1].map(rating => `
                            <div class="rating-bar">
                                <span>${rating} نجوم</span>
                                <div class="bar">
                                    <div class="bar-fill" style="width: ${(ratingCounts[rating - 1] / reviews.length) * 100}%"></div>
                                </div>
                                <span class="count">${ratingCounts[rating - 1]}</span>
                            </div>
                        `).join('')}
                    </div>
                `;
            }
            
            if (reviewsList) {
                reviewsList.innerHTML = reviews.map(review => `
                    <div class="review-item">
                        <div class="review-item-header">
                            <div class="reviewer-info">
                                <div class="reviewer-avatar">${review.user?.full_name?.charAt(0) || 'U'}</div>
                                <div>
                                    <h4 class="reviewer-name">${Utils.sanitizeHTML(review.user?.full_name || 'عميل')}</h4>
                                    <span class="review-date">${Utils.formatDate(review.created_at)}</span>
                                </div>
                            </div>
                            <div class="review-rating">
                                <div class="stars">${HomePage.renderStars(review.rating)}</div>
                            </div>
                        </div>
                        <div class="review-item-content">
                            <p>${Utils.sanitizeHTML(review.comment)}</p>
                        </div>
                    </div>
                `).join('');
            }
        }
        
        // Show write review form if user has purchased this product
        if (Store.user && writeReviewSection) {
            // Check if user purchased this product
            const canReview = await this.checkCanReview();
            if (canReview) {
                writeReviewSection.style.display = 'block';
                this.initReviewForm();
            }
        }
    },
    
    async checkCanReview() {
        // Check if user has purchased this product and hasn't reviewed it yet
        // This would require checking orders - simplified for now
        return Store.user != null;
    },
    
    initReviewForm() {
        const form = document.getElementById('review-form');
        const starButtons = document.querySelectorAll('#star-rating-input button');
        let selectedRating = 0;
        
        starButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                selectedRating = parseInt(btn.dataset.rating);
                starButtons.forEach((b, i) => {
                    b.classList.toggle('active', i < selectedRating);
                });
            });
            
            btn.addEventListener('mouseenter', () => {
                const hoverRating = parseInt(btn.dataset.rating);
                starButtons.forEach((b, i) => {
                    b.style.color = i < hoverRating ? 'var(--secondary)' : 'var(--border-color)';
                });
            });
            
            btn.addEventListener('mouseleave', () => {
                starButtons.forEach((b, i) => {
                    b.style.color = i < selectedRating ? 'var(--secondary)' : 'var(--border-color)';
                });
            });
        });
        
        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (selectedRating === 0) {
                Toast.warning('يرجى اختيار تقييم');
                return;
            }
            
            const comment = document.getElementById('review-text').value.trim();
            if (!comment) {
                Toast.warning('يرجى كتابة تعليق');
                return;
            }
            
            const result = await DB.addReview({
                product_id: this.product.id,
                rating: selectedRating,
                comment: comment
            });
            
            if (result.success) {
                Toast.success('شكراً لتقييمك! سيتم مراجعته قبل النشر');
                form.reset();
                selectedRating = 0;
                starButtons.forEach(b => b.classList.remove('active'));
            } else {
                Toast.error('حدث خطأ أثناء إرسال التقييم');
            }
        });
    },
    
    async loadRelatedProducts() {
        const container = document.getElementById('related-products');
        if (!container || !this.product) return;
        
        const products = await DB.getRelatedProducts(this.product.id, this.product.category_id);
        
        if (products.length === 0) {
            container.parentElement.style.display = 'none';
            return;
        }
        
        container.innerHTML = products.map(product => HomePage.createProductCard(product)).join('');
    },
    
    share(platform) {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(this.product.name);
        
        const urls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
            twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
            whatsapp: `https://wa.me/?text=${text}%20${url}`
        };
        
        window.open(urls[platform], '_blank', 'width=600,height=400');
    }
};

// ==================== CART PAGE ====================
const CartPage = {
    init() {
        this.render();
    },
    
    render() {
        const itemsList = document.getElementById('cart-items-list');
        const emptyCart = document.getElementById('empty-cart');
        const summarySection = document.getElementById('cart-summary-section');
        const itemsSection = document.querySelector('.cart-items-section');
        
        if (Store.cart.length === 0) {
            if (emptyCart) emptyCart.style.display = 'block';
            if (summarySection) summarySection.style.display = 'none';
            if (itemsSection) itemsSection.style.display = 'none';
            return;
        }
        
        if (emptyCart) emptyCart.style.display = 'none';
        if (summarySection) summarySection.style.display = 'block';
        if (itemsSection) itemsSection.style.display = 'block';
        
        if (itemsList) {
            itemsList.innerHTML = Store.cart.map(item => `
                <div class="cart-page-item" data-id="${item.id}">
                    <div class="cart-page-product">
                        <img src="${item.image || '/placeholder.jpg'}" alt="${Utils.sanitizeHTML(item.name)}">
                        <div>
                            <h4>${Utils.sanitizeHTML(item.name)}</h4>
                            ${item.originalPrice > item.price ? `<p>خصم ${Utils.calculateDiscount(item.originalPrice, item.price)}%</p>` : ''}
                        </div>
                    </div>
                    <div class="cart-page-price">${Utils.formatPrice(item.price)}</div>
                    <div class="quantity-control">
                        <button class="quantity-btn" onclick="Cart.updateQuantity('${item.id}', ${item.quantity - 1})">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>
                        </button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn" onclick="Cart.updateQuantity('${item.id}', ${item.quantity + 1})">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="12" y1="5" x2="12" y2="19"/>
                                <line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>
                        </button>
                    </div>
                    <div class="cart-page-total">${Utils.formatPrice(item.price * item.quantity)}</div>
                    <button class="cart-page-remove" onclick="Cart.remove('${item.id}')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                            <line x1="10" y1="11" x2="10" y2="17"/>
                            <line x1="14" y1="11" x2="14" y2="17"/>
                        </svg>
                    </button>
                </div>
            `).join('');
        }
        
        this.updateTotals();
        this.initCoupon();
        this.initCheckoutButton();
    },
    
    updateTotals() {
        const subtotal = Cart.getTotal();
        
        document.getElementById('page-cart-subtotal')?.textContent && 
            (document.getElementById('page-cart-subtotal').textContent = Utils.formatPrice(subtotal));
        document.getElementById('page-cart-total')?.textContent && 
            (document.getElementById('page-cart-total').textContent = Utils.formatPrice(subtotal));
    },
    
    initCoupon() {
        const couponInput = document.getElementById('coupon-input');
        const applyBtn = document.getElementById('apply-coupon');
        
        applyBtn?.addEventListener('click', async () => {
            const code = couponInput?.value.trim();
            if (!code) {
                Toast.warning('يرجى إدخال كود الخصم');
                return;
            }
            
            // TODO: Validate coupon code with backend
            Toast.info('هذه الميزة قيد التطوير');
        });
    },
    
    initCheckoutButton() {
        const btn = document.getElementById('proceed-checkout');
        
        btn?.addEventListener('click', () => {
            if (Store.cart.length === 0) {
                Toast.warning('السلة فارغة');
                return;
            }
            
            if (!Store.user) {
                Toast.warning('يرجى تسجيل الدخول أولاً');
                Router.navigate('auth');
                return;
            }
            
            if (!Auth.isEmailConfirmed()) {
                Toast.warning('يرجى تأكيد بريدك الإلكتروني أولاً');
                return;
            }
            
            Router.navigate('checkout');
        });
    }
};

// ==================== CHECKOUT PAGE ====================
const CheckoutPage = {
    currentStep: 1,
    shippingData: {},
    paymentMethod: 'card',
    
    async init() {
        if (!Store.user) {
            Router.navigate('auth');
            return;
        }
        
        if (Store.cart.length === 0) {
            Router.navigate('cart');
            return;
        }
        
        await this.loadShippingRates();
        this.populateWilayas();
        this.renderOrderSummary();
        this.initSteps();
        this.initForms();
        this.initGeolocation();
    },
    
    async loadShippingRates() {
        await DB.getShippingRates();
    },
    
    populateWilayas() {
        const select = document.getElementById('shipping-wilaya');
        if (!select) return;
        
        select.innerHTML = `
            <option value="">اختر الولاية</option>
            ${CONFIG.WILAYAS.map(w => `
                <option value="${w.code}">${w.code} - ${w.name}</option>
            `).join('')}
        `;
        
        select.addEventListener('change', () => {
            this.updateShippingCost();
        });
    },
    
    updateShippingCost() {
        const wilayaCode = document.getElementById('shipping-wilaya')?.value;
        if (!wilayaCode) return;
        
        // Find shipping rate for this wilaya
        const rate = Store.shippingRates.find(r => r.wilaya_code === wilayaCode);
        const shippingCost = rate?.price || Store.settings.default_shipping || 0;
        
        document.getElementById('checkout-shipping')?.textContent && 
            (document.getElementById('checkout-shipping').textContent = Utils.formatPrice(shippingCost));
        
        this.updateTotal();
    },
    
    updateTotal() {
        const subtotal = Cart.getTotal();
        const shippingText = document.getElementById('checkout-shipping')?.textContent || '0';
        const shipping = parseInt(shippingText.replace(/[^\d]/g, '')) || 0;
        const tax = Math.round(subtotal * (Store.settings.tax_rate || 0) / 100);
        
        document.getElementById('checkout-subtotal')?.textContent && 
            (document.getElementById('checkout-subtotal').textContent = Utils.formatPrice(subtotal));
        document.getElementById('checkout-tax')?.textContent && 
            (document.getElementById('checkout-tax').textContent = Utils.formatPrice(tax));
        document.getElementById('checkout-total')?.textContent && 
            (document.getElementById('checkout-total').textContent = Utils.formatPrice(subtotal + shipping + tax));
    },
    
    renderOrderSummary() {
        const container = document.getElementById('checkout-items');
        if (!container) return;
        
        container.innerHTML = Store.cart.map(item => `
            <div class="checkout-item">
                <img src="${item.image || '/placeholder.jpg'}" alt="${Utils.sanitizeHTML(item.name)}">
                <div class="checkout-item-info">
                    <h4>${Utils.sanitizeHTML(item.name)}</h4>
                    <p>الكمية: ${item.quantity}</p>
                </div>
                <span class="checkout-item-price">${Utils.formatPrice(item.price * item.quantity)}</span>
            </div>
        `).join('');
        
        this.updateTotal();
    },
    
    initSteps() {
        // Navigation between steps
        document.getElementById('to-step-2')?.addEventListener('click', () => {
            if (this.validateStep1()) {
                this.goToStep(2);
            }
        });
        
        document.getElementById('back-to-step-1')?.addEventListener('click', () => {
            this.goToStep(1);
        });
        
        document.getElementById('to-step-3')?.addEventListener('click', () => {
            this.goToStep(3);
            this.renderOrderReview();
        });
        
        document.getElementById('back-to-step-2')?.addEventListener('click', () => {
            this.goToStep(2);
        });
    },
    
    goToStep(step) {
        this.currentStep = step;
        
        // Update step indicators
        document.querySelectorAll('.checkout-step').forEach((el, i) => {
            el.classList.remove('active', 'completed');
            if (i + 1 < step) {
                el.classList.add('completed');
            } else if (i + 1 === step) {
                el.classList.add('active');
            }
        });
        
        // Update step content
        document.querySelectorAll('.checkout-step-content').forEach((el, i) => {
            el.classList.toggle('active', i + 1 === step);
        });
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    
    validateStep1() {
        const name = document.getElementById('shipping-name')?.value.trim();
        const phone = document.getElementById('shipping-phone')?.value.trim();
        const email = document.getElementById('shipping-email')?.value.trim();
        const wilaya = document.getElementById('shipping-wilaya')?.value;
        const commune = document.getElementById('shipping-commune')?.value.trim();
        const address = document.getElementById('shipping-address')?.value.trim();
        
        if (!name) {
            Toast.warning('يرجى إدخال الاسم');
            return false;
        }
        
        if (!Utils.isValidPhone(phone)) {
            Toast.warning('يرجى إدخال رقم هاتف صحيح');
            return false;
        }
        
        if (!Utils.isValidEmail(email)) {
            Toast.warning('يرجى إدخال بريد إلكتروني صحيح');
            return false;
        }
        
        if (!wilaya) {
            Toast.warning('يرجى اختيار الولاية');
            return false;
        }
        
        if (!commune) {
            Toast.warning('يرجى إدخال البلدية');
            return false;
        }
        
        if (!address) {
            Toast.warning('يرجى إدخال العنوان');
            return false;
        }
        
        this.shippingData = {
            name,
            phone,
            email,
            wilaya,
            wilaya_name: CONFIG.WILAYAS.find(w => w.code === wilaya)?.name,
            commune,
            address,
            notes: document.getElementById('shipping-notes')?.value.trim(),
            lat: document.getElementById('shipping-lat')?.value,
            lng: document.getElementById('shipping-lng')?.value
        };
        
        return true;
    },
    
    initForms() {
        // Payment method selection
        document.querySelectorAll('input[name="payment-method"]').forEach(input => {
            input.addEventListener('change', (e) => {
                this.paymentMethod = e.target.value;
            });
        });
        
        // Form submission
        const form = document.getElementById('checkout-form');
        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const acceptTerms = document.getElementById('accept-terms')?.checked;
            if (!acceptTerms) {
                Toast.warning('يرجى الموافقة على الشروط والأحكام');
                return;
            }
            
            await this.placeOrder();
        });
        
        // Pre-fill user data
        if (Store.user) {
            const userData = Store.user.user_metadata || {};
            document.getElementById('shipping-name')?.value || 
                (document.getElementById('shipping-name').value = userData.full_name || '');
            document.getElementById('shipping-email')?.value || 
                (document.getElementById('shipping-email').value = Store.user.email || '');
            document.getElementById('shipping-phone')?.value || 
                (document.getElementById('shipping-phone').value = userData.phone || '');
        }
    },
    
    initGeolocation() {
        const btn = document.getElementById('get-location');
        
        btn?.addEventListener('click', () => {
            if (!navigator.geolocation) {
                Toast.warning('المتصفح لا يدعم تحديد الموقع');
                return;
            }
            
            btn.disabled = true;
            btn.innerHTML = `
                <div class="spinner spinner-sm"></div>
                جاري تحديد الموقع...
            `;
            
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    
                    document.getElementById('shipping-lat').value = lat;
                    document.getElementById('shipping-lng').value = lng;
                    
                    // --- كود جلب اسم الشارع والمدينة ---
                    try {
                        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ar`);
                        const data = await response.json();
                        if (data && data.display_name) {
                            // وضع العنوان النصي في مربع العنوان التفصيلي
                            const addressInput = document.getElementById('shipping-address');
                            if(addressInput) addressInput.value = data.display_name;
                        }
                    } catch (error) {
                        console.error('خطأ في جلب العنوان:', error);
                    }
                    // ----------------------------------
                    
                    btn.innerHTML = `
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                            <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                        تم تحديد الموقع
                    `;
                    btn.disabled = false;
                    Toast.success('تم تحديد موقعك وجلب العنوان بنجاح');
                },
                (error) => {
                    btn.innerHTML = `
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                            <circle cx="12" cy="10" r="3"/>
                        </svg>
                        تحديد موقعي تلقائياً
                    `;
                    btn.disabled = false;
                    Toast.error('فشل في تحديد الموقع');
                },
                { enableHighAccuracy: true, timeout: 10000 }
            );
        });
    },

    
    renderOrderReview() {
        // Shipping info
        const shippingReview = document.getElementById('review-shipping');
        if (shippingReview) {
            shippingReview.innerHTML = `
                <p><strong>الاسم:</strong> ${Utils.sanitizeHTML(this.shippingData.name)}</p>
                <p><strong>الهاتف:</strong> ${this.shippingData.phone}</p>
                <p><strong>البريد:</strong> ${this.shippingData.email}</p>
                <p><strong>العنوان:</strong> ${this.shippingData.wilaya_name}, ${this.shippingData.commune}</p>
                <p>${Utils.sanitizeHTML(this.shippingData.address)}</p>
            `;
        }
        
        // Payment info
        const paymentReview = document.getElementById('review-payment');
        if (paymentReview) {
            const paymentNames = {
                card: 'البطاقة الذهبية / CIB',
                cod: 'الدفع عند الاستلام'
            };
            paymentReview.innerHTML = `<p>${paymentNames[this.paymentMethod]}</p>`;
        }
        
        // Products
        const productsReview = document.getElementById('review-products');
        if (productsReview) {
            productsReview.innerHTML = Store.cart.map(item => `
                <div class="review-product-item">
                    <img src="${item.image || '/placeholder.jpg'}" alt="${Utils.sanitizeHTML(item.name)}">
                    <h5>${Utils.sanitizeHTML(item.name)} × ${item.quantity}</h5>
                    <span>${Utils.formatPrice(item.price * item.quantity)}</span>
                </div>
            `).join('');
        }
    },
    
    async placeOrder() {
        const placeOrderBtn = document.getElementById('place-order');
        placeOrderBtn.disabled = true;
        placeOrderBtn.innerHTML = `<div class="spinner spinner-sm"></div> جاري تأكيد الطلب...`;
        
        try {
            const subtotal = Cart.getTotal();
            const shippingCost = parseInt(document.getElementById('checkout-shipping')?.textContent.replace(/[^\d]/g, '')) || 0;
            const tax = Math.round(subtotal * (Store.settings.tax_rate || 0) / 100);
            const total = subtotal + shippingCost + tax;
            
            const orderNumber = Utils.generateOrderNumber();
            
            const orderData = {
                order_number: orderNumber,
                user_id: Store.user.id,
                status: 'pending',
                payment_method: this.paymentMethod,
                payment_status: this.paymentMethod === 'cod' ? 'pending' : 'pending',
                subtotal: subtotal,
                shipping_cost: shippingCost,
                tax: tax,
                total: total,
                shipping_name: this.shippingData.name,
                shipping_phone: this.shippingData.phone,
                shipping_email: this.shippingData.email || null,
                shipping_wilaya: this.shippingData.wilaya,
                shipping_commune: this.shippingData.commune,
                shipping_address: this.shippingData.address,
                shipping_notes: this.shippingData.notes || null,
                shipping_lat: this.shippingData.lat || null,
                shipping_lng: this.shippingData.lng || null,
                items: Store.cart.map(item => ({
                    product_id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    total: item.price * item.quantity
                }))
            };
            
            const result = await DB.createOrder(orderData);
            
            if (!result.success) {
                // تمرير رسالة الخطأ القادمة من الداتابيز مباشرة
                throw new Error(result.error);
            }
            
            // If card payment, redirect to Chargily
            if (this.paymentMethod === 'card') {
                await Payment.initChargilyPayment(result.order, total);
            } else {
                // COD - Clear cart and show success
                Cart.clear();
                Router.navigate('order-success', { orderId: result.order.id });
            }
            
        } catch (error) {
            console.error('Order error:', error);
            // ✅ التعديل هنا: إظهار الخطأ الحقيقي على الشاشة
            Toast.error('سبب الرفض: ' + error.message);
            
            placeOrderBtn.disabled = false;
            placeOrderBtn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                تأكيد الطلب
            `;
        }
    }
}; // 🌟 هذا القوس والفاصلة ضروريان جداً لكي تعمل الأزرار!

// ==================== PAYMENT (CHARGILY) ====================
const Payment = {
    async initChargilyPayment(order, amount) {
        try {
            Toast.info('جاري تجهيز بوابة الدفع الآمنة، يرجى الانتظار...');
            
            // الاتصال المباشر بالسيرفر الآمن (Edge Function) الذي أنشأناه للتو
            const { data, error } = await supabase.functions.invoke('create-checkout', {
                body: { 
                    amount: amount,
                    success_url: `${window.location.origin}/?page=order-success&orderId=${order.id}`,
                    back_url: `${window.location.origin}/?page=checkout`
                }
            });

            if (error) {
                console.error("Invoke Error:", error);
                throw new Error('فشل الاتصال بخوادم الدفع الآمنة');
            }
            
            // تحويل العميل لصفحة الدفع
            if (data && data.checkout_url) {
                window.location.href = data.checkout_url;
            } else {
                console.error("Chargily Error Data:", data);
                throw new Error(data.error || 'لم يتم استلام رابط الدفع من البوابة');
            }
            
        } catch (error) {
            console.error('Payment error:', error);
            Toast.error('عذراً، حدث خطأ: ' + error.message);
            
            const placeOrderBtn = document.getElementById('place-order');
            if(placeOrderBtn) {
                placeOrderBtn.disabled = false;
                placeOrderBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    تأكيد الطلب
                `;
            }
        }
    },
    
    async handlePaymentCallback(checkoutId, status) {
        // ...
    }
};

    

    

// ==================== ORDER SUCCESS PAGE ====================
const OrderSuccessPage = {
    async init(orderId) {
        if (!orderId) {
            const orderNumber = Utils.getUrlParams().orderNumber;
            if (orderNumber) {
                document.getElementById('success-order-number').textContent = `#${orderNumber}`;
            }
            return;
        }
        
        const order = await DB.getOrderById(orderId);
        if (!order) return;
        
        document.getElementById('success-order-number').textContent = `#${order.order_number}`;
        
        const summaryContainer = document.getElementById('success-order-summary');
        if (summaryContainer) {
            summaryContainer.innerHTML = `
                <div class="summary-row">
                    <span>المجموع الفرعي:</span>
                    <span>${Utils.formatPrice(order.subtotal)}</span>
                </div>
                <div class="summary-row">
                    <span>التوصيل:</span>
                    <span>${Utils.formatPrice(order.shipping_cost)}</span>
                </div>
                ${order.tax > 0 ? `
                    <div class="summary-row">
                        <span>الضريبة:</span>
                        <span>${Utils.formatPrice(order.tax)}</span>
                    </div>
                ` : ''}
                <div class="summary-row total">
                    <span>الإجمالي:</span>
                    <span>${Utils.formatPrice(order.total)}</span>
                </div>
                <div class="summary-row">
                    <span>طريقة الدفع:</span>
                    <span>${order.payment_method === 'cod' ? 'الدفع عند الاستلام' : 'بطاقة إلكترونية'}</span>
                </div>
            `;
        }
    }
};

// ==================== AUTH PAGE ====================
const AuthPage = {
    init() {
        this.initTabs();
        this.initLoginForm();
        this.initRegisterForm();
        this.initForgotPassword();
        this.initPasswordToggle();
        this.initGoogleLogin();
    },
    
    initTabs() {
        const tabs = document.querySelectorAll('.auth-tab');
        const forms = document.querySelectorAll('.auth-form');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.dataset.tab;
                
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                forms.forEach(form => {
                    form.classList.remove('active');
                    if (form.id === `${targetTab}-form`) {
                        form.classList.add('active');
                    }
                });
            });
        });
    },
    
    initLoginForm() {
        const form = document.getElementById('login-form');
        
        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;
            
            if (!Utils.isValidEmail(email)) {
                Toast.warning('يرجى إدخال بريد إلكتروني صحيح');
                return;
            }
            
            if (password.length < 6) {
                Toast.warning('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
                return;
            }
            
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<div class="spinner spinner-sm"></div> جاري تسجيل الدخول...';
            
            const result = await Auth.login(email, password);
            
            if (result.success) {
                // Auth state change listener will handle the rest
            } else {
                Toast.error(this.translateError(result.error));
                submitBtn.disabled = false;
                submitBtn.textContent = 'تسجيل الدخول';
            }
        });
    },
    
    initRegisterForm() {
        const form = document.getElementById('register-form');
        const passwordInput = document.getElementById('register-password');
        
        // Password strength indicator
        passwordInput?.addEventListener('input', (e) => {
            this.updatePasswordStrength(e.target.value);
        });
        
        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const firstName = document.getElementById('register-firstname').value.trim();
            const lastName = document.getElementById('register-lastname').value.trim();
            const email = document.getElementById('register-email').value.trim();
            const phone = document.getElementById('register-phone').value.trim();
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;
            const acceptTerms = document.getElementById('register-terms').checked;
            
            // Validation
            if (!firstName || !lastName) {
                Toast.warning('يرجى إدخال الاسم الكامل');
                return;
            }
            
            if (!Utils.isValidEmail(email)) {
                Toast.warning('يرجى إدخال بريد إلكتروني صحيح');
                return;
            }
            
            if (!Utils.isValidPhone(phone)) {
                Toast.warning('يرجى إدخال رقم هاتف صحيح (مثال: 0551234567)');
                return;
            }
            
            if (password.length < 8) {
                Toast.warning('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
                return;
            }
            
            if (password !== confirmPassword) {
                Toast.warning('كلمتا المرور غير متطابقتين');
                return;
            }
            
            if (!acceptTerms) {
                Toast.warning('يرجى الموافقة على الشروط والأحكام');
                return;
            }
            
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<div class="spinner spinner-sm"></div> جاري إنشاء الحساب...';
            
            const result = await Auth.register({
                firstName,
                lastName,
                email,
                phone,
                password
            });
            
            if (result.success) {
                // إخفاء التبويبات القديمة
                document.querySelector('.auth-tabs').style.display = 'none';
                
                // تحويل الواجهة بالكامل لصفحة تأكيد البريد مع دالة تحقق فعلية
                const authCard = document.querySelector('.auth-card');
                authCard.innerHTML = `
                    <div class="email-verification-ui" style="text-align: center; padding: 40px 20px;">
                        <div style="font-size: 60px; margin-bottom: 20px; animation: bounce 2s infinite;">✉️</div>
                        <h2 style="margin-bottom: 15px; color: var(--primary);">تأكيد البريد الإلكتروني</h2>
                        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                            لقد قمنا بإرسال رابط التفعيل إلى البريد:<br>
                            <strong style="color: var(--text); font-size: 18px;">${email}</strong>
                        </p>
                        <div style="background: var(--bg-color); padding: 15px; border-radius: 8px; margin-bottom: 25px;">
                            <p style="margin: 0; font-size: 14px; color: var(--text-light);">
                                يرجى فتح بريدك الإلكتروني وتفقّد صندوق الوارد أو الرسائل غير المرغوب فيها (Spam) والضغط على الرابط لتفعيل حسابك.
                            </p>
                        </div>
                        <button id="verify-check-btn" class="btn btn-primary btn-lg btn-block">
                            تم التأكيد، أريد تسجيل الدخول
                        </button>
                    </div>
                `;
                
                // إضافة حدث الزر للتحقق الفعلي
                document.getElementById('verify-check-btn').addEventListener('click', async function() {
                    const btn = this;
                    const originalText = btn.innerHTML;
                    btn.innerHTML = '<div class="spinner spinner-sm"></div> جاري التحقق...';
                    btn.disabled = true;
                    
                    // محاولة تسجيل الدخول لفحص حالة التأكيد
                    const { data, error } = await supabase.auth.signInWithPassword({
                        email: email,
                        password: password
                    });
                    
                    if (error) {
                        if (error.message.includes('Email not confirmed')) {
                            Toast.error('لم يتم تأكيد البريد بعد! يرجى الذهاب للجيميل والضغط على الرابط.');
                        } else {
                            Toast.error(AuthPage.translateError(error.message));
                        }
                        btn.innerHTML = originalText;
                        btn.disabled = false;
                    } else {
                        Toast.success('تم تأكيد الحساب وتسجيل الدخول بنجاح!');
                        window.location.reload(); 
                    }
                });

            } else {
                // معالجة خطأ البريد المسجل مسبقاً بشكل صريح
                if (result.error && (result.error.toLowerCase().includes('already registered') || result.error.toLowerCase().includes('already exists') || result.error.toLowerCase().includes('user already exists'))) {
                    Toast.error('هذا الحساب مسجل من قبل! يرجى الانتقال لصفحة تسجيل الدخول.');
                } else {
                    Toast.error(this.translateError(result.error));
                }
            }
            
            submitBtn.disabled = false;
            submitBtn.textContent = 'إنشاء الحساب';
        });
    },
    
    initForgotPassword() {
        const forgotLink = document.getElementById('forgot-password-link');
        const backToLoginBtn = document.getElementById('back-to-login');
        const forgotForm = document.getElementById('forgot-password-form');
        const loginForm = document.getElementById('login-form');
        
        forgotLink?.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm?.classList.remove('active');
            forgotForm?.classList.add('active');
        });
        
        backToLoginBtn?.addEventListener('click', () => {
            forgotForm?.classList.remove('active');
            loginForm?.classList.add('active');
        });
        
        forgotForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('forgot-email').value.trim();
            
            if (!Utils.isValidEmail(email)) {
                Toast.warning('يرجى إدخال بريد إلكتروني صحيح');
                return;
            }
            
            const submitBtn = forgotForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<div class="spinner spinner-sm"></div> جاري الإرسال...';
            
            const result = await Auth.resetPassword(email);
            
            if (result.success) {
                Toast.success('تم إرسال رابط استعادة كلمة المرور إلى بريدك');
                forgotForm.reset();
                backToLoginBtn.click();
            } else {
                Toast.error(this.translateError(result.error));
            }
            
            submitBtn.disabled = false;
            submitBtn.textContent = 'إرسال رابط الاستعادة';
        });
    },
    
    initPasswordToggle() {
        document.querySelectorAll('.toggle-password').forEach(btn => {
            btn.addEventListener('click', () => {
                const input = btn.parentElement.querySelector('input');
                const type = input.type === 'password' ? 'text' : 'password';
                input.type = type;
                btn.classList.toggle('active');
            });
        });
    },
    
    initGoogleLogin() {
        const googleBtn = document.querySelector('.btn-google');
        googleBtn?.addEventListener('click', () => {
            Auth.loginWithGoogle();
        });
    },
    
    updatePasswordStrength(password) {
        const strengthIndicator = document.getElementById('password-strength');
        if (!strengthIndicator) return;
        
        let strength = 0;
        
        if (password.length >= 8) strength++;
        if (password.match(/[a-z]/)) strength++;
        if (password.match(/[A-Z]/)) strength++;
        if (password.match(/[0-9]/)) strength++;
        if (password.match(/[^a-zA-Z0-9]/)) strength++;
        
        strengthIndicator.className = 'password-strength';
        
        if (password.length === 0) {
            strengthIndicator.querySelector('.strength-text').textContent = '';
        } else if (strength < 3) {
            strengthIndicator.classList.add('weak');
            strengthIndicator.querySelector('.strength-text').textContent = 'ضعيفة';
        } else if (strength < 4) {
            strengthIndicator.classList.add('medium');
            strengthIndicator.querySelector('.strength-text').textContent = 'متوسطة';
        } else {
            strengthIndicator.classList.add('strong');
            strengthIndicator.querySelector('.strength-text').textContent = 'قوية';
        }
    },
    
    translateError(error) {
        const translations = {
            'Invalid login credentials': 'بيانات الدخول غير صحيحة',
            'Email not confirmed': 'يرجى تأكيد بريدك الإلكتروني أولاً',
            'User already registered': 'هذا البريد مسجل مسبقاً',
            'Password should be at least 6 characters': 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
            'Unable to validate email address: invalid format': 'صيغة البريد الإلكتروني غير صحيحة'
        };
        
        return translations[error] || 'حدث خطأ غير متوقع';
    }
};

// ==================== ACCOUNT PAGE ====================
const AccountPage = {
    currentSection: 'overview',
    
    async init(section) {
        if (!Store.user) {
            Router.navigate('auth');
            return;
        }
        
        this.currentSection = section || 'overview';
        this.initNavigation();
        await this.loadSection(this.currentSection);
    },
    
    initNavigation() {
        const navItems = document.querySelectorAll('.account-nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const section = item.dataset.section;
                if (section) {
                    this.loadSection(section);
                }
            });
        });
        
        // Logout button
        document.getElementById('logout-btn')?.addEventListener('click', () => {
            Auth.logout();
        });
    },
    
    async loadSection(section) {
        this.currentSection = section;
        
        // Update nav
        document.querySelectorAll('.account-nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.section === section);
        });
        
        // Update content
        document.querySelectorAll('.account-section').forEach(el => {
            el.classList.toggle('active', el.id === `section-${section}`);
        });
        
        // Load section data
        switch (section) {
            case 'overview':
                await this.renderOverview();
                break;
            case 'orders':
                await this.renderOrders();
                break;
            case 'wishlist':
                await this.renderWishlist();
                break;
            case 'addresses':
                await this.renderAddresses();
                break;
            case 'support':
                await this.renderSupport();
                break;
            case 'settings':
                this.renderSettings();
                break;
        }
    },
    
    async renderOverview() {
        // Load counts
        const orders = await DB.getUserOrders();
        const tickets = await DB.getUserTickets();
        
        document.getElementById('overview-orders').textContent = orders.length;
        document.getElementById('overview-wishlist').textContent = Store.wishlist.length;
        document.getElementById('overview-tickets').textContent = tickets.length;
        
        // Recent orders
        const recentOrdersTable = document.getElementById('recent-orders-table');
        if (recentOrdersTable) {
            if (orders.length === 0) {
                recentOrdersTable.innerHTML = `
                    <div class="empty-state">
                        <p>لا توجد طلبات بعد</p>
                        <button class="btn btn-primary" data-page="products">تسوق الآن</button>
                    </div>
                `;
            } else {
                recentOrdersTable.innerHTML = `
                    <table class="orders-table">
                        <thead>
                            <tr>
                                <th>رقم الطلب</th>
                                <th>التاريخ</th>
                                <th>الحالة</th>
                                <th>الإجمالي</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${orders.slice(0, 5).map(order => `
                                <tr>
                                    <td>#${order.order_number}</td>
                                    <td>${Utils.formatDate(order.created_at)}</td>
                                    <td><span class="order-status ${order.status}">${this.getStatusText(order.status)}</span></td>
                                    <td>${Utils.formatPrice(order.total)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
            }
        }
    },
    
    async renderOrders() {
        const container = document.getElementById('orders-list');
        if (!container) return;
        
        container.innerHTML = '<div class="loading-spinner"><div class="spinner"></div></div>';
        
        const orders = await DB.getUserOrders();
        
        if (orders.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                            <line x1="3" y1="6" x2="21" y2="6"/>
                            <path d="M16 10a4 4 0 01-8 0"/>
                        </svg>
                    </div>
                    <h3>لا توجد طلبات</h3>
                    <p>لم تقم بأي طلبات بعد</p>
                    <button class="btn btn-primary" data-page="products">تسوق الآن</button>
                </div>
            `;
            return;
        }
        
        container.innerHTML = orders.map(order => `
            <div class="order-card">
                <div class="order-card-header">
                    <div>
                        <span class="order-number">#${order.order_number}</span>
                        <span class="order-date">${Utils.formatDate(order.created_at)}</span>
                    </div>
                    <span class="order-status ${order.status}">${this.getStatusText(order.status)}</span>
                </div>
                <div class="order-card-body">
                    <div class="order-products">
                        ${(order.items || []).slice(0, 4).map(item => `
                            <div class="order-product-thumb">
                                <img src="${item.image || '/placeholder.jpg'}" alt="${Utils.sanitizeHTML(item.name)}">
                            </div>
                        `).join('')}
                        ${(order.items || []).length > 4 ? `
                            <div class="order-product-thumb more">
                                +${order.items.length - 4}
                            </div>
                        ` : ''}
                    </div>
                </div>
                <div class="order-card-footer">
                    <span class="order-total">${Utils.formatPrice(order.total)}</span>
                    <button class="btn btn-outline btn-sm" onclick="AccountPage.viewOrderDetails('${order.id}')">
                        عرض التفاصيل
                    </button>
                </div>
            </div>
        `).join('');
    },
    
    async viewOrderDetails(orderId) {
        const order = await DB.getOrderById(orderId);
        if (!order) return;
        
        // Create modal content
        const content = `
            <div class="order-details-modal">
                <h3>تفاصيل الطلب #${order.order_number}</h3>
                
                <div class="order-timeline">
                    <div class="timeline-item ${order.status === 'pending' || order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered' ? 'completed' : ''}">
                        <div class="timeline-icon">✓</div>
                        <div class="timeline-content">
                            <h4>تم استلام الطلب</h4>
                            <p>${Utils.formatDate(order.created_at)}</p>
                        </div>
                    </div>
                    <div class="timeline-item ${order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered' ? 'completed' : ''}">
                        <div class="timeline-icon">✓</div>
                        <div class="timeline-content">
                            <h4>قيد المعالجة</h4>
                        </div>
                    </div>
                    <div class="timeline-item ${order.status === 'shipped' || order.status === 'delivered' ? 'completed' : ''}">
                        <div class="timeline-icon">✓</div>
                        <div class="timeline-content">
                            <h4>جاري التوصيل</h4>
                        </div>
                    </div>
                    <div class="timeline-item ${order.status === 'delivered' ? 'completed' : ''}">
                        <div class="timeline-icon">✓</div>
                        <div class="timeline-content">
                            <h4>تم التسليم</h4>
                        </div>
                    </div>
                </div>
                
                <div class="order-info-section">
                    <h4>معلومات التوصيل</h4>
                    <p><strong>${Utils.sanitizeHTML(order.shipping_name)}</strong></p>
                    <p>${order.shipping_phone}</p>
                    <p>${order.shipping_wilaya} - ${order.shipping_commune}</p>
                    <p>${Utils.sanitizeHTML(order.shipping_address)}</p>
                </div>
                
                <div class="order-items-section">
                    <h4>المنتجات</h4>
                    ${(order.items || []).map(item => `
                        <div class="order-item-row">
                            <span>${Utils.sanitizeHTML(item.name)} × ${item.quantity}</span>
                            <span>${Utils.formatPrice(item.total)}</span>
                        </div>
                    `).join('')}
                </div>
                
                <div class="order-totals-section">
                    <div class="total-row">
                        <span>المجموع الفرعي</span>
                        <span>${Utils.formatPrice(order.subtotal)}</span>
                    </div>
                    <div class="total-row">
                        <span>التوصيل</span>
                        <span>${Utils.formatPrice(order.shipping_cost)}</span>
                    </div>
                    ${order.tax > 0 ? `
                        <div class="total-row">
                            <span>الضريبة</span>
                            <span>${Utils.formatPrice(order.tax)}</span>
                        </div>
                    ` : ''}
                    <div class="total-row total">
                        <span>الإجمالي</span>
                        <span>${Utils.formatPrice(order.total)}</span>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('quick-view-content').innerHTML = content;
        Modal.open('quick-view-modal');
    },
    
    getStatusText(status) {
        const statuses = {
            pending: 'قيد المراجعة',
            processing: 'قيد المعالجة',
            shipped: 'جاري التوصيل',
            delivered: 'تم التسليم',
            cancelled: 'ملغي'
        };
        return statuses[status] || status;
    },
    
    async renderWishlist() {
        const container = document.getElementById('wishlist-grid');
        if (!container) return;
        
        if (Store.wishlist.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1;">
                    <div class="empty-state-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                        </svg>
                    </div>
                    <h3>المفضلة فارغة</h3>
                    <p>لم تقم بإضافة أي منتجات للمفضلة</p>
                    <button class="btn btn-primary" data-page="products">تسوق الآن</button>
                </div>
            `;
            return;
        }
        
        container.innerHTML = Store.wishlist.map(item => `
            <div class="product-card wishlist-item">
                <div class="product-image">
                    <img src="${item.image || '/placeholder.jpg'}" alt="${Utils.sanitizeHTML(item.name)}">
                    <button class="product-action-btn remove-wishlist" onclick="Wishlist.remove('${item.id}'); AccountPage.renderWishlist();">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
                <div class="product-info">
                    <h3 class="product-name">
                        <a href="#" data-page="product-detail" data-id="${item.id}">${Utils.sanitizeHTML(item.name)}</a>
                    </h3>
                    <div class="product-price">
                        <span class="current-price">${Utils.formatPrice(item.sale_price || item.price)}</span>
                        ${item.sale_price ? `<span class="original-price">${Utils.formatPrice(item.price)}</span>` : ''}
                    </div>
                    <button class="btn btn-primary btn-block btn-sm" onclick="Cart.add(${JSON.stringify(item).replace(/"/g, '&quot;')})">
                        أضف للسلة
                    </button>
                </div>
            </div>
        `).join('');
    },
    
    async renderAddresses() {
        const container = document.getElementById('addresses-grid');
        if (!container) return;
        
        const addresses = await DB.getUserAddresses();
        
        if (addresses.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1;">
                    <p>لا توجد عناوين محفوظة</p>
                </div>
            `;
        } else {
            container.innerHTML = addresses.map(addr => `
                <div class="address-card ${addr.is_default ? 'default' : ''}">
                    ${addr.is_default ? '<span class="default-badge">الافتراضي</span>' : ''}
                    <h4 class="address-label">${Utils.sanitizeHTML(addr.label)}</h4>
                    <p class="address-text">
                        ${addr.wilaya_name} - ${addr.commune}<br>
                        ${Utils.sanitizeHTML(addr.address)}
                    </p>
                    <div class="address-actions">
                        <button class="btn btn-outline btn-sm" onclick="AccountPage.editAddress('${addr.id}')">
                            تعديل
                        </button>
                        <button class="btn btn-ghost btn-sm" onclick="AccountPage.deleteAddress('${addr.id}')">
                            حذف
                        </button>
                    </div>
                </div>
            `).join('');
        }
        
        // Init add address button
        document.getElementById('add-address-btn')?.addEventListener('click', () => {
            this.openAddressModal();
        });
    },
    
    openAddressModal(address = null) {
        const modal = document.getElementById('address-modal');
        const form = document.getElementById('address-form');
        const title = document.getElementById('address-modal-title');
        const wilayaSelect = document.getElementById('address-wilaya');
        
        // Reset form
        form.reset();
        
        // Populate wilayas
        if (wilayaSelect && wilayaSelect.options.length <= 1) {
            wilayaSelect.innerHTML = `
                <option value="">اختر الولاية</option>
                ${CONFIG.WILAYAS.map(w => `
                    <option value="${w.code}">${w.code} - ${w.name}</option>
                `).join('')}
            `;
        }
        
        if (address) {
            title.textContent = 'تعديل العنوان';
            document.getElementById('address-id').value = address.id;
            document.getElementById('address-label').value = address.label;
            document.getElementById('address-wilaya').value = address.wilaya;
            document.getElementById('address-commune').value = address.commune;
            document.getElementById('address-details').value = address.address;
            document.getElementById('address-default').checked = address.is_default;
        } else {
            title.textContent = 'إضافة عنوان جديد';
            document.getElementById('address-id').value = '';
        }
        
        Modal.open('address-modal');
    },
    
    async editAddress(addressId) {
        const addresses = await DB.getUserAddresses();
        const address = addresses.find(a => a.id === addressId);
        if (address) {
            this.openAddressModal(address);
        }
    },
    
    async deleteAddress(addressId) {
        if (!confirm('هل أنت متأكد من حذف هذا العنوان؟')) return;
        
        const result = await DB.deleteAddress(addressId);
        if (result.success) {
            Toast.success('تم حذف العنوان');
            this.renderAddresses();
        } else {
            Toast.error('حدث خطأ أثناء حذف العنوان');
        }
    },
    
    async renderSupport() {
        const container = document.getElementById('tickets-list');
        if (!container) return;
        
        const tickets = await DB.getUserTickets();
        
        if (tickets.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>لا توجد تذاكر دعم</p>
                </div>
            `;
        } else {
            container.innerHTML = tickets.map(ticket => `
                <div class="ticket-card">
                    <div class="ticket-header">
                        <div>
                            <h4 class="ticket-subject">${Utils.sanitizeHTML(ticket.subject)}</h4>
                            <span class="ticket-id">#${ticket.id.slice(0, 8)} - ${Utils.formatDate(ticket.created_at)}</span>
                        </div>
                        <span class="ticket-status ${ticket.status}">${this.getTicketStatusText(ticket.status)}</span>
                    </div>
                    <p class="ticket-message">${Utils.sanitizeHTML(ticket.message).slice(0, 150)}...</p>
                </div>
            `).join('');
        }
        
        // Init new ticket button
        document.getElementById('new-ticket-btn')?.addEventListener('click', () => {
            Modal.open('new-ticket-modal');
        });
        
        // Init ticket form
        this.initTicketForm();
    },
    
    getTicketStatusText(status) {
        const statuses = {
            open: 'مفتوحة',
            'in-progress': 'قيد المعالجة',
            resolved: 'تم الحل',
            closed: 'مغلقة'
        };
        return statuses[status] || status;
    },
    
    initTicketForm() {
        const form = document.getElementById('new-ticket-form');
        
        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const subject = document.getElementById('ticket-subject').value.trim();
            const type = document.getElementById('ticket-type').value;
            const orderId = document.getElementById('ticket-order-id').value.trim();
            const message = document.getElementById('ticket-message').value.trim();
            
            if (!subject || !type || !message) {
                Toast.warning('يرجى ملء جميع الحقول المطلوبة');
                return;
            }
            
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<div class="spinner spinner-sm"></div> جاري الإرسال...';
            
            const result = await DB.createTicket({
                subject,
                type,
                order_id: orderId || null,
                message
            });
            
            if (result.success) {
                Toast.success('تم إرسال تذكرتك بنجاح');
                form.reset();
                Modal.close('new-ticket-modal');
                this.renderSupport();
            } else {
                Toast.error('حدث خطأ أثناء إرسال التذكرة');
            }
            
            submitBtn.disabled = false;
            submitBtn.textContent = 'إرسال التذكرة';
        });
    },
    
    renderSettings() {
        const userData = Store.user?.user_metadata || {};
        
        document.getElementById('settings-firstname').value = userData.first_name || '';
        document.getElementById('settings-lastname').value = userData.last_name || '';
        document.getElementById('settings-phone').value = userData.phone || '';
        
        const form = document.getElementById('settings-form');
        
        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const firstName = document.getElementById('settings-firstname').value.trim();
            const lastName = document.getElementById('settings-lastname').value.trim();
            const phone = document.getElementById('settings-phone').value.trim();
            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-new-password').value;
            
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<div class="spinner spinner-sm"></div> جاري الحفظ...';
            
            try {
                // Update profile
                const { error: profileError } = await supabase.auth.updateUser({
                    data: {
                        first_name: firstName,
                        last_name: lastName,
                        full_name: `${firstName} ${lastName}`,
                        phone: phone
                    }
                });
                
                if (profileError) throw profileError;
                
                // Update password if provided
                if (newPassword) {
                    if (newPassword !== confirmPassword) {
                        Toast.warning('كلمتا المرور غير متطابقتين');
                        return;
                    }
                    
                    if (newPassword.length < 8) {
                        Toast.warning('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
                        return;
                    }
                    
                    const { error: passwordError } = await supabase.auth.updateUser({
                        password: newPassword
                    });
                    
                    if (passwordError) throw passwordError;
                }
                
                Toast.success('تم حفظ التغييرات بنجاح');
                
                // Clear password fields
                document.getElementById('current-password').value = '';
                document.getElementById('new-password').value = '';
                document.getElementById('confirm-new-password').value = '';
                
            } catch (error) {
                console.error('Settings error:', error);
                Toast.error('حدث خطأ أثناء حفظ التغييرات');
            }
            
            submitBtn.disabled = false;
            submitBtn.textContent = 'حفظ التغييرات';
        });
    }
};

// ==================== HEADER SCROLL EFFECT ====================
const HeaderScroll = {
    header: null,
    lastScroll: 0,
    
    init() {
        this.header = document.getElementById('header');
        if (!this.header) return;
        
        window.addEventListener('scroll', Utils.throttle(() => {
            this.onScroll();
        }, 100));
    },
    
    onScroll() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
        
        this.lastScroll = currentScroll;
    }
};

// ==================== BACK TO TOP ====================
const BackToTop = {
    button: null,
    
    init() {
        this.button = document.getElementById('back-to-top');
        if (!this.button) return;
        
        window.addEventListener('scroll', Utils.throttle(() => {
            this.onScroll();
        }, 100));
        
        this.button.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    },
    
    onScroll() {
        if (window.pageYOffset > 300) {
            this.button.classList.add('visible');
        } else {
            this.button.classList.remove('visible');
        }
    }
};

// ==================== USER DROPDOWN ====================
const UserDropdown = {
    init() {
        const dropdown = document.getElementById('user-dropdown');
        const btn = document.getElementById('user-btn');
        
        if (!dropdown || !btn) return;
        
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('active');
        });
        
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    }
};

// ==================== NEWSLETTER ====================
const Newsletter = {
    init() {
        const form = document.getElementById('newsletter-form');
        
        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = form.querySelector('input[type="email"]').value.trim();
            
            if (!Utils.isValidEmail(email)) {
                Toast.warning('يرجى إدخال بريد إلكتروني صحيح');
                return;
            }
            
            try {
                // Save to Supabase
                const { error } = await supabase
                    .from('newsletter_subscribers')
                    .insert([{ email }]);
                
                if (error && error.code !== '23505') { // Ignore duplicate
                    throw error;
                }
                
                Toast.success('شكراً لاشتراكك في نشرتنا البريدية!');
                form.reset();
            } catch (error) {
                console.error('Newsletter error:', error);
                Toast.error('حدث خطأ أثناء الاشتراك');
            }
        });
    }
};

// ==================== CONTACT FORM ====================
const ContactForm = {
    init() {
        const form = document.getElementById('contact-form');
        
        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            try {
                const { error } = await supabase
                    .from('contact_messages')
                    .insert([{
                        name: data.name,
                        email: data.email,
                        subject: data.subject,
                        message: data.message
                    }]);
                
                if (error) throw error;
                
                Toast.success('تم إرسال رسالتك بنجاح!');
                form.reset();
            } catch (error) {
                console.error('Contact form error:', error);
                Toast.error('حدث خطأ أثناء إرسال الرسالة');
            }
        });
    }
};

// ==================== ADDRESS FORM ====================
const AddressForm = {
    init() {
        const form = document.getElementById('address-form');
        
        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const addressId = document.getElementById('address-id').value;
            const label = document.getElementById('address-label').value.trim();
            const wilaya = document.getElementById('address-wilaya').value;
            const commune = document.getElementById('address-commune').value.trim();
            const address = document.getElementById('address-details').value.trim();
            const isDefault = document.getElementById('address-default').checked;
            
            if (!label || !wilaya || !commune || !address) {
                Toast.warning('يرجى ملء جميع الحقول');
                return;
            }
            
            const wilayaName = CONFIG.WILAYAS.find(w => w.code === wilaya)?.name;
            
            const result = await DB.saveAddress({
                id: addressId || undefined,
                label,
                wilaya,
                wilaya_name: wilayaName,
                commune,
                address,
                is_default: isDefault
            });
            
            if (result.success) {
                Toast.success(addressId ? 'تم تحديث العنوان' : 'تم إضافة العنوان');
                Modal.close('address-modal');
                AccountPage.renderAddresses();
            } else {
                Toast.error('حدث خطأ أثناء حفظ العنوان');
            }
        });
    }
};

// ==================== CURRENT YEAR ====================
const updateYear = () => {
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
};

// ==================== PAGE LOADER ====================
const hideLoader = () => {
    const loader = document.getElementById('page-loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 500);
    }
};

// ==================== INITIALIZE APP ====================
const initApp = async () => {
    try {
        // 1. تهيئة المخازن المحلية والوحدات الأساسية للواجهة
        Store.init();
        ThemeManager.init();
        Toast.init();
        Modal.init();
        MobileMenu.init();
        CartSidebar.init();
        Search.init();
        HeaderScroll.init();
        BackToTop.init();
        UserDropdown.init();
        Newsletter.init();
        ContactForm.init();
        AddressForm.init();
        
        // 2. البدء بالاتصال بقاعدة البيانات والتحقق من هوية المستخدم أولاً
        // وضعنا await لضمان أن التطبيق لن ينتقل للخطوة التالية إلا بعد معرفة حالة تسجيل الدخول
        try {
            await Auth.init(); // التأكد من هوية المستخدم (Session)
            
            // جلب إعدادات الموقع والتصنيفات في وقت واحد لزيادة السرعة
            await Promise.all([
                DB.getSettings(),
                DB.getCategories()
            ]);
        } catch (dbError) {
            console.warn('Database Error during initialization:', dbError);
        }

        // 3. الخطوة الأخيرة: تشغيل نظام التنقل (Router)
        // الآن الراوتر سيعمل وهو يعلم تماماً إن كان المستخدم مسجل دخول أم لا، ولن يطرده
        Router.init(); 
        
        // تحديث التاريخ في التذييل
        updateYear();
        
    } catch (error) {
        console.error('Initialization error:', error);
    } finally {
        // إخفاء شاشة التحميل بعد اكتمال كل شيء
        hideLoader();
        console.log('✨ تِرياق الجمال - Taryaq Beauty initialized successfully!');
    }
};

// ==================== DOM READY ====================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// ==================== GLOBAL ERROR HANDLER ====================
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// ==================== EXPORT FOR GLOBAL ACCESS ====================
window.Cart = Cart;
window.Wishlist = Wishlist;
window.Auth = Auth;
window.Router = Router;
window.Toast = Toast;
window.Modal = Modal;
window.ProductsPage = ProductsPage;
window.ProductDetailPage = ProductDetailPage;
window.AccountPage = AccountPage;
window.Utils = Utils;

// ======================================================
// واجهة تأكيد البريد الإلكتروني المخصصة (من رابط الجيميل)
// ======================================================
window.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash;
    if (hash && (hash.includes('access_token') || hash.includes('type=signup') || hash.includes('type=recovery'))) {
        
        // إنشاء شاشة واجهة متخصصة فوق الموقع بالكامل
        const confirmationUI = document.createElement('div');
        confirmationUI.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background-color:#f8f9fa; z-index:999999; display:flex; align-items:center; justify-content:center; padding:20px; font-family:var(--font-family, "Tajawal", sans-serif);';
        confirmationUI.innerHTML = `
            <div style="background:#fff; padding:40px; border-radius:20px; box-shadow:0 15px 35px rgba(0,0,0,0.1); max-width:450px; width:100%; text-align:center;">
                <div style="width:80px; height:80px; background:#d4edda; color:#28a745; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:40px; margin:0 auto 20px;">
                    ✓
                </div>
                <h2 style="color:#1a1a2e; margin-bottom:15px; font-size:24px;">تم تأكيد حسابك بنجاح!</h2>
                <p style="color:#6c757d; margin-bottom:30px; line-height:1.6; font-size:16px;">
                    أهلاً بك في متجر ترياق الجمال. تم التحقق من بريدك الإلكتروني وتفعيل حسابك. يمكنك الآن البدء في التسوق.
                </p>
                <button id="enter-store-btn" style="background:var(--primary, #1a1a2e); color:#fff; border:none; padding:15px 20px; width:100%; border-radius:10px; font-size:16px; font-weight:bold; cursor:pointer; transition:all 0.3s ease;">
                    تأكيد الدخول للموقع
                </button>
            </div>
        `;
        document.body.appendChild(confirmationUI);

        // إخفاء شاشة التحميل الافتراضية للموقع
        const loader = document.getElementById('page-loader');
        if(loader) loader.style.display = 'none';

        // تنظيف الرابط في الخلفية بدون علم المستخدم
        setTimeout(() => {
            window.history.replaceState(null, null, window.location.pathname);
        }, 1000);

        // برمجة زر الدخول
        document.getElementById('enter-store-btn').addEventListener('click', () => {
            const btn = document.getElementById('enter-store-btn');
            btn.innerHTML = 'جاري توجيهك للمتجر...';
            btn.style.opacity = '0.8';
            
            setTimeout(() => {
                confirmationUI.remove();
                if (typeof Toast !== 'undefined') {
                    Toast.success('تم تأكيد البريد، مرحباً بك!');
                }
                // إعادة تحميل الصفحة للدخول كعضو مسجل بشكل مؤكد
                window.location.href = window.location.pathname + '#home';
                window.location.reload();
            }, 800);
        });
    }
});
