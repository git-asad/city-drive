// City Drive - Client Dashboard JavaScript
console.log("Client Script loaded!"); // Temporary test marker

// Global variables
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
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
    setupSearchForm();
});

// Check if user is authenticated
function checkAuthentication() {
    if (currentUser && currentUser.type === 'client') {
        // Show authenticated user UI
        const userMenu = document.getElementById('user-menu');
        const guestMenu = document.getElementById('guest-menu');
        const userName = document.getElementById('user-name');
        const welcomeName = document.getElementById('welcome-name');
        const profileName = document.getElementById('profile-name');
        const profileEmail = document.getElementById('profile-email');
        const bookings = document.getElementById('bookings');

        if (userMenu) userMenu.style.display = 'flex';
        if (guestMenu) guestMenu.style.display = 'none';
        if (userName) userName.textContent = currentUser.name;
        if (welcomeName) welcomeName.textContent = currentUser.name;
        if (profileName) profileName.textContent = currentUser.name;
        if (profileEmail) profileEmail.textContent = currentUser.email;

        // Show bookings section
        if (bookings) bookings.style.display = 'block';
    } else {
        // Show guest UI
        const userMenu = document.getElementById('user-menu');
        const guestMenu = document.getElementById('guest-menu');
        const welcomeName = document.getElementById('welcome-name');
        const bookings = document.getElementById('bookings');

        if (userMenu) userMenu.style.display = 'none';
        if (guestMenu) guestMenu.style.display = 'flex';
        if (welcomeName) welcomeName.textContent = 'Guest';

        // Hide bookings section for guests
        if (bookings) bookings.style.display = 'none';
    }
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            navigateToSection(targetId);
        });
    });

    // Logout
    const logoutBtn = document.querySelector('.btn-secondary');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for subscribing! You will receive our latest offers.');
        });
    }
}

// Setup search form
function setupSearchForm() {
    const pickupLocation = document.getElementById('pickup-location');
    const locationDisplay = document.getElementById('location-display');
    const pickupDate = document.getElementById('pickup-date');
    const returnDate = document.getElementById('return-date');
    const searchForm = document.querySelector('.search-form');

    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    pickupDate.min = today;

    // Update location display
    pickupLocation.addEventListener('change', function() {
        locationDisplay.textContent = this.value || 'Please Select Location';
    });

    // Update return date minimum when pickup changes
    pickupDate.addEventListener('change', function() {
        returnDate.min = this.value;
    });

    // Handle search form submission
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const location = pickupLocation.value;
        const startDate = pickupDate.value;
        const endDate = returnDate.value;

        if (!location || !startDate || !endDate) {
            alert('Please fill in all search fields');
            return;
        }

        if (new Date(endDate) <= new Date(startDate)) {
            alert('Return date must be after pickup date');
            return;
        }

        // Filter cars by location and availability
        const availableCars = sampleCars.filter(car =>
            car.location.toLowerCase().includes(location.toLowerCase().split(',')[0])
        );

        if (availableCars.length > 0) {
            displayCars(availableCars, 'featured-cars');
            alert(`Found ${availableCars.length} cars available in ${location} for your dates!`);
        } else {
            alert(`No cars available in ${location} for the selected dates. Please try a different location.`);
        }
    });
}

// Navigate between sections
function navigateToSection(sectionId) {
    // Update active nav
    document.querySelectorAll('.nav a').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`.nav a[href="#${sectionId}"]`).classList.add('active');

    // Scroll to section
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Load dashboard data
function loadDashboard() {
    // Load featured cars
    displayCars(sampleCars.slice(0, 6), 'featured-cars');
}

// Load cars data
function loadCars() {
    cars = sampleCars;
}

// Load bookings data
function loadBookings() {
    if (!currentUser) return;

    // Sample bookings data
    bookings = [
        {
            id: '1',
            car: sampleCars[0],
            pickupDate: '2025-06-13',
            returnDate: '2025-06-14',
            status: 'confirmed',
            price: 300
        },
        {
            id: '2',
            car: sampleCars[1],
            pickupDate: '2025-06-12',
            returnDate: '2025-06-12',
            status: 'pending',
            price: 130
        }
    ];

    displayBookings(bookings, 'bookings-list');
}

// Display cars in grid
function displayCars(carsToShow, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    carsToShow.forEach(car => {
        const carCard = document.createElement('div');
        carCard.className = 'car-card';
        carCard.innerHTML = `
            <div class="car-image">
                <img src="${car.image}" alt="${car.brand} ${car.model}" onerror="this.src='../assets/main_car.png'">
            </div>
            <div class="car-info">
                <h3>${car.brand} ${car.model}</h3>
                <div class="car-details">
                    <span class="car-price">$${car.pricePerDay}/day</span>
                    <span class="car-location">${car.location}</span>
                </div>
                <button class="book-btn" onclick="bookCar('${car._id}')">Book Now</button>
            </div>
        `;
        container.appendChild(carCard);
    });
}

// Display bookings
function displayBookings(bookingsToShow, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    if (bookingsToShow.length === 0) {
        container.innerHTML = '<p>No bookings found.</p>';
        return;
    }

    bookingsToShow.forEach(booking => {
        const bookingCard = document.createElement('div');
        bookingCard.className = 'booking-card';
        bookingCard.innerHTML = `
            <div class="booking-image">
                <img src="${booking.car.image}" alt="${booking.car.brand} ${booking.car.model}" onerror="this.src='../assets/main_car.png'">
            </div>
            <div class="booking-info">
                <h3>${booking.car.brand} ${booking.car.model}</h3>
                <div class="booking-details">
                    <span>Dates: ${booking.pickupDate} - ${booking.returnDate}</span>
                    <span class="booking-status status-${booking.status}">${booking.status}</span>
                </div>
                <p>Total: $${booking.price}</p>
            </div>
        `;
        container.appendChild(bookingCard);
    });
}

// Go to login page
function goToLogin() {
    window.location.href = '../login.html';
}

// Book a car
function bookCar(carId) {
    // Check if user is logged in
    if (!currentUser || currentUser.type !== 'client') {
        alert('Please login to book a car.');
        goToLogin();
        return;
    }

    const car = cars.find(c => c._id === carId);
    if (!car) return;

    // Simple booking simulation
    const booking = {
        id: Date.now().toString(),
        car: car,
        pickupDate: document.getElementById('pickup-date').value || '2025-06-15',
        returnDate: document.getElementById('return-date').value || '2025-06-16',
        status: 'pending',
        price: car.pricePerDay * 2 // 2 days default
    };

    bookings.push(booking);
    displayBookings(bookings, 'bookings-list');

    alert(`Booking request submitted for ${car.brand} ${car.model}!\nTotal: $${booking.price}\nStatus: ${booking.status.toUpperCase()}\n\nThe owner will review your request.`);
}

// Logout function
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    window.location.href = '../login.html';
}