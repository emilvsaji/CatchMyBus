# 🚌 CatchMyBus — Comprehensive Project Details & Technical Documentation

> **CatchMyBus** is a modern, mobile-first, intelligent bus timing and route information system engineered specifically for public (KSRTC) and private bus transportation across Kerala, India.

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
CatchMyBus provides daily commuters, students, working professionals, and travelers in Kerala with reliable, real-time bus schedules, departure and arrival timings, intermediate stop breakdowns, automated fare calculation, and interactive route mapping.

### Key Value Pillars
- **Transit-Board Interface:** High-density, professional transit board presentation focusing on readability, tabular alignment, and clean visual hierarchy.
- **Mobile-First Experience:** Built with a strict 375px+ responsive grid, touch-friendly hit areas ($\ge 44\text{px}$), sticky filter bars, and minimal scrolling friction.
- **Accurate Timing & Fare Engine:** Smart multi-criteria matching algorithm with automated fare approximation and distance calculations.

---

## 🎨 Design System, Colors & Visual Aesthetics

The application uses a **professional transit design system** anchored in deep transit navy and signal amber, avoiding childish saturated colors in favor of desaturated badges, tabular figures, and border-based elevations.

### 1. Color Palette & Hex Tokens

#### **Primary Brand Anchor (Deep Transit Navy)**
| Token | Hex Code | RGB | Typical Usage |
|---|---|---|---|
| `navy-50` | `#EBF0F7` | `rgb(235, 240, 247)` | Light section tint, subtle container fill |
| `navy-100` | `#C8D6E9` | `rgb(200, 214, 233)` | Subtle borders, light chip backgrounds |
| `navy-200` | `#A2B9D8` | `rgb(162, 185, 216)` | Inactive indicator states |
| `navy-300` | `#7B9CC7` | `rgb(123, 156, 199)` | Secondary navbar text & labels |
| `navy-400` | `#5881B4` | `rgb(88, 129, 180)` | Accent borders & secondary highlights |
| `navy-500` | `#3A66A0` | `rgb(58, 102, 160)` | Intermediate active elements |
| `navy-600` | `#214F8C` | `rgb(33, 79, 140)` | Interactive focus states |
| `navy-700` | `#0F3B78` | `rgb(15, 59, 120)` | Button hover states (`.btn-navy:hover`) |
| `navy-800` | `#0B2545` | `rgb(11, 37, 69)` | **Main Brand Anchor**: Navbar, hero band, sticky filter bar, polyline |
| `navy-900` | `#071730` | `rgb(7, 23, 48)` | Navbar bottom border, footer background |

#### **Accent Brand Color (Signal Amber — Used Sparingly)**
| Token | Hex Code | RGB | Typical Usage |
|---|---|---|---|
| `amber-50` | `#FEF8EC` | `rgb(254, 248, 236)` | Notice box light background |
| `amber-100` | `#FDEDC9` | `rgb(253, 237, 201)` | Warning container background |
| `amber-200` | `#FBD98B` | `rgb(251, 217, 139)` | Notice border tint |
| `amber-300` | `#F9C54E` | `rgb(249, 197, 78)` | Button hover state (`.btn-amber:hover`) |
| `amber-400` | `#F5A623` | `rgb(245, 166, 35)` | **Main Accent CTA**: Buttons, active filter chips, live dots, logo icon |
| `amber-500` | `#D98C0E` | `rgb(217, 140, 14)` | Button active press state (`.btn-amber:active`) |
| `amber-600` | `#B27209` | `rgb(178, 114, 9)` | High-contrast amber labels |
| `amber-700` | `#8A5706` | `rgb(138, 87, 6)` | Deep amber notice text |

#### **Neutral & Background Scale**
| Token | Hex Code | RGB | Typical Usage |
|---|---|---|---|
| `neutral-50` | `#F7F8FA` | `rgb(247, 248, 250)` | **App Page Background**, input field background |
| `neutral-100` | `#ECEEF2` | `rgb(236, 238, 242)` | Hairline dividers, accordion borders |
| `neutral-200` | `#E2E6EA` | `rgb(226, 230, 234)` | **Card Borders**, input borders, dropdown borders |
| `neutral-300` | `#C8CDD5` | `rgb(200, 205, 213)` | Disabled icons, placeholder stop dots |
| `neutral-400` | `#9AA3AF` | `rgb(154, 163, 175)` | Sub-labels, distance text, uppercase labels |
| `neutral-500` | `#6B7585` | `rgb(107, 117, 133)` | Secondary body copy, stop names |
| `neutral-600` | `#4A5568` | `rgb(74, 85, 104)` | Intermediate text, filter labels |
| `neutral-700` | `#3A4455` | `rgb(58, 68, 85)` | High-contrast secondary headings |
| `neutral-800` | `#1E2530` | `rgb(30, 37, 48)` | **Primary Text (Slate-Gray)**, card titles, fares |
| `neutral-900` | `#111620` | `rgb(17, 22, 32)` | Maximum contrast titles |

#### **Muted Bus-Type Badge Palette (Desaturated Letterpress Style)**
| Bus Type | Background Hex | Text Hex | Style Class |
|---|---|---|---|
| **KSRTC** | `#EBF1F7` | `#2E5A8A` | `.badge-ksrtc` |
| **Private** | `#EEE9F7` | `#5B3A8A` | `.badge-private` |
| **Fast Passenger** | `#E8F5EE` | `#24643C` | `.badge-fast` |
| **Super Fast** | `#FBE9E9` | `#8A2E2E` | `.badge-superfast` |
| **Ordinary** | `#F0F1F3` | `#4A5568` | `.badge-ordinary` |

#### **Status & Pin Markers**
| Purpose | Hex Code | Visual Description |
|---|---|---|
| **Origin Stop Pin** | `#1B7F4C` | Deep green SVG pin & route progress start dot |
| **Destination Stop Pin** | `#B3261E` | Deep red SVG pin & route progress end dot |
| **Intermediate Stop Marker** | `#0B2545` | White circular badge with navy border & stop number |
| **Partial Match Notice** | `#F5A623` | Amber-400 2px left border on `#F5A623`/10 background |
| **Live Status Dot** | `#F5A623` | 6px amber dot (`.live-dot`) |

---

### 2. Typography & Tabular Numerals
- **Primary Font Family:** `'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Monospace Font Family:** `'JetBrains Mono', 'Fira Code', 'Consolas', monospace` (used for bus registration numbers)
- **Tabular Figures:** `font-variant-numeric: tabular-nums;` is applied across all timing, fare, distance, and duration data to ensure strict character alignment like transit departure boards.

---

### 3. Keyframe Animations & Micro-Interactions
Animations are subtle and wrapped with `@media (prefers-reduced-motion: no-preference)` to respect accessibility:
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

### 4. Custom Reusable Utility Classes (`index.css`)
- `.btn-amber`: Signal amber primary CTA (`bg-amber-400 text-navy-800 font-semibold px-5 py-2.5 rounded-lg hover:bg-amber-300 min-h-[44px]`)
- `.btn-navy`: Navy secondary button (`bg-navy-800 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-navy-700 min-h-[44px]`)
- `.btn-ghost`: Outline ghost button (`border border-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-100 min-h-[44px]`)
- `.transit-card`: Border-based card container (`bg-white rounded-lg border border-neutral-200 shadow-transit`)
- `.transit-row`: Transit-board result item (`bg-white border border-neutral-200 hover:border-neutral-300 shadow-transit`)
- `.input-field`: Off-white input with navy focus ring (`bg-neutral-50 border border-neutral-200 focus:border-navy-800 focus:ring-2 focus:ring-navy-800/15 min-h-[44px]`)
- `.route-progress`: Segmented flat route line with origin dot, dashed line, via stop label, and destination dot
- `.sticky-filter-bar`: Sticky sub-navbar (`sticky top-[56px] z-30 bg-navy-800 border-b border-navy-900`)
- `.map-muted`: Map tile filter (`filter: saturate(0.82) brightness(1.03)`)

---

## 🛠️ Technology Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **React** | `18.2.0` | UI Component Framework |
| **TypeScript** | `5.2.2` | Static type safety and data modeling |
| **Vite** | `5.4.21` | High-speed frontend bundler & dev server |
| **Tailwind CSS** | `3.3.6` | Utility-first styling with custom transit design tokens |
| **React Router DOM**| `6.20.1` | Client-side routing (`/`, `/search`, `/admin`, `/debug`) |
| **Leaflet & React Leaflet** | `1.9.4` / `4.2.1` | Interactive map tiles with custom SVG markers & polylines |
| **Lucide React** | `0.294.0` | Clean, lightweight transit iconography |
| **React Hot Toast** | `2.4.1` | User notification toasts for bookmarks, auth, and feedback |
| **Axios** | `1.6.2` | Promise-based REST client with baseURL config |
| **Firebase Client SDK** | `10.7.1` | Firebase Authentication (Email/Password & Admin detection) |
| **Date-fns** | `3.0.0` | Date and time utilities |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | `v18+` / `v20+` | JavaScript runtime environment |
| **TypeScript** | `5.3.3` | Transpiled server-side code |
| **Express** | `4.18.2` | RESTful API routing and middleware |
| **Firebase Admin SDK** | `12.0.0` | Server-side Firestore access |
| **CORS** | `2.8.5` | Cross-Origin Resource Sharing with multi-domain whitelist |
| **Dotenv** | `16.3.1` | Environment variable management |
| **Axios** | `1.13.2` | OpenStreetMap Nominatim geocoding integration |
| **Express Validator** | `7.0.1` | Request body validation |
| **Nodemon & ts-node** | `3.0.2` / `10.9.2` | Development hot-reload |

### Cloud Database & Hosting
| Service | Role |
|---|---|
| **Google Cloud Firestore** | NoSQL document database (`buses`, `stops`, `favorites`, `feedback`) |
| **Firebase Authentication** | User credentials & administrative role checking |
| **Render** | Node.js web service production deployment (`render.yaml`) |
| **Vercel** | SPA frontend hosting with edge rewrite rules (`vercel.json`) |
| **OpenStreetMap Nominatim** | Real-time geocoding and reverse geocoding API |

---

## 🏛️ System Architecture & Data Flow

```
+-----------------------------------------------------------------------------------+
|                                  USER BROWSER                                     |
|  [HomePage / SearchResults / AdminPage / DebugPage]                               |
|                                                                                   |
|  • Transit-Board Cards           • Segmented Route Progress   • Autocomplete      |
|  • React Leaflet (Custom Pins)   • Tabular-Nums Formatting    • Firebase Auth     |
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
|  ├── /api/favorites           (Inline route bookmarking endpoint)                 |
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

### 1. Directory Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx           # 56px sticky navy navbar with logo + auth button
│   │   │   └── Footer.tsx           # Compact navy footer with brand, contact & copyright
│   │   ├── AutocompleteInput.tsx    # Accessible stop input with keyboard navigation (↑↓ Enter Esc)
│   │   ├── BusCard.tsx              # Transit-board row card with flat segmented route & inline bookmark
│   │   ├── LoginModal.tsx           # Firebase Auth popup for login/registration
│   │   ├── ProtectedRoute.tsx       # Route guard redirecting non-admins
│   │   └── RouteMap.tsx             # React Leaflet map with custom SVG pins & muted tiles
│   ├── config/
│   │   ├── api.ts                   # Axios instance with VITE_API_URL baseURL
│   │   └── firebase.ts              # Firebase client app initialization
│   ├── contexts/
│   │   └── AuthContext.tsx          # Auth provider tracking currentUser & isAdmin status
│   ├── pages/
│   │   ├── AdminPage.tsx            # Full-featured Bus & Stop CRUD management
│   │   ├── DebugPage.tsx            # Diagnostic utility for API connectivity
│   │   ├── HomePage.tsx             # Navy hero, overlapping search card, 3-feature strip, inline results
│   │   └── SearchResults.tsx        # Sticky filter bar, responsive 1-col to 2-col results grid, map toggle
│   ├── types/
│   │   └── index.ts                 # Central TypeScript interfaces
│   ├── App.tsx                      # Clean React Router config (no dead routes)
│   ├── main.tsx                     # React DOM root render with Toaster
│   └── index.css                    # Design tokens, component classes, tabular-nums utilities
├── public/                          # Static assets
├── index.html                       # HTML5 entry with Inter font
├── tailwind.config.js               # Transit navy + signal amber design tokens
├── tsconfig.json                    # TypeScript compiler configuration
├── vercel.json                      # Vercel SPA routing rewrite rules
└── vite.config.ts                   # Vite configuration
```

### 2. Component Highlights

#### `Header.tsx`
- **Slim Sticky Bar:** 56px height (`h-14`), deep navy `#0B2545` background with hairline bottom border.
- **Logo:** Amber bus icon block + bold white wordmark with subtle "Kerala" badge.
- **Single Auth Button:** Amber "Log in" button when signed out; user avatar circle with dropdown menu (Admin link + Sign out) when signed in.
- **No Hamburger Menu:** Kept clean without mobile collapse since there are no redundant top-level links.

#### `BusCard.tsx`
- **Transit-Board Row Layout:** Dense horizontal format with `shadow-transit` border elevation.
- **Left Column:** Desaturated bus-type badge (`.badge-ksrtc`, `.badge-private`, etc.) + bus registration number in monospace font.
- **Center Column:** Bus name, flat segmented route progress line (`SegmentedRoute` component with origin dot, dashed line, via stop label, and destination dot), stop names, departure $\rightarrow$ arrival in `tabular-nums`, and duration.
- **Right Column:** Large bold fare in INR (`₹`) + total distance in km.
- **Inline Bookmark Button:** Bookmark icon in top right that saves the route directly via `POST /api/favorites` with toast feedback (no separate page required).
- **Accordion Timeline:** Clean hairline top border revealing vertical stop timeline with start/destination indicator dots and scheduled times.
- **Inline Notices:** Partial-match notice with amber left border; estimated times notice in neutral gray.

#### `RouteMap.tsx`
- **Custom SVG Markers:** Origin pin in deep green (`#1B7F4C`), Destination pin in deep red (`#B3261E`), numbered stop badges in white with navy border (`#0B2545`).
- **Muted Tile Styling:** CSS filter `.map-muted` (`saturate(0.82) brightness(1.03)`) for a clean, non-distracting map aesthetic.
- **Navy Route Polyline:** `#0B2545` dash-array line connecting all intermediate stops.
- **Synchronous Coordinates Lookup:** Fast dictionary lookup covering 30+ Kerala transit locations.

#### `AutocompleteInput.tsx`
- **Full Keyboard Accessibility:** Supports `ArrowDown`, `ArrowUp`, `Enter`, and `Escape` keys.
- **ARIA Attributes:** `role="combobox"`, `aria-autocomplete="list"`, `aria-expanded`, and `aria-activedescendant`.
- **Navy Active Selection:** Selected dropdown item highlighted with navy `#0B2545` background and white text.

#### `HomePage.tsx`
- **Navy Hero Band:** Deep navy `#0B2545` background with amber accent heading.
- **Overlapping Search Card:** Elevated card positioned over the hero border with inputs for From, To, Departure Time, Bus Type, and "Show all buses" checkbox.
- **Inline Results Preview:** Shows up to 3 matching bus cards directly on the home view with a "View all $\rightarrow$" action.
- **Compact 3-Feature Strip:** Plain, fluff-free feature highlights:
  1. *Arrival times* — See departure and arrival times for any route.
  2. *Route on map* — View the full route with intermediate stops on a live map.
  3. *Save routes* — Bookmark any result directly from the card.

#### `SearchResults.tsx`
- **Sticky Filter Bar:** Sticky bar under the navbar with horizontal scrolling bus-type chips (`All types`, `KSRTC`, `Private`, `Fast`, `Super Fast`, `Ordinary`) and clear filter action.
- **Map View Toggle:** Shows/hides `RouteMap` with active button state.
- **Responsive Results Grid:** 1 column on mobile, 2 columns on tablet and desktop (`grid-cols-1 md:grid-cols-2`).
- **Clean Empty State:** Minimal no-results card with "New search" button.

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
| `GET` | `/api/buses/search` | `from` (string, req)<br>`to` (string, req)<br>`type` (string, opt)<br>`time` (string, opt: `08:30 AM` / `14:30`)<br>`showAll` (boolean, opt) | `{ success: true, count: number, data: BusResult[] }` | Search engine matching origin, destination, intermediate routes, timing availability, distance and fare calculation. |
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
| `POST` | `/api/favorites` | `{ fromStop: string, toStop: string }` | Saves a route to user's favorites (triggered via inline card bookmark). |
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
      allow read, create, delete: if true;
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

# Terminal 2: Frontend (Port 5173 / 3000)
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
   - Ensure the frontend URL in `backend/.env` under `FRONTEND_URL` exactly matches your browser's protocol, host, and port (e.g. `http://localhost:5173` or `http://localhost:3000` without trailing slashes).
2. **Firebase Private Key Newline Escapes:**
   - In `.env` or Render environment settings, ensure the private key contains literal `\n` or properly formatted multi-line RSA PEM strings: `"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"`.
3. **Port In Use (EADDRINUSE):**
   - If port `5000` or `5173` is busy, configure alternative ports in `backend/.env` (`PORT=5001`) and `frontend/vite.config.ts`.
4. **Leaflet Custom Marker Alignment:**
   - SVG markers use `iconAnchor: [14, 36]` and `popupAnchor: [0, -36]` to pin the tip directly to the stop's geographic coordinates.

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
