# City Drive - Vanilla JavaScript Car Rental Platform

A complete car rental platform built with vanilla JavaScript, HTML, and CSS, featuring Firebase authentication and Firestore database integration.

## Features

### ✅ Completed Features
- **Firebase Authentication**: Sign up and login with role selection (Customer/Owner)
- **Role-based Dashboards**: Separate dashboards for customers and car owners
- **Booking System**: Complete booking flow with Firestore integration
- **Responsive Design**: Mobile-friendly interface
- **Action Logging**: Comprehensive logging of user actions and errors
- **Navigation**: Single-page application with routing

### 🚧 Future Enhancements (Commented in Code)
- **Payment Integration**: Stripe/PayPal payment processing
- **Image Upload**: Car image management system
- **Review System**: Customer reviews and ratings
- **Advanced Filtering**: Search and filter cars by multiple criteria
- **Email Notifications**: Booking confirmations and updates
- **Admin Panel**: Administrative controls for platform management

## Project Structure

```
city-drive-vanilla-complete/
├── index.html          # Main HTML file with Firebase CDN
├── style.css           # Complete CSS styling
├── script.js           # Vanilla JavaScript application logic
├── assets/             # Images, icons, and static assets
│   ├── logo.svg
│   ├── main_car.png
│   └── ... (47 asset files)
└── README.md           # This file
```

## Setup Instructions

### 1. Firebase Configuration
1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Authentication and Firestore Database
3. Update the Firebase config in `index.html`:

```javascript
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};
```

### 2. Firestore Security Rules
Add these basic security rules to your Firestore database:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Cars can be read by anyone, written by owners
    match /cars/{carId} {
      allow read: if true;
      allow write: if request.auth != null && resource.data.ownerId == request.auth.uid;
    }

    // Bookings can be read/written by involved parties
    match /bookings/{bookingId} {
      allow read, write: if request.auth != null &&
        (request.auth.uid == resource.data.customerId ||
         request.auth.uid == resource.data.ownerId);
    }
  }
}
```

### 3. Run the Application
1. Open `index.html` in a modern web browser
2. Or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000

   # Using Node.js
   npx http-server

   # Or use VS Code Live Server extension
   ```

## Usage

### For Customers
1. **Sign Up**: Create account with "Customer" role
2. **Browse Cars**: View available cars on the home page
3. **Book Car**: Select dates and complete booking
4. **Manage Bookings**: View booking history in "My Bookings"

### For Car Owners
1. **Sign Up**: Create account with "Owner" role
2. **Dashboard**: View statistics and recent bookings
3. **Manage Cars**: Add, edit, and manage car listings (framework ready)
4. **Handle Bookings**: Accept or reject booking requests

## Key Components

### Authentication System
- Firebase Auth integration
- Role-based access control
- Persistent login state

### Booking System
- Date selection and validation
- Pricing calculation
- Firestore data persistence
- Status management (pending/confirmed/cancelled)

### Dashboard System
- Real-time statistics
- Booking management
- Revenue tracking

### Logging System
- Action logging for debugging
- Error tracking
- Local storage persistence

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development Notes

### Code Comments
The code includes extensive comments indicating where future features should be implemented:
- Payment processing integration points
- Image upload functionality
- Review system placeholders
- Advanced filtering logic

### Firebase Integration
- Authentication handled via Firebase Auth
- All data stored in Firestore
- Real-time listeners for live updates
- Security rules for data protection

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly interfaces

## Troubleshooting

### Common Issues
1. **Firebase Config**: Ensure Firebase config is correctly updated
2. **CORS Issues**: Use a local server instead of opening HTML directly
3. **Authentication**: Check Firebase Authentication settings
4. **Firestore**: Verify security rules are deployed

### Debug Mode
Check browser console for detailed logging:
- Action logs: User interactions and system events
- Error logs: Application errors and Firebase issues
- Auth state: Authentication status changes

## Contributing

This is a vanilla JavaScript implementation. For the React version, see the `client/` directory.

## License

This project is for educational purposes. Modify and use as needed.