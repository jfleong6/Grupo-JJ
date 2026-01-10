// ecommerce.js
document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    let cart = JSON.parse(localStorage.getItem('ecommerce_cart')) || [];
    let products = [];
    
    // Elementos del DOM
    const cartToggle = document.getElementById('cartToggle');
    const closeCart = document.getElementById('closeCart');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    const productsGrid = document.getElementById('productsGrid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const continueShopping = document.getElementById('continueShopping');
    const simulatePayment = document.getElementById('simulatePayment');
    const paymentResult = document.getElementById('paymentResult');
    const viewCartFooter = document.getElementById('viewCartFooter');
    const simulateCheckout = document.getElementById('simulateCheckout');
    const paymentModal = document.getElementById('paymentModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const currentYear = document.getElementById('currentYear');
    const orderNumber = document.getElementById('orderNumber');
    const orderTotal = document.getElementById('orderTotal');
    
    // Configurar año actual
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
    
    // Datos de productos simulados
    const productsData = [
        {
            id: 1,
            name: "Smartphone X10",
            category: "electronics",
            description: "Teléfono inteligente con pantalla AMOLED de 6.5 pulgadas, 128GB de almacenamiento y cámara triple de 48MP.",
            price: 599.99,
            originalPrice: 699.99,
            image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1744&q=80",
            rating: 4.5,
            badge: "Oferta"
        },
        {
            id: 2,
            name: "Laptop Pro 15",
            category: "electronics",
            description: "Portátil profesional con procesador i7, 16GB RAM, SSD 512GB y pantalla Retina 4K.",
            price: 1299.99,
            originalPrice: null,
            image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1742&q=80",
            rating: 4.8,
            badge: null
        },
        {
            id: 3,
            name: "Audífonos Inalámbricos",
            category: "electronics",
            description: "Audífonos con cancelación de ruido activa, batería de 30 horas y carga rápida.",
            price: 199.99,
            originalPrice: 249.99,
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
            rating: 4.3,
            badge: "Popular"
        },
        {
            id: 4,
            name: "Camiseta Casual",
            category: "fashion",
            description: "Camiseta de algodón 100% con diseño moderno y cómodo para uso diario.",
            price: 29.99,
            originalPrice: 39.99,
            image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80",
            rating: 4.2,
            badge: "Nuevo"
        },
        {
            id: 5,
            name: "Zapatos Deportivos",
            category: "fashion",
            description: "Zapatos para correr con suela amortiguada y material transpirable.",
            price: 89.99,
            originalPrice: 119.99,
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
            rating: 4.6,
            badge: "Oferta"
        },
        {
            id: 6,
            name: "Reloj Inteligente",
            category: "electronics",
            description: "Reloj con monitor de frecuencia cardíaca, GPS integrado y notificaciones inteligentes.",
            price: 249.99,
            originalPrice: null,
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1699&q=80",
            rating: 4.4,
            badge: null
        },
        {
            id: 7,
            name: "Lámpara de Mesa Moderna",
            category: "home",
            description: "Lámpara LED con diseño minimalista y control de intensidad táctil.",
            price: 49.99,
            originalPrice: 69.99,
            image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
            rating: 4.7,
            badge: "Popular"
        },
        {
            id: 8,
            name: "Balón de Fútbol",
            category: "sports",
            description: "Balón oficial tamaño 5, ideal para partidos profesionales y entrenamiento.",
            price: 34.99,
            originalPrice: null,
            image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1742&q=80",
            rating: 4.5,
            badge: null
        },
        {
            id: 9,
            name: "Raqueta de Tenis",
            category: "sports",
            description: "Raqueta profesional con marco de grafito y encordado de alta resistencia.",
            price: 129.99,
            originalPrice: 159.99,
            image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
            rating: 4.8,
            badge: "Oferta"
        }
    ];
    
    // Inicializar la aplicación
    function init() {
        products = productsData;
        renderProducts('all');
        updateCart();
        setupEventListeners();
    }
    
    // Configurar event listeners
    function setupEventListeners() {
        // Carrito
        if (cartToggle) cartToggle.addEventListener('click', toggleCart);
        if (closeCart) closeCart.addEventListener('click', toggleCart);
        if (continueShopping) continueShopping.addEventListener('click', toggleCart);
        if (checkoutBtn) checkoutBtn.addEventListener('click', proceedToCheckout);
        
        // Filtros de productos
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                renderProducts(filter);
            });
        });
        
        // Pago simulado
        if (simulatePayment) simulatePayment.addEventListener('click', simulatePaymentProcess);
        
        // Enlaces del footer
        if (viewCartFooter) viewCartFooter.addEventListener('click', function(e) {
            e.preventDefault();
            toggleCart();
        });
        
        if (simulateCheckout) simulateCheckout.addEventListener('click', function(e) {
            e.preventDefault();
            simulatePaymentProcess();
        });
        
        // Modal
        if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
        
        closeModalButtons.forEach(button => {
            button.addEventListener('click', closeModal);
        });
        
        // Cerrar modal al hacer clic fuera
        if (paymentModal) {
            paymentModal.addEventListener('click', function(e) {
                if (e.target === this) {
                    closeModal();
                }
            });
        }
        
        // Cerrar carrito al hacer clic fuera (en móviles)
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768 && 
                cartSidebar.classList.contains('active') && 
                !cartSidebar.contains(e.target) && 
                !cartToggle.contains(e.target)) {
                toggleCart();
            }
        });
    }
    
    // Renderizar productos
    function renderProducts(filter) {
        if (!productsGrid) return;
        
        let filteredProducts = products;
        if (filter !== 'all') {
            filteredProducts = products.filter(product => product.category === filter);
        }
        
        productsGrid.innerHTML = '';
        
        filteredProducts.forEach(product => {
            const productCard = createProductCard(product);
            productsGrid.appendChild(productCard);
        });
    }
    
    // Crear tarjeta de producto
    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.id = product.id;
        
        const isInCart = cart.some(item => item.id === product.id);
        const addButtonText = isInCart ? 'Agregado' : 'Agregar al carrito';
        const addButtonClass = isInCart ? 'added' : '';
        
        card.innerHTML = `
            ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <div class="product-category">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</div>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">
                    <div>
                        ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                        <span class="price">$${product.price.toFixed(2)}</span>
                    </div>
                    <div class="product-rating">
                        <i class="fas fa-star"></i>
                        <span>${product.rating}</span>
                    </div>
                </div>
                <button class="add-to-cart ${addButtonClass}" data-id="${product.id}">
                    <i class="fas fa-shopping-cart"></i> ${addButtonText}
                </button>
            </div>
        `;
        
        // Agregar evento al botón
        const addButton = card.querySelector('.add-to-cart');
        addButton.addEventListener('click', function() {
            addToCart(product);
        });
        
        return card;
    }
    
    // Agregar producto al carrito
    function addToCart(product) {
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        // Actualizar localStorage
        localStorage.setItem('ecommerce_cart', JSON.stringify(cart));
        
        // Actualizar UI
        updateCart();
        
        // Mostrar feedback visual
        const addButton = document.querySelector(`.add-to-cart[data-id="${product.id}"]`);
        if (addButton) {
            addButton.textContent = 'Agregado';
            addButton.classList.add('added');
            
            // Restaurar texto después de un tiempo
            setTimeout(() => {
                addButton.innerHTML = '<i class="fas fa-shopping-cart"></i> Agregar al carrito';
                addButton.classList.remove('added');
            }, 1500);
        }
        
        // Mostrar carrito si está cerrado
        if (!cartSidebar.classList.contains('active')) {
            toggleCart();
        }
    }
    
    // Actualizar carrito en la UI
    function updateCart() {
        // Actualizar contador
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Actualizar total
        const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
        
        // Actualizar lista de productos
        renderCartItems();
    }
    
    // Renderizar productos del carrito
    function renderCartItems() {
        if (!cartItems) return;
        
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-basket"></i>
                    <p>Tu carrito está vacío</p>
                    <a href="#products" class="btn btn-primary">Ver productos</a>
                </div>
            `;
            return;
        }
        
        cartItems.innerHTML = '';
        
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.dataset.id = item.id;
            
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn increase">+</button>
                    </div>
                </div>
                <button class="remove-item" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            
            // Agregar eventos
            const decreaseBtn = cartItem.querySelector('.decrease');
            const increaseBtn = cartItem.querySelector('.increase');
            const removeBtn = cartItem.querySelector('.remove-item');
            
            decreaseBtn.addEventListener('click', () => updateQuantity(item.id, -1));
            increaseBtn.addEventListener('click', () => updateQuantity(item.id, 1));
            removeBtn.addEventListener('click', () => removeFromCart(item.id));
            
            cartItems.appendChild(cartItem);
        });
    }
    
    // Actualizar cantidad de producto en el carrito
    function updateQuantity(productId, change) {
        const itemIndex = cart.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            cart[itemIndex].quantity += change;
            
            // Si la cantidad es 0 o menor, eliminar producto
            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1);
            }
            
            // Actualizar localStorage y UI
            localStorage.setItem('ecommerce_cart', JSON.stringify(cart));
            updateCart();
        }
    }
    
    // Eliminar producto del carrito
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('ecommerce_cart', JSON.stringify(cart));
        updateCart();
    }
    
    // Alternar visibilidad del carrito
    function toggleCart() {
        cartSidebar.classList.toggle('active');
        
        // Bloquear scroll del body cuando el carrito está abierto
        if (cartSidebar.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }
    
    // Proceder al pago
    function proceedToCheckout() {
        if (cart.length === 0) {
            alert('Tu carrito está vacío. Agrega productos antes de proceder al pago.');
            return;
        }
        
        // Simular redirección a página de checkout
        alert('Redirigiendo a la página de checkout... (simulación)');
        
        // En una implementación real, aquí redirigiríamos a una página de checkout
        console.log('Procediendo al pago con productos:', cart);
    }
    
    // Simular proceso de pago
    function simulatePaymentProcess() {
        // Validar campos de tarjeta (simulación básica)
        const cardName = document.getElementById('cardName').value.trim();
        const cardNumber = document.getElementById('cardNumber').value.trim();
        const cardExpiry = document.getElementById('cardExpiry').value.trim();
        const cardCVC = document.getElementById('cardCVC').value.trim();
        
        if (!cardName || !cardNumber || !cardExpiry || !cardCVC) {
            paymentResult.textContent = 'Por favor, completa todos los campos';
            paymentResult.className = 'payment-result error';
            paymentResult.style.display = 'block';
            return;
        }
        
        // Simular procesamiento
        paymentResult.textContent = 'Procesando pago...';
        paymentResult.className = 'payment-result';
        paymentResult.style.display = 'block';
        
        // Simular retardo de procesamiento
        setTimeout(() => {
            // Calcular total
            const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            
            // Generar número de pedido aleatorio
            const randomOrderNum = Math.floor(10000 + Math.random() * 90000);
            
            // Actualizar modal
            orderNumber.textContent = randomOrderNum;
            orderTotal.textContent = `$${totalPrice.toFixed(2)}`;
            
            // Mostrar modal
            paymentModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Limpiar carrito
            cart = [];
            localStorage.removeItem('ecommerce_cart');
            updateCart();
            
            // Ocultar mensaje de resultado
            paymentResult.style.display = 'none';
            
            // Limpiar formulario
            document.getElementById('cardName').value = '';
            document.getElementById('cardNumber').value = '';
            document.getElementById('cardExpiry').value = '';
            document.getElementById('cardCVC').value = '';
            
        }, 2000);
    }
    
    // Cerrar modal
    function closeModal() {
        paymentModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    // Inicializar la aplicación
    init();
});