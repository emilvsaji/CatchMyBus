# Authentication Setup Instructions

## 🔐 Authentication System Added!

Your CatchMyBus application now has a complete authentication system with:
- ✅ User Registration
- ✅ User Login
- ✅ Admin Login (with special privileges)
- ✅ Protected Admin Panel

## 🚀 How to Set Up

### 1. Enable Firebase Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `catchmybus-8fafa`
3. Click **"Authentication"** in the left sidebar
4. Click **"Get Started"**
5. Enable **"Email/Password"** sign-in method
6. Click **"Save"**

### 2. Create Admin Account

**Option A: Firebase Console (Recommended)**
1. Go to Authentication → Users
2. Click **"Add User"**
3. Email: `admin@catchmybus.com`
4. Password: (choose a secure password)
5. Click **"Add User"**

**Option B: Through the App**
1. Click "Login" button
2. Click "Register"
3. Use email: `admin@catchmybus.com`
4. Create a password
5. Register

## 👤 How It Works

### For Regular Users:
- Click **"Login"** button in navbar
- Register with any email
- Login to access favorites and other features
- **Cannot** access Admin Panel

### For Admin:
- Login with: `admin@catchmybus.com`
- **Can** access Admin Panel
- Admin Panel button appears in navbar only for admin
- Can add/manage buses and stops

## 🔑 Default Admin Email

The admin email is configured as:
```
admin@catchmybus.com
```

To change it, edit:
`frontend/src/contexts/AuthContext.tsx` line 37

## 🎯 Features

### Login Modal
- Email/Password authentication
- Toggle between Login/Register
- Form validation
- Error handling
- Shows admin credentials hint

### Protected Routes
- Admin panel requires admin login
- Non-admin users are redirected
- Toast notifications for access denied

### Navbar Updates
- **Not Logged In:** Shows "Login" button
- **Logged In (User):** Shows username + "Logout"
- **Logged In (Admin):** Shows username + "Logout" + "Admin" button

## 📱 Mobile Responsive
All auth features work perfectly on mobile devices!

## 🧪 Testing

1. **Test User Registration:**
   - Click Login → Register
   - Email: test@example.com
   - Password: test123
   - Try accessing /admin (should be denied)

2. **Test Admin Login:**
   - Login with: admin@catchmybus.com
   - Admin button should appear
   - Can access Admin Panel

3. **Test Logout:**
   - Click Logout
   - Admin button disappears
   - Redirected to home

## ⚠️ Important Notes

- First time setup requires Firebase Authentication to be enabled
- Admin account must be created before admin features work
- Only one email can be admin (configurable in code)
- For production, consider using Firebase Custom Claims for admin roles

## 🔒 Security

- Passwords are handled by Firebase (encrypted)
- Admin status checked on both client and should be verified on server
- Protected routes prevent unauthorized access
- Session persists across page refreshes

---

**Need Help?** Check the Firebase Authentication documentation or reach out for support!
