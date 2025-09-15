// City Drive - Main JavaScript
// Handles login and general functionality

document.addEventListener('DOMContentLoaded', function() {
    console.log('Script loaded successfully!');

    // Check if we're on login page
    if (document.getElementById('login-form')) {
        setupLogin();
    } else {
        // Initialize template animations
        initializeAnimations();
        setupScrollAnimations();
        setupButtonInteractions();
    }
});

// Setup login functionality
function setupLogin() {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    loginForm.addEventListener('submit', handleLogin);
    signupForm.addEventListener('submit', handleSignup);
}

// Handle login
function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const userType = document.getElementById('user-type').value;

    // Check specific credentials
    const validCredentials = {
        owner: {
            email: 'asadtft456@gmail.com',
            password: 'asadtft654@gmail.com'
        },
        client: {
            email: 'asadclient456@gmail.com',
            password: 'asadclient654@gmail.com'
        }
    };

    const creds = validCredentials[userType];
    if (creds && email === creds.email && password === creds.password) {
        const user = {
            id: Date.now(),
            name: email.split('@')[0],
            email: email,
            type: userType
        };

        localStorage.setItem('currentUser', JSON.stringify(user));

        // Redirect based on user type
        if (userType === 'client') {
            window.location.href = 'client/index.html';
        } else if (userType === 'owner') {
            window.location.href = 'owner/index.html';
        }
    } else {
        alert('Invalid credentials. Please check your email and password.');
    }
}

// Handle signup
function handleSignup(event) {
    event.preventDefault();

    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const userType = document.getElementById('signup-type').value;

    // Mock registration
    if (name && email && password && userType) {
        const user = {
            id: Date.now(),
            name: name,
            email: email,
            type: userType
        };

        localStorage.setItem('currentUser', JSON.stringify(user));
        alert('Account created successfully!');

        // Redirect based on user type
        if (userType === 'client') {
            window.location.href = 'client/index.html';
        } else if (userType === 'owner') {
            window.location.href = 'owner/index.html';
        }
    } else {
        alert('Please fill in all fields');
    }
}

// Show signup modal
function showSignup() {
    document.getElementById('signup-modal').style.display = 'block';
}

// Close modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Forgot password placeholder
function forgotPassword() {
    alert('Forgot password functionality - placeholder');
}

// Initialize page load animations
function initializeAnimations() {
    // Add animation classes after a short delay for smooth loading
    setTimeout(() => {
        const animatedElements = document.querySelectorAll('.animate-fade-in, .animate-bounce-in, .animate-slide-up, .animate-pulse, .animate-shimmer');
        animatedElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.animationPlayState = 'running';
            }, index * 200);
        });
    }, 100);
}

// Setup scroll-based animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe all elements with animate-on-scroll class
    const scrollElements = document.querySelectorAll('.animate-on-scroll');
    scrollElements.forEach(element => {
        observer.observe(element);
    });
}

// Setup button interactions
function setupButtonInteractions() {
    const buttons = document.querySelectorAll('.btn-primary');

    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);

            // Show alert for demo
            alert('Button clicked! This is a placeholder action.');
        });
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('.nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading animation to images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('load', function() {
        this.style.opacity = '0';
        this.style.animation = 'fadeIn 0.5s ease-in-out forwards';
    });
});

// Parallax effect for hero image (simple)
window.addEventListener('scroll', function() {
    const heroImage = document.querySelector('.hero-image img');
    if (heroImage) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        heroImage.style.transform = `translateY(${rate}px)`;
    }
});

// Add hover effects
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) rotate(2deg)';
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
});

// Simple form validation demo (if forms are added later)
function validateForm(form) {
    const inputs = form.querySelectorAll('input, textarea');
    let isValid = true;

    inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
            input.style.borderColor = 'red';
            isValid = false;
        } else {
            input.style.borderColor = '#ddd';
        }
    });

    return isValid;
}

// Utility function for random animations
function randomAnimation() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    const randomElement = elements[Math.floor(Math.random() * elements.length)];

    if (randomElement) {
        randomElement.style.animation = 'bounceIn 0.8s ease-out';
        setTimeout(() => {
            randomElement.style.animation = '';
        }, 800);
    }
}

// Trigger random animation every 10 seconds for demo
setInterval(randomAnimation, 10000);

// Performance optimization - lazy load images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
lazyLoadImages();

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.classList.contains('btn-primary')) {
        e.target.click();
    }
});

// Console log for debugging
console.log('All animations and interactions initialized successfully!');