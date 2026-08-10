# 🚌 CatchMyBus — Comprehensive Project Details & Technical Documentation

> **CatchMyBus** is a modern, mobile-responsive, intelligent bus timing and route information system engineered specifically for public and private bus transportation in Kerala, India.

---

## 📋 Table of Contents
1. [Project Overview & Mission](#-project-overview--mission)
2. [Design System, Colors & Visual Aesthetics](#-design-system-colors--visual-aesthetics)
3. [Technology Stack](#-technology-stack)
4. [System Architecture & Data Flow](#-system-architecture--data-flow)
5. [Frontend Architecture & Component Reference](#-frontend-architecture--component-reference)
6. [Backend Architecture & API Specification](#-backend-architecture--api-specification)
7. [Database Schema & Firestore Models](#-database-schema--firestore-models)
8. [Algorithms & Calculation Logic](#-algorithms--calculation-logic)
9. [Environment Variables Reference](#-environment-variables-reference)
10. [Step-by-Step Setup & Installation Guide](#-step-by-step-setup--installation-guide)
11. [Sample Seed Data Reference](#-sample-seed-data-reference)
12. [Troubleshooting & Gotchas](#-troubleshooting--gotchas)
13. [Deployment Configuration (Render & Vercel)](#-deployment-configuration-render--vercel)
14. [Security Hardening & Production Roadmap](#-security-hardening--production-roadmap)

---

## 🎯 Project Overview & Mission

### Purpose
CatchMyBus addresses the unpredictability of bus travel across Kerala by providing daily commuters, students, working professionals, and tourists with instant, accurate bus arrival times, intermediate stop schedules, distance calculations, fare estimations, interactive map visualizations, and saved routes.

### Target Users
- **Daily Commuters & Office Workers:** Need dependable departure/arrival schedules to plan daily travel.
- **Students:** Seeking affordable, frequent bus routes between colleges and transit hubs.
- **Tourists & Long-Distance Travelers:** Requiring clear route paths, intermediate stop breakdowns, and fare estimates.
- **Transit Administrators & Depot Managers:** Managing bus schedules, stops, timings, and passenger feedback.

---

## 🎨 Design System, Colors & Visual Aesthetics

The user interface is built on modern visual design principles with rich micro-animations, glassmorphism, responsive grid layouts, card elevations, and custom 3D canvas simulations.

### 1. Complete Color Palette & Hex Tokens

#### **Primary Color Palette (Sky Blue — Trust, Reliability, Transit)**
| Token | Hex Code | RGB | Typical Usage |
|---|---|---|---|
| `primary-50` | `#f0f9ff` | `rgb(240, 249, 255)` | Page section backgrounds, light hover tints |
| `primary-100` | `#e0f2fe` | `rgb(224, 242, 254)` | 3D Bus window mesh, soft highlight pills |
| `primary-200` | `#bae6fd` | `rgb(186, 230, 253)` | Focus outline rings (`focus:ring-primary-200`) |
| `primary-300` | `#7dd3fc` | `rgb(125, 211, 252)` | Subtle borders and decorative accents |
| `primary-400` | `#38bdf8` | `rgb(56, 189, 248)` | Intermediate glow highlights |
| `primary-500` | `#0ea5e9` | `rgb(14, 165, 233)` | Active states, input border focus |
| `primary-600` | `#0284c7` | `rgb(2, 132, 199)` | **Main Brand Primary Color**, buttons, icons, navbar elements |
| `primary-700` | `#0369a1` | `rgb(3, 105, 161)` | Button hover states (`hover:bg-primary-700`) |
| `primary-800` | `#075985` | `rgb(7, 89, 133)` | Dark high-contrast primary text |
| `primary-900` | `#0c4a6e` | `rgb(12, 74, 110)` | Hero sub-headers and dark text accents |

#### **Accent Color Palette (Kerala Orange / Amber — Energy, Action, KSRTC Identity)**
| Token | Hex Code | RGB | Typical Usage |
|---|---|---|---|
| `accent-50` | `#fff7ed` | `rgb(255, 247, 237)` | Feature card gradient highlights |
| `accent-100` | `#ffedd5` | `rgb(255, 237, 213)` | Info cards & subtle warning panels |
| `accent-200` | `#fed7aa` | `rgb(254, 215, 170)` | Secondary button border tints |
| `accent-300` | `#fdba74` | `rgb(253, 186, 116)` | Warm accent badges |
| `accent-400` | `#fb923c` | `rgb(251, 146, 60)` | Highlights & notification counters |
| `accent-500` | `#f97316` | `rgb(249, 115, 22)` | **Main Accent Color**, Admin action badges, CTA buttons |
| `accent-600` | `#ea580c` | `rgb(234, 88, 12)` | Admin hover states (`hover:bg-accent-600`) |
| `accent-700` | `#c2410c` | `rgb(194, 65, 12)` | Deep orange alert text |
| `accent-800` | `#9a3412` | `rgb(154, 52, 18)` | High-contrast accent labels |
| `accent-900` | `#7c2d12` | `rgb(124, 45, 18)` | Dark footer accent text |

#### **Bus Type Badge Colors**
| Bus Type | Background Class | Hex Background | Text Class | Hex Text | Description |
|---|---|---|---|---|---|
| **KSRTC** | `bg-blue-100` | `#dbeafe` | `text-blue-800` | `#1e40af` | Official state transport blue badge |
| **Private** | `bg-purple-100` | `#f3e8ff` | `text-purple-800` | `#6b21a8` | Private operator purple badge |
| **Fast Passenger** | `bg-green-100` | `#dcfce7` | `text-green-800` | `#166534` | Green limited-stop service badge |
| **Super Fast** | `bg-red-100` | `#fee2e2` | `text-red-800` | `#991b1b` | Red express non-stop/limited badge |
| **Ordinary** | `bg-gray-100` | `#f3f4f6` | `text-gray-800` | `#1f2937` | Neutral gray city/local service badge |

#### **Functional, Status & Animation Colors**
| Purpose | Class / Hex | Value |
|---|---|---|
| **Origin Stop Pin** | `text-green-600` | `#16a34a` |
| **Origin Pin (3D canvas)** | `THREE.MeshBasicMaterial` | `0x22c55e` (`#22c55e`) |
| **Destination Stop Pin** | `text-red-600` | `#dc2626` |
| **Destination Pin (3D canvas)**| `THREE.MeshBasicMaterial` | `0xef4444` (`#ef4444`) |
| **Estimated Fare Display** | `text-green-600` | `#16a34a` / Bold INR currency formatting |
| **Estimated Timing Pill** | `bg-yellow-50`, `text-yellow-800` | `#fefce8` bg, `#854d0e` text |
| **Partial Match Banner** | `bg-yellow-100`, `border-yellow-500` | `#fef9c3` bg, `#eab308` border |
| **Favorite Route Heart** | `text-red-500` | `#ef4444` |
| **3D Bus Mesh Body** | `THREE.MeshBasicMaterial` | `0x2563eb` (`#2563eb`) |
| **3D Bus Wheels** | `THREE.MeshBasicMaterial` | `0x111827` (`#111827`) |
| **3D Bus Glow Aura** | `THREE.MeshBasicMaterial` | `0x60a5fa` (`#60a5fa`, opacity: 0.25) |
| **3D Track Line** | `THREE.MeshBasicMaterial` | `0xd1d5db` (light mode), `0x5eead4` (dark mode) |
| **3D Canvas Light Background** | `THREE.MeshBasicMaterial` | `0xf8fafc` (`#f8fafc`) |
| **3D Canvas Dark Background** | `THREE.MeshBasicMaterial` | `0x0b1020` (`#0b1020`) |
| **Fallback Animation Track** | `linear-gradient(90deg, #e5e7eb, #d1d5db)` | CSS fallback track gradient |

---

### 2. Typography & Font System
- **Primary Typeface:** `'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Google Fonts Import:** `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');`
- **Typography Scale:**
  - `Hero Heading`: 48px – 60px (`text-4xl md:text-5xl font-bold tracking-tight`)
  - `Section Titles`: 24px – 30px (`text-2xl md:text-3xl font-bold text-gray-800`)
  - `Card Titles`: 20px (`text-xl font-bold text-gray-800`)
  - `Body / Descriptions`: 16px (`text-base text-gray-600 leading-relaxed`)
  - `Data Labels & Timings`: 18px (`text-lg font-bold text-gray-900`)
  - `Micro-badges & Tooltips`: 12px (`text-xs font-semibold uppercase tracking-wider`)

---

### 3. Keyframe Animations & Micro-Interactions

```css
/* Fade In */
@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

/* Slide Up */
@keyframes slideUp {
  0% { transform: translateY(10px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

/* Floating Bus */
@keyframes busMove {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(30px); }
}

/* Horizontal Fallback Bus Simulation */
@keyframes busMoveX {
  0% { transform: translateX(0); }
  50% { transform: translateX(calc(100% - 24px)); }
  100% { transform: translateX(0); }
}
```

### 4. Custom Reusable Utility Classes (`index.css`)
- `.btn-primary`: `bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 shadow-md hover:shadow-lg`
- `.btn-secondary`: `bg-white text-primary-600 px-6 py-3 rounded-lg font-medium border-2 border-primary-600 hover:bg-primary-50 transition-colors duration-200`
- `.input-field`: `w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all duration-200`
- `.card`: `bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300`
- `.section-title`: `text-2xl md:text-3xl font-bold text-gray-800 mb-4`
- `.leaflet-container`: `rounded-lg shadow-md w-full h-full min-h-[400px]`

---

## 🛠️ Technology Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **React** | `18.2.0` | UI Component Framework |
| **TypeScript** | `5.2.2` | Static type safety and data modeling |
| **Vite** | `5.0.8` | Next-generation frontend build tool and dev server |
| **Tailwind CSS** | `3.3.6` | Utility-first styling framework |
| **React Router DOM**| `6.20.1` | Client-side routing and deep-linking |
| **Leaflet & React Leaflet** | `1.9.4` / `4.2.1` | Interactive map tiles and route polyline rendering |
| **Three.js** | `0.159.0` | 3D WebGL real-time animated bus progress simulation |
| **Lucide React** | `0.294.0` | Clean, lightweight SVG iconography |
| **React Hot Toast** | `2.4.1` | Responsive toast notifications for user interactions |
| **Axios** | `1.6.2` | Promise-based HTTP client |
| **Firebase Client SDK** | `10.7.1` | Firebase Authentication (Email/Password) |
| **Date-fns** | `3.0.0` | Date and time formatting helpers |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | `v18+` / `v20+` | JavaScript runtime environment |
| **TypeScript** | `5.3.3` | Backend type definitions and transpilation |
| **Express** | `4.18.2` | RESTful API server |
| **Firebase Admin SDK** | `12.0.0` | Secure server-side Firestore database read/write access |
| **CORS** | `2.8.5` | Cross-Origin Resource Sharing middleware with multi-domain whitelist |
| **Dotenv** | `16.3.1` | Environment variable management |
| **Axios** | `1.13.2` | Geocoding API communication (OpenStreetMap Nominatim) |
| **Express Validator** | `7.0.1` | Request schema validation |
| **Nodemon & ts-node** | `3.0.2` / `10.9.2` | Hot-reloading development server |

### Cloud Database & Infrastructure
| Service | Role |
|---|---|
| **Google Cloud Firestore** | NoSQL document database for buses, stops, favorites, and feedback |
| **Firebase Authentication** | User identity & Admin role detection |
| **Render** | Node.js web service production deployment (`render.yaml`) |
| **Vercel** | SPA frontend hosting with edge rewrite rules (`vercel.json`) |
| **OpenStreetMap Nominatim** | Real-time geocoding and reverse geocoding API |

---

## 🏛️ System Architecture & Data Flow

```
+-----------------------------------------------------------------------------------+
|                                  USER BROWSER                                     |
|  [HomePage / SearchResults / FavoritesPage / AboutPage / AdminPage]               |
|                                                                                   |
|  • Three.js Canvas Animation     • React Leaflet Map       • Autocomplete Inputs  |
|  • Firebase Client Auth          • Axios HTTP Client       • Tailwind UI Tokens   |
+----------------------------------------+------------------------------------------+
                                         |
                                         | HTTP / JSON (REST)
                                         v
+-----------------------------------------------------------------------------------+
|                               EXPRESS BACKEND API                                 |
|                                                                                   |
|  • CORS Middleware (Multi-origin regex matching)                                  |
|  • Time Normalizer & Distance / Fare Computation Engine                           |
|  • Geocoding / Haversine Engine (OpenStreetMap Nominatim integration)             |
|                                                                                   |
|  Routes:                                                                          |
|  ├── /api/buses/search        (Multi-criteria route & timing matching)            |
|  ├── /api/buses/stops         (Autocomplete & spatial stops retrieval)            |
|  ├── /api/admin/buses         (CRUD operations for bus routes & timings)          |
|  ├── /api/admin/stops         (Bus stop location registration)                    |
|  ├── /api/favorites           (User favorite routes storage)                      |
|  ├── /api/feedback            (Commuter reporting & admin review)                 |
|  └── /health                  (Uptime heartbeat monitoring)                       |
+----------------------------------------+------------------------------------------+
                                         |
                                         | Firebase Admin SDK (gRPC / TLS)
                                         v
+-----------------------------------------------------------------------------------+
|                            GOOGLE CLOUD FIRESTORE                                 |
|                                                                                   |
|  Collections:                                                                     |
|  ├── `buses`       (Routes, intermediate stops, arrival/departure schedules)      |
|  ├── `stops`       (Geocoded stop names, districts, latitude/longitude coords)    |
|  ├── `favorites`   (User saved routes)                                            |
|  └── `feedback`    (Reports, status, user notes)                                  |
+-----------------------------------------------------------------------------------+
```

---

## 💻 Frontend Architecture & Component Reference

### 1. Root Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx           # Sticky top navigation with Auth modal & Admin badge
│   │   │   └── Footer.tsx           # Application footer with quick links & info
│   │   ├── AutocompleteInput.tsx    # Debounced stop name search with dropdown suggestions
│   │   ├── BusCard.tsx              # Rich bus card with timings, fares, badges, 3D animation
│   │   ├── BusProgress.tsx          # Three.js 3D bus on track with WebGL / CSS fallback
│   │   ├── LoginModal.tsx           # Firebase Auth popup for login/registration
│   │   ├── ProtectedRoute.tsx       # Route guard redirecting non-admins
│   │   └── RouteMap.tsx             # Interactive Leaflet map with Kerala coordinates
│   ├── config/
│   │   ├── api.ts                   # Axios instance with VITE_API_URL baseURL
│   │   └── firebase.ts              # Firebase client app initialization
│   ├── contexts/
│   │   └── AuthContext.tsx          # Auth provider tracking currentUser & isAdmin status
│   ├── pages/
│   │   ├── AboutPage.tsx            # Mission, features overview, upcoming roadmap
│   │   ├── AdminPage.tsx            # Full-featured Bus & Stop CRUD management
│   │   ├── DebugPage.tsx            # Diagnostic utility for API connectivity
│   │   ├── FavoritesPage.tsx        # Saved user routes with 1-click re-search
│   │   ├── HomePage.tsx             # Search form, live inline results, hero & stats
│   │   └── SearchResults.tsx        # Deep-linked search results with map view toggle
│   ├── types/
│   │   └── index.ts                 # Central TypeScript interfaces
│   ├── App.tsx                      # React Router configuration
│   ├── main.tsx                     # React DOM root render with Toaster
│   └── index.css                    # Tailwind directives, keyframes, component classes
├── public/                          # Static assets
├── index.html                       # HTML5 entry with Inter font
├── tailwind.config.js               # Theme extensions, colors, animations
├── tsconfig.json                    # TypeScript compiler configuration
├── vercel.json                      # Vercel SPA routing rewrite rules
└── vite.config.ts                   # Vite configuration (port 3000 default)
```

### 2. Component Highlights

#### `BusCard.tsx`
- **Badges:** Displays colored tags for bus type (`KSRTC`, `Private`, `Fast`, `Super Fast`, `Ordinary`).
- **Timing Display:** Shows sanitized departure and arrival timings. Displays an `Estimated times` yellow badge when timings are computed dynamically.
- **Partial Match Warning:** Displays an alert banner if a bus passes through only one of the searched stops.
- **Route Expand/Collapse:** Reveals an interactive vertical timeline showing all intermediate stops with arrival/departure times.
- **3D Animated Bus:** Mounts the `BusProgress` component directly inside the card.

#### `BusProgress.tsx`
- Initializes a Three.js `OrthographicCamera`, `WebGLRenderer`, and `Scene`.
- Builds a 3D geometry track, green start pin, red destination pin, blue bus body (`BoxGeometry`), white windows (`PlaneGeometry`), rotating wheels (`CircleGeometry`), and an ambient blue glow aura (`0x60a5fa`).
- Gracefully falls back to a lightweight CSS `@keyframes busMoveX` track if WebGL is unsupported or disabled.

#### `RouteMap.tsx`
- Built on `react-leaflet`.
- Contains built-in coordinates for 20+ Kerala transit locations:
  - *Major Cities:* Thiruvananthapuram (`8.5241, 76.9366`), Kochi (`9.9312, 76.2673`), Kozhikode (`11.2588, 75.7804`), Thrissur (`10.5276, 76.2144`), Kannur (`11.8745, 75.3704`), Kollam (`8.8932, 76.6141`), Palakkad (`10.7867, 76.6548`), Alappuzha (`9.4981, 76.3388`), Kottayam (`9.5916, 76.5222`), Malappuram (`11.0510, 76.0711`).
  - *Towns & Hubs:* Pala, Erattupetta, Ettumanoor, Pravithanam, Ponkunnam, Changanassery, Tiruvalla, Thalassery, Kasaragod, Wayanad, Attingal, Varkala, Neyyattinkara, Perumbavoor, Muvattupuzha, Kothamangalam, Angamaly, Aluva.
- Connects stops with smooth blue polyline routes on OpenStreetMap tiles.

#### `AdminPage.tsx`
- **Tab 1: Manage Buses:**
  - Add new bus form with Bus Name, Bus Number, Origin, Via, Destination, Bus Type.
  - Multi-stop timing creator with dynamic `AM`/`PM` toggle buttons.
  - **Smart Paste:** Allows pasting multiline stop schedules with auto-delimiter parsing (`-`, `,`, `|`, `\t`).
  - Search filter to quickly locate existing buses.
  - Full edit and delete capabilities.
- **Tab 2: Manage Stops:**
  - Register new bus stops with Stop Name, District, Latitude, and Longitude.

#### `AuthContext.tsx`
- Synchronizes with Firebase Authentication.
- Checks if the authenticated user's email matches the configured admin email (`admin@catchmybus.com`) and updates `isAdmin` state.

---

## ⚡ Backend Architecture & API Specification

### 1. Directory Structure
```
backend/
├── src/
│   ├── config/
│   │   └── firebase.ts              # Firebase Admin SDK initialization
│   ├── routes/
│   │   ├── adminRoutes.ts           # Admin bus/stop CRUD endpoints
│   │   ├── busRoutes.ts             # Bus search, stops & nearby APIs
│   │   ├── favoriteRoutes.ts        # User favorite routes CRUD
│   │   └── feedbackRoutes.ts        # Feedback submission & status updates
│   ├── utils/
│   │   ├── googleMaps.ts            # OpenStreetMap Nominatim geocoding & Haversine formula
│   │   └── helpers.ts               # Fare & travel time estimation formulas
│   └── server.ts                    # Express app entry, CORS, logger & health check
├── dist/                            # Transpiled JavaScript production output
├── package.json                     # Backend dependencies & build scripts
└── tsconfig.json                    # Backend TypeScript compiler settings
```

### 2. Complete REST API Specification

#### **Bus Routes (`/api/buses`)**
| Method | Endpoint | Query / Body Parameters | Response Format | Description |
|---|---|---|---|---|
| `GET` | `/api/buses/search` | `from` (string, req)<br>`to` (string, req)<br>`type` (string, opt)<br>`time` (string, opt: `08:30 AM` / `14:30`)<br>`showAll` (boolean, opt) | `{ success: true, count: number, data: BusResult[] }` | Smart search engine matching origin, destination, intermediate routes, timing availability, distance and fare calculation. |
| `GET` | `/api/buses/stops` | None | `{ success: true, count: number, data: BusStop[] }` | Returns all registered bus stops for autocomplete. |
| `GET` | `/api/buses/stops/nearby` | `lat` (number)<br>`lng` (number)<br>`radius` (number, default: 5km) | `{ success: true, count: number, data: BusStop[] }` | Spatial lookup of nearby bus stops within radius using Haversine calculation. |

#### **Admin Management Routes (`/api/admin`)**
| Method | Endpoint | Payload / Params | Description |
|---|---|---|---|
| `GET` | `/api/admin/buses` | None | Retrieves all bus records for admin overview. |
| `POST` | `/api/admin/buses` | `{ busName, from, via, to, type, route: string[], timings: BusTiming[] }` | Registers a new bus route with timing schedules. |
| `PUT` | `/api/admin/buses/:id` | Partial bus object payload | Updates existing bus information. |
| `DELETE` | `/api/admin/buses/:id` | `:id` path parameter | Permanently deletes a bus from Firestore. |
| `POST` | `/api/admin/stops` | `{ name, district, location: { lat, lng } }` | Adds a new official bus stop. |
| `GET` | `/api/admin/debug/buses` | `limit` (number, opt: default 10) | Diagnostic inspection of raw Firestore documents. |

#### **User Favorites Routes (`/api/favorites`)**
| Method | Endpoint | Payload / Params | Description |
|---|---|---|---|
| `GET` | `/api/favorites` | None | Retrieves saved routes for the user. |
| `POST` | `/api/favorites` | `{ fromStop: string, toStop: string }` | Saves a route to user's favorites. |
| `DELETE` | `/api/favorites/:id` | `:id` path parameter | Removes a saved route. |

#### **Feedback & Reporting Routes (`/api/feedback`)**
| Method | Endpoint | Payload / Params | Description |
|---|---|---|---|
| `POST` | `/api/feedback` | `{ busId, message, type: 'timing'\|'route'\|'other' }` | Commuter feedback submission. |
| `GET` | `/api/feedback` | None | Retrieves all feedback tickets (Admin). |
| `PUT` | `/api/feedback/:id` | `{ status: 'pending'\|'reviewed'\|'resolved' }` | Updates feedback processing status. |

#### **System Health Route**
| Method | Endpoint | Response | Description |
|---|---|---|---|
| `GET` | `/health` | `{ status: 'ok', message: 'CatchMyBus API is running' }` | Heartbeat endpoint for cloud health checks. |

---

## 🗄️ Database Schema & Firestore Models

```typescript
// 1. Bus Stop Document (`stops` collection)
interface BusStop {
  id: string;
  name: string;               // e.g. "Kochi KSRTC Bus Stand"
  district: string;           // e.g. "Ernakulam"
  location: {
    lat: number;              // e.g. 9.9312
    lng: number;              // e.g. 76.2673
  };
  createdAt: Date;
}

// 2. Bus Document (`buses` collection)
interface Bus {
  id: string;
  busNumber: string;          // e.g. "KL-01-AB-1234"
  busName: string;            // e.g. "Trivandrum - Kochi Express"
  type: 'KSRTC' | 'Private' | 'Fast' | 'Super Fast' | 'Ordinary';
  from?: string;              // Starting terminus
  to?: string;                // Ending terminus
  via?: string;               // Optional intermediate landmark string
  route: string[];            // Array of ordered stop names: ["Stop A", "Stop B", "Stop C"]
  timings: BusTiming[];       // Array of timing objects
  fare?: number;              // Pre-calculated base fare (optional)
  createdAt: Date;
}

interface BusTiming {
  stopId?: string;
  stopName: string;           // Name of the stop
  arrivalTime: string;        // e.g. "06:00 AM" or "06:00"
  departureTime: string;      // e.g. "06:15 AM" or "06:15"
  dayOfWeek?: string[];       // e.g. ["Monday", "Tuesday", ...]
}

// 3. User Favorites Document (`favorites` collection)
interface UserFavorite {
  id: string;
  userId: string;             // User UID from Firebase Auth
  fromStop: string;           // Origin stop name
  toStop: string;             // Destination stop name
  createdAt: Date;
}

// 4. Feedback Document (`feedback` collection)
interface Feedback {
  id: string;
  userId?: string;            // User UID (if logged in)
  busId: string;              // Referenced Bus ID
  message: string;            // Feedback/report text
  type: 'timing' | 'route' | 'other';
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: Date;
}
```

### Firestore Security Rules (`firestore.rules`)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Bus stops - public read, admin write
    match /stops/{stopId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Buses - public read, admin write
    match /buses/{busId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Favorites - authenticated user access
    match /favorites/{favoriteId} {
      allow read, create, delete: if true; // Restrict to request.auth.uid in production
    }
    
    // Feedback - public create, admin read/update
    match /feedback/{feedbackId} {
      allow create: if true;
      allow read, update: if request.auth != null;
    }
  }
}
```

---

## 🧮 Algorithms & Calculation Logic

### 1. Distance Calculation Engine
1. **Primary Free Geocoding (Nominatim & Haversine):**
   - Coordinates are resolved via OpenStreetMap Nominatim: `https://nominatim.openstreetmap.org/search?q={location}, Kerala, India&format=json&limit=1`.
   - Great-circle distance is calculated using the **Haversine Formula**:
     $$\Delta \text{lat} = \text{lat}_2 - \text{lat}_1$$
     $$\Delta \text{lng} = \text{lng}_2 - \text{lng}_1$$
     $$a = \sin^2\left(\frac{\Delta\text{lat}}{2}\right) + \cos(\text{lat}_1)\cos(\text{lat}_2)\sin^2\left(\frac{\Delta\text{lng}}{2}\right)$$
     $$c = 2 \cdot \text{atan2}\left(\sqrt{a}, \sqrt{1-a}\right)$$
     $$d = R \cdot c \quad (R = 6371\text{ km})$$
   - An additional **25% road-winding multiplier** ($d_{\text{road}} = d \times 1.25$) is added to convert straight-line displacement into realistic Kerala road distance.
2. **Fallback Index-Based Estimation:**
   $$\text{Distance (km)} = |\text{toIndex} - \text{fromIndex}| \times 15\text{ km}$$

### 2. Travel Duration Estimation
$$\text{Duration (minutes)} = \text{round}\left(\frac{\text{Distance (km)}}{\text{Average Speed (40 km/h)}} \times 60\right)$$

### 3. Bus Fare Calculation Rates
$$\text{Fare (INR)} = \text{round}(\text{Distance (km)} \times \text{Base Rate})$$

| Bus Service Category | Base Rate per Kilometer | Example (50 km Route) |
|---|---|---|
| **Ordinary** | ₹1.00 / km | ₹50 |
| **KSRTC (Standard)** | ₹1.20 / km | ₹60 |
| **Private (City/Line)**| ₹1.50 / km | ₹75 |
| **Fast Passenger** | ₹1.80 / km | ₹90 |
| **Super Fast Express**| ₹2.20 / km | ₹110 |

### 4. Kerala Vehicle Registration Validator
$$\text{Regex Pattern: } \texttt{\textasciicircum KL-\textbackslash d\{2\}-[A-Z]\{2\}-\textbackslash d\{4\}\$}$$
- Example Valid: `KL-01-AB-1234`, `KL-07-BC-5678`, `KL-11-CD-9012`

---

## 🔐 Environment Variables Reference

### 1. Frontend Environment (`frontend/.env`)
```env
# Backend API Base URL
VITE_API_URL=http://localhost:5000/api

# Firebase Web App Credentials (from Firebase Project Settings -> General -> Web Apps)
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=catchmybus-kerala.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=catchmybus-kerala
VITE_FIREBASE_STORAGE_BUCKET=catchmybus-kerala.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 2. Backend Environment (`backend/.env`)
```env
# Server Port & Runtime Mode
PORT=5000
NODE_ENV=development

# Allowed CORS Origins (comma-separated list, without trailing slashes)
FRONTEND_URL=http://localhost:3000,http://localhost:5173,https://catch-my-bus.vercel.app

# Firebase Admin SDK Credentials (from Project Settings -> Service Accounts -> Generate new private key)
FIREBASE_PROJECT_ID=catchmybus-kerala
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@catchmybus-kerala.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

---

## 🚀 Step-by-Step Setup & Installation Guide

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **Firebase Account**: Free Spark plan on [Firebase Console](https://console.firebase.google.com/)

### Quick Install & Run (Root)
```bash
# 1. Clone repository
git clone https://github.com/your-username/CatchMyBus.git
cd CatchMyBus

# 2. Install all root, frontend, and backend dependencies
npm run install:all

# 3. Configure environment variables in frontend/.env and backend/.env (see templates above)

# 4. Start both frontend and backend concurrently
npm run dev
```

### Standalone Installation (PowerShell / Windows)
```powershell
# Install frontend
cd frontend
npm install
cd ..

# Install backend
cd backend
npm install
cd ..

# Run in separate terminal windows
# Terminal 1: Backend (Port 5000)
cd backend
npm run dev

# Terminal 2: Frontend (Port 3000 / 5173)
cd frontend
npm run dev
```

---

## 📦 Sample Seed Data Reference

Use the Admin Panel (`/admin`) or import `sample-data.js` to seed the database with initial Kerala bus routes and transit hubs.

### 1. Sample Transit Hubs (`sampleBusStops`)
| Stop Name | District | Latitude | Longitude |
|---|---|---|---|
| **Thiruvananthapuram Central Bus Station** | Thiruvananthapuram | `8.5241` | `76.9366` |
| **Kollam KSRTC Bus Stand** | Kollam | `8.8932` | `76.6141` |
| **Alappuzha Bus Stand** | Alappuzha | `9.4981` | `76.3388` |
| **Kochi KSRTC Bus Stand** | Ernakulam | `9.9312` | `76.2673` |
| **Thrissur KSRTC Bus Stand** | Thrissur | `10.5276` | `76.2144` |
| **Kozhikode KSRTC Bus Stand** | Kozhikode | `11.2588` | `75.7804` |

### 2. Sample Bus Routes (`sampleBuses`)
- **Trivandrum – Kochi Express** (`KL-01-AB-1234`, `KSRTC`):
  - *Route:* Thiruvananthapuram (06:00 AM) → Kollam (07:30 AM) → Alappuzha (08:45 AM) → Kochi (10:00 AM)
- **Kochi – Thrissur Super Fast** (`KL-07-BC-5678`, `Super Fast`):
  - *Route:* Kochi (07:00 AM) → Thrissur (08:30 AM)
- **Kozhikode – Thrissur Fast** (`KL-11-CD-9012`, `Fast`):
  - *Route:* Kozhikode (09:00 AM) → Thrissur (11:30 AM)
- **Trivandrum – Kollam Private** (`KL-01-EF-3456`, `Private`):
  - *Route:* Thiruvananthapuram (08:00 AM) → Attingal (08:45 AM) → Kollam (09:30 AM)
- **Kerala Coastal Ordinary** (`KL-04-GH-7890`, `Ordinary`):
  - *Route:* Kollam (06:30 AM) → Karunagappally (07:15 AM) → Kayamkulam (08:00 AM) → Alappuzha (09:00 AM)

---

## 🔧 Troubleshooting & Gotchas

1. **CORS Blocked Errors:**
   - Ensure the frontend URL in `backend/.env` under `FRONTEND_URL` exactly matches your browser's protocol, host, and port (e.g. `http://localhost:3000` or `http://localhost:5173` without trailing slashes).
2. **Firebase Private Key Newline Escapes:**
   - In `.env` or Render environment settings, ensure the private key contains literal `\n` or properly formatted multi-line RSA PEM strings: `"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"`.
3. **Port In Use (EADDRINUSE):**
   - If port `5000` or `3000` is busy, configure alternative ports in `backend/.env` (`PORT=5001`) and update `frontend/vite.config.ts` (`server: { port: 3001 }`).
4. **Leaflet Marker Icons Missing in Production Build:**
   - Handled via explicit icon instantiation in `RouteMap.tsx` with standard Leaflet marker icon URLs (`marker-icon.png` and `marker-shadow.png`).

---

## 🌐 Deployment Configuration (Render & Vercel)

### 1. Backend Service on Render (`render.yaml`)
```yaml
services:
  - type: web
    name: catchmybus-backend
    env: node
    region: oregon
    plan: free
    rootDir: backend
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 5000
      - key: FRONTEND_URL
        value: https://catch-my-bus.vercel.app,http://localhost:5173,http://localhost:3000
```

### 2. Frontend SPA on Vercel (`frontend/vercel.json`)
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 🛡️ Security Hardening & Production Roadmap

### Security Hardening
- [ ] Implement server-side Firebase ID token verification middleware on all `/api/admin/*` and `/api/feedback` routes.
- [ ] Enforce Firestore role-based security rules using custom user claims.
- [ ] Add rate limiting (`express-rate-limit`) to prevent API abuse on `/api/buses/search`.

### Future Roadmap
- [ ] **Live GPS Bus Tracking:** Real-time WebSocket / MQTT integration for streaming vehicle coordinates.
- [ ] **Push & SMS Alerts:** Commuter notifications for delay updates and departure reminders.
- [ ] **Voice Search:** Multi-dialect Malayalam voice recognition search.
- [ ] **Offline PWA:** Progressive Web App service worker caching for offline schedule lookups.
- [ ] **Native Mobile Apps:** Cross-platform React Native / Expo build for Android and iOS.

---
*Built with ❤️ for commuters across Kerala.*
