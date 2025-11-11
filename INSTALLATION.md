# CatchMyBus - Installation Instructions

## For Windows (PowerShell)

### Step 1: Install Dependencies
```powershell
# Navigate to project root
cd C:\Users\emils\OneDrive\Desktop\Projects\CatchMyBus

# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ..\backend
npm install

# Go back to root
cd ..
```

### Step 2: Create Environment Files

**Create frontend/.env:**
```powershell
cd frontend
echo "VITE_API_URL=http://localhost:5000/api" > .env
echo "VITE_FIREBASE_API_KEY=your_api_key" >> .env
echo "VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com" >> .env
echo "VITE_FIREBASE_PROJECT_ID=your_project_id" >> .env
echo "VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com" >> .env
echo "VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id" >> .env
echo "VITE_FIREBASE_APP_ID=your_app_id" >> .env
cd ..
```

**Create backend/.env:**
```powershell
cd backend
copy .env.example .env
# Then edit .env file with your Firebase credentials
cd ..
```

### Step 3: Run the Application
```powershell
# Run both frontend and backend together
npm run dev
```

Or run separately in different terminals:

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

---

## For Mac/Linux (Bash)

### Step 1: Install Dependencies
```bash
# Navigate to project root
cd ~/Desktop/Projects/CatchMyBus

# Install all at once
npm run install:all

# OR install separately
npm install
cd frontend && npm install
cd ../backend && npm install
cd ..
```

### Step 2: Create Environment Files

**Create frontend/.env:**
```bash
cat > frontend/.env << EOF
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
EOF
```

**Create backend/.env:**
```bash
cp backend/.env.example backend/.env
# Then edit backend/.env with your Firebase credentials
```

### Step 3: Run the Application
```bash
# Run both frontend and backend together
npm run dev
```

---

## Verify Installation

1. **Backend Running:**
   - Open: http://localhost:5000/health
   - Should see: `{"status":"ok","message":"CatchMyBus API is running"}`

2. **Frontend Running:**
   - Open: http://localhost:3000
   - Should see the CatchMyBus homepage

3. **Test the Application:**
   - Go to Admin Panel: http://localhost:3000/admin
   - Add a bus stop
   - Add a bus
   - Search for buses on the homepage

---

## Common Issues

### Issue: "npm: command not found"
**Solution:** Install Node.js from https://nodejs.org/

### Issue: "Port 3000 is already in use"
**Solution:** 
- Kill the process using port 3000
- Or change port in `frontend/vite.config.ts`

### Issue: "Port 5000 is already in use"
**Solution:**
- Kill the process using port 5000
- Or change PORT in `backend/.env`

### Issue: "Module not found"
**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules frontend/node_modules backend/node_modules
npm run install:all
```

### Issue: Firebase errors
**Solution:**
- Double-check your Firebase configuration
- Ensure Firestore is enabled in Firebase Console
- Verify service account key is correct

---

## Need Help?

1. Check **README.md** for full documentation
2. Check **QUICKSTART.md** for quick setup
3. Check **SETUP_CHECKLIST.md** for step-by-step guide
4. Check **PROJECT_SUMMARY.md** for overview

---

## Ready to Go? 🚀

Once everything is running:
1. Open http://localhost:3000
2. Explore the homepage
3. Go to Admin Panel and add sample data
4. Search for buses
5. Enjoy! 🎉
