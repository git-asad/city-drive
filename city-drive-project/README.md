# City Drive - Car Rental Platform

A fully functional car rental platform built with vanilla JavaScript, HTML, and CSS using Firebase for backend services.

## 🚀 Features

- **User Authentication**: Sign up/Login with role selection (Customer/Car Owner)
- **Role-based Dashboards**: Different interfaces for customers and car owners
- **Car Listings**: Browse available cars with detailed information
- **Booking System**: Complete booking workflow with date selection and pricing
- **Real-time Updates**: Firebase integration for live data synchronization
- **Responsive Design**: Mobile-friendly interface with modern UI
- **Action Logging**: Comprehensive logging system for debugging and monitoring

## 📁 Project Structure

```
city-drive-project/
├── index.html          # Main HTML file
├── style.css           # CSS stylesheets
├── script.js           # Main JavaScript application
├── assets/             # Static assets (images, icons, etc.)
│   ├── *.svg           # Icons and logos
│   ├── *.png           # Car images and UI elements
│   └── assets.js       # Asset exports (ES6 modules)
└── README.md           # This file
```

## 🛠️ Setup Instructions

### Prerequisites
- A Firebase project (create one at https://console.firebase.google.com/)
- VS Code with Live Server extension (recommended)

### Firebase Configuration

1. Go to your Firebase Console
2. Create a new project or use an existing one
3. Enable Authentication, Firestore Database, and Analytics
4. Get your Firebase configuration from Project Settings > General > Your apps
5. Update the configuration in `index.html`:

```javascript
const firebaseConfig = {
    apiKey: "your-actual-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-actual-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "your-actual-sender-id",
    appId: "your-actual-app-id",
    measurementId: "G-XXXXXXXXXX" // For Analytics
};
```

### Running the Project

1. Open the project folder in VS Code
2. Right-click on `index.html` and select "Open with Live Server"
3. The application will open in your default browser

### Sample Data

To populate the database with sample cars, open the browser console and run:
```javascript
initializeSampleData()
```

## 🔧 Firebase Services Used

- **Authentication**: User registration and login
- **Firestore**: Database for users, cars, and bookings
- **Analytics**: User behavior tracking (optional)

## 📱 Features Overview

### For Customers
- Browse available cars
- View car details and pricing
- Make bookings with date selection
- View booking history and status
- Manage personal profile

### For Car Owners
- Add and manage car listings
- View booking requests
- Accept/reject bookings
- Track revenue and statistics
- Manage car availability

## 🚀 Future Enhancements

See the comments in `script.js` for planned improvements including:
- Payment integration (Stripe/PayPal)
- Image upload system
- Review and rating system
- Advanced search and filtering
- Email notifications
- Admin panel
- Mobile app
- Multi-language support

## 🐛 Troubleshooting

### Common Issues

1. **Firebase Configuration Error**
   - Ensure all Firebase services are enabled
   - Double-check your configuration values
   - Make sure the domain is added to authorized domains

2. **Assets Not Loading**
   - Check that all files are in the correct `assets/` folder
   - Verify file paths in the code
   - Ensure Live Server is serving the files correctly

3. **Authentication Issues**
   - Enable Email/Password authentication in Firebase Console
   - Check browser console for error messages
   - Ensure Firebase configuration is correct

### Debug Mode

The application includes comprehensive logging. Check the browser console for:
- Action logs (user interactions)
- Error logs (issues and stack traces)
- Firebase initialization status

## 📄 License

This project is for educational and demonstration purposes.

## 🤝 Contributing

Feel free to contribute by implementing any of the planned future enhancements!

---

**Note**: This is a vanilla JavaScript implementation. For a React version with more advanced features, check the `client/` folder in the parent directory.