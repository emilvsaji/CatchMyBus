# Quick Start Guide

## Installation Steps

### 1. Install All Dependencies
```bash
npm run install:all
```

### 2. Set Up Firebase
1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Firestore Database
3. Create a Web App and get the config
4. Generate a Service Account Key

### 3. Configure Environment Variables

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=your_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Backend (.env):**
```env
PORT=5000
NODE_ENV=development
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="your_private_key_here"
FIREBASE_CLIENT_EMAIL=your_client_email
FRONTEND_URL=http://localhost:3000
```

### 4. Run the Application
```bash
npm run dev
```

This starts both frontend (port 3000) and backend (port 5000).

## Testing the Application

1. **Open the app:** http://localhost:3000
2. **Go to Admin Panel:** Add sample buses and stops
3. **Search for buses:** Enter origin and destination
4. **Save favorites:** Click the heart icon on search results

## Common Issues

### Port Already in Use
If port 3000 or 5000 is busy:
- Frontend: Change port in `frontend/vite.config.ts`
- Backend: Change PORT in `backend/.env`

### Firebase Errors
- Double-check your Firebase configuration
- Ensure Firestore rules allow read/write operations
- Verify service account key is correct

### Module Not Found
```bash
cd frontend && npm install
cd ../backend && npm install
```

## Next Steps

1. Add sample data through Admin Panel
2. Test bus search functionality
3. Try different bus type filters
4. Save favorite routes
5. View routes on the map

For detailed documentation, see [README.md](./README.md)
