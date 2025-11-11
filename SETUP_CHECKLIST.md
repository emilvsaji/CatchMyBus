# CatchMyBus Setup Checklist ✅

## Prerequisites
- [ ] Node.js v18+ installed
- [ ] npm installed
- [ ] Firebase account created
- [ ] Git installed (optional)

## Firebase Setup
- [ ] Create new Firebase project
- [ ] Enable Firestore Database
- [ ] Create Web App in Firebase
- [ ] Copy Web App configuration
- [ ] Generate Service Account Key (Settings → Service Accounts)
- [ ] Download service account JSON file
- [ ] Set Firestore security rules (use firestore.rules)

## Project Setup
- [ ] Clone/download the project
- [ ] Navigate to project directory
- [ ] Run `npm install` in root directory
- [ ] Run `cd frontend && npm install`
- [ ] Run `cd ../backend && npm install`

## Environment Configuration

### Frontend
- [ ] Create `frontend/.env` file
- [ ] Add `VITE_API_URL=http://localhost:5000/api`
- [ ] Add Firebase Web App config variables
- [ ] Update `frontend/src/config/firebase.ts` with your config

### Backend
- [ ] Create `backend/.env` file (copy from .env.example)
- [ ] Add `PORT=5000`
- [ ] Add Firebase Admin SDK credentials
- [ ] Add `FRONTEND_URL=http://localhost:3000`

## First Run
- [ ] Open terminal in project root
- [ ] Run `npm run dev` (or run frontend/backend separately)
- [ ] Wait for both servers to start
- [ ] Frontend: http://localhost:3000
- [ ] Backend: http://localhost:5000

## Add Sample Data
- [ ] Open http://localhost:3000/admin
- [ ] Add bus stops from sample-data.js
  - [ ] Thiruvananthapuram Central
  - [ ] Kollam KSRTC
  - [ ] Alappuzha
  - [ ] Kochi KSRTC
  - [ ] Thrissur KSRTC
  - [ ] Kozhikode KSRTC
- [ ] Add buses from sample-data.js
  - [ ] Trivandrum - Kochi Express
  - [ ] Kochi - Thrissur Super Fast
  - [ ] Kozhikode - Thrissur Fast
  - [ ] Trivandrum - Kollam Private
  - [ ] Kerala Coastal Ordinary

## Test Features
- [ ] Search for buses (e.g., Thiruvananthapuram to Kochi)
- [ ] View search results
- [ ] Check bus type filters
- [ ] View route on map
- [ ] Save a favorite route
- [ ] View favorites page
- [ ] Test mobile responsiveness (resize browser)

## Troubleshooting
- [ ] If port busy, change ports in config files
- [ ] If Firebase error, verify credentials
- [ ] If modules missing, run npm install again
- [ ] Check browser console for errors
- [ ] Check terminal for backend errors

## Optional Enhancements
- [ ] Add authentication
- [ ] Customize theme colors in tailwind.config.js
- [ ] Add more bus routes
- [ ] Implement real-time updates
- [ ] Add user profiles
- [ ] Deploy to production

## Production Deployment
- [ ] Update environment variables for production
- [ ] Build frontend: `cd frontend && npm run build`
- [ ] Build backend: `cd backend && npm run build`
- [ ] Deploy to hosting service (Vercel, Netlify, etc.)
- [ ] Update Firestore security rules for production
- [ ] Set up proper authentication
- [ ] Configure CORS for production URL

---

✅ **Setup Complete!** You're ready to use CatchMyBus!

Need help? Check README.md or QUICKSTART.md
