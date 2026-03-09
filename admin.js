/**
 * ========================================
 * تِرياق الجمال - Taryaq Beauty
 * Admin Dashboard Application
 * ========================================
 */

// ==================== CONFIGURATION ====================
// ==================== CONFIGURATION ====================
const ADMIN_CONFIG = {
    SUPABASE_URL: 'https://vhqrbrlosqnzpqtxhypc.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZocXJicmxvc3FuenBxdHhoeXBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNDc0NTAsImV4cCI6MjA4ODYyMzQ1MH0.B8BWhTZ6ZjDeN6JOyuV6kOvwjGV9aWA9g3TvdcrYe_s',
    ADMIN_EMAIL: 'om011013om@gmail.com',
    STORAGE_BUCKET: 'products',
    WILAYAS: [
        { code: '01', name: 'أدرار' }, { code: '02', name: 'الشلف' }, { code: '03', name: 'الأغواط' },
        { code: '04', name: 'أم البواقي' }, { code: '05', name: 'باتنة' }, { code: '06', name: 'بجاية' },
        { code: '07', name: 'بسكرة' }, { code: '08', name: 'بشار' }, { code: '09', name: 'البليدة' },
        { code: '10', name: 'البويرة' }, { code: '11', name: 'تمنراست' }, { code: '12', name: 'تبسة' },
        { code: '13', name: 'تلمسان' }, { code: '14', name: 'تيارت' }, { code: '15', name: 'تيزي وزو' },
        { code: '16', name: 'الجزائر' }, { code: '17', name: 'الجلفة' }, { code: '18', name: 'جيجل' },
        { code: '19', name: 'سطيف' }, { code: '20', name: 'سعيدة' }, { code: '21', name: 'سكيكدة' },
        { code: '22', name: 'سيدي بلعباس' }, { code: '23', name: 'عنابة' }, { code: '24', name: 'قالمة' },
        { code: '25', name: 'قسنطينة' }, { code: '26', name: 'المدية' }, { code: '27', name: 'مستغانم' },
        { code: '28', name: 'المسيلة' }, { code: '29', name: 'معسكر' }, { code: '30', name: 'ورقلة' },
        { code: '31', name: 'وهران' }, { code: '32', name: 'البيض' }, { code: '33', name: 'إليزي' },
        { code: '34', name: 'برج بوعريريج' }, { code: '35', name: 'بومرداس' }, { code: '36', name: 'الطارف' },
        { code: '37', name: 'تندوف' }, { code: '38', name: 'تيسمسيلت' }, { code: '39', name: 'الوادي' },
        { code: '40', name: 'خنشلة' }, { code: '41', name: 'سوق أهراس' }, { code: '42', name: 'تيبازة' },
        { code: '43', name: 'ميلة' }, { code: '44', name: 'عين الدفلى' }, { code: '45', name: 'النعامة' },
        { code: '46', name: 'عين تموشنت' }, { code: '47', name: 'غرداية' }, { code: '48', name: 'غليزان' },
        { code: '49', name: 'تيميمون' }, { code: '50', name: 'برج باجي مختار' }, { code: '51', name: 'أولاد جلال' },
        { code: '52', name: 'بني عباس' }, { code: '53', name: 'عين صالح' }, { code: '54', name: 'عين قزام' },
        { code: '55', name: 'توقرت' }, { code: '56', name: 'جانت' }, { code: '57', name: 'المغير' },
        { code: '58', name: 'المنيعة' }
    ]
};

// ==================== SUPABASE CLIENT ====================
if (typeof window.supabase !== 'undefined' && typeof window.supabase.createClient === 'function') {
    window.supabase = window.supabase.createClient(ADMIN_CONFIG.SUPABASE_URL, ADMIN_CONFIG.SUPABASE_ANON_KEY);
}


// ==================== ADMIN STATE ====================
const AdminState = {
    user: null,
    currentSection: 'dashboard',
    products: [],
    categories: [],
    orders: [],
    customers: [],
    reviews: [],
    tickets: [],
    messages: [],
    shippingRates: [],
    settings: {},
    uploadedImages: [],
    deleteCallback: null
};

// ==================== UTILITY FUNCTIONS ====================
const AdminUtils = {
    formatPrice(price) {
        return new Intl.NumberFormat('ar-DZ').format(price) + ' دج';
    },
    
    formatDate(date) {
        return new Intl.DateTimeFormat('ar-DZ', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    },
    
    formatDateShort(date) {
        return new Intl.DateTimeFormat('ar-DZ', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(new Date(date));
    },
    
    sanitizeHTML(str) {
        if (!str) return '';
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    },
    
    generateSlug(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    },
    
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
};

// ==================== TOAST NOTIFICATIONS ====================
const AdminToast = {
    container: null,
    
    init() {
        this.container = document.getElementById('toast-container');
    },
    
    show(message, type = 'info', duration = 4000) {
        const icons = {
            success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
            error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
            warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
            info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`
        };
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-icon">${icons[type]}</div>
            <div class="toast-content">
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        `;
        
        this.container.appendChild(toast);
        
        toast.querySelector('.toast-close').addEventListener('click', () => this.remove(toast));
        setTimeout(() => this.remove(toast), duration);
    },
    
    remove(toast) {
        toast.classList.add('removing');
        setTimeout(() => toast.remove(), 300);
    },
    
    success(message) { this.show(message, 'success'); },
    error(message) { this.show(message, 'error'); },
    warning(message) { this.show(message, 'warning'); },
    info(message) { this.show(message, 'info'); }
};

// ==================== MODAL MANAGER ====================
const AdminModal = {
    open(modalId) {
        document.getElementById(modalId)?.classList.add('active');
        document.body.classList.add('no-scroll');
    },
    
    close(modalId) {
        document.getElementById(modalId)?.classList.remove('active');
        document.body.classList.remove('no-scroll');
    },
    
    closeAll() {
        document.querySelectorAll('.modal.active').forEach(m => m.classList.remove('active'));
        document.body.classList.remove('no-scroll');
    },
    
    init() {
        document.querySelectorAll('.modal-overlay, .modal-close').forEach(el => {
            el.addEventListener('click', () => this.closeAll());
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeAll();
        });
    }
};

// ==================== ADMIN APP ====================
const AdminApp = {
    // ============ INITIALIZATION ============
    async init() {
        AdminToast.init();
        AdminModal.init();
        
        // Check authentication
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session && session.user.email.toLowerCase() === ADMIN_CONFIG.ADMIN_EMAIL.toLowerCase()) {
            AdminState.user = session.user;
            this.showDashboard();
            await this.loadDashboardData();
        } else {
            this.showLoginPage();
        }
        
        this.initEventListeners();
        this.initTheme();
    },
    
    initEventListeners() {
        // Login form
        document.getElementById('admin-login-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
        
        // Logout
        document.getElementById('admin-logout-btn')?.addEventListener('click', () => {
            this.handleLogout();
        });
        
        // Navigation
        document.querySelectorAll('.admin-nav-item[data-section]').forEach(item => {
            item.addEventListener('click', () => {
                const section = item.dataset.section;
                this.showSection(section);
            });
        });
        
        // Mobile menu
        document.getElementById('admin-menu-toggle')?.addEventListener('click', () => {
            document.getElementById('admin-sidebar')?.classList.toggle('active');
            document.getElementById('admin-sidebar-overlay')?.classList.toggle('active');
        });
        
        document.getElementById('admin-sidebar-overlay')?.addEventListener('click', () => {
            document.getElementById('admin-sidebar')?.classList.remove('active');
            document.getElementById('admin-sidebar-overlay')?.classList.remove('active');
        });
        
        // Theme toggle
        document.getElementById('admin-theme-toggle')?.addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // Product form
        document.getElementById('add-product-btn')?.addEventListener('click', () => {
            this.showAddProductModal();
        });
        
        document.getElementById('product-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleProductSubmit();
        });
        
        // Category form
        document.getElementById('add-category-btn')?.addEventListener('click', () => {
            this.showAddCategoryModal();
        });
        
        document.getElementById('category-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleCategorySubmit();
        });
        
        // Image upload
        this.initImageUpload();
        
        // Filters
        document.getElementById('orders-filter')?.addEventListener('change', () => {
            this.loadOrders();
        });
        
        document.getElementById('reviews-filter')?.addEventListener('change', () => {
            this.loadReviews();
        });
        
        document.getElementById('tickets-filter')?.addEventListener('change', () => {
            this.loadTickets();
        });
        
        // Shipping save
        document.getElementById('save-shipping-btn')?.addEventListener('click', () => {
            this.saveShippingRates();
        });
        
        // Settings forms
        document.getElementById('site-settings-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveSiteSettings();
        });
        
        document.getElementById('tax-settings-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveTaxSettings();
        });
        
        // Ticket reply
        document.getElementById('ticket-reply-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleTicketReply();
        });
    },
    
    initTheme() {
        const savedTheme = localStorage.getItem('admin_theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
    },
    
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('admin_theme', newTheme);
    },
    
    // ============ AUTH ============
    showLoginPage() {
        document.getElementById('admin-login-page').style.display = 'flex';
        document.getElementById('admin-dashboard').style.display = 'none';
    },
    
    showDashboard() {
        document.getElementById('admin-login-page').style.display = 'none';
        document.getElementById('admin-dashboard').style.display = 'flex';
        
        // Update user info
        const userData = AdminState.user?.user_metadata || {};
        const name = userData.full_name || AdminState.user?.email?.split('@')[0] || 'المشرف';
        document.getElementById('admin-name').textContent = name;
        document.getElementById('admin-avatar').textContent = name.charAt(0).toUpperCase();
    },
    
    async handleLogin() {
        const email = document.getElementById('admin-email').value.trim();
        const password = document.getElementById('admin-password').value;
        
        const submitBtn = document.querySelector('#admin-login-form button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<div class="spinner spinner-sm"></div> جاري التحقق...';
        
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            
            if (error) throw error;
            
            if (data.user.email.toLowerCase() !== ADMIN_CONFIG.ADMIN_EMAIL.toLowerCase()) {
                await supabase.auth.signOut();
                throw new Error('ليس لديك صلاحية الوصول لهذه الصفحة');
            }
            
            AdminState.user = data.user;
            AdminToast.success('تم تسجيل الدخول بنجاح');
            this.showDashboard();
            await this.loadDashboardData();
            
        } catch (error) {
            AdminToast.error(error.message || 'فشل تسجيل الدخول');
        }
        
        submitBtn.disabled = false;
        submitBtn.textContent = 'تسجيل الدخول';
    },
    
    async handleLogout() {
        await supabase.auth.signOut();
        AdminState.user = null;
        this.showLoginPage();
        AdminToast.info('تم تسجيل الخروج');
    },
    
    // ============ NAVIGATION ============
    showSection(section) {
        AdminState.currentSection = section;
        
        // Update nav
        document.querySelectorAll('.admin-nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.section === section);
        });
        
        // Update sections
        document.querySelectorAll('.admin-section').forEach(sec => {
            sec.classList.toggle('active', sec.id === `section-${section}`);
        });
        
        // Update title
        const titles = {
            dashboard: 'لوحة القيادة',
            products: 'إدارة المنتجات',
            categories: 'إدارة التصنيفات',
            orders: 'إدارة الطلبات',
            customers: 'إدارة العملاء',
            reviews: 'إدارة التقييمات',
            tickets: 'تذاكر الدعم',
            messages: 'رسائل التواصل',
            shipping: 'التوصيل والشحن',
            settings: 'إعدادات الموقع'
        };
        document.getElementById('admin-page-title').textContent = titles[section] || section;
        
        // Load section data
        this.loadSectionData(section);
        
        // Close mobile menu
        document.getElementById('admin-sidebar')?.classList.remove('active');
        document.getElementById('admin-sidebar-overlay')?.classList.remove('active');
    },
    
    async loadSectionData(section) {
        switch (section) {
            case 'dashboard':
                await this.loadDashboardData();
                break;
            case 'products':
                await this.loadProducts();
                break;
            case 'categories':
                await this.loadCategories();
                break;
            case 'orders':
                await this.loadOrders();
                break;
            case 'customers':
                await this.loadCustomers();
                break;
            case 'reviews':
                await this.loadReviews();
                break;
            case 'tickets':
                await this.loadTickets();
                break;
            case 'messages':
                await this.loadMessages();
                break;
            case 'shipping':
                await this.loadShippingRates();
                break;
            case 'settings':
                await this.loadSettings();
                break;
        }
    },
    
    // ============ DASHBOARD ============
    async loadDashboardData() {
        try {
            // Get stats
            const [
                { count: productsCount },
                { count: ordersCount },
                { count: customersCount },
                { data: orders },
                { data: tickets },
                { data: pendingOrders }
            ] = await Promise.all([
                supabase.from('products').select('*', { count: 'exact', head: true }),
                supabase.from('orders').select('*', { count: 'exact', head: true }),
                supabase.from('users').select('*', { count: 'exact', head: true }),
                supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
                supabase.from('tickets').select('*').eq('status', 'open').order('created_at', { ascending: false }).limit(5),
                supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending')
            ]);
            
            // Calculate total sales
            const { data: salesData } = await supabase.from('orders').select('total').eq('status', 'delivered');
            const totalSales = salesData?.reduce((sum, o) => sum + (o.total || 0), 0) || 0;
            
            // Update stats
            document.getElementById('stat-products').textContent = productsCount || 0;
            document.getElementById('stat-orders').textContent = ordersCount || 0;
            document.getElementById('stat-customers').textContent = customersCount || 0;
            document.getElementById('stat-sales').textContent = AdminUtils.formatPrice(totalSales);
            
            // Update badges
            document.getElementById('new-orders-badge').textContent = pendingOrders?.count || 0;
            document.getElementById('new-tickets-badge').textContent = tickets?.length || 0;
            
            // Render recent orders
            this.renderRecentOrders(orders || []);
            
            // Render recent tickets
            this.renderRecentTickets(tickets || []);
            
        } catch (error) {
            console.error('Dashboard error:', error);
        }
    },
    
    renderRecentOrders(orders) {
        const container = document.getElementById('recent-orders-list');
        if (!container) return;
        
        if (orders.length === 0) {
            container.innerHTML = '<p class="text-center text-muted p-lg">لا توجد طلبات</p>';
            return;
        }
        
        container.innerHTML = orders.map(order => `
            <div class="order-item">
                <div class="order-info">
                    <div class="order-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                            <line x1="3" y1="6" x2="21" y2="6"/>
                        </svg>
                    </div>
                    <div class="order-details">
                        <h4>#${order.order_number}</h4>
                        <span>${AdminUtils.formatDateShort(order.created_at)}</span>
                    </div>
                </div>
                <div class="order-amount">
                    <h4>${AdminUtils.formatPrice(order.total)}</h4>
                    <span class="order-status ${order.status}">${this.getOrderStatusText(order.status)}</span>
                </div>
            </div>
        `).join('');
    },
    
    renderRecentTickets(tickets) {
        const container = document.getElementById('recent-tickets-list');
        if (!container) return;
        
        if (tickets.length === 0) {
            container.innerHTML = '<p class="text-center text-muted p-lg">لا توجد تذاكر جديدة</p>';
            return;
        }
        
        container.innerHTML = tickets.map(ticket => `
            <div class="ticket-item" style="padding: var(--spacing-md); cursor: pointer;" onclick="AdminApp.viewTicket('${ticket.id}')">
                <div class="ticket-header">
                    <div class="ticket-user">
                        <div class="ticket-user-avatar">${ticket.user_name?.charAt(0) || 'U'}</div>
                        <div class="ticket-user-info">
                            <h4>${AdminUtils.sanitizeHTML(ticket.user_name || 'مستخدم')}</h4>
                            <span>${AdminUtils.formatDateShort(ticket.created_at)}</span>
                        </div>
                    </div>
                    <span class="ticket-status ${ticket.status}">${this.getTicketStatusText(ticket.status)}</span>
                </div>
                <p class="ticket-subject">${AdminUtils.sanitizeHTML(ticket.subject)}</p>
            </div>
        `).join('');
    },
    
    // ============ PRODUCTS ============
    async loadProducts() {
        const container = document.getElementById('products-table-body');
        if (!container) return;
        
        container.innerHTML = '<tr><td colspan="6" class="text-center p-xl"><div class="spinner"></div></td></tr>';
        
        try {
            const { data, error } = await supabase
                .from('products')
                .select(`*, category:categories(name)`)
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            
            AdminState.products = data || [];
            this.renderProductsTable(data || []);
            
        } catch (error) {
            console.error('Products error:', error);
            container.innerHTML = '<tr><td colspan="6" class="text-center text-danger">حدث خطأ في تحميل المنتجات</td></tr>';
        }
    },
    
    renderProductsTable(products) {
        const container = document.getElementById('products-table-body');
        
        if (products.length === 0) {
            container.innerHTML = '<tr><td colspan="6" class="text-center p-xl">لا توجد منتجات</td></tr>';
            return;
        }
        
        container.innerHTML = products.map(product => `
            <tr>
                <td>
                    <div class="table-product">
                        <div class="table-product-image">
                            <img src="${product.images?.[0] || '/placeholder.jpg'}" alt="${AdminUtils.sanitizeHTML(product.name)}">
                        </div>
                        <div class="table-product-info">
                            <h4>${AdminUtils.sanitizeHTML(product.name)}</h4>
                            <span>SKU: ${product.sku || '-'}</span>
                        </div>
                    </div>
                </td>
                <td>${product.category?.name || '-'}</td>
                <td>
                    ${product.sale_price ? `
                        <span style="text-decoration: line-through; color: var(--text-muted);">${AdminUtils.formatPrice(product.price)}</span><br>
                        <span style="color: var(--danger); font-weight: 600;">${AdminUtils.formatPrice(product.sale_price)}</span>
                    ` : AdminUtils.formatPrice(product.price)}
                </td>
                <td>
                    <span class="badge ${product.stock > 10 ? 'badge-success' : product.stock > 0 ? 'badge-warning' : 'badge-danger'}">
                        ${product.stock}
                    </span>
                </td>
                <td>
                    <span class="badge ${product.active ? 'badge-success' : 'badge-secondary'}">
                        ${product.active ? 'نشط' : 'غير نشط'}
                    </span>
                </td>
                <td>
                    <div class="table-actions">
                        <button class="table-action-btn edit" onclick="AdminApp.editProduct('${product.id}')" title="تعديل">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                        </button>
                        <button class="table-action-btn delete" onclick="AdminApp.deleteProduct('${product.id}')" title="حذف">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    },
    
    async showAddProductModal() {
        document.getElementById('product-modal-title').textContent = 'إضافة منتج جديد';
        document.getElementById('product-form').reset();
        document.getElementById('product-id').value = '';
        document.getElementById('product-images-preview').innerHTML = '';
        AdminState.uploadedImages = [];
        
        await this.loadCategoriesForSelect();
        AdminModal.open('product-modal');
    },
    
    async editProduct(productId) {
        const product = AdminState.products.find(p => p.id === productId);
        if (!product) return;
        
        document.getElementById('product-modal-title').textContent = 'تعديل المنتج';
        document.getElementById('product-id').value = product.id;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-description').value = product.description || '';
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-sale-price').value = product.sale_price || '';
        document.getElementById('product-stock').value = product.stock;
        document.getElementById('product-sku').value = product.sku || '';
        document.getElementById('product-featured').checked = product.featured || false;
        document.getElementById('product-active').checked = product.active !== false;
        
        if (product.sale_end) {
            document.getElementById('product-sale-end').value = product.sale_end.slice(0, 16);
        }
        
        // Load images
        AdminState.uploadedImages = product.images || [];
        this.renderImagePreviews();
        
        await this.loadCategoriesForSelect();
        document.getElementById('product-category').value = product.category_id || '';
        
        AdminModal.open('product-modal');
    },
    
    async handleProductSubmit() {
        const productId = document.getElementById('product-id').value;
        const productData = {
            name: document.getElementById('product-name').value.trim(),
            description: document.getElementById('product-description').value.trim(),
            price: parseFloat(document.getElementById('product-price').value),
            sale_price: document.getElementById('product-sale-price').value ? parseFloat(document.getElementById('product-sale-price').value) : null,
            category_id: document.getElementById('product-category').value || null,
            stock: parseInt(document.getElementById('product-stock').value) || 0,
            sku: document.getElementById('product-sku').value.trim() || null,
            featured: document.getElementById('product-featured').checked,
            active: document.getElementById('product-active').checked,
            sale_end: document.getElementById('product-sale-end').value || null,
            images: AdminState.uploadedImages
        };
        
        if (!productData.name || !productData.price) {
            AdminToast.warning('يرجى ملء الحقول المطلوبة');
            return;
        }
        
        try {
            if (productId) {
                // Update
                const { error } = await supabase.from('products').update(productData).eq('id', productId);
                if (error) throw error;
                AdminToast.success('تم تحديث المنتج بنجاح');
            } else {
                // Create
                productData.slug = AdminUtils.generateSlug(productData.name);
                const { error } = await supabase.from('products').insert([productData]);
                if (error) throw error;
                AdminToast.success('تم إضافة المنتج بنجاح');
            }
            
            AdminModal.close('product-modal');
            await this.loadProducts();
            
        } catch (error) {
            console.error('Product save error:', error);
            AdminToast.error('حدث خطأ أثناء حفظ المنتج');
        }
    },
    
    async deleteProduct(productId) {
        this.showConfirmModal('هل أنت متأكد من حذف هذا المنتج؟', async () => {
            try {
                const { error } = await supabase.from('products').delete().eq('id', productId);
                if (error) throw error;
                AdminToast.success('تم حذف المنتج');
                await this.loadProducts();
            } catch (error) {
                AdminToast.error('حدث خطأ أثناء حذف المنتج');
            }
        });
    },
    
    // ============ IMAGE UPLOAD ============
    initImageUpload() {
        const uploadZone = document.getElementById('product-images-upload');
        const input = document.getElementById('product-images-input');
        
        if (!uploadZone || !input) return;
        
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('dragover');
        });
        
        uploadZone.addEventListener('dragleave', () => {
            uploadZone.classList.remove('dragover');
        });
        
        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
            this.handleImageFiles(e.dataTransfer.files);
        });
        
        input.addEventListener('change', (e) => {
            this.handleImageFiles(e.target.files);
        });
    },
    
    async handleImageFiles(files) {
        for (const file of files) {
            if (!file.type.startsWith('image/')) continue;
            if (file.size > 5 * 1024 * 1024) {
                AdminToast.warning('حجم الصورة يجب أن يكون أقل من 5MB');
                continue;
            }
            
            try {
                const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${file.name.split('.').pop()}`;
                const filePath = `products/${fileName}`;
                
                const { data, error } = await supabase.storage
                    .from(ADMIN_CONFIG.STORAGE_BUCKET)
                    .upload(filePath, file);
                
                if (error) throw error;
                
                const { data: { publicUrl } } = supabase.storage
                    .from(ADMIN_CONFIG.STORAGE_BUCKET)
                    .getPublicUrl(filePath);
                
                AdminState.uploadedImages.push(publicUrl);
                this.renderImagePreviews();
                
            } catch (error) {
                console.error('Upload error:', error);
                AdminToast.error('فشل في رفع الصورة');
            }
        }
    },
    
    renderImagePreviews() {
        const container = document.getElementById('product-images-preview');
        if (!container) return;
        
        container.innerHTML = AdminState.uploadedImages.map((url, index) => `
            <div class="image-preview-item">
                <img src="${url}" alt="صورة ${index + 1}">
                <button type="button" class="image-preview-remove" onclick="AdminApp.removeImage(${index})">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>
        `).join('');
    },
    
    removeImage(index) {
        AdminState.uploadedImages.splice(index, 1);
        this.renderImagePreviews();
    },
    
    // ============ CATEGORIES ============
    async loadCategories() {
        const container = document.getElementById('categories-grid');
        if (!container) return;
        
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .order('sort_order');
            
            if (error) throw error;
            
            AdminState.categories = data || [];
            this.renderCategoriesGrid(data || []);
            
        } catch (error) {
            console.error('Categories error:', error);
        }
    },
    
    renderCategoriesGrid(categories) {
        const container = document.getElementById('categories-grid');
        
        if (categories.length === 0) {
            container.innerHTML = '<p class="text-center text-muted p-xl" style="grid-column: 1/-1;">لا توجد تصنيفات</p>';
            return;
        }
        
        container.innerHTML = categories.map(cat => `
            <div class="category-manage-card">
                <div class="category-manage-icon">${cat.icon || '📦'}</div>
                <div class="category-manage-info">
                    <h4>${AdminUtils.sanitizeHTML(cat.name)}</h4>
                    <span>${cat.products_count || 0} منتج</span>
                </div>
                <div class="category-manage-actions">
                    <button class="table-action-btn edit" onclick="AdminApp.editCategory('${cat.id}')" title="تعديل">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                    </button>
                    <button class="table-action-btn delete" onclick="AdminApp.deleteCategory('${cat.id}')" title="حذف">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                        </svg>
                    </button>
                </div>
            </div>
        `).join('');
    },
    
    async loadCategoriesForSelect() {
        if (AdminState.categories.length === 0) {
            const { data } = await supabase.from('categories').select('*').eq('active', true).order('name');
            AdminState.categories = data || [];
        }
        
        const select = document.getElementById('product-category');
        if (select) {
            select.innerHTML = `
                <option value="">اختر التصنيف</option>
                ${AdminState.categories.map(cat => `
                    <option value="${cat.id}">${cat.name}</option>
                `).join('')}
            `;
        }
    },
    
    showAddCategoryModal() {
        document.getElementById('category-modal-title').textContent = 'إضافة تصنيف جديد';
        document.getElementById('category-form').reset();
        document.getElementById('category-id').value = '';
        AdminModal.open('category-modal');
    },
    
    editCategory(categoryId) {
        const category = AdminState.categories.find(c => c.id === categoryId);
        if (!category) return;
        
        document.getElementById('category-modal-title').textContent = 'تعديل التصنيف';
        document.getElementById('category-id').value = category.id;
        document.getElementById('category-name').value = category.name;
        document.getElementById('category-description').value = category.description || '';
        document.getElementById('category-icon').value = category.icon || '';
        document.getElementById('category-sort').value = category.sort_order || 0;
        document.getElementById('category-active').checked = category.active !== false;
        
        AdminModal.open('category-modal');
    },
    
    async handleCategorySubmit() {
        const categoryId = document.getElementById('category-id').value;
        // جلب اسم التصنيف
        const catName = document.getElementById('category-name').value.trim();
        
        // توليد slug تلقائي من الاسم (مطلوب في قاعدة البيانات)
        const generateSlug = catName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\u0600-\u06FF-]/g, '') || 'cat-' + Date.now();

        const categoryData = {
            name: catName,
            name_ar: catName,
            slug: generateSlug, // تمت إضافة الـ slug الإجباري
            description: document.getElementById('category-description').value.trim(),
            image_url: document.getElementById('category-icon') ? document.getElementById('category-icon').value.trim() : null, // تم تعديل الاسم ليطابق الداتابيز
            sort_order: parseInt(document.getElementById('category-sort').value) || 0,
            is_active: document.getElementById('category-active') ? document.getElementById('category-active').checked : true // تم تعديل الاسم ليطابق الداتابيز
        };

        
        if (!categoryData.name) {
            AdminToast.warning('يرجى إدخال اسم التصنيف');
            return;
        }
        
        try {
            if (categoryId) {
                const { error } = await supabase.from('categories').update(categoryData).eq('id', categoryId);
                if (error) throw error;
                AdminToast.success('تم تحديث التصنيف');
            } else {
                categoryData.slug = AdminUtils.generateSlug(categoryData.name);
                const { error } = await supabase.from('categories').insert([categoryData]);
                if (error) throw error;
                AdminToast.success('تم إضافة التصنيف');
            }
            
            AdminModal.close('category-modal');
            AdminState.categories = [];
            await this.loadCategories();
            
        } catch (error) {
            console.error('Category save error:', error);
            AdminToast.error('حدث خطأ أثناء حفظ التصنيف');
        }
    },
    
    async deleteCategory(categoryId) {
        this.showConfirmModal('هل أنت متأكد من حذف هذا التصنيف؟', async () => {
            try {
                const { error } = await supabase.from('categories').delete().eq('id', categoryId);
                if (error) throw error;
                AdminToast.success('تم حذف التصنيف');
                AdminState.categories = [];
                await this.loadCategories();
            } catch (error) {
                AdminToast.error('حدث خطأ أثناء حذف التصنيف');
            }
        });
    },
    
    // ============ ORDERS ============
    async loadOrders() {
        const container = document.getElementById('orders-table-body');
        if (!container) return;
        
        container.innerHTML = '<tr><td colspan="7" class="text-center p-xl"><div class="spinner"></div></td></tr>';
        
        const filter = document.getElementById('orders-filter')?.value || 'all';
        
        try {
            let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
            
            if (filter !== 'all') {
                query = query.eq('status', filter);
            }
            
            const { data, error } = await query;
            if (error) throw error;
            
            AdminState.orders = data || [];
            this.renderOrdersTable(data || []);
            
        } catch (error) {
            console.error('Orders error:', error);
        }
    },
    
    renderOrdersTable(orders) {
        const container = document.getElementById('orders-table-body');
        
        if (orders.length === 0) {
            container.innerHTML = '<tr><td colspan="7" class="text-center p-xl">لا توجد طلبات</td></tr>';
            return;
        }
        
        container.innerHTML = orders.map(order => `
            <tr>
                <td><strong>#${order.order_number}</strong></td>
                <td>
                    <div>${AdminUtils.sanitizeHTML(order.shipping_name)}</div>
                    <small class="text-muted">${order.shipping_phone}</small>
                </td>
                <td>${AdminUtils.formatDateShort(order.created_at)}</td>
                <td><strong>${AdminUtils.formatPrice(order.total)}</strong></td>
                <td>
                    <select class="order-status-select" onchange="AdminApp.updateOrderStatus('${order.id}', this.value)" style="padding: 4px 8px; border-radius: 4px; border: 1px solid var(--border-color);">
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>قيد المراجعة</option>
                        <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>قيد المعالجة</option>
                        <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>جاري التوصيل</option>
                        <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>تم التسليم</option>
                        <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>ملغي</option>
                    </select>
                </td>
                <td>
                    <span class="badge ${order.payment_status === 'paid' ? 'badge-success' : 'badge-warning'}">
                        ${order.payment_status === 'paid' ? 'مدفوع' : 'غير مدفوع'}
                    </span>
                </td>
                <td>
                    <button class="table-action-btn" onclick="AdminApp.viewOrder('${order.id}')" title="عرض التفاصيل">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                        </svg>
                    </button>
                </td>
            </tr>
        `).join('');
    },
    
    async updateOrderStatus(orderId, status) {
        try {
            const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
            if (error) throw error;
            AdminToast.success('تم تحديث حالة الطلب');
        } catch (error) {
            AdminToast.error('حدث خطأ');
            this.loadOrders();
        }
    },
    
    async viewOrder(orderId) {
        const order = AdminState.orders.find(o => o.id === orderId);
        if (!order) return;
        
        const content = document.getElementById('order-details-content');
        content.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-xl);">
                <div>
                    <h4 style="margin-bottom: var(--spacing-md);">معلومات الطلب</h4>
                    <p><strong>رقم الطلب:</strong> #${order.order_number}</p>
                    <p><strong>التاريخ:</strong> ${AdminUtils.formatDate(order.created_at)}</p>
                    <p><strong>الحالة:</strong> ${this.getOrderStatusText(order.status)}</p>
                    <p><strong>طريقة الدفع:</strong> ${order.payment_method === 'cod' ? 'عند الاستلام' : 'بطاقة'}</p>
                </div>
                <div>
                    <h4 style="margin-bottom: var(--spacing-md);">معلومات التوصيل</h4>
                    <p><strong>الاسم:</strong> ${AdminUtils.sanitizeHTML(order.shipping_name)}</p>
                    <p><strong>الهاتف:</strong> ${order.shipping_phone}</p>
                    <p><strong>العنوان:</strong> ${order.shipping_wilaya} - ${order.shipping_commune}</p>
                    <p>${AdminUtils.sanitizeHTML(order.shipping_address)}</p>
                    ${order.shipping_notes ? `<p><strong>ملاحظات:</strong> ${AdminUtils.sanitizeHTML(order.shipping_notes)}</p>` : ''}
                </div>
            </div>
            <hr style="margin: var(--spacing-xl) 0; border: none; border-top: 1px solid var(--border-color);">
            <h4 style="margin-bottom: var(--spacing-md);">تفاصيل الفاتورة</h4>
            <div style="background: var(--bg-secondary); padding: var(--spacing-lg); border-radius: var(--radius-lg);">
                <div style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-sm);">
                    <span>المجموع الفرعي:</span>
                    <span>${AdminUtils.formatPrice(order.subtotal)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-sm);">
                    <span>التوصيل:</span>
                    <span>${AdminUtils.formatPrice(order.shipping_cost)}</span>
                </div>
                ${order.tax > 0 ? `
                    <div style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-sm);">
                        <span>الضريبة:</span>
                        <span>${AdminUtils.formatPrice(order.tax)}</span>
                    </div>
                ` : ''}
                <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 1.2em; padding-top: var(--spacing-md); border-top: 1px solid var(--border-color);">
                    <span>الإجمالي:</span>
                    <span style="color: var(--secondary);">${AdminUtils.formatPrice(order.total)}</span>
                </div>
            </div>
        `;
        
        AdminModal.open('order-modal');
    },
    
    getOrderStatusText(status) {
        const texts = {
            pending: 'قيد المراجعة',
            processing: 'قيد المعالجة',
            shipped: 'جاري التوصيل',
            delivered: 'تم التسليم',
            cancelled: 'ملغي'
        };
        return texts[status] || status;
    },
    
    // ============ CUSTOMERS ============
    async loadCustomers() {
        const container = document.getElementById('customers-table-body');
        if (!container) return;
        
        container.innerHTML = '<tr><td colspan="6" class="text-center p-xl"><div class="spinner"></div></td></tr>';
        
        try {
            const { data, error } = await supabase.auth.admin.listUsers();
            
            // Fallback: get from orders unique users
            const { data: orders } = await supabase
                .from('orders')
                .select('user_id, shipping_name, shipping_email, shipping_phone, total, created_at')
                .order('created_at', { ascending: false });
            
            // Group by user
            const usersMap = {};
            (orders || []).forEach(order => {
                if (!usersMap[order.user_id]) {
                    usersMap[order.user_id] = {
                        id: order.user_id,
                        name: order.shipping_name,
                        email: order.shipping_email,
                        phone: order.shipping_phone,
                        orders_count: 0,
                        total_spent: 0,
                        first_order: order.created_at
                    };
                }
                usersMap[order.user_id].orders_count++;
                usersMap[order.user_id].total_spent += order.total || 0;
            });
            
            const customers = Object.values(usersMap);
            AdminState.customers = customers;
            this.renderCustomersTable(customers);
            
        } catch (error) {
            console.error('Customers error:', error);
            container.innerHTML = '<tr><td colspan="6" class="text-center">لا يمكن تحميل العملاء</td></tr>';
        }
    },
    
    renderCustomersTable(customers) {
        const container = document.getElementById('customers-table-body');
        
        if (customers.length === 0) {
            container.innerHTML = '<tr><td colspan="6" class="text-center p-xl">لا يوجد عملاء</td></tr>';
            return;
        }
        
        container.innerHTML = customers.map(customer => `
            <tr>
                <td>${AdminUtils.sanitizeHTML(customer.name || 'غير محدد')}</td>
                <td>${customer.email || '-'}</td>
                <td>${customer.phone || '-'}</td>
                <td>${customer.orders_count}</td>
                <td>${AdminUtils.formatPrice(customer.total_spent)}</td>
                <td>${AdminUtils.formatDateShort(customer.first_order)}</td>
            </tr>
        `).join('');
    },
    
    // ============ REVIEWS ============
    async loadReviews() {
        const container = document.getElementById('reviews-table-body');
        if (!container) return;
        
        container.innerHTML = '<tr><td colspan="7" class="text-center p-xl"><div class="spinner"></div></td></tr>';
        
        const filter = document.getElementById('reviews-filter')?.value || 'all';
        
        try {
            let query = supabase.from('reviews').select(`
                *,
                product:products(name),
                user:users(full_name)
            `).order('created_at', { ascending: false });
            
            if (filter === 'pending') {
                query = query.eq('approved', false);
            } else if (filter === 'approved') {
                query = query.eq('approved', true);
            }
            
            const { data, error } = await query;
            if (error) throw error;
            
            AdminState.reviews = data || [];
            this.renderReviewsTable(data || []);
            
        } catch (error) {
            console.error('Reviews error:', error);
        }
    },
    
    renderReviewsTable(reviews) {
        const container = document.getElementById('reviews-table-body');
        
        if (reviews.length === 0) {
            container.innerHTML = '<tr><td colspan="7" class="text-center p-xl">لا توجد تقييمات</td></tr>';
            return;
        }
        
        container.innerHTML = reviews.map(review => `
            <tr>
                <td>${AdminUtils.sanitizeHTML(review.user?.full_name || 'مستخدم')}</td>
                <td>${AdminUtils.sanitizeHTML(review.product?.name || '-')}</td>
                <td>
                    <span style="color: var(--secondary);">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</span>
                </td>
                <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    ${AdminUtils.sanitizeHTML(review.comment)}
                </td>
                <td>${AdminUtils.formatDateShort(review.created_at)}</td>
                <td>
                    <span class="badge ${review.approved ? 'badge-success' : 'badge-warning'}">
                        ${review.approved ? 'موافق' : 'بانتظار'}
                    </span>
                </td>
                <td>
                    <div class="table-actions">
                        ${!review.approved ? `
                            <button class="table-action-btn" onclick="AdminApp.approveReview('${review.id}')" title="موافقة" style="color: var(--success);">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="20 6 9 17 4 12"/>
                                </svg>
                            </button>
                        ` : ''}
                        <button class="table-action-btn delete" onclick="AdminApp.deleteReview('${review.id}')" title="حذف">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    },
    
    async approveReview(reviewId) {
        try {
            const { error } = await supabase.from('reviews').update({ approved: true }).eq('id', reviewId);
            if (error) throw error;
            AdminToast.success('تمت الموافقة على التقييم');
            await this.loadReviews();
        } catch (error) {
            AdminToast.error('حدث خطأ');
        }
    },
    
    async deleteReview(reviewId) {
        this.showConfirmModal('هل أنت متأكد من حذف هذا التقييم؟', async () => {
            try {
                const { error } = await supabase.from('reviews').delete().eq('id', reviewId);
                if (error) throw error;
                AdminToast.success('تم حذف التقييم');
                await this.loadReviews();
            } catch (error) {
                AdminToast.error('حدث خطأ');
            }
        });
    },
    
    // ============ TICKETS ============
    async loadTickets() {
        const container = document.getElementById('tickets-list');
        if (!container) return;
        
        container.innerHTML = '<div class="text-center p-xl"><div class="spinner"></div></div>';
        
        const filter = document.getElementById('tickets-filter')?.value || 'all';
        
        try {
            let query = supabase.from('tickets').select('*').order('created_at', { ascending: false });
            
            if (filter !== 'all') {
                query = query.eq('status', filter);
            }
            
            const { data, error } = await query;
            if (error) throw error;
            
            AdminState.tickets = data || [];
            this.renderTicketsList(data || []);
            
        } catch (error) {
            console.error('Tickets error:', error);
        }
    },
    
    renderTicketsList(tickets) {
        const container = document.getElementById('tickets-list');
        
        if (tickets.length === 0) {
            container.innerHTML = '<p class="text-center text-muted p-xl">لا توجد تذاكر</p>';
            return;
        }
        
        container.innerHTML = tickets.map(ticket => `
            <div class="ticket-item" onclick="AdminApp.viewTicket('${ticket.id}')" style="cursor: pointer;">
                <div class="ticket-header">
                    <div class="ticket-user">
                        <div class="ticket-user-avatar">${ticket.user_name?.charAt(0) || 'U'}</div>
                        <div class="ticket-user-info">
                            <h4>${AdminUtils.sanitizeHTML(ticket.user_name || 'مستخدم')}</h4>
                            <span>${ticket.user_email || ''}</span>
                        </div>
                    </div>
                    <span class="ticket-status ${ticket.status}">${this.getTicketStatusText(ticket.status)}</span>
                </div>
                <p class="ticket-subject"><strong>${AdminUtils.sanitizeHTML(ticket.subject)}</strong></p>
                <p style="color: var(--text-tertiary); font-size: 0.875rem; margin-top: 4px;">
                    ${AdminUtils.sanitizeHTML(ticket.message).slice(0, 100)}...
                </p>
                <div class="ticket-footer">
                    <div class="ticket-meta">
                        <span>النوع: ${ticket.type || 'عام'}</span>
                        <span>${AdminUtils.formatDate(ticket.created_at)}</span>
                    </div>
                </div>
            </div>
        `).join('');
    },
    
    viewTicket(ticketId) {
        const ticket = AdminState.tickets.find(t => t.id === ticketId);
        if (!ticket) return;
        
        document.getElementById('ticket-id').value = ticket.id;
        document.getElementById('ticket-status').value = ticket.status;
        
        const content = document.getElementById('ticket-details-content');
        content.innerHTML = `
            <div style="background: var(--bg-secondary); padding: var(--spacing-lg); border-radius: var(--radius-lg); margin-bottom: var(--spacing-lg);">
                <p><strong>من:</strong> ${AdminUtils.sanitizeHTML(ticket.user_name)} (${ticket.user_email})</p>
                <p><strong>الموضوع:</strong> ${AdminUtils.sanitizeHTML(ticket.subject)}</p>
                <p><strong>النوع:</strong> ${ticket.type || 'عام'}</p>
                ${ticket.order_id ? `<p><strong>رقم الطلب:</strong> ${ticket.order_id}</p>` : ''}
                <hr style="margin: var(--spacing-md) 0; border: none; border-top: 1px solid var(--border-color);">
                <p>${AdminUtils.sanitizeHTML(ticket.message)}</p>
            </div>
        `;
        
        AdminModal.open('ticket-modal');
    },
    
    async handleTicketReply() {
        const ticketId = document.getElementById('ticket-id').value;
        const reply = document.getElementById('ticket-reply').value.trim();
        const status = document.getElementById('ticket-status').value;
        
        if (!reply) {
            AdminToast.warning('يرجى كتابة الرد');
            return;
        }
        
        try {
            // Update ticket status
            const { error } = await supabase.from('tickets').update({ 
                status,
                admin_reply: reply,
                replied_at: new Date().toISOString()
            }).eq('id', ticketId);
            
            if (error) throw error;
            
            AdminToast.success('تم إرسال الرد');
            AdminModal.close('ticket-modal');
            document.getElementById('ticket-reply').value = '';
            await this.loadTickets();
            
        } catch (error) {
            AdminToast.error('حدث خطأ');
        }
    },
    
    getTicketStatusText(status) {
        const texts = {
            open: 'مفتوحة',
            'in-progress': 'قيد المعالجة',
            resolved: 'تم الحل',
            closed: 'مغلقة'
        };
        return texts[status] || status;
    },
    
    // ============ MESSAGES ============
    async loadMessages() {
        const container = document.getElementById('messages-table-body');
        if (!container) return;
        
        container.innerHTML = '<tr><td colspan="6" class="text-center p-xl"><div class="spinner"></div></td></tr>';
        
        try {
            const { data, error } = await supabase
                .from('contact_messages')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            
            AdminState.messages = data || [];
            this.renderMessagesTable(data || []);
            
        } catch (error) {
            console.error('Messages error:', error);
        }
    },
    
    renderMessagesTable(messages) {
        const container = document.getElementById('messages-table-body');
        
        if (messages.length === 0) {
            container.innerHTML = '<tr><td colspan="6" class="text-center p-xl">لا توجد رسائل</td></tr>';
            return;
        }
        
        container.innerHTML = messages.map(msg => `
            <tr>
                <td>${AdminUtils.sanitizeHTML(msg.name)}</td>
                <td>${msg.email}</td>
                <td>${AdminUtils.sanitizeHTML(msg.subject)}</td>
                <td>${AdminUtils.formatDateShort(msg.created_at)}</td>
                <td>
                    <span class="badge ${msg.read ? 'badge-secondary' : 'badge-success'}">
                        ${msg.read ? 'مقروءة' : 'جديدة'}
                    </span>
                </td>
                <td>
                    <div class="table-actions">
                        <button class="table-action-btn" onclick="AdminApp.viewMessage('${msg.id}')" title="عرض">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                <circle cx="12" cy="12" r="3"/>
                            </svg>
                        </button>
                        <button class="table-action-btn delete" onclick="AdminApp.deleteMessage('${msg.id}')" title="حذف">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    },
    
    async viewMessage(messageId) {
        const message = AdminState.messages.find(m => m.id === messageId);
        if (!message) return;
        
        // Mark as read
        await supabase.from('contact_messages').update({ read: true }).eq('id', messageId);
        
        alert(`من: ${message.name}\nالبريد: ${message.email}\nالموضوع: ${message.subject}\n\nالرسالة:\n${message.message}`);
        
        await this.loadMessages();
    },
    
    async deleteMessage(messageId) {
        this.showConfirmModal('هل أنت متأكد من حذف هذه الرسالة؟', async () => {
            try {
                await supabase.from('contact_messages').delete().eq('id', messageId);
                AdminToast.success('تم حذف الرسالة');
                await this.loadMessages();
            } catch (error) {
                AdminToast.error('حدث خطأ');
            }
        });
    },
    
    // ============ SHIPPING ============
    async loadShippingRates() {
        const container = document.getElementById('shipping-rates-grid');
        if (!container) return;
        
        try {
            const { data } = await supabase.from('shipping_rates').select('*');
            AdminState.shippingRates = data || [];
            
            // Render all wilayas with rates
            container.innerHTML = ADMIN_CONFIG.WILAYAS.map(wilaya => {
                const rate = AdminState.shippingRates.find(r => r.wilaya_code === wilaya.code);
                return `
                    <div class="shipping-rate-card">
                        <h4>${wilaya.code} - ${wilaya.name}</h4>
                        <input type="number" 
                               data-wilaya="${wilaya.code}" 
                               data-wilaya-name="${wilaya.name}"
                               value="${rate?.price || 500}" 
                               min="0" 
                               placeholder="السعر">
                    </div>
                `;
            }).join('');
            
            // Load default settings
            const { data: settings } = await supabase.from('settings').select('*').single();
            if (settings) {
                document.getElementById('default-shipping').value = settings.default_shipping || 500;
                document.getElementById('free-shipping-min').value = settings.free_shipping_min || 5000;
            }
            
        } catch (error) {
            console.error('Shipping rates error:', error);
        }
    },
    
    async saveShippingRates() {
        try {
            const inputs = document.querySelectorAll('#shipping-rates-grid input');
            const rates = [];
            
            inputs.forEach(input => {
                rates.push({
                    wilaya_code: input.dataset.wilaya,
                    wilaya_name: input.dataset.wilayaName,
                    price: parseInt(input.value) || 0,
                    active: true
                });
            });
            
            // Upsert rates
            for (const rate of rates) {
                await supabase.from('shipping_rates').upsert(rate, { onConflict: 'wilaya_code' });
            }
            
            // Save default settings
            await supabase.from('settings').upsert({
                id: 1,
                default_shipping: parseInt(document.getElementById('default-shipping').value) || 500,
                free_shipping_min: parseInt(document.getElementById('free-shipping-min').value) || 5000
            });
            
            AdminToast.success('تم حفظ أسعار التوصيل');
            
        } catch (error) {
            console.error('Save shipping error:', error);
            AdminToast.error('حدث خطأ أثناء الحفظ');
        }
    },
    
    // ============ SETTINGS ============
    async loadSettings() {
        try {
            const { data } = await supabase.from('settings').select('*').single();
            if (data) {
                AdminState.settings = data;
                document.getElementById('site-name').value = data.site_name || 'تِرياق الجمال';
                document.getElementById('site-description').value = data.site_description || '';
                document.getElementById('site-email').value = data.site_email || '';
                document.getElementById('site-phone').value = data.site_phone || '';
                document.getElementById('site-address').value = data.site_address || '';
                document.getElementById('tax-rate').value = data.tax_rate || 0;
                document.getElementById('chargily-key').value = data.chargily_key || '';
            }
        } catch (error) {
            console.error('Settings error:', error);
        }
    },
    
    async saveSiteSettings() {
        try {
            const settings = {
                id: 1,
                site_name: document.getElementById('site-name').value,
                site_description: document.getElementById('site-description').value,
                site_email: document.getElementById('site-email').value,
                site_phone: document.getElementById('site-phone').value,
                site_address: document.getElementById('site-address').value
            };
            
            await supabase.from('settings').upsert(settings);
            AdminToast.success('تم حفظ الإعدادات');
            
        } catch (error) {
            AdminToast.error('حدث خطأ');
        }
    },
    
    async saveTaxSettings() {
        try {
            const settings = {
                id: 1,
                tax_rate: parseFloat(document.getElementById('tax-rate').value) || 0,
                chargily_key: document.getElementById('chargily-key').value
            };
            
            await supabase.from('settings').upsert(settings);
            AdminToast.success('تم حفظ الإعدادات');
            
        } catch (error) {
            AdminToast.error('حدث خطأ');
        }
    },
    
    // ============ CONFIRM MODAL ============
    showConfirmModal(message, callback) {
        document.getElementById('confirm-message').textContent = message;
        AdminState.deleteCallback = callback;
        
        document.getElementById('confirm-delete-btn').onclick = async () => {
            if (AdminState.deleteCallback) {
                await AdminState.deleteCallback();
            }
            AdminModal.close('confirm-modal');
        };
        
        AdminModal.open('confirm-modal');
    },
    
    closeModal(modalId) {
        AdminModal.close(modalId);
    }
};

// ==================== INITIALIZE ====================
document.addEventListener('DOMContentLoaded', () => {
    AdminApp.init();
});

// ==================== GLOBAL ACCESS ====================
window.AdminApp = AdminApp;
