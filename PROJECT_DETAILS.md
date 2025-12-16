# CatchMyBus — Project Details

## What this project is
CatchMyBus is a mobile-responsive bus timing and route information system focused on Kerala. Users can search buses between two stops, see timings/route details, view a route map, estimate fare, and save favorite routes. Admins can manage buses/stops and review feedback.

## Tech stack (languages + frameworks)

### Frontend
- Language: TypeScript
- Framework: React 18
- Build tooling: Vite 5
- Styling: Tailwind CSS
- Routing: React Router
- Maps: Leaflet + React Leaflet
- UI utilities: Lucide icons, React Hot Toast
- HTTP: Axios
- Auth (client-side): Firebase Auth (email/password)
- 3D/visuals: Three.js (used by `BusProgress`)

### Backend
- Runtime: Node.js
- Language: TypeScript (compiled to `dist/`)
- Framework: Express
- Firebase: Firebase Admin SDK (Firestore access)
- Config: dotenv
- HTTP middleware: cors
- Validation: express-validator (dependency present)

### Database
- Firebase Firestore (NoSQL)

## High-level architecture
- SPA frontend (Vite/React) calls a REST API.
- Express backend reads/writes Firestore via Firebase Admin SDK.
- Frontend auth uses Firebase Auth; admin UI is gated in the client (`ProtectedRoute` + `AuthContext`).

Request flow:
1. User searches from/to in the UI.
2. Frontend calls `GET /api/buses/search` with query params.
3. Backend queries Firestore `buses`, matches routes, calculates distance/fare/time, returns results.

## Features

### User features
- Bus search between two stops (`HomePage`, `SearchResults`).
- Autocomplete suggestions for From/To based on Firestore `stops` (`GET /api/buses/stops`).
- Bus type filtering: KSRTC, Private, Fast, Super Fast, Ordinary.
- Route visualization on a map (`RouteMap`).
- Fare estimation and duration/distance display.
- Save favorite routes (`FavoritesPage`, `POST /api/favorites`).

### Admin features
- Add/update/delete buses (`/api/admin/buses`).
- Add bus stops (`/api/admin/stops`).
- Search/filter buses in admin UI.
- View and update feedback status (`/api/feedback`).

## API (backend)
Base path: `/api`

### Buses
- `GET /api/buses/search?from=...&to=...&type=...&time=...&showAll=true|false`
- `GET /api/buses/stops`
- `GET /api/buses/stops/nearby?lat=...&lng=...&radius=...`

### Admin
- `GET /api/admin/buses`
- `POST /api/admin/buses`
- `PUT /api/admin/buses/:id`
- `DELETE /api/admin/buses/:id`
- `POST /api/admin/stops`

### Favorites
- `GET /api/favorites`
- `POST /api/favorites`
- `DELETE /api/favorites/:id`

### Feedback
- `POST /api/feedback`
- `GET /api/feedback`
- `PUT /api/feedback/:id`

### Health
- `GET /health`

## Firestore data model (collections)

### `stops`
Typical fields:
- `name` (string)
- `district` (string)
- `location` ({ lat: number, lng: number })
- `createdAt` (timestamp/date)

### `buses`
Typical fields:
- `busName` (string)
- `from` (string)
- `to` (string)
- `via` (string, optional)
- `type` (string)
- `route` (string[])
- `timings` (array of stop/time objects)
- `createdAt` (timestamp/date)

### `favorites`
Typical fields:
- `userId` (string; currently a placeholder in backend)
- `fromStop` (string)
- `toStop` (string)
- `createdAt` (timestamp/date)

### `feedback`
Typical fields:
- `userId` (string; currently a placeholder in backend)
- `busId` (string)
- `message` (string)
- `type` (timing|route|other)
- `status` (pending|reviewed|resolved)
- `createdAt` (timestamp/date)

## Environment variables

### Frontend (`frontend/.env`)
- `VITE_API_URL` (example: `http://localhost:5000` or `https://<backend-domain>`)
- Firebase web app config:
  - `VITE_FIREBASE_API_KEY`
  - `VITE_FIREBASE_AUTH_DOMAIN`
  - `VITE_FIREBASE_PROJECT_ID`
  - `VITE_FIREBASE_STORAGE_BUCKET`
  - `VITE_FIREBASE_MESSAGING_SENDER_ID`
  - `VITE_FIREBASE_APP_ID`
  - `VITE_FIREBASE_MEASUREMENT_ID` (optional)

### Backend (`backend/.env`)
- `PORT`
- `NODE_ENV`
- Firebase Admin SDK credentials:
  - `FIREBASE_PROJECT_ID`
  - `FIREBASE_CLIENT_EMAIL`
  - `FIREBASE_PRIVATE_KEY`
- CORS allowlist:
  - `FRONTEND_URL` (comma-separated origins)

## Local development
From repo root:
- `npm run install:all`
- `npm run dev`

Or run separately:
- Backend: `cd backend` then `npm run dev`
- Frontend: `cd frontend` then `npm run dev`

Default ports:
- Frontend: Vite default (commonly `5173`)
- Backend: `5000`

## Deployment notes
- Frontend can be deployed to Vercel as a SPA (see `frontend/vercel.json` rewrite).
- Backend can be deployed to a Node host (Render is configured via `render.yaml`) or as a Vercel Node deployment.
- CORS: set backend `FRONTEND_URL` to the exact origin(s) that will call the API (no trailing slash needed; the server normalizes it).
- Firebase Admin `private_key` formatting is critical; ensure the env var preserves newlines correctly for your hosting provider.

## Security + production hardening (important)
- Firestore rules in `firestore.rules` are permissive for development; tighten them for production.
- Backend `favorites` and `feedback` currently use placeholder `userId` and do not enforce auth/roles server-side.
- Admin routes should be protected server-side (verify Firebase ID tokens + role checks), not only in the frontend.
