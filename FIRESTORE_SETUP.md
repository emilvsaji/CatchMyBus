# Firestore Database Setup Guide

## ⚠️ Current Issue
Your backend is showing error: **"5 NOT_FOUND"** - This means Firestore is not enabled or not properly configured in your Firebase project.

## 🔧 Steps to Fix:

### 1. Enable Firestore Database

1. **Go to Firebase Console**: https://console.firebase.google.com/project/catchmybus-8fafa

2. **Navigate to Firestore Database**:
   - Click on "Firestore Database" in the left sidebar
   - OR go directly to: https://console.firebase.google.com/project/catchmybus-8fafa/firestore

3. **Create Database**:
   - Click "Create database" button
   - Select **"Start in production mode"** or **"Start in test mode"**
     - **Test mode** (recommended for development): Anyone can read/write for 30 days
     - **Production mode**: Requires security rules (more secure)
   
4. **Choose Firestore Location**:
   - Select a location close to you (e.g., `asia-south1` for India)
   - **IMPORTANT**: Once selected, this cannot be changed!
   - Click "Enable"

5. **Wait for initialization**: Takes 30-60 seconds

### 2. Verify Firestore is Working

After enabling Firestore:

1. **Refresh your backend terminal** (it should auto-restart)
2. **Try adding a bus** from the admin panel
3. You should see the bus data appear in Firestore console

### 3. Optional: Add Sample Data Manually

You can manually add a test document to verify Firestore works:

1. In Firestore console, click **"Start collection"**
2. Collection ID: `buses`
3. Document ID: (Auto-ID)
4. Fields:
   - `busNumber` (string): "KL-01-TEST"
   - `busName` (string): "Test Bus"
   - `type` (string): "KSRTC"
   - `route` (array): ["Stop1", "Stop2"]
5. Click **Save**

### 4. Security Rules (Optional - for Production)

If you started in production mode, add these security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow all reads
    match /{document=**} {
      allow read: if true;
    }
    
    // Allow writes only to authenticated users
    match /buses/{busId} {
      allow write: if request.auth != null;
    }
    
    match /stops/{stopId} {
      allow write: if request.auth != null;
    }
    
    match /favorites/{favoriteId} {
      allow write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    match /feedback/{feedbackId} {
      allow create: if true;
      allow update, delete: if request.auth != null;
    }
  }
}
```

## ✅ After Setup

Once Firestore is enabled:
1. Your backend will automatically connect
2. Try adding a bus from http://localhost:5173/admin
3. Check Firestore console to see the data appear in real-time

## 🚨 Common Issues

**Issue**: "insufficient permissions"
- **Fix**: Change Firestore rules to test mode temporarily

**Issue**: "Project not found"
- **Fix**: Verify your Firebase project ID matches in `.env` file

**Issue**: Still getting errors
- **Fix**: Restart the backend: `npm run dev` in backend folder
