// City Drive - Owner Dashboard JavaScript
console.log("Owner Script loaded!"); // Temporary test marker

// Global variables
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let currentSection = 'dashboard';
let cars = [];
let bookings = [];

// Sample car data (simulating the dummyCarData from assets)
const sampleCars = [
    {
        _id: "1",
        brand: "BMW",
        model: "X5",
        image: "../assets/car_image1.png",
        year: 2006,
        category: "SUV",
        seating_capacity: 4,
        fuel_type: "Hybrid",
        transmission: "Semi-Automatic",
        pricePerDay: 300,
        location: "New York",
        description: "The BMW X5 is a mid-size luxury SUV produced by BMW."
    },
    {
        _id: "2",
        brand: "Toyota",
        model: "Corolla",
        image: "../assets/car_image2.png",
        year: 2021,
        category: "Sedan",
        seating_capacity: 4,
        fuel_type: "Diesel",
        transmission: "Manual",
        pricePerDay: 130,
        location: "Chicago",
        description: "The Toyota Corolla is a mid-size luxury sedan."
    },
    {
        _id: "3",
        brand: "Jeep",
        model: "Wrangler",
        image: "../assets/car_image3.png",
        year: 2023,
        category: "SUV",
        seating_capacity: 4,
        fuel_type: "Hybrid",
        transmission: "Automatic",
        pricePerDay: 200,
        location: "Los Angeles",
        description: "The Jeep Wrangler is a mid-size luxury SUV."
    },
    {
        _id: "4",
        brand: "Ford",
        model: "Neo 6",
        image: "../assets/car_image4.png",
        year: 2022,
        category: "Sedan",
        seating_capacity: 2,
        fuel_type: "Diesel",
        transmission: "Semi-Automatic",
        pricePerDay: 209,
        location: "Houston",
        description: "This is a mid-size luxury sedan."
    },
    {
        _id: "5",
        brand: "BMW",
        model: "X5",
        image: "../assets/bmw_new.png",
        year: 2023,
        category: "SUV",
        seating_capacity: 5,
        fuel_type: "Gasoline",
        transmission: "Automatic",
        pricePerDay: 350,
        location: "Miami",
        description: "Latest BMW X5 with premium features."
    },
    {
        _id: "6",
        brand: "Mercedes",
        model: "C-Class",
        image: "../assets/main_car.png",
        year: 2022,
        category: "Sedan",
        seating_capacity: 5,
        fuel_type: "Gasoline",
        transmission: "Automatic",
        pricePerDay: 280,
        location: "Seattle",
        description: "Elegant Mercedes C-Class sedan."
    }
];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    setupEventListeners();
    loadDashboard();
    loadCars();
    loadBookings();
});

// Check if user is authenticated as owner
function checkAuthentication() {
    if (currentUser && currentUser.type === 'owner') {
        // Show authenticated owner UI
        const ownerName = document.getElementById('owner-name');
        const ownerEmail = document.getElementById('owner-email');

        if (ownerName) ownerName.textContent = currentUser.name;
        if (ownerEmail) ownerEmail.textContent = currentUser.email;
        showSection('dashboard');
    } else {
        // Redirect to login if not authenticated as owner
        window.location.href = '../login.html';
    }
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const section = this.id.replace('nav-', '');
            navigateTo(section);
        });
    });

    // Add car form
    const addCarForm = document.getElementById('add-car-form');
    if (addCarForm) {
        addCarForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addNewCar();
        });
    }
}

// Navigate between sections
function navigateTo(section) {
    // Update navigation active state
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.getElementById(`nav-${section}`).classList.add('active');

    // Show section
    showSection(section);
}

// Show specific section
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    const targetSection = document.getElementById(`${sectionId}-content`);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionId;

        // Load section-specific data
        switch(sectionId) {
            case 'dashboard':
                loadDashboard();
                break;
            case 'manage-cars':
                loadOwnerCars();
                break;
            case 'manage-bookings':
                loadAllBookings();
                break;
        }
    }
}

// Load dashboard data
function loadDashboard() {
    // Calculate statistics
    const totalCars = cars.length;
    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter(b => b.status === 'pending').length;
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
    const monthlyRevenue = bookings
        .filter(b => b.status === 'confirmed')
        .reduce((sum, b) => sum + (b.price || 0), 0);

    // Update UI
    document.getElementById('total-cars').textContent = totalCars;
    document.getElementById('total-bookings').textContent = totalBookings;
    document.getElementById('pending-bookings').textContent = pendingBookings;
    document.getElementById('confirmed-bookings').textContent = confirmedBookings;
    document.getElementById('monthly-revenue').textContent = formatCurrency(monthlyRevenue);

    // Load recent bookings
    loadRecentBookings();
}

// Load cars data
function loadCars() {
    cars = sampleCars;
}

// Load bookings data
function loadBookings() {
    // Sample bookings data
    bookings = [
        {
            _id: '1',
            car: sampleCars[0],
            customerInfo: { firstName: 'John', lastName: 'Doe' },
            pickupDate: '2025-06-13',
            returnDate: '2025-06-14',
            pickupLocation: 'New York',
            status: 'confirmed',
            price: 300
        },
        {
            _id: '2',
            car: sampleCars[1],
            customerInfo: { firstName: 'Jane', lastName: 'Smith' },
            pickupDate: '2025-06-12',
            returnDate: '2025-06-12',
            pickupLocation: 'Chicago',
            status: 'pending',
            price: 130
        },
        {
            _id: '3',
            car: sampleCars[2],
            customerInfo: { firstName: 'Bob', lastName: 'Johnson' },
            pickupDate: '2025-06-11',
            returnDate: '2025-06-12',
            pickupLocation: 'Los Angeles',
            status: 'confirmed',
            price: 400
        }
    ];
}

// Load recent bookings for dashboard
function loadRecentBookings() {
    const recentBookings = bookings.slice(-5).reverse();
    const container = document.getElementById('recent-bookings');

    if (recentBookings.length === 0) {
        container.innerHTML = '<div class="booking-item"><p>No bookings yet</p></div>';
        return;
    }

    container.innerHTML = '';

    recentBookings.forEach(booking => {
        const bookingItem = document.createElement('div');
        bookingItem.className = 'booking-item';
        bookingItem.innerHTML = `
            <div class="booking-content">
                <div class="booking-left">
                    <div class="booking-image">
                        <img src="${booking.car.image}" alt="${booking.car.brand}" onerror="this.src='../assets/main_car.png'">
                    </div>
                    <div class="booking-details">
                        <h4>${booking.car.brand} ${booking.car.model}</h4>
                        <p>${formatDate(booking.pickupDate)} - ${formatDate(booking.returnDate)}</p>
                        <p>${booking.pickupLocation}</p>
                        ${booking.customerInfo ? `<p>Customer: ${booking.customerInfo.firstName} ${booking.customerInfo.lastName}</p>` : ''}
                    </div>
                </div>
                <div class="booking-right">
                    <div class="booking-price">${formatCurrency(booking.price)}</div>
                    <span class="booking-status status-${booking.status}">${booking.status}</span>
                    ${booking.status === 'pending' ? `
                        <div class="booking-actions">
                            <button onclick="acceptBooking('${booking._id}')" class="btn-small btn-accept">Accept</button>
                            <button onclick="rejectBooking('${booking._id}')" class="btn-small btn-reject">Reject</button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        container.appendChild(bookingItem);
    });
}

// Load owner's cars
function loadOwnerCars() {
    const container = document.getElementById('owner-cars-list');
    container.innerHTML = '';

    cars.forEach(car => {
        const carItem = document.createElement('div');
        carItem.className = 'car-item';
        carItem.innerHTML = `
            <img src="${car.image}" alt="${car.brand} ${car.model}" onerror="this.src='../assets/main_car.png'">
            <div class="car-item-details">
                <h4>${car.brand} ${car.model}</h4>
                <p>$${car.pricePerDay}/day</p>
                <p>${car.location}</p>
                <p>${car.year} • ${car.fuel_type}</p>
            </div>
            <div class="car-item-actions">
                <button onclick="editCar('${car._id}')" class="btn-secondary">Edit</button>
                <button onclick="deleteCar('${car._id}')" class="btn-small btn-reject">Delete</button>
            </div>
        `;
        container.appendChild(carItem);
    });
}

// Load all bookings
function loadAllBookings() {
    const container = document.getElementById('all-bookings-list');
    container.innerHTML = '';

    if (bookings.length === 0) {
        container.innerHTML = '<div class="booking-item"><p>No bookings found</p></div>';
        return;
    }

    bookings.forEach(booking => {
        const bookingItem = document.createElement('div');
        bookingItem.className = 'booking-item';
        bookingItem.innerHTML = `
            <div class="booking-content">
                <div class="booking-left">
                    <div class="booking-image">
                        <img src="${booking.car.image}" alt="${booking.car.brand}" onerror="this.src='../assets/main_car.png'">
                    </div>
                    <div class="booking-details">
                        <h4>${booking.car.brand} ${booking.car.model}</h4>
                        <p>${formatDate(booking.pickupDate)} - ${formatDate(booking.returnDate)}</p>
                        <p>${booking.pickupLocation}</p>
                        ${booking.customerInfo ? `<p>Customer: ${booking.customerInfo.firstName} ${booking.customerInfo.lastName}</p>` : ''}
                    </div>
                </div>
                <div class="booking-right">
                    <div class="booking-price">${formatCurrency(booking.price)}</div>
                    <span class="booking-status status-${booking.status}">${booking.status}</span>
                    ${booking.status === 'pending' ? `
                        <div class="booking-actions">
                            <button onclick="acceptBooking('${booking._id}')" class="btn-small btn-accept">Accept</button>
                            <button onclick="rejectBooking('${booking._id}')" class="btn-small btn-reject">Reject</button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        container.appendChild(bookingItem);
    });
}

// Add new car
function addNewCar() {
    const carName = document.getElementById('car-name').value;
    const carModel = document.getElementById('car-model').value;
    const carPrice = parseFloat(document.getElementById('car-price').value);
    const carLocation = document.getElementById('car-location').value;

    if (!carName || !carModel || !carPrice || !carLocation) {
        alert('Please fill in all fields');
        return;
    }

    const newCar = {
        _id: Date.now().toString(),
        brand: carName,
        model: carModel,
        image: '../assets/main_car.png', // Default image
        year: new Date().getFullYear(),
        category: 'SUV',
        seating_capacity: 5,
        fuel_type: 'Gasoline',
        transmission: 'Automatic',
        pricePerDay: carPrice,
        location: carLocation,
        description: `Beautiful ${carName} ${carModel} available for rent`
    };

    cars.push(newCar);

    // Clear form
    document.getElementById('car-name').value = '';
    document.getElementById('car-model').value = '';
    document.getElementById('car-price').value = '';
    document.getElementById('car-location').value = '';

    alert('Car added successfully!');
    loadDashboard(); // Refresh stats
}

// Accept booking
function acceptBooking(bookingId) {
    const booking = bookings.find(b => b._id === bookingId);
    if (booking) {
        booking.status = 'confirmed';
        alert('Booking accepted successfully!');
        loadDashboard(); // Refresh stats and recent bookings
    }
}

// Reject booking
function rejectBooking(bookingId) {
    const booking = bookings.find(b => b._id === bookingId);
    if (booking) {
        booking.status = 'cancelled';
        alert('Booking rejected.');
        loadDashboard(); // Refresh stats and recent bookings
    }
}

// Edit car (placeholder)
function editCar(carId) {
    alert('Edit car functionality - would open edit form');
}

// Delete car (placeholder)
function deleteCar(carId) {
    if (confirm('Are you sure you want to delete this car?')) {
        cars = cars.filter(c => c._id !== carId);
        alert('Car deleted successfully!');
        loadDashboard(); // Refresh stats
        if (currentSection === 'manage-cars') {
            loadOwnerCars();
        }
    }
}

// Utility functions
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Logout function
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    window.location.href = '../login.html';
}