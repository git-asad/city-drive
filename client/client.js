// City Drive Client JavaScript
let filteredCars = [...cars];
let currentUser = null;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadCars();
    setMinimumDates();
    checkAuthStatus();
});

// Load and display cars
function loadCars() {
    const carsGrid = document.getElementById('cars-grid');
    carsGrid.innerHTML = '';

    if (filteredCars.length === 0) {
        carsGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No cars available matching your criteria.</p>';
        return;
    }

    filteredCars.forEach(car => {
        const carCard = document.createElement('div');
        carCard.className = 'car-card';
        carCard.innerHTML = `
            <img src="${car.image}" alt="${car.name}" class="car-image" onerror="this.src='/client/assets/main_car.png'">
            <div class="car-info">
                <h3 class="car-name">${car.name}</h3>
                <div class="car-details">
                    <span>🚗 ${car.type}</span>
                    <span>⛽ Available</span>
                    <span>👥 ${car.seats} seats</span>
                </div>
                <div class="car-price">$${car.price}/day</div>
                <button class="btn-book" onclick="bookCar(${car.id})">Book Now</button>
            </div>
        `;
        carsGrid.appendChild(carCard);
    });
}

// Update filters
function updateFilters() {
    const pickupDate = document.getElementById('pickup-date').value;
    const returnDate = document.getElementById('return-date').value;
    const carType = document.getElementById('car-type').value;
    const priceRange = document.getElementById('price-range').value;

    // Validate dates
    if (pickupDate && returnDate && new Date(returnDate) <= new Date(pickupDate)) {
        alert('Return date must be after pickup date');
        document.getElementById('return-date').value = '';
        return;
    }

    filteredCars = cars.filter(car => {
        // Car type filter
        if (carType && car.type.toLowerCase() !== carType.toLowerCase()) {
            return false;
        }

        // Price range filter
        if (priceRange) {
            const [min, max] = priceRange.split('-').map(p => p === '+' ? Infinity : parseInt(p));
            if (car.price < min || (max !== Infinity && car.price > max)) {
                return false;
            }
        }

        return true;
    });

    loadCars();
}

// Set minimum dates
function setMinimumDates() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('pickup-date').min = today;
    document.getElementById('return-date').min = today;

    document.getElementById('pickup-date').addEventListener('change', function() {
        document.getElementById('return-date').min = this.value;
        if (document.getElementById('return-date').value < this.value) {
            document.getElementById('return-date').value = this.value;
        }
    });
}

// Scroll to cars section
function scrollToCars() {
    document.getElementById('cars').scrollIntoView({ behavior: 'smooth' });
}

// Authentication functions
function showLoginModal() {
    document.getElementById('login-modal').style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Check credentials
    if (email === 'asadclient456@gmail.com' && password === 'asadclient654@gmail.com') {
        currentUser = {
            email: email,
            name: 'Asad Client',
            type: 'client'
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        closeModal('login-modal');
        showNotification('Login successful!', 'success');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    } else {
        showNotification('Invalid credentials', 'error');
    }
}

function checkAuthStatus() {
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.type === 'client') {
        // User is logged in, update UI
        document.querySelector('.nav-auth').innerHTML = `
            <span>Welcome, ${currentUser.name}</span>
            <button onclick="logout()" class="btn-secondary">Logout</button>
        `;
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    showNotification('Logged out successfully', 'success');
    setTimeout(() => {
        window.location.reload();
    }, 1000);
}

// Booking functions
function bookCar(carId) {
    if (!currentUser) {
        showLoginModal();
        return;
    }

    const car = cars.find(c => c.id === carId);
    if (!car) return;

    // Show booking modal (we'll add this)
    showBookingModal(car);
}

function showBookingModal(car) {
    // Create booking modal dynamically
    const modal = document.createElement('div');
    modal.id = 'booking-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Book ${car.name}</h2>
                <span class="close" onclick="closeModal('booking-modal')">&times;</span>
            </div>
            <form class="auth-form" onsubmit="handleBooking(event, ${car.id})">
                <div class="form-group">
                    <label>Pickup Date</label>
                    <input type="date" id="booking-pickup" class="form-input" required>
                </div>
                <div class="form-group">
                    <label>Return Date</label>
                    <input type="date" id="booking-return" class="form-input" required>
                </div>
                <div class="form-group">
                    <label>Total Cost: $<span id="total-cost">0</span></label>
                </div>
                <button type="submit" class="btn-primary btn-full">Confirm Booking</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'flex';

    // Set minimum dates
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('booking-pickup').min = today;
    document.getElementById('booking-return').min = today;

    // Calculate cost
    function calculateCost() {
        const pickup = document.getElementById('booking-pickup').value;
        const returnD = document.getElementById('booking-return').value;
        if (pickup && returnD) {
            const days = Math.ceil((new Date(returnD) - new Date(pickup)) / (1000 * 60 * 60 * 24));
            document.getElementById('total-cost').textContent = days * car.price;
        }
    }

    document.getElementById('booking-pickup').addEventListener('change', function() {
        document.getElementById('booking-return').min = this.value;
        calculateCost();
    });
    document.getElementById('booking-return').addEventListener('change', calculateCost);
}

function handleBooking(event, carId) {
    event.preventDefault();

    const pickup = document.getElementById('booking-pickup').value;
    const returnD = document.getElementById('booking-return').value;

    if (new Date(returnD) <= new Date(pickup)) {
        showNotification('Return date must be after pickup date', 'error');
        return;
    }

    const car = cars.find(c => c.id === carId);
    const days = Math.ceil((new Date(returnD) - new Date(pickup)) / (1000 * 60 * 60 * 24));
    const totalPrice = days * car.price;

    const booking = {
        id: Date.now(),
        carId: carId,
        carName: car.name,
        pickupDate: pickup,
        returnDate: returnD,
        duration: days,
        totalPrice: totalPrice,
        status: 'pending',
        bookingDate: new Date().toLocaleDateString(),
        clientEmail: currentUser.email
    };

    // Save booking
    const bookings = JSON.parse(localStorage.getItem('clientBookings')) || [];
    bookings.push(booking);
    localStorage.setItem('clientBookings', JSON.stringify(bookings));

    closeModal('booking-modal');
    showNotification('Booking confirmed! Check My Bookings for details.', 'success');
}

// Contact form
function handleContactSubmit(event) {
    event.preventDefault();
    showNotification('Your message has been sent successfully!', 'success');
    event.target.reset();
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block';
    notification.style.background = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6';

    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Make functions global
window.showLoginModal = showLoginModal;
window.closeModal = closeModal;
window.handleLogin = handleLogin;
window.logout = logout;
window.bookCar = bookCar;
window.scrollToCars = scrollToCars;
window.handleContactSubmit = handleContactSubmit;
window.showBookingModal = showBookingModal;
window.handleBooking = handleBooking;