// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTop = document.querySelector('.back-to-top');
    const currentYear = document.getElementById('currentYear');
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    
    // Configurar año actual en el footer
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
    
    // Menú hamburguesa para móviles
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Cerrar menú al hacer clic en un enlace (en móviles)
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (hamburger.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
            
            // Actualizar enlace activo
            navLinks.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Scroll suave a secciones
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Mostrar/ocultar botón "volver arriba"
    window.addEventListener('scroll', function() {
        // Botón volver arriba
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
        
        // Actualizar enlace activo según scroll
        updateActiveNavLink();
    });
    
    // Actualizar enlace activo en navegación según scroll
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Animación de elementos al hacer scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Observar elementos para animar
    document.querySelectorAll('.project-card, .service-card, .skill, .contact-method').forEach(el => {
        observer.observe(el);
    });
    
    // Validación del formulario de contacto
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Resetear mensajes de error
            document.querySelectorAll('.error-message').forEach(el => {
                el.textContent = '';
            });
            
            // Obtener valores
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            let isValid = true;
            
            // Validar nombre
            if (!name) {
                document.getElementById('nameError').textContent = 'Por favor, introduce tu nombre';
                isValid = false;
            } else if (name.length < 2) {
                document.getElementById('nameError').textContent = 'El nombre debe tener al menos 2 caracteres';
                isValid = false;
            }
            
            // Validar email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email) {
                document.getElementById('emailError').textContent = 'Por favor, introduce tu email';
                isValid = false;
            } else if (!emailRegex.test(email)) {
                document.getElementById('emailError').textContent = 'Por favor, introduce un email válido';
                isValid = false;
            }
            
            // Validar mensaje
            if (!message) {
                document.getElementById('messageError').textContent = 'Por favor, introduce tu mensaje';
                isValid = false;
            } else if (message.length < 10) {
                document.getElementById('messageError').textContent = 'El mensaje debe tener al menos 10 caracteres';
                isValid = false;
            }
            
            // Si todo es válido, simular envío
            if (isValid) {
                // Aquí normalmente enviarías los datos a un servidor
                // Por ahora solo mostramos un mensaje de éxito
                formSuccess.style.display = 'block';
                contactForm.reset();
                
                // Ocultar mensaje después de 5 segundos
                setTimeout(() => {
                    formSuccess.style.display = 'none';
                }, 5000);
            }
        });
    }
    
    // Efectos hover en tarjetas de proyectos
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Inicializar animaciones
    function initAnimations() {
        // Agregar clase animated a elementos visibles
        const animatedElements = document.querySelectorAll('.project-card, .service-card');
        
        animatedElements.forEach((el, index) => {
            // Retraso escalonado para animaciones
            el.style.animationDelay = `${index * 0.1}s`;
            
            // Añadir clase cuando el elemento sea visible
            const rect = el.getBoundingClientRect();
            const isVisible = (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
            
            if (isVisible) {
                el.classList.add('animated');
            }
        });
    }
    
    // Llamar a initAnimations después de un breve retraso
    setTimeout(initAnimations, 300);
    
    // Añadir estilos CSS para animaciones
    const style = document.createElement('style');
    style.textContent = `
        .project-card, .service-card, .skill, .contact-method {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .project-card.animated, .service-card.animated, .skill.animated, .contact-method.animated {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
});

// index.js

// Inicializar Firebase con la configuración proporcionada
const firebaseConfig = {
    apiKey: "AIzaSyCuDm6m3Iy9LMWFRlWXk8lm4uGPzAWfFaY",
    authDomain: "grupo-jj.firebaseapp.com",
    projectId: "grupo-jj",
    storageBucket: "grupo-jj.firebasestorage.app",
    messagingSenderId: "824132267786",
    appId: "1:824132267786:web:292964f1b0ecef29aa94f3",
    measurementId: "G-G8PYMMC71J"
};

// Inicializar Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Obtener referencia a Firestore
const db = firebase.firestore();

// =========== MENÚ HAMBURGUESA ===========
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Cerrar menú al hacer clic en un enlace
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        
        // Actualizar enlace activo
        navLinks.forEach(item => item.classList.remove('active'));
        link.classList.add('active');
    });
});

// =========== ENVÍO DE FORMULARIO A FIRESTORE ===========
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const errorMessages = {
    nameError: document.getElementById('nameError'),
    emailError: document.getElementById('emailError'),
    messageError: document.getElementById('messageError')
};

// Validación de email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Limpiar errores
function clearErrors() {
    Object.values(errorMessages).forEach(error => {
        error.textContent = '';
    });
}

// Mostrar error
function showError(field, message) {
    if (errorMessages[field]) {
        errorMessages[field].textContent = message;
    }
}

// Enviar datos a Firestore
async function sendMessageToFirestore(name, email, message) {
    try {
        // Agregar documento a la colección "contacts"
        await db.collection('contacts').add({
            name: name,
            email: email,
            message: message,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            read: false
        });
        return true;
    } catch (error) {
        console.error('Error al enviar mensaje:', error);
        return false;
    }
}

// Manejar envío de formulario
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Obtener valores
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Limpiar errores previos
    clearErrors();
    formSuccess.style.display = 'none';
    
    // Validar campos
    let isValid = true;
    
    if (!name) {
        showError('nameError', 'Por favor ingresa tu nombre');
        isValid = false;
    }
    
    if (!email) {
        showError('emailError', 'Por favor ingresa tu email');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('emailError', 'Por favor ingresa un email válido');
        isValid = false;
    }
    
    if (!message) {
        showError('messageError', 'Por favor ingresa tu mensaje');
        isValid = false;
    } else if (message.length < 10) {
        showError('messageError', 'El mensaje debe tener al menos 10 caracteres');
        isValid = false;
    }
    
    if (!isValid) return;
    
    // Mostrar indicador de carga
    const submitBtn = contactForm.querySelector('.btn-submit');
    const originalBtnText = submitBtn.querySelector('.btn-text').textContent;
    submitBtn.querySelector('.btn-text').textContent = 'Enviando...';
    submitBtn.disabled = true;
    
    // Enviar a Firestore
    const success = await sendMessageToFirestore(name, email, message);
    
    if (success) {
        // Mostrar mensaje de éxito
        formSuccess.style.display = 'block';
        formSuccess.style.opacity = '1';
        
        // Resetear formulario
        contactForm.reset();
        
        // Ocultar mensaje después de 5 segundos
        setTimeout(() => {
            formSuccess.style.opacity = '0';
            setTimeout(() => {
                formSuccess.style.display = 'none';
            }, 500);
        }, 5000);
    } else {
        // Mostrar error
        alert('Hubo un error al enviar tu mensaje. Por favor, intenta nuevamente.');
    }
    
    // Restaurar botón
    submitBtn.querySelector('.btn-text').textContent = originalBtnText;
    submitBtn.disabled = false;
});

// =========== AÑO ACTUAL EN FOOTER ===========
document.getElementById('currentYear').textContent = new Date().getFullYear();

// =========== SCROLL SUAVE ===========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// =========== BOTÓN VOLVER ARRIBA ===========
const backToTopBtn = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

// =========== EFECTO DE CARGA ===========
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// =========== VALIDACIÓN EN TIEMPO REAL ===========
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');

nameInput.addEventListener('input', () => {
    if (nameInput.value.trim()) {
        errorMessages.nameError.textContent = '';
    }
});

emailInput.addEventListener('input', () => {
    if (emailInput.value.trim() && isValidEmail(emailInput.value.trim())) {
        errorMessages.emailError.textContent = '';
    }
});

messageInput.addEventListener('input', () => {
    if (messageInput.value.trim() && messageInput.value.trim().length >= 10) {
        errorMessages.messageError.textContent = '';
    }
});

// =========== NAVEGACIÓN ACTIVA AL SCROLL ===========
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelector(`.nav-menu a[href="#${sectionId}"]`)?.classList.add('active');
        } else {
            document.querySelector(`.nav-menu a[href="#${sectionId}"]`)?.classList.remove('active');
        }
    });
});