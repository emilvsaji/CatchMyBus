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
- **Transit-Board Interface:** High-density, professional transit board presentation focusing on readability, uppercase bus names, tabular alignment, and clean visual hierarchy.
- **Mobile-First Experience:** Built with a strict 375px+ responsive grid, touch-friendly hit areas ($\ge 44\text{px}$), sticky filter bars, and minimal scrolling friction.
- **Accurate Timing & Fare Engine:** Smart multi-criteria matching algorithm with exact/word-boundary stop matching, automated fare approximation, and distance calculations.

---

## 🎨 Design System, Colors & Visual Aesthetics

The application uses a **professional transit design system** anchored in deep transit navy and signal amber, avoiding childish saturated colors in favor of desaturated badges, tabular figures, uppercase bus titles, and border-based elevations.

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
| **User Stop Tag Pill** | `#F5A623` | Amber-400/20 background, amber-800 text, border chip for `Your From` & `Your To` |
| **Partial Match Notice** | `#F5A623` | Amber-400 2px left border on `#F5A623`/10 background |
| **Live Status Dot** | `#F5A623` | 6px amber dot (`.live-dot`) |

---

### 2. Typography & Tabular Numerals
- **Primary Font Family:** `'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Monospace Font Family:** `'JetBrains Mono', 'Fira Code', 'Consolas', monospace` (used for bus registration numbers)
- **Bus Name Styling:** Rendered in full uppercase with `tracking-wide` (`text-transform: uppercase`) for a transit board appearance.
- **Tabular Figures:** `font-variant-numeric: tabular-nums;` is applied across all timing, fare, distance, and duration data.

---

### 3. Keyframe Animations & Micro-Interactions
Animations are subtle and wrapped with `@media (prefers-reduced-motion: no-preference)`:
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
│   │   │   ├── Header.tsx           # 56px sticky navy navbar with logo + auth avatar dropdown
│   │   │   └── Footer.tsx           # Compact navy footer with brand, contact & copyright
│   │   ├── AutocompleteInput.tsx    # Accessible stop input with keyboard navigation (↑↓ Enter Esc)
│   │   ├── BusCard.tsx              # Transit-board row card with flat segmented route & stacked DEPARTS/ARRIVES
│   │   ├── LoginModal.tsx           # Firebase Auth popup styled with btn-amber
│   │   ├── ProtectedRoute.tsx       # Route guard redirecting non-admins
│   │   └── RouteMap.tsx             # React Leaflet map with custom SVG pins & muted tiles
│   ├── config/
│   │   ├── api.ts                   # Axios instance with VITE_API_URL baseURL
│   │   └── firebase.ts              # Firebase client app initialization
│   ├── contexts/
│   │   └── AuthContext.tsx          # Auth provider tracking currentUser & isAdmin status
│   ├── pages/
│   │   ├── AdminPage.tsx            # Bus & Stop CRUD management with real-time uppercase bus names
│   │   ├── DebugPage.tsx            # Diagnostic utility for API connectivity
│   │   ├── HomePage.tsx             # Navy hero, overlapping search card, desktop feature strip, inline results
│   │   └── SearchResults.tsx        # Sticky filter bar, responsive 1-col to 2-col results grid, map toggle
│   ├── types/
│   │   └── index.ts                 # Central TypeScript interfaces
│   ├── App.tsx                      # Clean React Router config
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
- **Slim Sticky Bar:** 56px height (`h-14`), deep navy `#0B2545` background.
- **Clean Logo:** Amber bus icon block + bold white "CatchMyBus" wordmark.
- **Auth Controls:** Amber "Log in" button when logged out; avatar circle with dropdown when logged in.
- **Admin Access:** "Admin panel" link surfaces inside the avatar dropdown menu for admins (above "Sign out").

#### `BusCard.tsx`
- **Transit-Board Row Layout:** Horizontal format with `shadow-transit` border elevation.
- **Uppercase Bus Names:** Rendered in full uppercase with `tracking-wide` (`text-transform: uppercase`).
- **Stacked Timing Display:** 3-column block with small uppercase labels:
  - *DEPARTS:* Departure time in `tabular-nums` + stop name.
  - *DURATION CONNECTOR:* Thin vertical line + trip duration (`Xh Ym` / `Ym` / `↓`).
  - *ARRIVES:* Arrival time in `tabular-nums` + stop name.
- **Inline Bookmark:** Top-right bookmark icon posting to `/api/favorites`.
- **Intermediate Stop Timeline:** Vertical timeline with exact/word-boundary stop matching (`isStopMatch`). Displays amber chip tags: `Your From`, `Your To`, `Start`, `End`.

#### `AdminPage.tsx`
- **Add Bus Action:** Action button `+ Add Bus` beside the "Manage Buses" section header and top tab row.
- **Real-Time Uppercase:** Bus name fields automatically convert typed text to uppercase in real time (`e.target.value.toUpperCase()`).

#### `LoginModal.tsx`
- **Clean Modal Shell:** Styled with `btn-amber` primary CTA button.
- **Removed Hardcoded Credentials:** Removed static admin email/password hint box.

#### `HomePage.tsx` & `SearchResults.tsx`
- **Desktop-Only Feature Strip:** 3-card feature strip hidden on mobile (`hidden sm:block`) for mobile search focus.
- **Refined Bottom Spacing:** Reduced bottom padding (`pb-8`) and grid margins (`mb-6`) above the footer.

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
│   │   ├── busRoutes.ts             # Bus search (exact/word-boundary stop index matching)
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
| `GET` | `/api/buses/search` | `from` (string, req)<br>`to` (string, req)<br>`type` (string, opt)<br>`time` (string, opt)<br>`showAll` (boolean, opt) | `{ success: true, count: number, data: BusResult[] }` | Search engine with word-boundary stop matching, distance, fare, and timing calculation. |
| `GET` | `/api/buses/stops` | None | `{ success: true, count: number, data: BusStop[] }` | Returns all registered bus stops for autocomplete. |
| `GET` | `/api/buses/stops/nearby` | `lat` (number)<br>`lng` (number)<br>`radius` (number) | `{ success: true, count: number, data: BusStop[] }` | Spatial lookup of nearby bus stops within radius using Haversine calculation. |

#### **Admin Management Routes (`/api/admin`)**
| Method | Endpoint | Payload / Params | Description |
|---|---|---|---|
| `GET` | `/api/admin/buses` | None | Retrieves all bus records for admin overview. |
| `POST` | `/api/admin/buses` | `{ busName, from, via, to, type, route: string[], timings: BusTiming[] }` | Registers a new bus route (auto-uppercased name). |
| `PUT` | `/api/admin/buses/:id` | Partial bus object payload | Updates existing bus information. |
| `DELETE` | `/api/admin/buses/:id` | `:id` path parameter | Permanently deletes a bus from Firestore. |
| `POST` | `/api/admin/stops` | `{ name, district, location: { lat, lng } }` | Adds a new official bus stop. |
| `GET` | `/api/admin/debug/buses` | `limit` (number, opt) | Diagnostic inspection of raw Firestore documents. |

#### **User Favorites Routes (`/api/favorites`)**
| Method | Endpoint | Payload / Params | Description |
|---|---|---|---|
| `GET` | `/api/favorites` | None | Retrieves saved routes for the user. |
| `POST` | `/api/favorites` | `{ fromStop: string, toStop: string }` | Saves a route to user's favorites (triggered via inline card bookmark). |
| `DELETE` | `/api/favorites/:id` | `:id` path parameter | Removes a saved route. |

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
  busName: string;            // e.g. "TRIVANDRUM - KOCHI EXPRESS"
  type: 'KSRTC' | 'Private' | 'Fast' | 'Super Fast' | 'Ordinary';
  from?: string;              // Starting terminus
  to?: string;                // Ending terminus
  via?: string;               // Optional intermediate landmark string
  route: string[];            // Array of ordered stop names
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
```

---

## 🧮 Algorithms & Calculation Logic

### 1. Stop Matching Engine (`isStopMatch` & `matchStopIndex`)
Prevents false-positive substring matches (e.g. searching "Pala" will not match "Panackapalam"):
```typescript
const normalizeStop = (s: string) =>
  (s || '')
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const isStopMatch = (stopCandidate: string, targetQuery: string): boolean => {
  const normCandidate = normalizeStop(stopCandidate);
  const normTarget = normalizeStop(targetQuery);
  if (!normCandidate || !normTarget) return false;

  // 1. Exact match
  if (normCandidate === normTarget) return true;

  // 2. Word-boundary match
  const wordRegex = new RegExp(`(^|\\s)${normTarget}(\\s|$)`, 'i');
  if (wordRegex.test(normCandidate)) return true;

  // 3. Reverse word-boundary match
  const reverseWordRegex = new RegExp(`(^|\\s)${normCandidate}(\\s|$)`, 'i');
  if (reverseWordRegex.test(normTarget)) return true;

  return false;
};
```

---
*Built with ❤️ for commuters across Kerala.*
