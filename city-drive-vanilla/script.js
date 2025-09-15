// City Drive - Complete Car Rental App JavaScript
// This file contains all the Firebase-powered functionality for the car rental system

// Import Firebase modules from window (loaded in index.html)
const {
    initializeApp,
    getAnalytics,
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    firebaseSignOut,
    onAuthStateChanged,
    getFirestore,
    collection,
    addDoc,
    getDocs,
    doc,
    setDoc,
    getDoc,
    query,
    where,
    updateDoc,
    deleteDoc
} = window.firebaseModules;

// TODO: Replace with your actual Firebase project configuration
// Get these values from your Firebase Console > Project Settings > General > Your apps
const firebaseConfig = {
    apiKey: "AIzaSyBf-ZFhG8tesNnulOqO_zppcU5wC9pj6MM",
    authDomain: "city-drive-953c0.firebaseapp.com",
    projectId: "city-drive-953c0",
    storageBucket: "city-drive-953c0.firebasestorage.app",
    messagingSenderId: "83138806155",
    appId: "1:83138806155:web:e7d967dbeddee9e47daf8e",
    measurementId: "G-RB3LNG1J3K"
};

// Global variables to hold Firebase instances
let app;
let auth;
let db;
let analytics;
let currentUser = null;
let currentUserRole = null;

// Initialize Firebase
function initializeFirebase() {
    try {
        console.log('🔥 Initializing Firebase...');

        // Initialize Firebase App
        app = initializeApp(firebaseConfig);
        console.log('✅ Firebase App initialized');

        // Initialize Firebase Auth
        auth = getAuth(app);
        console.log('✅ Firebase Auth initialized');

        // Initialize Firestore
        db = getFirestore(app);
        console.log('✅ Firestore initialized');

        // Initialize Analytics (optional)
        analytics = getAnalytics(app);
        console.log('✅ Firebase Analytics initialized');

        // Update UI
        updateFirebaseStatus('✅ Firebase initialized successfully!');
        logToConsole('Firebase initialized successfully!');

        // Set up auth state listener
        setupAuthListener();

    } catch (error) {
        console.error('❌ Firebase initialization failed:', error);
        updateFirebaseStatus('❌ Firebase initialization failed: ' + error.message);
        logToConsole('Firebase initialization failed: ' + error.message);
    }
}

// Set up authentication state listener
function setupAuthListener() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            console.log('👤 User signed in:', user.email);
            currentUser = user;
            await loadUserRole();
            updateUserStatus(`✅ Signed in as: ${user.email} (${currentUserRole})`);
            showDashboard(currentUserRole);
            logToConsole(`User signed in: ${user.email} (Role: ${currentUserRole})`);
        } else {
            console.log('👤 User signed out');
            currentUser = null;
            currentUserRole = null;
            updateUserStatus('Not signed in');
            hideDashboards();
            logToConsole('User signed out');
        }
    });
}

// Load user role from Firestore
async function loadUserRole() {
    if (!currentUser) return;

    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('uid', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0].data();
            currentUserRole = userDoc.role || 'customer';
        } else {
            currentUserRole = 'customer';
        }
    } catch (error) {
        console.error('Error loading user role:', error);
        currentUserRole = 'customer';
    }
}

// Show appropriate dashboard based on role
function showDashboard(role) {
    hideDashboards();
    if (role === 'owner') {
        document.getElementById('owner-dashboard').classList.add('active');
    } else {
        document.getElementById('customer-dashboard').classList.add('active');
    }
}

// Hide all dashboards
function hideDashboards() {
    document.getElementById('customer-dashboard').classList.remove('active');
    document.getElementById('owner-dashboard').classList.remove('active');
}

// Authentication Functions
async function signUp() {
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const role = document.querySelector('input[name="signup-role"]:checked').value;

    if (!email || !password) {
        alert('Please enter both email and password');
        return;
    }

    try {
        console.log('📝 Creating user account...');
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log('✅ User account created:', user.email);
        logToConsole(`User account created: ${user.email}`);

        // Create user document in Firestore
        await createUserDocument(user, role);

        alert('Account created successfully!');

    } catch (error) {
        console.error('❌ Sign up failed:', error);
        alert('Sign up failed: ' + error.message);
        logToConsole('Sign up failed: ' + error.message);
    }
}

async function signIn() {
    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;

    if (!email || !password) {
        alert('Please enter both email and password');
        return;
    }

    try {
        console.log('🔑 Signing in user...');
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log('✅ User signed in:', user.email);
        logToConsole(`User signed in: ${user.email}`);

        alert('Signed in successfully!');

    } catch (error) {
        console.error('❌ Sign in failed:', error);
        alert('Sign in failed: ' + error.message);
        logToConsole('Sign in failed: ' + error.message);
    }
}

async function signOut() {
    try {
        console.log('🚪 Signing out user...');
        await firebaseSignOut(auth);
        console.log('✅ User signed out');
        logToConsole('User signed out successfully');
    } catch (error) {
        console.error('❌ Sign out failed:', error);
        alert('Sign out failed: ' + error.message);
        logToConsole('Sign out failed: ' + error.message);
    }
}

// Firestore Functions
async function createUserDocument(user, role = 'customer') {
    try {
        console.log('📄 Creating user document in Firestore...');

        const userDoc = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email.split('@')[0],
            role: role,
            createdAt: new Date(),
            profileComplete: false
        };

        // Add user document to 'users' collection
        const docRef = await addDoc(collection(db, 'users'), userDoc);

        console.log('✅ User document created with ID:', docRef.id);
        logToConsole(`User document created: ${docRef.id} (Role: ${role})`);

    } catch (error) {
        console.error('❌ Failed to create user document:', error);
        logToConsole('Failed to create user document: ' + error.message);
    }
}

async function addSampleCar() {
    if (!currentUser || currentUserRole !== 'owner') {
        alert('Only car owners can add cars');
        return;
    }

    const carName = document.getElementById('car-name').value;
    const carModel = document.getElementById('car-model').value;
    const carPrice = parseFloat(document.getElementById('car-price').value);
    const carLocation = document.getElementById('car-location').value;

    if (!carName || !carModel || !carPrice || !carLocation) {
        alert('Please fill in all car details');
        return;
    }

    try {
        console.log('🚗 Adding car to Firestore...');

        const carDoc = {
            name: carName,
            model: carModel,
            pricePerDay: carPrice,
            location: carLocation,
            ownerId: currentUser.uid,
            category: 'SUV',
            fuelType: 'Gasoline',
            transmission: 'Automatic',
            seatingCapacity: 5,
            available: true,
            description: `Beautiful ${carName} ${carModel} available for rent`,
            features: ['Air Conditioning', 'GPS', 'Bluetooth'],
            images: ['placeholder-image.jpg'],
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Add car document to 'cars' collection
        const docRef = await addDoc(collection(db, 'cars'), carDoc);

        console.log('✅ Car added with ID:', docRef.id);
        logToConsole(`Car added: ${carName} ${carModel} (ID: ${docRef.id})`);

        // Clear form
        document.getElementById('car-name').value = '';
        document.getElementById('car-model').value = '';
        document.getElementById('car-price').value = '';
        document.getElementById('car-location').value = '';

        alert('Car added successfully!');

        // Refresh owner's cars list
        getOwnerCars();

    } catch (error) {
        console.error('❌ Failed to add car:', error);
        alert('Failed to add car: ' + error.message);
        logToConsole('Failed to add car: ' + error.message);
    }
}

async function getAllCars() {
    try {
        console.log('📋 Fetching all available cars from Firestore...');

        const carsRef = collection(db, 'cars');
        const q = query(carsRef, where('available', '==', true));
        const querySnapshot = await getDocs(q);
        const cars = [];

        querySnapshot.forEach((doc) => {
            cars.push({ id: doc.id, ...doc.data() });
        });

        console.log(`✅ Retrieved ${cars.length} available cars`);
        logToConsole(`Retrieved ${cars.length} available cars from database`);

        // Display cars based on current dashboard
        if (currentUserRole === 'owner') {
            displayCars(cars, 'owner-cars-list');
        } else {
            displayCars(cars, 'customer-cars-list');
        }

    } catch (error) {
        console.error('❌ Failed to fetch cars:', error);
        logToConsole('Failed to fetch cars: ' + error.message);
        const listId = currentUserRole === 'owner' ? 'owner-cars-list' : 'customer-cars-list';
        document.getElementById(listId).textContent = 'Error loading cars: ' + error.message;
    }
}

async function getOwnerCars() {
    if (!currentUser || currentUserRole !== 'owner') return;

    try {
        console.log('📋 Fetching owner cars from Firestore...');

        const carsRef = collection(db, 'cars');
        const q = query(carsRef, where('ownerId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        const cars = [];

        querySnapshot.forEach((doc) => {
            cars.push({ id: doc.id, ...doc.data() });
        });

        console.log(`✅ Retrieved ${cars.length} owner cars`);
        logToConsole(`Retrieved ${cars.length} owner cars from database`);

        displayCars(cars, 'owner-cars-list');

    } catch (error) {
        console.error('❌ Failed to fetch owner cars:', error);
        logToConsole('Failed to fetch owner cars: ' + error.message);
        document.getElementById('owner-cars-list').textContent = 'Error loading cars: ' + error.message;
    }
}

async function createBooking() {
    if (!currentUser) {
        alert('Please sign in to book a car');
        return;
    }

    const carId = document.getElementById('book-car-id').value;
    const startDate = new Date(document.getElementById('book-start-date').value);
    const endDate = new Date(document.getElementById('book-end-date').value);

    if (!carId || !startDate || !endDate) {
        alert('Please fill in all booking details');
        return;
    }

    if (startDate >= endDate) {
        alert('End date must be after start date');
        return;
    }

    try {
        console.log('📅 Creating booking...');

        // Get car details to calculate price
        const carDoc = await getDoc(doc(db, 'cars', carId));
        if (!carDoc.exists()) {
            alert('Car not found');
            return;
        }

        const carData = carDoc.data();
        const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        const totalPrice = days * carData.pricePerDay;

        const bookingDoc = {
            userId: currentUser.uid,
            carId: carId,
            carName: `${carData.name} ${carData.model}`,
            startDate: startDate,
            endDate: endDate,
            totalPrice: totalPrice,
            status: 'pending',
            createdAt: new Date()
        };

        // Add booking document to 'bookings' collection
        const docRef = await addDoc(collection(db, 'bookings'), bookingDoc);

        console.log('✅ Booking created with ID:', docRef.id);
        logToConsole(`Booking created: ${bookingDoc.carName} (ID: ${docRef.id})`);

        // Clear form
        document.getElementById('book-car-id').value = '';
        document.getElementById('book-start-date').value = '';
        document.getElementById('book-end-date').value = '';

        alert(`Booking created successfully! Total: $${totalPrice}`);

        // Refresh user's bookings
        getUserBookings();

    } catch (error) {
        console.error('❌ Failed to create booking:', error);
        alert('Failed to create booking: ' + error.message);
        logToConsole('Failed to create booking: ' + error.message);
    }
}

async function getUserBookings() {
    if (!currentUser) return;

    try {
        console.log('📋 Fetching user bookings from Firestore...');

        const bookingsRef = collection(db, 'bookings');
        const q = query(bookingsRef, where('userId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        const bookings = [];

        querySnapshot.forEach((doc) => {
            bookings.push({ id: doc.id, ...doc.data() });
        });

        console.log(`✅ Retrieved ${bookings.length} user bookings`);
        logToConsole(`Retrieved ${bookings.length} user bookings from database`);

        displayBookings(bookings, 'customer-bookings-list');

    } catch (error) {
        console.error('❌ Failed to fetch user bookings:', error);
        logToConsole('Failed to fetch user bookings: ' + error.message);
        document.getElementById('customer-bookings-list').textContent = 'Error loading bookings: ' + error.message;
    }
}

async function getAllBookings() {
    if (!currentUser || currentUserRole !== 'owner') return;

    try {
        console.log('📋 Fetching all bookings from Firestore...');

        const querySnapshot = await getDocs(collection(db, 'bookings'));
        const bookings = [];

        querySnapshot.forEach((doc) => {
            bookings.push({ id: doc.id, ...doc.data() });
        });

        console.log(`✅ Retrieved ${bookings.length} bookings`);
        logToConsole(`Retrieved ${bookings.length} bookings from database`);

        displayBookings(bookings, 'owner-bookings-list');

    } catch (error) {
        console.error('❌ Failed to fetch bookings:', error);
        logToConsole('Failed to fetch bookings: ' + error.message);
        document.getElementById('owner-bookings-list').textContent = 'Error loading bookings: ' + error.message;
    }
}

function displayCars(cars, listId) {
    const listEl = document.getElementById(listId);

    if (cars.length === 0) {
        listEl.textContent = 'No cars found in database';
        return;
    }

    const carsHtml = cars.map(car => `🚗 ${car.name} ${car.model}
💰 $${car.pricePerDay}/day
📍 ${car.location}
🏷️ ${car.available ? 'Available' : 'Not Available'}
📅 Created: ${car.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
ID: ${car.id}

`).join('');

    listEl.textContent = carsHtml;
}

function displayBookings(bookings, listId) {
    const listEl = document.getElementById(listId);

    if (bookings.length === 0) {
        listEl.textContent = 'No bookings found';
        return;
    }

    const bookingsHtml = bookings.map(booking => `🚗 ${booking.carName}
📅 ${booking.startDate?.toDate?.()?.toLocaleDateString() || 'N/A'} - ${booking.endDate?.toDate?.()?.toLocaleDateString() || 'N/A'}
💰 Total: $${booking.totalPrice}
🏷️ Status: ${booking.status}
📝 Created: ${booking.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
ID: ${booking.id}

`).join('');

    listEl.textContent = bookingsHtml;
}

// UI Helper Functions
function updateFirebaseStatus(message) {
    const statusEl = document.getElementById('firebase-status');
    statusEl.textContent = message;
    statusEl.className = message.includes('✅') ? 'status success' :
                        message.includes('❌') ? 'status error' : 'status info';
}

function updateUserStatus(message) {
    const statusEl = document.getElementById('user-status');
    statusEl.textContent = message;
    statusEl.className = message.includes('✅') ? 'status success' :
                        message.includes('Not signed in') ? 'status info' : 'status error';
}

function logToConsole(message) {
    const consoleEl = document.getElementById('console-output');
    const timestamp = new Date().toLocaleTimeString();
    consoleEl.textContent += `[${timestamp}] ${message}\n`;

    // Auto-scroll to bottom
    consoleEl.scrollTop = consoleEl.scrollHeight;
}

// Make functions globally available
window.signUp = signUp;
window.signIn = signIn;
window.signOut = signOut;
window.addSampleCar = addSampleCar;
window.getAllCars = getAllCars;
window.getOwnerCars = getOwnerCars;
window.createBooking = createBooking;
window.getUserBookings = getUserBookings;
window.getAllBookings = getAllBookings;

// Initialize Firebase when page loads
document.addEventListener('DOMContentLoaded', initializeFirebase);

console.log('🎯 City Drive Complete App loaded!');
console.log('📝 TODO: Implement payment processing, reviews system, email notifications');
console.log('📝 TODO: Add car image upload, booking calendar, location services');
console.log('📝 TODO: Implement admin panel for system management');