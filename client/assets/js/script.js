// City Drive Client JavaScript
let filteredCars = [];
let currentUser = null;
let cars = [];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadCarsData();
    checkAuthStatus();
    initializePage();
});

// Load cars data
async function loadCarsData() {
    try {
        const response = await fetch('/client/cars.js');
        const script = await response.text();
        // Extract cars array from the script
        const carsMatch = script.match(/let cars = (\[[\s\S]*?\]);/);
        if (carsMatch) {
            cars = eval(carsMatch[1]);
            filteredCars = [...cars];
            if (document.getElementById('cars-grid')) {
                loadCars();
            }
            if (document.querySelector('.cars-grid')) {
                loadFeaturedCars();
            }
        }
    } catch (error) {
        console.error('Error loading cars data:', error);
        showNotification('Error loading cars data', 'error');
    }
}

// Initialize page-specific functionality
function initializePage() {
    const path = window.location.pathname;

    if (path.includes('index.html') || path === '/' || path.endsWith('/client/')) {
        // Home page
        setMinimumDates();
    } else if (path.includes('cars.html')) {
        // Cars page
        setMinimumDates();
        document.getElementById('clear-filters')?.addEventListener('click', clearFilters);
    } else if (path.includes('dashboard.html')) {
        loadDashboard();
    } else if (path.includes('my-bookings.html')) {
        loadBookings();
    }
}

// Load and display cars
function loadCars() {
    const carsGrid = document.getElementById('cars-grid');
    if (!carsGrid) return;

    carsGrid.innerHTML = '';

    if (filteredCars.length === 0) {
        carsGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No cars available matching your criteria.</p>';
        return;
    }

    filteredCars.forEach(car => {
        const carCard = document.createElement('div');
        carCard.className = 'car-card';
        carCard.innerHTML = `
            <img src="${car.image}" alt="${car.name}" class="car-image" loading="lazy" onerror="this.src='/client/assets/main_car.png'">
            <div class="car-info">
                <h3 class="car-name">${car.name}</h3>
                <div class="car-details">
                    <span>🚗 ${car.category || car.type}</span>
                    <span>⛽ ${car.fuel || 'Petrol'}</span>
                    <span>👥 ${car.seats} seats</span>
                    <span>⚙️ ${car.transmission || 'Auto'}</span>
                </div>
                <div class="car-price">$${car.price}/day</div>
                <button class="btn btn-book" onclick="bookCar(${car.id})">Book Now</button>
            </div>
        `;
        carsGrid.appendChild(carCard);
    });
}

// Load featured cars (3-4 cars)
function loadFeaturedCars() {
    const carsGrid = document.querySelector('.cars-grid');
    if (!carsGrid) return;

    carsGrid.innerHTML = '';
    const featured = cars.slice(0, 4); // First 4 cars

    featured.forEach(car => {
        const carCard = document.createElement('div');
        carCard.className = 'car-card';
        carCard.innerHTML = `
            <img src="${car.image}" alt="${car.name}" class="car-image" loading="lazy" onerror="this.src='/client/assets/main_car.png'">
            <div class="car-info">
                <h3 class="car-name">${car.name}</h3>
                <div class="car-details">
                    <span>🚗 ${car.category || car.type}</span>
                    <span>👥 ${car.seats} seats</span>
                </div>
                <div class="car-price">$${car.price}/day</div>
            </div>
        `;
        carsGrid.appendChild(carCard);
    });
}

// Update filters
function updateFilters() {
    const pickupDate = document.getElementById('pickup-date')?.value;
    const returnDate = document.getElementById('return-date')?.value;
    const carType = document.getElementById('car-type')?.value;
    const priceRange = document.getElementById('price-range')?.value;

    // Validate dates
    if (pickupDate && returnDate && new Date(returnDate) <= new Date(pickupDate)) {
        showNotification('Return date must be after pickup date', 'error');
        document.getElementById('return-date').value = '';
        return;
    }

    filteredCars = cars.filter(car => {
        // Car type filter
        if (carType && car.category.toLowerCase() !== carType.toLowerCase() && car.type.toLowerCase() !== carType.toLowerCase()) {
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

// Clear filters
function clearFilters() {
    document.getElementById('pickup-date').value = '';
    document.getElementById('return-date').value = '';
    document.getElementById('car-type').value = '';
    document.getElementById('price-range').value = '';
    filteredCars = [...cars];
    loadCars();
}

// Set minimum dates
function setMinimumDates() {
    const today = new Date().toISOString().split('T')[0];
    const pickupInputs = document.querySelectorAll('#pickup-date, #booking-pickup');
    const returnInputs = document.querySelectorAll('#return-date, #booking-return');

    pickupInputs.forEach(input => {
        input.min = today;
        input.addEventListener('change', function() {
            returnInputs.forEach(ret => {
                ret.min = this.value;
                if (ret.value < this.value) {
                    ret.value = this.value;
                }
            });
        });
    });
}

// Authentication functions
function showLoginModal() {
    const modal = document.getElementById('login-modal') || createLoginModal();
    modal.classList.add('show');
}

function createLoginModal() {
    const modal = document.createElement('div');
    modal.id = 'login-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Client Login</h2>
                <span class="close" onclick="closeModal('login-modal')">&times;</span>
            </div>
            <form class="auth-form" onsubmit="handleLogin(event)">
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="login-email" class="form-input" required>
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" id="login-password" class="form-input" required>
                </div>
                <button type="submit" class="btn btn-primary btn-full">Login</button>
                <p style="text-align: center; margin-top: 1rem;">
                    Don't have an account? <a href="#" onclick="showRegisterModal()">Register</a>
                </p>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    return modal;
}

function showRegisterModal() {
    closeModal('login-modal');
    const modal = document.getElementById('register-modal') || createRegisterModal();
    modal.classList.add('show');
}

function createRegisterModal() {
    const modal = document.createElement('div');
    modal.id = 'register-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Client Registration</h2>
                <span class="close" onclick="closeModal('register-modal')">&times;</span>
            </div>
            <form class="auth-form" onsubmit="handleRegister(event)">
                <div class="form-group">
                    <label>Name</label>
                    <input type="text" id="register-name" class="form-input" required>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="register-email" class="form-input" required>
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" id="register-password" class="form-input" required>
                </div>
                <button type="submit" class="btn btn-primary btn-full">Register</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    return modal;
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
    }
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

function handleRegister(event) {
    event.preventDefault();

    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    // Save to localStorage (demo only)
    const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    users.push({ name, email, password });
    localStorage.setItem('registeredUsers', JSON.stringify(users));

    closeModal('register-modal');
    showNotification('Registration successful! Please login.', 'success');
}

function checkAuthStatus() {
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.type === 'client') {
        // User is logged in, update UI
        const navAuth = document.querySelector('.nav-auth');
        if (navAuth) {
            navAuth.innerHTML = `
                <span>Welcome, ${currentUser.name}</span>
                <button onclick="logout()" class="btn">Logout</button>
            `;
        }
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    showNotification('Logged out successfully', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
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

    showBookingModal(car);
}

function showBookingModal(car) {
    const modal = document.getElementById('booking-modal') || createBookingModal();
    modal.classList.add('show');

    // Pre-fill car info
    document.getElementById('booking-car-name').textContent = car.name;
    document.getElementById('booking-car-id').value = car.id;
}

function createBookingModal() {
    const modal = document.createElement('div');
    modal.id = 'booking-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Book <span id="booking-car-name"></span></h2>
                <span class="close" onclick="closeModal('booking-modal')">&times;</span>
            </div>
            <form class="booking-form" onsubmit="handleBooking(event)">
                <input type="hidden" id="booking-car-id">
                <div class="form-group">
                    <label>Pickup Date</label>
                    <input type="date" id="booking-pickup" class="form-input" required>
                </div>
                <div class="form-group">
                    <label>Return Date</label>
                    <input type="date" id="booking-return" class="form-input" required>
                </div>
                <div class="form-group">
                    <label>Name</label>
                    <input type="text" id="booking-name" class="form-input" value="${currentUser?.name || ''}" required>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="booking-email" class="form-input" value="${currentUser?.email || ''}" required>
                </div>
                <div class="form-group">
                    <label>Phone</label>
                    <input type="tel" id="booking-phone" class="form-input" required>
                </div>
                <div class="total-cost">
                    Total Cost: $<span id="booking-total">0</span> (including 10% tax)
                </div>
                <button type="submit" class="btn btn-primary btn-full">Proceed to Payment</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    // Set minimum dates and calculate cost
    setMinimumDates();
    const pickupInput = document.getElementById('booking-pickup');
    const returnInput = document.getElementById('booking-return');

    function calculateCost() {
        const pickup = pickupInput.value;
        const returnD = returnInput.value;
        if (pickup && returnD) {
            const days = Math.ceil((new Date(returnD) - new Date(pickup)) / (1000 * 60 * 60 * 24));
            const carId = document.getElementById('booking-car-id').value;
            const car = cars.find(c => c.id == carId);
            if (car) {
                const subtotal = days * car.price;
                const tax = subtotal * 0.1;
                const total = subtotal + tax;
                document.getElementById('booking-total').textContent = total.toFixed(2);
            }
        }
    }

    pickupInput.addEventListener('change', calculateCost);
    returnInput.addEventListener('change', calculateCost);

    return modal;
}

function handleBooking(event) {
    event.preventDefault();

    const carId = document.getElementById('booking-car-id').value;
    const pickup = document.getElementById('booking-pickup').value;
    const returnD = document.getElementById('booking-return').value;
    const name = document.getElementById('booking-name').value;
    const email = document.getElementById('booking-email').value;
    const phone = document.getElementById('booking-phone').value;

    if (new Date(returnD) <= new Date(pickup)) {
        showNotification('Return date must be after pickup date', 'error');
        return;
    }

    // Check availability (simulate)
    const bookings = JSON.parse(localStorage.getItem('clientBookings')) || [];
    const conflict = bookings.some(b =>
        b.carId == carId &&
        b.status !== 'Cancelled' &&
        ((new Date(pickup) >= new Date(b.pickupDate) && new Date(pickup) <= new Date(b.returnDate)) ||
         (new Date(returnD) >= new Date(b.pickupDate) && new Date(returnD) <= new Date(b.returnDate)))
    );

    if (conflict) {
        showNotification('Car not available for selected dates', 'error');
        return;
    }

    const car = cars.find(c => c.id == carId);
    const days = Math.ceil((new Date(returnD) - new Date(pickup)) / (1000 * 60 * 60 * 24));
    const subtotal = days * car.price;
    const tax = subtotal * 0.1;
    const totalPrice = subtotal + tax;

    // Show payment modal
    showPaymentModal({
        carId, pickup, returnD, name, email, phone, days, subtotal, tax, totalPrice, carName: car.name
    });
}

function showPaymentModal(bookingData) {
    closeModal('booking-modal');
    const modal = document.getElementById('payment-modal') || createPaymentModal();
    modal.classList.add('show');

    // Store booking data
    window.pendingBooking = bookingData;
}

function createPaymentModal() {
    const modal = document.createElement('div');
    modal.id = 'payment-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Payment Details</h2>
                <span class="close" onclick="closeModal('payment-modal')">&times;</span>
            </div>
            <form class="booking-form" onsubmit="handlePayment(event)">
                <div class="form-group">
                    <label>Card Number</label>
                    <input type="text" id="card-number" class="form-input" placeholder="1234 5678 9012 3456" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Expiry Date</label>
                        <input type="text" id="card-expiry" class="form-input" placeholder="MM/YY" required>
                    </div>
                    <div class="form-group">
                        <label>CVV</label>
                        <input type="text" id="card-cvv" class="form-input" placeholder="123" required>
                    </div>
                </div>
                <button type="submit" class="btn btn-primary btn-full">Complete Booking</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    return modal;
}

function handlePayment(event) {
    event.preventDefault();

    // Simulate payment processing
    showNotification('Processing payment...', 'info');

    setTimeout(() => {
        const bookingData = window.pendingBooking;
        const booking = {
            id: Date.now(),
            ...bookingData,
            status: 'Confirmed',
            bookingDate: new Date().toLocaleDateString(),
            clientEmail: currentUser.email
        };

        // Save booking
        const bookings = JSON.parse(localStorage.getItem('clientBookings')) || [];
        bookings.push(booking);
        localStorage.setItem('clientBookings', JSON.stringify(bookings));

        closeModal('payment-modal');
        showNotification('Booking confirmed successfully!', 'success');

        setTimeout(() => {
            window.location.href = 'my-bookings.html';
        }, 2000);
    }, 2000);
}

// Dashboard functions
function loadDashboard() {
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    const bookings = JSON.parse(localStorage.getItem('clientBookings')) || [];
    const userBookings = bookings.filter(b => b.clientEmail === currentUser.email);

    document.getElementById('total-bookings').textContent = userBookings.length;
    document.getElementById('total-spent').textContent = `$${userBookings.reduce((sum, b) => sum + b.totalPrice, 0).toFixed(2)}`;
}

// My Bookings functions
function loadBookings() {
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    const bookings = JSON.parse(localStorage.getItem('clientBookings')) || [];
    const userBookings = bookings.filter(b => b.clientEmail === currentUser.email);

    const tbody = document.querySelector('.bookings-table tbody');
    tbody.innerHTML = '';

    if (userBookings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No bookings found. <a href="cars.html">Browse cars</a> to make your first booking.</td></tr>';
        return;
    }

    userBookings.forEach(booking => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${cars.find(c => c.id == booking.carId)?.image || '/client/assets/main_car.png'}" alt="${booking.carName}" style="width: 50px; height: 30px; object-fit: cover;"></td>
            <td>${booking.carName}</td>
            <td>${booking.pickupDate}</td>
            <td>${booking.returnDate}</td>
            <td>$${booking.totalPrice.toFixed(2)}</td>
            <td>${booking.status}</td>
            <td class="booking-actions">
                <button onclick="viewBookingDetails(${booking.id})" class="btn">View</button>
                ${booking.status !== 'Cancelled' ? `<button onclick="cancelBooking(${booking.id})" class="btn" style="background: #ef4444;">Cancel</button>` : ''}
            </td>
        `;
        tbody.appendChild(row);
    });
}

function viewBookingDetails(bookingId) {
    const bookings = JSON.parse(localStorage.getItem('clientBookings')) || [];
    const booking = bookings.find(b => b.id === bookingId);

    if (booking) {
        const modal = document.getElementById('booking-details-modal') || createBookingDetailsModal();
        modal.classList.add('show');

        document.getElementById('details-car').textContent = booking.carName;
        document.getElementById('details-pickup').textContent = booking.pickupDate;
        document.getElementById('details-return').textContent = booking.returnDate;
        document.getElementById('details-duration').textContent = `${booking.days} days`;
        document.getElementById('details-total').textContent = `$${booking.totalPrice.toFixed(2)}`;
        document.getElementById('details-status').textContent = booking.status;
    }
}

function createBookingDetailsModal() {
    const modal = document.createElement('div');
    modal.id = 'booking-details-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Booking Details</h2>
                <span class="close" onclick="closeModal('booking-details-modal')">&times;</span>
            </div>
            <div>
                <p><strong>Car:</strong> <span id="details-car"></span></p>
                <p><strong>Pickup Date:</strong> <span id="details-pickup"></span></p>
                <p><strong>Return Date:</strong> <span id="details-return"></span></p>
                <p><strong>Duration:</strong> <span id="details-duration"></span></p>
                <p><strong>Total Cost:</strong> <span id="details-total"></span></p>
                <p><strong>Status:</strong> <span id="details-status"></span></p>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    return modal;
}

function cancelBooking(bookingId) {
    if (confirm('Are you sure you want to cancel this booking?')) {
        const bookings = JSON.parse(localStorage.getItem('clientBookings')) || [];
        const booking = bookings.find(b => b.id === bookingId);
        if (booking) {
            booking.status = 'Cancelled';
            localStorage.setItem('clientBookings', JSON.stringify(bookings));
            loadBookings();
            showNotification('Booking cancelled successfully', 'success');
        }
    }
}

// Contact form
function handleContactSubmit(event) {
    event.preventDefault();

    const subject = document.getElementById('contact-subject').value;
    if (!subject) {
        showNotification('Please select a subject', 'error');
        return;
    }

    // Simulate sending
    showNotification('Message sent successfully!', 'success');
    event.target.reset();
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification') || createNotification();
    notification.textContent = message;
    notification.style.display = 'block';
    notification.className = `notification ${type}`;

    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

function createNotification() {
    const notification = document.createElement('div');
    notification.id = 'notification';
    notification.className = 'notification';
    document.body.appendChild(notification);
    return notification;
}

// Utility functions
function scrollToSection(sectionId) {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
}

// Make functions global
window.showLoginModal = showLoginModal;
window.closeModal = closeModal;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.logout = logout;
window.bookCar = bookCar;
window.showBookingModal = showBookingModal;
window.handleBooking = handleBooking;
window.handlePayment = handlePayment;
window.handleContactSubmit = handleContactSubmit;
window.updateFilters = updateFilters;
window.clearFilters = clearFilters;
window.viewBookingDetails = viewBookingDetails;
window.cancelBooking = cancelBooking;
window.scrollToSection = scrollToSection;