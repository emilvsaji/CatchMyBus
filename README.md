# 🚌 CatchMyBus - Kerala Bus Timing Information System

A high-performance, mobile-first intelligent bus schedule and route finder engineered specifically for Kerala's transit network. CatchMyBus enables commuters to discover accurate bus timings, fares, and route stops between any two points across KSRTC and private bus networks.

![Version](https://img.shields.io/badge/Version-1.1.0-blue)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178C6?logo=typescript)
![Fuse.js](https://img.shields.io/badge/Fuse.js-Fuzzy_Search-FF5722)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?logo=firebase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.6-38B2AC?logo=tailwind-css)

---

## ✨ Features

### 🔍 Commuter Search & Route Experience
- 🔤 **Typo-Tolerant Stop Autocomplete (Fuse.js)**: Client-side fuzzy matching that surfaces real Kerala stops even with common spelling variations or typos (e.g. typing `"eratpeta"` surfaces `"Erattupetta"`).
- 📜 **Auto-Scroll to Results**: Smoothly brings the results header into view after search submission, with automatic fallback for `prefers-reduced-motion`.
- 🧭 **Directional Word-Boundary Matching**: Intelligent route matching that prevents substring false-positives (e.g., `"Pala"` will not match `"Panackapalam"`) and enforces route direction.
- ⏱️ **Accurate Stop Timelines**: Expanded route accordion displays designated `"Dep"` / `"Your From"` and `"Arr"` / `"Your To"` chips only at queried endpoints, with clean scheduled time listings for intermediate stops.
- 🕒 **Time-Filtered & "Show All" Queries**: Discover buses departing at or after a specific time, or toggle "Show all buses" to view all scheduled services across the day.
- 🗺️ **Interactive Route Maps**: Visualizes full route trajectories (origin, intermediate via-stops, destination) using Leaflet and OpenStreetMap.
- 🏷️ **Bus Type Filtering**: Categorize by KSRTC, Private, Fast Passenger, Super Fast, and Ordinary.
- ⭐ **Bookmarks / Favorites**: Save frequently searched routes to your account for one-tap access.

### 👥 Community Crowdsourcing
- 📝 **"Suggest a Bus" Portal**: Commuters can submit missing routes, vehicle numbers, and multi-stop timing schedules for review.
- 👤 **Commuter Profile**: Save basic contact and hometown details for personalized suggestions.

### 🛡️ Admin Management & Verification
- 📥 **Bus Requests Approval Pipeline**: Review, approve, or reject user-submitted bus suggestions with direct publishing to live search listings.
- 📋 **Corridor Route Import**: One-click `"Import stops from existing route"` tool in the Add Bus form that automatically copies existing stop sequences for shared corridors (e.g. Pala–Thodupuzha).
- ⏳ **Untimed Bus Registration**: Register routes in advance (`timings: []`) before schedules are finalized; search results display a clean `"Timings not yet available"` badge.
- ✏️ **Bus & Stop CRUD**: Full schedule editor, duplicate bus tool, and multi-stop bulk paste importer.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18.2 with TypeScript
- **Bundler**: Vite 5.0
- **Styling**: Tailwind CSS 3.3 with custom Kerala Transit tokens (Navy `#0B2545` & Amber `#F59E0B`)
- **Fuzzy Search**: Fuse.js
- **Routing**: React Router 6.20
- **Icons**: Lucide React
- **Maps**: Leaflet & React Leaflet
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast

### Backend
- **Runtime**: Node.js with Express
- **Language**: TypeScript
- **Database & Auth**: Firebase Admin SDK (Firestore & Authentication)
- **CORS**: Dynamic origin whitelist

---

## 📋 Prerequisites

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Firebase Project** with Firestore enabled

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/emilvsaji/CatchMyBus.git
cd CatchMyBus
```

### 2. Install Dependencies

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

### 3. Environment Configuration

#### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

#### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=development
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FRONTEND_URL=http://localhost:5173
```

### 4. Run Locally

#### Option 1: Run Concurrently (Root)
```bash
npm run dev
```

#### Option 2: Run Separately
```bash
# Terminal 1 - Backend API (Port 5000)
cd backend
npm run dev

# Terminal 2 - Frontend (Port 5173)
cd frontend
npm run dev
```

---

## 🔌 API Endpoints

### Bus & Search Routes (`/api/buses`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/buses/search?from=X&to=Y&type=Z&time=T&showAll=bool` | Search buses between stops with time filtering |
| `GET` | `/api/buses/stops` | Retrieve all registered stop names |
| `GET` | `/api/buses/stops/nearby?lat=X&lng=Y` | Retrieve nearby stops |

### Bus Suggestion Pipeline (`/api/bus-requests`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/bus-requests` | Submit community bus suggestion |
| `GET` | `/api/bus-requests?status=pending` | List submitted requests (Admin queue) |
| `PUT` | `/api/bus-requests/:id/approve` | Approve suggestion and publish to live buses |
| `PUT` | `/api/bus-requests/:id/reject` | Reject suggestion with optional reason |

### Admin Management (`/api/admin`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/buses` | Retrieve all buses in system |
| `POST` | `/api/admin/buses` | Create new bus (timings optional) |
| `PUT` | `/api/admin/buses/:id` | Update bus route, metadata, or timings |
| `DELETE` | `/api/admin/buses/:id` | Remove bus record |
| `POST` | `/api/admin/stops` | Add new bus stop |

### Favorites (`/api/favorites`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/favorites` | List user's saved favorite routes |
| `POST` | `/api/favorites` | Bookmark a route |
| `DELETE` | `/api/favorites/:id` | Remove bookmark |

---

## 📁 Project Structure

```
CatchMyBus/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AutocompleteInput.tsx   # Fuse.js fuzzy autocomplete input
│   │   │   ├── BusCard.tsx             # Result card with scoped Dep/Arr timeline
│   │   │   ├── RouteMap.tsx            # Leaflet map visualization
│   │   │   ├── LoginModal.tsx          # Firebase authentication modal
│   │   │   └── ProtectedRoute.tsx      # Admin authentication guard
│   │   ├── pages/
│   │   │   ├── HomePage.tsx            # Search hero and inline results
│   │   │   ├── SearchResults.tsx       # Full results page with map toggle
│   │   │   ├── AdminPage.tsx           # Admin CRUD, route importer, request queue
│   │   │   ├── UserDashboard.tsx       # Commuter profile & Suggest a Bus
│   │   │   └── DebugPage.tsx           # Database inspection utilities
│   │   ├── config/                     # Axios API client & Firebase config
│   │   ├── contexts/                   # AuthContext
│   │   ├── types/                      # TypeScript definitions
│   │   └── index.css                   # Kerala Transit Design Tokens
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── busRoutes.ts            # Directional search & stop matching
│   │   │   ├── adminRoutes.ts          # Admin CRUD & untimed bus support
│   │   │   ├── busRequestRoutes.ts     # Community suggestions & approval
│   │   │   ├── favoriteRoutes.ts       # User bookmarks
│   │   │   └── feedbackRoutes.ts       # User feedback
│   │   ├── config/                     # Firebase Admin initialization
│   │   ├── utils/                      # Distance, fare, and geocoding helpers
│   │   └── server.ts                   # Express server entry point
│   ├── package.json
│   └── tsconfig.json
│
├── PROJECT_DETAILS.md                  # Comprehensive architectural reference
└── README.md
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

