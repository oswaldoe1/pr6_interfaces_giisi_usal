document.addEventListener('DOMContentLoaded', () => {

    const app = document.getElementById('app');
    const cartButton = document.getElementById('cart-button');
    const cartModal = document.getElementById('cart-modal');
    const closeModalButton = document.querySelector('.close-button');
    
    const cartCountEl = document.getElementById('cart-count');
    const cartItemsListEl = document.getElementById('cart-items-list');
    const cartTotalEl = document.getElementById('cart-total');
    
    const navLinks = document.querySelectorAll('.nav-link');

    // --- AÑADE ESTAS ---
    const cartView = document.getElementById('cart-view');
    const checkoutView = document.getElementById('checkout-view');
    const checkoutButton = document.getElementById('checkout-button');
    const backToCartButton = document.getElementById('back-to-cart-btn');
    const checkoutForm = document.getElementById('checkout-form');
    const checkoutTotalAmount = document.getElementById('checkout-total-amount');

    // --- Estado de la Aplicación (Carrito) ---
    let cart = {}; // { id: { name, price, quantity } }

    // --- Lógica de Enrutamiento ---
    function navigateTo(viewId) {
        // Cargar el contenido de la plantilla
        const template = document.getElementById(viewId);
        if (template) {
            app.innerHTML = ''; // Limpiar vista anterior
            app.appendChild(template.content.cloneNode(true));
        }

        // Actualizar el estado 'active' de los enlaces
        navLinks.forEach(link => {
            if (link.dataset.view === viewId) {
                link.classList.add('active');
                // Problema: No se usa 'aria-current'
            } else {
                link.classList.remove('active');
            }
        });
    }

    // --- Lógica del Modal ---
    function openCartModal() {
        cartModal.classList.add('active');
        // Problema: El foco no se mueve al modal
        // Problema: El fondo (body) no se oculta a lectores de pantalla
    }

    // --- MODIFICA ESTA FUNCIÓN ---
    function closeCartModal() {
        cartModal.classList.remove('active');
        
        // Reinicia el modal a la vista del carrito
        setTimeout(() => { // Damos tiempo a la animación de cierre
            checkoutView.classList.add('hidden');
            cartView.classList.remove('hidden');
        }, 300);
        
        // Problema: El foco no se restaura al botón que abrió el modal
    }

    // --- Lógica del Carrito ---
    function addToCart(id, name, price) {
        if (cart[id]) {
            cart[id].quantity++;
        } else {
            cart[id] = { name: name, price: parseFloat(price), quantity: 1 };
        }
        updateCartUI();
        // Problema: No se anuncia nada al lector de pantalla
    }

    function removeFromCart(id) {
        if (cart[id]) {
            cart[id].quantity--;
            if (cart[id].quantity <= 0) {
                delete cart[id];
            }
        }
        updateCartUI();
        // Problema: No se anuncia nada al lector de pantalla
    }

    // --- AÑADE ESTA NUEVA FUNCIÓN ---
    function removeAllFromCart(id) {
        if (cart[id]) {
            delete cart[id];
        }
        updateCartUI();
        // Problema: No se anuncia nada al lector de pantalla
    }
    
    // --- REEMPLAZA TU FUNCIÓN updateCartUI ---
function updateCartUI() {
    let totalCount = 0;
    let totalPrice = 0;

    // Vaciar la lista del modal
    cartItemsListEl.innerHTML = '';

    const ids = Object.keys(cart);

    if (ids.length === 0) {
        cartItemsListEl.innerHTML = '<p>El carrito está vacío.</p>';
    } else {
        ids.forEach(id => {
            const item = cart[id];
            totalCount += item.quantity;
            totalPrice += item.price * item.quantity;

            // Crear elemento <li> para el modal
            const li = document.createElement('div');
            li.className = 'cart-item';

            // Problema: Botones con símbolos sin contexto/aria-label
            // Hemos añadido data-name y data-price al botón '+' para reutilizar addToCart
            li.innerHTML = `
                <span class="cart-item-name">${item.name}</span>
                <div class="cart-item-controls">
                    <button class="cart-remove-one" data-id="${id}">-</button>
                    <span class="cart-quantity">${item.quantity}</span>
                    <button class="cart-add-one" data-id="${id}" data-name="${item.name}" data-price="${item.price}">+</button>
                </div>
                <span class="cart-item-price">${(item.price * item.quantity).toFixed(2)}€</span>
                <button class="remove-item" data-id="${id}">&times;</button>
            `;
            
            cartItemsListEl.appendChild(li);
        });
    }

    // Actualizar contadores
    cartCountEl.innerText = totalCount;
    cartTotalEl.innerText = totalPrice.toFixed(2);
    
    // Problema: El 'innerText' cambia, pero no se anuncia (falta aria-live)
}

    // --- Asignación de Eventos (Event Listeners) ---

    // 1. Navegación
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Prevenir navegación real
            const viewId = e.target.dataset.view;
            navigateTo(viewId);
        });
    });

    // 2. Abrir/Cerrar Modal
    cartButton.addEventListener('click', (e) => {
        e.preventDefault();
        openCartModal();
    });
    closeModalButton.addEventListener('click', closeCartModal);

    // --- REEMPLAZA TU document.body.addEventListener ---
document.body.addEventListener('click', (e) => {
    // Clic en 'Añadir' (página de productos)
    if (e.target.classList.contains('add-cart')) {
        const id = e.target.dataset.id;
        const name = e.target.dataset.name;
        const price = e.target.dataset.price;
        addToCart(id, name, price);
    }

    // --- NUEVO: Clic en '+' (dentro del modal) ---
    if (e.target.classList.contains('cart-add-one')) {
        const id = e.target.dataset.id;
        const name = e.target.dataset.name;
        const price = e.target.dataset.price;
        addToCart(id, name, price); // Reutilizamos la misma función
    }

    // --- NUEVO: Clic en '-' (dentro del modal) ---
    if (e.target.classList.contains('cart-remove-one')) {
        const id = e.target.dataset.id;
        removeFromCart(id); // Reutilizamos la misma función
    }

    // --- MODIFICADO: Clic en 'X' (dentro del modal) ---
    if (e.target.classList.contains('remove-item')) {
        const id = e.target.dataset.id;
        removeAllFromCart(id); // Ahora llama a la nueva función
    }

    // Clic fuera del modal para cerrar
    if (e.target.id === 'cart-modal') {
        closeCartModal();
    }
});

    // --- Asignación de Eventos (Event Listeners) ---

    // 1. Navegación
    // ... (tu código de navLinks.forEach) ...

    // 2. Abrir/Cerrar Modal
    // ... (tu código de cartButton y closeModalButton) ...

    // 3. Delegación de eventos (add-cart, remove-item, etc.)
    // ... (tu código de document.body.addEventListener) ...


    // --- AÑADE ESTOS NUEVOS EVENTOS ---

    // 4. Ir a Checkout
    checkoutButton.addEventListener('click', () => {
        // Actualiza el total en la vista de checkout
        checkoutTotalAmount.innerText = cartTotalEl.innerText;
        
        cartView.classList.add('hidden');
        checkoutView.classList.remove('hidden');
        
        // Problema: El foco no se mueve al formulario
    });

    // 5. Volver al Carrito
    backToCartButton.addEventListener('click', () => {
        checkoutView.classList.add('hidden');
        cartView.classList.remove('hidden');

        // Problema: El foco no se mueve de vuelta
    });

    // 6. Simular Pago
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Previene el envío real del formulario

        // Problema: 'alert' es bloqueante y terrible para la accesibilidad
        alert('¡Gracias por su compra! Su pedido ha sido procesado.');

        // Limpiar carrito y UI
        cart = {};
        updateCartUI();
        
        // Cerrar modal y volver al inicio
        closeCartModal();
        navigateTo('view-inicio');
    });


    // --- Inicialización ---
    // ... (tu código de navigateTo('view-inicio')) ...

    // --- Inicialización ---
    navigateTo('view-inicio'); // Cargar la vista inicial

});