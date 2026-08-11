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
CatchMyBus provides daily commuters, students, working professionals, and travelers in Kerala with reliable bus schedules, departure and arrival timings, intermediate stop breakdowns, automated fare calculation, and interactive route mapping.

### Key Value Pillars
- **Transit-Board Interface:** High-density, professional transit board presentation focusing on readability, uppercase bus names, tabular alignment, and clean visual hierarchy.
- **Typo-Tolerant Autocomplete (Fuse.js):** Client-side fuzzy stop search matching Malayalam place names even with spelling variations or transpositions (e.g. `"eratpeta"` $\rightarrow$ `"Erattupetta"`).
- **Mobile-First Experience:** Built with a strict 375px+ responsive grid, touch-friendly hit areas ($\ge 44\text{px}$), sticky filter bars, and auto-scrolling to search results.
- **Accurate Timing & Fare Engine:** Smart multi-criteria matching algorithm with exact/word-boundary stop matching, directional filtering, automated fare approximation, and distance calculations.
- **Community-Powered Crowdsourcing:** Commuter bus suggestion portal with an administrative review and one-click publishing workflow.

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
| `neutral-400` | `#9AA3AF` | `rgb(154, 163, 175)` | Sub-labels, distance text, uppercase labels, input placeholders |
| `neutral-500` | `#6B7585` | `rgb(107, 117, 133)` | Secondary body copy, stop names, intermediate timeline times |
| `neutral-600` | `#4A5568` | `rgb(74, 85, 104)` | Intermediate text, filter labels |
| `neutral-700` | `#3A4455` | `rgb(58, 68, 85)` | High-contrast secondary headings |
| `neutral-800` | `#1E2530` | `rgb(30, 37, 48)` | **Primary Text (Slate-Gray)**, card titles, fares, entered inputs |
| `neutral-900` | `#111620` | `rgb(17, 22, 32)` | Maximum contrast titles |

#### **Muted Bus-Type Badge Palette (Desaturated Letterpress Style)**
| Bus Type | Background Hex | Text Hex | Style Class |
|---|---|---|---|
| **KSRTC** | `#EBF1F7` | `#2E5A8A` | `.badge-ksrtc` |
| **Private** | `#EEE9F7` | `#5B3A8A` | `.badge-private` |
| **Fast Passenger** | `#E8F5EE` | `#24643C` | `.badge-fast` |
| **Super Fast** | `#FBE9E9` | `#8A2E2E` | `.badge-superfast` |
| **Ordinary** | `#F0F1F3` | `#4A5568` | `.badge-ordinary` |

---

## 🛠️ Technology Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **React** | `18.2.0` | UI Component Framework |
| **TypeScript** | `5.2.2` | Static type safety and data modeling |
| **Vite** | `5.4.21` | High-speed frontend bundler & dev server |
| **Fuse.js** | `7.5.0` | Client-side typo-tolerant fuzzy stop autocomplete |
| **Tailwind CSS** | `3.3.6` | Utility-first styling with custom transit design tokens |
| **React Router DOM**| `6.20.1` | Client-side routing (`/`, `/search`, `/admin`, `/user-dashboard`, `/debug`) |
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

---

## 🏛️ System Architecture & Data Flow

```
+-----------------------------------------------------------------------------------+
|                                  USER BROWSER                                     |
|  [HomePage / SearchResults / AdminPage / UserDashboard / DebugPage]               |
|                                                                                   |
|  • Fuse.js Fuzzy Autocomplete    • Auto-Scroll to Results     • Transit-Board Cards|
|  • Scoped Dep/Arr Timelines      • React Leaflet Maps         • Firebase Auth     |
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
|  ├── /api/buses/search        (Multi-criteria route & directional stop matching)  |
|  ├── /api/buses/stops         (Autocomplete & spatial stops retrieval)            |
|  ├── /api/bus-requests        (Community suggestions submission & admin review)   |
|  ├── /api/admin/buses         (CRUD operations for bus routes & untimed buses)    |
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
|  ├── `buses`          (Routes, intermediate stops, schedules, untimed routes)     |
|  ├── `stops`          (Geocoded stop names, districts, latitude/longitude coords) |
|  ├── `busRequests`    (Community submissions: pending, approved, rejected)        |
|  ├── `favorites`      (User saved routes)                                         |
|  └── `feedback`       (Reports, status, user notes)                               |
+-----------------------------------------------------------------------------------+
```

---

## 💻 Frontend Architecture & Component Reference

### 1. Key Component Features

#### `AutocompleteInput.tsx` (Fuzzy Autocomplete)
- **Single Fuse.js Indexing**: Builds a `Fuse` search instance once using `useMemo` keyed on the `suggestions` array.
- **Typo Tolerance**: Configured with `threshold: 0.4`, `distance: 100`, `minMatchCharLength: 2`, `ignoreLocation: true`.
- **Early Trigger**: Activates suggestions at $\ge 2$ characters; returns top 6 relevance-ranked matches.
- **Empty State Fallback**: When $\ge 2$ characters yield zero matches, displays a non-selectable `"No matching stops — check spelling"` hint item.
- **Accessibility & Keyboard Nav**: Full WAI-ARIA combobox support (`role="combobox"`, `aria-autocomplete="list"`, `aria-expanded`, `aria-activedescendant`) and keyboard controls (ArrowDown, ArrowUp, Enter, Escape).

#### `BusCard.tsx` (Transit Board Card & Timeline)
- **Scoped DEPARTS / ARRIVES Labels**: The intermediate stops timeline strictly scopes `"Dep"` / `"Your From"` to the searched origin and `"Arr"` / `"Your To"` to the searched destination.
- **Intermediate Stops**: Stops between origin and destination render only their scheduled time in secondary text (`text-neutral-500`) without confusing `"Arr"`/`"Dep"` labels.
- **Untimed Bus Handling**: When a bus has no scheduled timings (`noTimings: true`), renders a `"Timings not yet available"` block with subtitle `"Route registered • Exact schedule to be announced"`.
- **Stacked Timing Layout**: 3-column block with DEPARTS, trip duration connector, and ARRIVES.

#### `HomePage.tsx` & `SearchResults.tsx` (Search Flow & Auto-Scroll)
- **Clear Instructional Placeholders**: `"Enter starting stop"`, `"Enter destination stop"`, `"Enter via stop (optional)"`.
- **Auto-Scroll on Search**: Attaches a `resultsRef` and calls `scrollToResults()` after search completion, with fallback for `prefers-reduced-motion`.

#### `AdminPage.tsx` (Corridor Importer & Request Pipeline)
- **"Import stops from existing route"**: Checks existing buses on the same corridor using `isStopMatch`. If 1 bus matches, populates the stop sequence with empty time inputs; if multiple buses match, displays an interactive Route Picker modal.
- **Untimed Bus Creation**: Admins can register routes with empty timings (`timings: []`), requiring only $\ge 2$ route stops.
- **Community Requests Approval**: Review commuter suggestions with expandable stop timelines, one-click live publishing, and structured rejection reasons.

#### `UserDashboard.tsx` (Commuter Dashboard)
- **Commuter Profile**: Persistent storage for name, phone, district, and hometown.
- **Suggest a Bus**: Community route contribution form with mandatory stop timings validation and smart comma/newline stop parser.

---

## ⚡ Backend Architecture & API Specification

### Complete REST API Specification

#### **Bus & Search Routes (`/api/buses`)**
| Method | Endpoint | Query / Body Parameters | Response Format | Description |
|---|---|---|---|---|
| `GET` | `/api/buses/search` | `from` (string, req)<br>`to` (string, req)<br>`type` (string, opt)<br>`time` (string, opt)<br>`showAll` (boolean, opt) | `{ success: true, count: number, data: BusResult[] }` | Search engine with word-boundary stop matching, distance, fare, timing calculation, and untimed route support. |
| `GET` | `/api/buses/stops` | None | `{ success: true, count: number, data: BusStop[] }` | Returns all registered bus stops for client-side Fuse.js indexing. |
| `GET` | `/api/buses/stops/nearby` | `lat` (number)<br>`lng` (number)<br>`radius` (number) | `{ success: true, count: number, data: BusStop[] }` | Spatial lookup of nearby stops within radius using Haversine calculation. |

#### **Community Bus Requests (`/api/bus-requests`)**
| Method | Endpoint | Payload / Params | Description |
|---|---|---|---|
| `POST` | `/api/bus-requests` | `{ busName, busNumber, from, via, to, type, route, timings, submittedBy, submittedByEmail, submittedByName, submittedByPhone }` | Commuter submission of missing bus schedules (`status: 'pending'`). |
| `GET` | `/api/bus-requests` | `status` (query, opt, defaults to `'pending'`) | Retrieves community submissions for admin review. |
| `PUT` | `/api/bus-requests/:id/approve` | `{ adminEmail: string }` | Approves request: creates live record in `buses` collection and sets request status to `'approved'`. |
| `PUT` | `/api/bus-requests/:id/reject` | `{ rejectionReason: string, adminEmail: string }` | Rejects request with reason. |

#### **Admin Management Routes (`/api/admin`)**
| Method | Endpoint | Payload / Params | Description |
|---|---|---|---|
| `GET` | `/api/admin/buses` | None | Retrieves all bus records for admin overview. |
| `POST` | `/api/admin/buses` | `{ busName, from, via, to, type, route: string[], timings?: BusTiming[] }` | Registers a new bus (timings optional, $\ge 2$ route stops required). |
| `PUT` | `/api/admin/buses/:id` | Partial bus object payload | Updates existing bus information. |
| `DELETE` | `/api/admin/buses/:id` | `:id` path parameter | Permanently deletes a bus from Firestore. |
| `POST` | `/api/admin/stops` | `{ name, district, location: { lat, lng } }` | Adds a new official bus stop. |

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
  route: string[];            // Array of ordered stop names (>= 2 required)
  timings: BusTiming[];       // Array of timing objects (can be [] for untimed buses)
  fare?: number;              // Base fare (optional)
  createdAt: Date;
  approvedFromRequestId?: string; // Reference to community suggestion if approved
}

// 3. Community Bus Request Document (`busRequests` collection)
interface BusRequest {
  id: string;
  busName: string;            // Uppercased bus title
  busNumber?: string;         // Vehicle registration
  type: 'KSRTC' | 'Private' | 'Fast' | 'Super Fast' | 'Ordinary';
  from?: string;
  to?: string;
  via?: string;
  route: string[];
  timings: Array<{ stopName: string; arrivalTime: string; departureTime: string }>;
  submittedBy: string;        // Submitter Firebase UID
  submittedByEmail?: string;  // Submitter email address
  submittedByName?: string;   // Submitter full name
  submittedByPhone?: string;  // Submitter contact number
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;        // Reviewing admin
  rejectionReason?: string;   // Reason if rejected
  approvedBusId?: string;     // Resulting bus ID in live 'buses' collection
}
```

---

## 🧮 Algorithms & Calculation Logic

### 1. Stop Normalization & Matching Engine
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

### 2. Client-Side Fuse.js Fuzzy Matching
```typescript
const fuse = useMemo(() => new Fuse(suggestions, {
  threshold: 0.4,       // 0 = exact match, 1 = match anything; 0.4 handles typos
  distance: 100,
  minMatchCharLength: 2,
  ignoreLocation: true, // Don't penalize matches based on position in string
}), [suggestions]);
```

---

## ⚙️ Environment Variables Reference

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=development
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FRONTEND_URL=http://localhost:5173
```

---

*Built with ❤️ for commuters across Kerala.*
