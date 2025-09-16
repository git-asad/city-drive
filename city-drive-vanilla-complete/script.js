// City Drive - Static Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initializeApp();
});

// Global variables for booking system
let userBookings = JSON.parse(localStorage.getItem('userBookings')) || [];
let bookingStats = JSON.parse(localStorage.getItem('bookingStats')) || {
    totalBookings: 0,
    totalSpent: 0,
    avgRating: 0
};

function initializeApp() {
    // Set up event listeners
    setupEventListeners();

    // Initialize navigation
    initializeNavigation();

    // Set minimum dates for date inputs
    setMinimumDates();

    // Add scroll animations
    setupScrollAnimations();

    // Load user bookings
    loadUserBookings();

    // Update booking stats
    updateBookingStats();

    console.log('City Drive static website initialized');
}

// Set up all event listeners
function setupEventListeners() {
    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', handleNavigation);
    });

    // Modal triggers
    document.querySelectorAll('[onclick*="showLoginModal"]').forEach(btn => {
        btn.addEventListener('click', () => showLoginModal());
    });

    document.querySelectorAll('[onclick*="showSignupModal"]').forEach(btn => {
        btn.addEventListener('click', () => showSignupModal());
    });

    // Close modals
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            const modalId = e.target.closest('.modal').id;
            closeModal(modalId);
        });
    });

    // Click outside modal to close
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });

    // Form submissions
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }

    const bookingForm = document.querySelector('.form-container');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmit);
    }

    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }

    // Smooth scrolling for anchor links
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

// Initialize navigation
function initializeNavigation() {
    // Update active navigation link based on scroll position
    updateActiveNavLink();

    // Add scroll event listener for navigation updates
    window.addEventListener('scroll', updateActiveNavLink);
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Set minimum dates for date inputs
function setMinimumDates() {
    const today = new Date().toISOString().split('T')[0];

    const pickupDateInput = document.getElementById('pickup-date');
    const returnDateInput = document.getElementById('return-date');

    if (pickupDateInput) {
        pickupDateInput.min = today;
    }

    if (returnDateInput) {
        returnDateInput.min = today;
    }

    // Update return date min when pickup date changes
    if (pickupDateInput && returnDateInput) {
        pickupDateInput.addEventListener('change', function() {
            returnDateInput.min = this.value;
            if (returnDateInput.value && returnDateInput.value < this.value) {
                returnDateInput.value = this.value;
            }
        });
    }
}

// Setup scroll animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
            }
        });
    }, observerOptions);

    // Observe elements that should animate on scroll
    document.querySelectorAll('.feature-card, .step, .car-card, .testimonial-card').forEach(el => {
        observer.observe(el);
    });
}

// Navigation handler
function handleNavigation(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);

    if (targetSection) {
        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Modal functions
function showLoginModal() {
    document.getElementById('login-modal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function showSignupModal() {
    document.getElementById('signup-modal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.body.style.overflow = 'auto';
}

function switchToSignup() {
    closeModal('login-modal');
    showSignupModal();
}

function switchToLogin() {
    closeModal('signup-modal');
    showLoginModal();
}

// Form handlers
async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }

    try {
        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Signing In...';
        submitBtn.disabled = true;

        // Simulate login (replace with actual authentication)
        await new Promise(resolve => setTimeout(resolve, 1000));

        // For demo purposes, accept any email/password
        alert('Login successful! (Demo mode)');
        closeModal('login-modal');

        // Reset form
        e.target.reset();

    } catch (error) {
        alert('Login failed. Please try again.');
    } finally {
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Sign In';
        submitBtn.disabled = false;
    }
}

async function handleSignup(e) {
    e.preventDefault();

    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const role = document.getElementById('signup-role').value;

    if (!name || !email || !password || !role) {
        alert('Please fill in all fields');
        return;
    }

    try {
        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Creating Account...';
        submitBtn.disabled = true;

        // Simulate signup (replace with actual registration)
        await new Promise(resolve => setTimeout(resolve, 1000));

        alert('Account created successfully! (Demo mode)');
        closeModal('signup-modal');

        // Reset form
        e.target.reset();

    } catch (error) {
        alert('Signup failed. Please try again.');
    } finally {
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Create Account';
        submitBtn.disabled = false;
    }
}

function handleBookingSubmit(e) {
    e.preventDefault();

    const pickupLocation = document.getElementById('pickup-location').value;
    const pickupDate = document.getElementById('pickup-date').value;
    const returnDate = document.getElementById('return-date').value;

    if (!pickupLocation || !pickupDate || !returnDate) {
        alert('Please fill in all required fields');
        return;
    }

    // Validate dates
    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);
    const today = new Date();

    if (pickup < today.setHours(0, 0, 0, 0)) {
        alert('Pickup date cannot be in the past');
        return;
    }

    if (returnD <= pickup) {
        alert('Return date must be after pickup date');
        return;
    }

    // Calculate basic pricing (demo)
    const days = Math.ceil((returnD - pickup) / (1000 * 60 * 60 * 24));
    const estimatedPrice = days * 150; // $150 per day average

    // Create booking object
    const booking = {
        carName: 'General Booking',
        pickupLocation: pickupLocation,
        pickupDate: pickupDate,
        returnDate: returnDate,
        duration: days,
        status: 'pending',
        totalPrice: estimatedPrice,
        bookingDate: new Date().toLocaleDateString(),
        image: 'assets/main_car.png'
    };

    // Save booking
    userBookings.push(booking);
    localStorage.setItem('userBookings', JSON.stringify(userBookings));

    // Update stats
    bookingStats.totalBookings += 1;
    bookingStats.totalSpent += estimatedPrice;
    localStorage.setItem('bookingStats', JSON.stringify(bookingStats));
    updateBookingStats();

    alert(`Booking submitted successfully!\n\nLocation: ${pickupLocation}\nPickup: ${pickupDate}\nReturn: ${returnDate}\nDuration: ${days} days\nEstimated Price: $${estimatedPrice}\n\nCheck "My Bookings" to view your booking status.`);

    // Reset form
    e.target.reset();
}

async function handleNewsletterSubmit(e) {
    e.preventDefault();

    const inputs = e.target.querySelectorAll('input');
    const email = inputs[inputs.length - 1].value; // Last input is email

    if (!email) {
        alert('Please enter your email address');
        return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
    }

    try {
        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Subscribing...';
        submitBtn.disabled = true;

        // Simulate newsletter subscription
        await new Promise(resolve => setTimeout(resolve, 1000));

        alert('Thank you for subscribing! Check your email for confirmation.');
        e.target.reset();

    } catch (error) {
        alert('Subscription failed. Please try again.');
    } finally {
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Subscribe Now';
        submitBtn.disabled = false;
    }
}

// Utility functions
function navigateTo(page) {
    console.log('Navigate to:', page);
    // In a real application, this would handle routing
    // For now, just scroll to sections or show alerts
    switch(page) {
        case 'home':
            window.scrollTo({ top: 0, behavior: 'smooth' });
            break;
        case 'cars':
            document.getElementById('featured-section')?.scrollIntoView({ behavior: 'smooth' });
            break;
        case 'my-bookings':
            window.location.href = 'my-bookings.html';
            break;
        case 'about':
            alert('About page coming soon!');
            break;
        case 'contact':
            document.getElementById('newsletter-section')?.scrollIntoView({ behavior: 'smooth' });
            break;
        case 'dashboard':
            alert('Dashboard requires login');
            break;
        default:
            console.log('Unknown page:', page);
    }
}

function logout() {
    alert('Logged out successfully');
    // In a real application, this would clear authentication tokens
}

// Car booking handler - Now scrolls to cars section
function bookCar(carName, price) {
    // Simply scroll to the cars section
    const carsSection = document.getElementById('cars');
    if (carsSection) {
        carsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    } else {
        // If on a different page, redirect to home page with cars section
        window.location.href = 'index.html#cars';
    }
}

// Get car image based on name
function getCarImage(carName) {
    const imageMap = {
        'BMW X5': 'assets/car_image1.png',
        'Toyota Corolla': 'assets/car_image2.png',
        'Jeep Wrangler': 'assets/car_image3.png',
        'Ford Neo 6': 'assets/car_image4.png'
    };
    return imageMap[carName] || 'assets/main_car.png';
}

// Load user bookings
function loadUserBookings() {
    const bookingsList = document.getElementById('bookings-list');
    if (!bookingsList) return;

    if (userBookings.length === 0) {
        bookingsList.innerHTML = `
            <div class="no-bookings">
                <div class="no-bookings-icon">📅</div>
                <h3>No Bookings Yet</h3>
                <p>You haven't made any bookings yet. Start exploring our premium fleet!</p>
                <button class="btn-primary" onclick="document.getElementById('pickup-location').focus()">Browse Cars</button>
            </div>
        `;
        return;
    }

    bookingsList.innerHTML = '';

    userBookings.forEach(booking => {
        const bookingCard = document.createElement('div');
        bookingCard.className = 'booking-card';
        bookingCard.innerHTML = `
            <div class="booking-image">
                <img src="${booking.image}" alt="${booking.carName}" onerror="this.src='assets/main_car.png'">
            </div>
            <div class="booking-info">
                <h3>${booking.carName}</h3>
                <div class="booking-details">
                    <span>📍 ${booking.pickupLocation}</span>
                    <span>📅 ${booking.pickupDate} - ${booking.returnDate}</span>
                    <span>⏱️ ${booking.duration} days</span>
                    <span class="booking-status status-${booking.status}">${booking.status}</span>
                </div>
                <p><strong>Total: $${booking.totalPrice}</strong></p>
                <small>Booked on: ${booking.bookingDate}</small>
            </div>
        `;
        bookingsList.appendChild(bookingCard);
    });
}

// Update booking statistics
function updateBookingStats() {
    const totalBookingsEl = document.getElementById('total-bookings');
    if (totalBookingsEl) totalBookingsEl.textContent = bookingStats.totalBookings;

    const totalSpentEl = document.getElementById('total-spent');
    if (totalSpentEl) totalSpentEl.textContent = `$${bookingStats.totalSpent}`;

    const avgRatingEl = document.getElementById('avg-rating');
    if (avgRatingEl) avgRatingEl.textContent = bookingStats.avgRating.toFixed(1);
}

// Car Search and Filter Functionality
let allCars = [];
let filteredCars = [];

function initializeCarSearch() {
    // Get all car cards
    allCars = Array.from(document.querySelectorAll('.car-card'));
    filteredCars = [...allCars];

    // Set up event listeners for filters
    document.getElementById('car-type-filter').addEventListener('change', applyFilters);
    document.getElementById('price-range-filter').addEventListener('change', applyFilters);
    document.getElementById('availability-filter').addEventListener('change', applyFilters);
    document.getElementById('search-input').addEventListener('input', applyFilters);
    document.getElementById('clear-filters').addEventListener('click', clearFilters);

    // Set minimum date for availability filter
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('availability-filter').min = today;
}

function applyFilters() {
    const carType = document.getElementById('car-type-filter').value.toLowerCase();
    const priceRange = document.getElementById('price-range-filter').value;
    const availabilityDate = document.getElementById('availability-filter').value;
    const searchTerm = document.getElementById('search-input').value.toLowerCase().trim();

    filteredCars = allCars.filter(car => {
        // Car type filter
        if (carType && car.dataset.type.toLowerCase() !== carType) {
            return false;
        }

        // Price range filter
        if (priceRange) {
            const carPrice = parseInt(car.dataset.price);
            const [min, max] = priceRange.split('-').map(p => p === '+' ? Infinity : parseInt(p));
            if (carPrice < min || (max !== Infinity && carPrice > max)) {
                return false;
            }
        }

        // Availability filter (simplified - in real app would check actual availability)
        if (availabilityDate) {
            // For demo purposes, assume all cars are available
            // In real app, this would check against booking data
        }

        // Search filter
        if (searchTerm) {
            const brand = car.dataset.brand.toLowerCase();
            const model = car.dataset.model.toLowerCase();
            const type = car.dataset.type.toLowerCase();
            const searchText = `${brand} ${model} ${type}`;

            if (!searchText.includes(searchTerm)) {
                return false;
            }
        }

        return true;
    });

    // Update display
    updateCarDisplay();
}

function updateCarDisplay() {
    allCars.forEach(car => {
        if (filteredCars.includes(car)) {
            car.classList.remove('hidden');
            setTimeout(() => {
                car.style.opacity = '1';
                car.style.transform = 'scale(1)';
            }, 10);
        } else {
            car.classList.add('hidden');
            car.style.opacity = '0';
            car.style.transform = 'scale(0.8)';
        }
    });

    // Update results count
    const resultsCount = filteredCars.length;
    const totalCount = allCars.length;

    // You could add a results counter here if desired
    console.log(`Showing ${resultsCount} of ${totalCount} cars`);
}

function clearFilters() {
    document.getElementById('car-type-filter').value = '';
    document.getElementById('price-range-filter').value = '';
    document.getElementById('availability-filter').value = '';
    document.getElementById('search-input').value = '';

    filteredCars = [...allCars];
    updateCarDisplay();
}

// Contact Form Handler
function handleContactSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const contactData = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };

    // Simulate form submission (in real app, this would send to backend)
    console.log('Contact form submitted:', contactData);

    // Show success message
    showNotification('Thank you for contacting us! We\'ll get back to you within 24 hours.', 'success');

    // Reset form
    event.target.reset();
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✅' : 'ℹ️'}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        padding: 15px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Smooth scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll to top button functionality
window.addEventListener('scroll', function() {
    // You can add a scroll to top button here if needed
});

// Handle window resize for responsive adjustments
window.addEventListener('resize', function() {
    // Handle responsive adjustments if needed
});

// Initialize car search when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    initializeCarSearch();
});

// Export functions for global access (for onclick handlers)
window.showLoginModal = showLoginModal;
window.showSignupModal = showSignupModal;
window.closeModal = closeModal;
window.switchToSignup = switchToSignup;
window.switchToLogin = switchToLogin;
window.navigateTo = navigateTo;
window.logout = logout;
window.bookCar = bookCar;
window.scrollToTop = scrollToTop;
window.handleBookingSubmit = handleBookingSubmit;
window.handleNewsletterSubmit = handleNewsletterSubmit;
window.handleLogin = handleLogin;
window.handleSignup = handleSignup;
window.handleContactSubmit = handleContactSubmit;
window.showNotification = showNotification;