# City Drive - Complete Car Rental App

A full-featured car rental web application built with vanilla JavaScript, HTML, and CSS, powered by Firebase.

## 🚀 Features

### ✅ Current Features
- **Firebase Authentication**: Sign up and sign in with email/password
- **Role-based Access**: Customer and Car Owner roles
- **Firestore Database**: Real-time data storage and retrieval
- **Car Management**: Add, view, and manage cars (Owner only)
- **Booking System**: Create and manage car rental bookings
- **Real-time Updates**: Live data synchronization
- **Responsive Design**: Works on desktop and mobile devices
- **Console Logging**: Detailed operation logs for debugging

### 📋 Collections Structure
```
users/           # User profiles and preferences
├── uid: string
├── email: string
├── role: 'customer' | 'owner'
└── createdAt: timestamp

cars/            # Car inventory and details
├── name: string
├── model: string
├── pricePerDay: number
├── ownerId: string
└── available: boolean

bookings/        # Rental bookings and reservations
├── userId: string
├── carId: string
├── startDate: timestamp
├── endDate: timestamp
├── totalPrice: number
└── status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
```

## 🛠️ Setup Instructions

### 1. Firebase Configuration
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable "Email/Password" provider
4. Enable Firestore:
   - Go to Firestore Database
   - Create database in production mode
5. Get your Firebase config:
   - Go to Project Settings > General > Your apps
   - Click "Add app" if you haven't already
   - Copy the config object

### 2. Update Firebase Config
Edit `script.js` and replace the `firebaseConfig` object with your actual Firebase project configuration:

```javascript
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456",
    measurementId: "G-ABCDEFGHIJ"
};
```

### 3. Run the Application
1. Open the project folder in VS Code
2. Install the Live Server extension if you haven't already
3. Right-click on `index.html` and select "Open with Live Server"
4. The app will open in your browser at `http://localhost:5500`

## 📱 How to Use

### For Customers:
1. **Sign Up**: Choose "Customer" role and create an account
2. **Browse Cars**: Click "Load Available Cars" to see all available vehicles
3. **Make Booking**: Enter car ID, start/end dates, and click "Book Car"
4. **View Bookings**: Check your booking history with "Load My Bookings"

### For Car Owners:
1. **Sign Up**: Choose "Car Owner" role and create an account
2. **Add Cars**: Fill in car details and click "Add Car"
3. **Manage Cars**: View all your cars with "Load My Cars"
4. **View Bookings**: See all bookings across your cars with "Load All Bookings"

## 🔧 Project Structure

```
city-drive-vanilla/
├── index.html          # Main HTML structure
├── style.css           # Application styles
├── script.js           # Firebase logic and app functionality
└── README.md           # This file
```

## 🚀 Future Improvements

### High Priority
- **Payment Integration**: Implement Stripe/PayPal for secure payments
- **Image Upload**: Add car photo upload functionality
- **Email Notifications**: Send booking confirmations and updates
- **Booking Calendar**: Visual calendar for date selection

### Medium Priority
- **Reviews System**: Allow customers to rate and review cars
- **Search & Filters**: Advanced car search with filters
- **Location Services**: GPS-based car location and pickup
- **Admin Panel**: System-wide management dashboard

### Low Priority
- **Mobile App**: React Native companion app
- **Multi-language**: Internationalization support
- **Dark Mode**: Theme switching capability
- **Push Notifications**: Real-time booking updates

## 🐛 Troubleshooting

### Common Issues:

1. **Firebase not initializing**:
   - Check your Firebase config in `script.js`
   - Ensure Firebase project is properly set up
   - Verify API keys are correct

2. **Authentication not working**:
   - Make sure Email/Password authentication is enabled in Firebase Console
   - Check browser console for error messages

3. **Data not saving to Firestore**:
   - Verify Firestore rules allow read/write operations
   - Check that collections are properly structured

4. **Live Server not working**:
   - Install Live Server extension in VS Code
   - Try opening `index.html` directly in browser (may have CORS issues)

## 📝 Development Notes

- All Firebase operations are logged to the console for debugging
- The app uses ES6 modules for better code organization
- Responsive design works on screens 768px and above
- Error handling is implemented for all Firebase operations

## 🤝 Contributing

Feel free to fork this project and add your own improvements! Some areas that could use enhancement:

- UI/UX improvements
- Additional Firebase features (Storage, Functions)
- Performance optimizations
- Accessibility improvements

## 📄 License

This project is open source and available under the MIT License.

---

**Happy coding! 🚗💨**