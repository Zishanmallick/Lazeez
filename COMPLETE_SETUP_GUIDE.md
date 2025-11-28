# LAZEEZ - Complete Setup & Deployment Guide

## Overview
LAZEEZ is a full-stack food delivery AI app with:
- **Frontend**: TypeScript + Vite (AI Studio compatible)
- **Backend**: Node.js + Express + MongoDB
- **Mobile**: Capacitor for Android APK generation
- **PWA**: Offline-first with service workers

---

## STEP 1: MongoDB Atlas Setup (5 minutes)

### 1.1 Create MongoDB Cluster
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up or log in
3. Click "+ Create" → "New Project"
4. Name it "Lazeez"
5. Click "+ Create Cluster"
6. Select "M0 Sandbox" (FREE tier)
7. Provider: AWS, Region: Choose closest to you (e.g., ap-south-1 for India)
8. Click "Create Cluster" (wait 1-2 minutes)

### 1.2 Create Database User
1. In Atlas dashboard, go to "Database Access"
2. Click "+ Add New Database User"
3. Username: `lazeezadmin`
4. Password: Generate secure password (copy it!)
5. Built-in Role: "Atlas Admin"
6. Click "Add User"

### 1.3 Whitelist IP
1. Go to "Network Access" tab
2. Click "+ Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0) for development
4. Click "Confirm"

### 1.4 Get Connection String
1. Go to "Clusters" → Click "Connect"
2. Choose "Drivers" (Node.js)
3. Copy the connection string:
   ```
   mongodb+srv://lazeezadmin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your password
5. This is your `MONGO_URI`

---

## STEP 2: Clone & Setup Locally (10 minutes)

### 2.1 Clone Repository
```bash
git clone https://github.com/Zishanmallick/Lazeez.git
cd Lazeez
```

### 2.2 Install Frontend Dependencies
```bash
npm install
```

### 2.3 Create Backend Folder
```bash
mkdir backend
cd backend
npm init -y
npm install express mongoose cors dotenv csvtojson nodemon
npm install -D @types/node
cd ..
```

### 2.4 Create .env.local (Frontend)
```
VITE_BACKEND_URL=http://localhost:5000
VITE_GEMINI_API_KEY=your_key_here
```

### 2.5 Create backend/.env
```
MONGO_URI=mongodb+srv://lazeezadmin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
PORT=5000
CORS_ORIGIN=http://localhost:5173
GITHUB_RAW_DATA_URL=https://raw.githubusercontent.com/Zishanmallick/Lazeez/main/data/food_data.csv
```

---

## STEP 3: Backend Files Creation (20 minutes)

### Files to Create:

**backend/package.json** (update scripts):
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed": "node utils/seedFromGitHub.js"
  }
}
```

**backend/server.js**
**backend/models/FoodItem.js**
**backend/models/Booking.js**
**backend/routes/api.js**
**backend/utils/seedFromGitHub.js**

→ See BACKEND_COMPLETE_CODE.md for all files

---

## STEP 4: Test Backend Locally (10 minutes)

```bash
cd backend

# Install deps
npm install

# Seed database
npm run seed

# Start server
npm run dev
```

Test: `http://localhost:5000/health`

---

## STEP 5: Deploy Backend on Render (15 minutes)

### 5.1 Push Backend to GitHub
```bash
git add backend/
git commit -m "feat: Add Node.js/Express/MongoDB backend"
git push origin main
```

### 5.2 Create Render Web Service
1. Go to https://render.com
2. Sign up with GitHub
3. Click "+ New" → "Web Service"
4. Connect your Lazeez repository
5. Configure:
   - **Name**: `lazeez-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Environment**:
     - `MONGO_URI`: Your MongoDB Atlas connection string
     - `PORT`: `5000`
     - `CORS_ORIGIN`: `https://zishanmallick.github.io`

### 5.3 Deploy
1. Click "Create Web Service"
2. Wait for deployment (2-3 minutes)
3. Copy the URL: `https://lazeez-backend-xxx.onrender.com`
4. Save this URL!

### 5.4 Seed Production Database
1. In Render dashboard, click your service
2. Go to "Shell" tab
3. Run: `npm run seed`
4. Wait for completion

---

## STEP 6: Add PWA Features (15 minutes)

### 6.1 Create public/manifest.json
```json
{
  "name": "LAZEEZ - AI Food Delivery",
  "short_name": "LAZEEZ",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#181818",
  "theme_color": "#ff914d",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

### 6.2 Update index.html
```html
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#ff914d">
<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
</script>
```

### 6.3 Create public/sw.js (Service Worker)
```javascript
const CACHE = 'lazeez-v1';
const urlsToCache = ['/'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
```

---

## STEP 7: Setup Capacitor (10 minutes)

### 7.1 Install Capacitor
```bash
npm install @capacitor/core @capacitor/cli -D
npx cap init
```

### 7.2 Add Android
```bash
npx cap add android
```

### 7.3 Create capacitor.config.json
```json
{
  "appId": "com.lazeez.app",
  "appName": "LAZEEZ",
  "webDir": "dist",
  "bundledWebRuntime": false,
  "server": {
    "androidScheme": "https"
  }
}
```

---

## STEP 8: Update Frontend API URLs

### In App.tsx and other API calls:
```typescript
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://lazeez-backend-xxx.onrender.com';

const response = await fetch(`${BACKEND_URL}/api/food`);
```

---

## STEP 9: Deploy Frontend (GitHub Pages)

### 9.1 Build Frontend
```bash
npm run build
```

### 9.2 Deploy
1. Push to GitHub:
   ```bash
   git add .
   git commit -m "feat: Add PWA, Capacitor, updated APIs"
   git push origin main
   ```

2. Go to GitHub repo Settings → Pages
3. Select "Deploy from branch" → main → /root
4. Your app is live at: `https://zishanmallick.github.io/Lazeez`

---

## STEP 10: Build Android APK

### 10.1 Sync Capacitor
```bash
npx cap sync
npx cap open android
```

### 10.2 Android Studio
1. Android Studio opens automatically
2. Wait for Gradle sync
3. Menu: Build → Build Bundle(s)/APK(s) → Build APK(s)
4. APK located: `android/app/build/outputs/apk/debug/app-debug.apk`

### 10.3 Install on Device
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

---

## API Endpoints Reference

### GET `/api/food?page=1&limit=12&search=pizza`
Fetch food items with filtering

### POST `/api/bookings`
Create a booking
```json
{
  "items": [{"foodItem": "id", "quantity": 1}],
  "userId": "user123",
  "total": 500,
  "address": "123 Main St"
}
```

### GET `/api/bookings`
Fetch all bookings (admin)

### GET `/api/kpi`
Get dashboard KPIs and analytics

---

## Troubleshooting

### MongoDB Connection Error
- Check IP whitelist on MongoDB Atlas
- Verify connection string in .env
- Ensure firewall allows outgoing connections

### CORS Issues
- Update `CORS_ORIGIN` in backend .env
- Ensure frontend URL matches

### APK Build Fails
- Run `./gradlew clean` in android folder
- Update Android SDK in Android Studio
- Check targetSdkVersion

---

## Next Steps
1. ✅ MongoDB Atlas ready
2. ✅ Backend deployed on Render
3. ✅ Frontend live on GitHub Pages
4. ✅ APK ready for Android
5. 🚀 Share with users!

**Status**: Production-ready!
