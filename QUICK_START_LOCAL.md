# LAZEEZ - Quick Start Local Setup

## What You'll Do (30 minutes)

1. **Clone & setup frontend locally**
2. **Create backend from scratch** (copy-paste the code below)
3. **Connect MongoDB Atlas**
4. **Run everything locally**
5. **Deploy to production** (Render + GitHub Pages)

---

## PHASE 1: MongoDB Setup (5 min)

1. Go to https://mongodb.com/cloud/atlas
2. Create FREE cluster (M0)
3. Create user: `lazeezadmin` / (strong password)
4. Whitelist IP: 0.0.0.0/0
5. Copy connection string:
   ```
   mongodb+srv://lazeezadmin:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

---

## PHASE 2: Clone & Setup (5 min)

```bash
git clone https://github.com/Zishanmallick/Lazeez.git
cd Lazeez
npm install
```

---

## PHASE 3: Create Backend Files (10 min)

Create folder structure:
```
backend/
  ├─ server.js
  ├─ package.json (done ✅)
  ├─ .env
  ├─ models/
  │  ├─ FoodItem.js
  │  └─ Booking.js
  ├─ routes/
  │  └─ api.js
  └─ utils/
     └─ seedFromGitHub.js
```

### File: `backend/.env`
```
MONGO_URI=mongodb+srv://lazeezadmin:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
PORT=5000
CORS_ORIGIN=http://localhost:5173
```

### File: `backend/models/FoodItem.js`
```js
const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, default: 4.5 },
  calories: { type: Number, default: 0 },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  available: { type: Boolean, default: true },
  extras: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('FoodItem', foodSchema);
```

### File: `backend/models/Booking.js`
```js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  items: [{
    foodItem: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem' },
    quantity: { type: Number, default: 1 }
  }],
  userId: { type: String, required: true },
  total: { type: Number, required: true },
  address: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'preparing', 'on_the_way', 'delivered'],
    default: 'pending'
  },
  eta: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
```

### File: `backend/routes/api.js`
```js
const express = require('express');
const FoodItem = require('../models/FoodItem');
const Booking = require('../models/Booking');
const router = express.Router();

// GET /api/food?page=1&limit=12&search=pizza
router.get('/food', async (req, res) => {
  const { page = 1, limit = 12, search = '' } = req.query;
  const filter = search ? { name: { $regex: search, $options: 'i' } } : {};
  const items = await FoodItem.find(filter)
    .skip((page - 1) * limit)
    .limit(Number(limit));
  const total = await FoodItem.countDocuments(filter);
  res.json({ data: items, page, total, totalPages: Math.ceil(total / limit) });
});

// GET /api/food/:id
router.get('/food/:id', async (req, res) => {
  const item = await FoodItem.findById(req.params.id);
  res.json(item);
});

// POST /api/bookings
router.post('/bookings', async (req, res) => {
  const { items, userId, total, address } = req.body;
  const booking = await Booking.create({
    items, userId, total, address,
    eta: new Date(Date.now() + 30 * 60 * 1000)
  });
  res.json(booking);
});

// GET /api/bookings
router.get('/bookings', async (req, res) => {
  const bookings = await Booking.find().populate('items.foodItem');
  res.json(bookings);
});

// GET /api/kpi
router.get('/kpi', async (req, res) => {
  const totalRevenue = await Booking.aggregate([{
    $group: { _id: null, total: { $sum: '$total' } }
  }]);
  res.json({
    totalRevenue: totalRevenue[0]?.total || 0,
    totalOrders: await Booking.countDocuments()
  });
});

module.exports = router;
```

### File: `backend/utils/seedFromGitHub.js`
```js
require('dotenv').config();
const mongoose = require('mongoose');
const FoodItem = require('../models/FoodItem');

const MONGO_URI = process.env.MONGO_URI;

const dummyData = [
  { name: 'Biryani', category: 'Rice', price: 300, rating: 4.8, calories: 450 },
  { name: 'Butter Chicken', category: 'Curry', price: 350, rating: 4.7, calories: 400 },
  { name: 'Paneer Tikka', category: 'Appetizer', price: 250, rating: 4.6, calories: 200 },
  { name: 'Naan', category: 'Bread', price: 50, rating: 4.5, calories: 300 },
  { name: 'Samosa', category: 'Snack', price: 30, rating: 4.4, calories: 150 }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    await FoodItem.deleteMany({});
    await FoodItem.insertMany(dummyData);
    console.log('✅ Database seeded!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();
```

---

## PHASE 4: Run Locally (5 min)

```bash
# Terminal 1: Backend
cd backend
npm install
npm run seed    # Seed database
npm run dev     # Start server

# Terminal 2: Frontend
npm run dev
```

Backend: http://localhost:5000/health ✅
Frontend: http://localhost:5173 ✅

---

## PHASE 5: Deploy Backend (10 min)

1. Push to GitHub:
   ```bash
   git add .
   git commit -m "feat: Add backend infrastructure"
   git push
   ```

2. Go to https://render.com
3. Connect GitHub repo
4. Create Web Service:
   - Root: `backend`
   - Build: `npm install`
   - Start: `node server.js`
   - Add env vars:
     - `MONGO_URI`: Your MongoDB connection string
     - `CORS_ORIGIN`: https://zishanmallick.github.io/Lazeez

5. Deploy & get URL: `https://lazeez-backend-xxx.onrender.com`

---

## PHASE 6: Update Frontend API

In `app/page.tsx` or `App.tsx`:
```typescript
const API_URL = process.env.VITE_BACKEND_URL || 
  'https://lazeez-backend-xxx.onrender.com';

const response = await fetch(`${API_URL}/api/food`);
```

Also update `.env.local`:
```
VITE_BACKEND_URL=https://lazeez-backend-xxx.onrender.com
```

---

## PHASE 7: Deploy Frontend (GitHub Pages)

```bash
npm run build
git add .
git commit -m "build: Deploy to GitHub Pages"
git push
```

Go to Repo Settings → Pages → Deploy from main branch

Live at: https://zishanmallick.github.io/Lazeez ✅

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/food?page=1&limit=12&search=x` | List food |
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings` | All bookings |
| GET | `/api/kpi` | Dashboard stats |

---

## Next: Android APK (Optional)

```bash
npm install @capacitor/core @capacitor/cli -D
npx cap init
npx cap add android
npx cap open android
```

→ Build → Build APK in Android Studio

---

## Troubleshooting

**MongoDB connection error?**
- Check IP whitelist (0.0.0.0/0)
- Verify password in connection string

**CORS errors?**
- Update CORS_ORIGIN in backend/.env

**API not responding?**
- Check backend is running: `http://localhost:5000/health`

---

## Status

✅ Backend scaffold ready
✅ MongoDB integrated
✅ API routes defined
✅ Deployment paths clear

**Now run PHASE 1-4 locally, then deploy!**
