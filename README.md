# 🚌 CatchMyBus - Kerala Bus Timing Information System

A mobile-responsive intelligent bus time information system designed specifically for Kerala bus transportation. CatchMyBus helps users easily find accurate bus arrival times and bus availability between two bus stops.

![CatchMyBus](https://img.shields.io/badge/Version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178C6?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?logo=firebase)

## ✨ Features

### Core Features
- 🔍 **Smart Bus Search** - Search buses between any two stops in Kerala
- ⏰ **Real-Time Information** - Get accurate arrival and departure times
- 🗺️ **Route Visualization** - Interactive maps showing bus routes
- 💰 **Fare Calculator** - Know the approximate fare before boarding
- 🚦 **Bus Type Filters** - Filter by KSRTC, Private, Fast, Super Fast, Ordinary
- ⭐ **Favorite Routes** - Save frequently used routes for quick access
- 📱 **Mobile Responsive** - Perfect experience on all devices

### Admin Features
- ➕ **Bus Management** - Add, update, and delete bus information
- 📍 **Stop Management** - Manage bus stops with location data
- 📊 **Dashboard** - Overview of all buses and routes
- 📝 **Feedback System** - View and manage user feedback

### Upcoming Features
- 🛰️ Live GPS tracking integration
- 🔔 Delay and arrival notifications
- 🎤 Voice assistant-based search
- 📍 Nearby bus stops suggestions
- 📜 Recent searches history

## 🛠️ Tech Stack

### Frontend
- **React 18.2** with TypeScript
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons
- **React Leaflet** - Interactive maps
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications

### Backend
- **Node.js** with Express
- **TypeScript**
- **Firebase Admin SDK** - Database and authentication
- **CORS** - Cross-origin resource sharing

### Database
- **Firebase Firestore** - NoSQL cloud database

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Firebase Account** - [Create one](https://firebase.google.com/)

## 🚀 Getting Started

## 📌 Project Details

For a complete overview of the architecture, tech stack, APIs, Firestore schema, and deployment notes, see `PROJECT_DETAILS.md`.

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd CatchMyBus
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Firestore Database**
4. Create a **Web App** and note down the configuration
5. Generate a **Service Account Key** for the backend:
   - Go to Project Settings → Service Accounts
   - Click "Generate New Private Key"

### 3. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 4. Environment Configuration

#### Frontend (.env file)

Create a `.env` file in the `frontend` folder:

```env
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

#### Backend (.env file)

Create a `.env` file in the `backend` folder:

```env
PORT=5000
NODE_ENV=development

# Firebase Admin SDK (from service account JSON)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000
```

### 5. Update Firebase Config

Update `frontend/src/config/firebase.ts` with your Firebase configuration.

### 6. Run the Application

#### Option 1: Run Everything Together (Recommended)

From the root directory:

```bash
npm run dev
```

This will start both frontend and backend concurrently.

#### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 7. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/health

## 📁 Project Structure

```
CatchMyBus/
├── frontend/                 # React + TypeScript frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── layout/      # Header, Footer
│   │   │   ├── BusCard.tsx
│   │   │   └── RouteMap.tsx
│   │   ├── pages/           # Page components
│   │   │   ├── HomePage.tsx
│   │   │   ├── SearchResults.tsx
│   │   │   ├── FavoritesPage.tsx
│   │   │   ├── AdminPage.tsx
│   │   │   └── AboutPage.tsx
│   │   ├── config/          # Firebase & API config
│   │   ├── types/           # TypeScript types
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css        # Tailwind styles
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── backend/                  # Express + TypeScript backend
│   ├── src/
│   │   ├── routes/          # API routes
│   │   │   ├── busRoutes.ts
│   │   │   ├── adminRoutes.ts
│   │   │   ├── favoriteRoutes.ts
│   │   │   └── feedbackRoutes.ts
│   │   ├── config/          # Firebase admin config
│   │   ├── utils/           # Helper functions
│   │   └── server.ts        # Express server
│   ├── dist/                # Compiled JavaScript
│   ├── package.json
│   └── tsconfig.json
│
├── package.json             # Root package.json
└── README.md
```

## 🔌 API Endpoints

### Bus Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/buses/search?from=X&to=Y&type=Z` | Search buses |
| GET | `/api/buses/stops` | Get all bus stops |
| GET | `/api/buses/stops/nearby?lat=X&lng=Y` | Get nearby stops |

### Admin Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/buses` | Get all buses |
| POST | `/api/admin/buses` | Add new bus |
| PUT | `/api/admin/buses/:id` | Update bus |
| DELETE | `/api/admin/buses/:id` | Delete bus |
| POST | `/api/admin/stops` | Add new bus stop |

### Favorite Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/favorites` | Get all favorites |
| POST | `/api/favorites` | Add favorite |
| DELETE | `/api/favorites/:id` | Remove favorite |

### Feedback Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/feedback` | Get all feedback |
| POST | `/api/feedback` | Submit feedback |
| PUT | `/api/feedback/:id` | Update feedback status |

## 🎨 Design Features

- **Modern UI/UX** - Clean and intuitive interface
- **Gradient Backgrounds** - Beautiful color schemes
- **Smooth Animations** - Fade-in and slide-up effects
- **Responsive Design** - Mobile-first approach
- **Custom Color Palette** - Primary (Blue) and Accent (Orange)
- **Interactive Elements** - Hover effects and transitions
- **Professional Typography** - Inter font family

## 📱 Mobile Responsive

The application is fully responsive with breakpoints:
- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

## 🧪 Sample Data

To test the application, you can add sample data through the Admin Panel:

### Sample Bus
- **Bus Number:** KL-01-AB-1234
- **Bus Name:** Trivandrum - Kochi Express
- **Type:** KSRTC
- **Route:** Thiruvananthapuram, Kollam, Alappuzha, Kochi

### Sample Bus Stop
- **Name:** Thiruvananthapuram Central
- **District:** Thiruvananthapuram
- **Latitude:** 8.5241
- **Longitude:** 76.9366

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Kerala State Road Transport Corporation (KSRTC)
- OpenStreetMap for map tiles
- All public transportation users in Kerala

## 📞 Support

For support, email info@catchmybus.com or create an issue in this repository.

## 🔮 Future Enhancements

- [ ] User authentication and profiles
- [ ] Real-time GPS bus tracking
- [ ] Push notifications for bus arrivals
- [ ] Offline mode with cached data
- [ ] Multi-language support (Malayalam, English)
- [ ] Integration with payment gateways for online tickets
- [ ] Crowdsourced bus updates
- [ ] Analytics dashboard for admins
- [ ] Mobile apps (React Native)

