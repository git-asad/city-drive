# City Drive - Premium Car Rental Website

A modern, full-featured car rental website built with React, Vite, and Tailwind CSS. Features include user authentication, car booking system, owner dashboard, and responsive design with smooth animations.

## 🚀 Features

- **User Authentication** - Google OAuth integration with JWT sessions
- **Car Booking System** - Multi-step booking process with real-time pricing
- **Owner Dashboard** - Complete management interface for car owners
- **Responsive Design** - Mobile-first approach with modern UI
- **Smooth Animations** - CSS animations and transitions throughout
- **Real-time Updates** - Dynamic pricing and availability

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Authentication**: Google OAuth 2.0, JWT
- **Database**: MongoDB (configured)
- **Animations**: Custom CSS keyframes

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd city-drive
   ```

2. **Install client dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Install server dependencies**
   ```bash
   cd src/server
   npm install
   ```

4. **Start the development servers**
   ```bash
   # Terminal 1 - Client
   cd client
   npm run dev

   # Terminal 2 - Server
   cd client/src/server
   npm run server
   ```

5. **Open your browser**
   ```
   http://localhost:5173
   ```

## 📁 Project Structure

```
city-drive/
├── client/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── assets/        # Images, icons, and data
│   │   └── backups/       # Component backups
│   └── public/            # Static assets
└── server/                # Backend API
```

## 🔐 Authentication

The app uses Google OAuth for user authentication:
- **Client ID**: Configure in server.js
- **JWT Tokens**: Secure session management
- **Protected Routes**: Owner dashboard and user bookings

## 🎨 Animations

Custom CSS animations include:
- Fade-in effects with staggered timing
- Hover animations for interactive elements
- Loading spinners and progress indicators
- Smooth page transitions

## 📱 Responsive Design

- Mobile-first approach
- Tablet and desktop optimizations
- Touch-friendly interactions
- Adaptive layouts

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
