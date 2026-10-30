# RoomTiffin Finder – AI-Powered Room & Tiffin Rental Platform

A full-stack MERN application that helps users (students, working professionals, migrants) find **rental rooms** and **tiffin (home-food) services** in a given city/area based on their **budget**, **location preference**, and other lifestyle preferences — with a **Generative AI layer** that understands natural-language input and gives smart, personalized recommendations. A built-in **Refer & Earn** program drives organic user growth.

> **Scope note (Oct 2026):** The earlier planned **rental vehicles (scooty/bike)** and **rental laptops/PCs** modules have been **removed from the project scope**. The standalone **Sathi Bundle Recommender** (combined room+tiffin combo with combo pricing) has also been removed — Sathi now works purely as an AI natural-language query parser that understands English, Hindi and Hinglish, and points users straight to matching Room/Tiffin listings. All code, routes, models, mock data and UI for vehicles, devices, rental requests and bundles have been removed; the platform now focuses entirely on Rooms/PGs and Tiffin services.

---

## 1. Project Overview

Many people moving to a new city struggle to find two things simultaneously:
1. An affordable place to stay (PG/rented room) within their budget and preferred locality.
2. A reliable tiffin/mess service near that location that fits their food preferences and budget.

This project solves both problems in one platform. Users can either use structured filters (budget, area, food type, room type, etc.) or simply **describe what they need in plain language** (e.g., *"I need a room under ₹8000 near a college with a veg tiffin service nearby"*), and the AI will parse the intent and return matching rooms + tiffin services.

---

## 2. Objectives

- Build a unified platform listing **rental rooms and tiffin services** for a given city/area.
- Allow users to search/filter listings by budget, location, category-specific preferences (room type, food type, etc.).
- Integrate a Generative AI feature that:
  - Understands natural language queries and converts them into structured filters across both categories.
  - Points the user straight to the matching room & tiffin listings based on parsed intent.
  - Explains *how* Sathi read the query (AI-generated summary in the user's own language).
- Provide separate roles for **Users (Tenants/Renters)** and **Providers** (Room Owners, Tiffin Vendors) to list and manage their services.
- Implement a **Refer & Earn** system to reward users for inviting new users/providers, driving organic growth.
- Implement efficient client-side data fetching/caching using **TanStack Query**.
- Build a robust REST API using **Express.js** and **Node.js**.
- Store data in **MongoDB** using **Mongoose** schemas.
- Ensure the app is scalable, secure, and mobile-responsive.

---

## 3. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js (Vite), TanStack Query, React Router, Tailwind CSS (or CSS Modules) |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose ODM |
| Authentication | JWT (JSON Web Token) + bcrypt for password hashing |
| Generative AI | OpenAI API / Google Gemini API (LLM for query parsing & recommendation reasoning) |
| State Management | TanStack Query (server state) + Context API / Zustand (UI state, optional) |
| File/Image Upload | Multer + Cloudinary (for room/tiffin images) |
| Maps/Location | Google Maps API / Mapbox (optional, for area-based search) |
| Deployment | Vercel/Netlify (frontend), Render/Railway (backend), MongoDB Atlas (DB) |

---

## 4. Core Features

### 4.1 User (Tenant) Side
- Sign up / Login (JWT-based auth)
- Search rooms and tiffin services by:
  - City / Area / Locality
  - Budget range (min–max)
  - Room type (single, shared, PG, 1BHK, etc.)
  - Food preference (veg/non-veg/Jain, meal frequency)
- **AI Search Bar**: type a natural language query and get AI-parsed + ranked results
- Save/bookmark favorite listings
- Contact provider (chat or call/email reveal)
- Leave ratings & reviews for rooms and tiffin services

### 4.2 Provider Side (Room Owners / Tiffin Vendors)
- Register as a provider
- Create/edit/delete listings (room or tiffin service)
- Upload images, set price, area, amenities/menu details
- View inquiries from users
- Dashboard with basic analytics (views, inquiries)

### 4.3 Generative AI Features
- **Natural Language Query Parsing**: Convert free-text input into structured search filters (budget, area, food type, etc.) using an LLM.
- **Multilingual Understanding (Hindi & Hinglish)**: Sathi accepts English, Hindi (Devanagari) and Hinglish (Roman Hindi) queries — e.g. "मुझे भावरकुआ में 3000 का शेयर्ड कमरा चाहिए" or "sasta kamra near Vijay Nagar in 5 hazaar". Devanagari digits and number words (हज़ार, लाख) are converted to rupees, Hindi food/rent words map to the same filters, and the AI explanation replies in the language the user wrote in. The fallback parser (no Gemini key) also understands the common Hindi/Hinglish keywords.
- **Smart Filtering & Ranking**: Parsed preferences flow into the Rooms/Tiffin listing filters, which rank listings by relevance, proximity and price.
- **AI-Generated Match Summary**: Sathi explains how it understood the query — e.g. why a shortlisted match fits the parsed budget, area and food preference.
- **Chat-based Assistant (optional/stretch goal)**: Conversational interface where users can refine their search turn-by-turn.

### 4.4 Rental Scooty/Bike Feature *(Removed from scope)*
- This module was dropped from the current build (see scope note at the top). No vehicle code, data or endpoints exist in the codebase.

### 4.5 Rental Laptop/PC Feature *(Removed from scope)*
- This module was dropped from the current build (see scope note at the top). No device code, data or endpoints exist in the codebase.

### 4.6 Refer & Earn Program
- Every user gets a unique referral code/link on signup
- New users who sign up using a referral code get a welcome bonus/discount (wallet credit or coupon)
- Referrer earns a reward (wallet credit, cashback, or discount coupon) once the referred user completes a qualifying action (e.g., first booking/listing)
- In-app wallet to track referral earnings, redeemable against bookings/listings
- Referral dashboard showing: total referrals, pending rewards, redeemed rewards, referral leaderboard (optional gamification)
- Shareable referral link/QR code for WhatsApp, SMS, social media

### 4.7 Admin Panel (optional/stretch goal)
- Approve/reject new listings
- Manage users/providers
- View platform-wide analytics

### 4.8 Light / Dark Theme
- Toggle in the navbar (desktop pill + mobile button/drawer item)
- Preference saved in `localStorage` (`rt_theme`), defaults to the user's system preference
- Implemented with Tailwind `darkMode: 'class'` + a dark override layer in `client/src/index.css` (dark surfaces re-skin light page/card/border/text token utilities; accents like saffron/teal/emerald keep their identity)

---

## 5. Functional Requirements

1. Users must be able to register/login securely.
2. Users must be able to filter/search rooms and tiffin services independently or combined.
3. The system must accept a free-text query and use an AI API to extract structured filters.
4. The system must display AI-ranked recommendations with reasoning.
5. Providers must be able to CRUD their own listings.
6. The system must support image upload for listings.
7. The system must persist all data in MongoDB.
8. The system must expose a documented REST API consumed by the React frontend via TanStack Query.

---

## 6. Non-Functional Requirements

- **Performance**: Use TanStack Query caching/pagination to minimize redundant API calls.
- **Scalability**: Modular Express architecture (routes/controllers/services/models) to allow future features.
- **Security**: Hash passwords, validate/sanitize inputs, secure JWT storage (httpOnly cookies preferred), rate-limit AI endpoints.
- **Responsiveness**: Mobile-first UI since target users often search on phones.
- **Maintainability**: Clean folder structure, environment-based config (.env), reusable API service layer.

---

## 7. Suggested Folder Structure

```
room-tiffin-finder/
├── client/                        # React frontend
│   ├── src/
│   │   ├── api/                   # Axios instances + API functions
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/                 # custom TanStack Query hooks
│   │   ├── context/ or store/
│   │   └── App.jsx
│   └── package.json
│
├── server/                        # Express backend
│   ├── src/
│   │   ├── config/                 # db.js, cloudinary.js, etc.
│   │   ├── models/                 # User.js, Room.js, TiffinService.js, Booking.js
│   │   ├── routes/                 # authRoutes.js, roomRoutes.js, tiffinRoutes.js, aiRoutes.js
│   │   ├── controllers/
│   │   ├── middlewares/            # auth.js, errorHandler.js
│   │   ├── services/                # aiService.js (LLM API calls), recommendationEngine.js
│   │   └── server.js
│   └── package.json
│
├── .env.example
└── README.md
```

---

## 8. Core Data Models (Draft)

**User**
- name, email, password (hashed), role (`tenant` | `provider` | `admin`), phone, createdAt

**Room**
- title, description, city, area, address, price, roomType, amenities[], images[], ownerId, location (geo coordinates), availability

**TiffinService**
- name, description, city, area, price (per meal/monthly), foodType (veg/non-veg/Jain), mealTiming[], images[], vendorId, location

**Booking** (generic, for room/tiffin reservations)
- userId, listingType (`room`/`tiffin`), listingId, startDate, endDate, status (pending/confirmed/completed/cancelled), amount

**Referral**
- referrerId, referredUserId, referralCode, status (pending/qualified/rewarded), rewardAmount, createdAt

**Wallet**
- userId, balance, transactions[] (type: credit/debit, amount, reason, timestamp)

**Preference/Query Log** (for AI context, optional)
- userId, rawQuery, parsedFilters (JSON), timestamp

**Review**
- userId, targetType (`room`/`tiffin`), targetId, rating, comment

---

## 9. Sample API Endpoints

```
POST   /api/auth/register
POST   /api/auth/login

GET    /api/rooms?city=&area=&minBudget=&maxBudget=&roomType=
POST   /api/rooms                → (provider only)
PUT    /api/rooms/:id
DELETE /api/rooms/:id

GET    /api/tiffin?city=&area=&foodType=&maxBudget=
POST   /api/tiffin               → (provider only)

POST   /api/bookings             → { listingType, listingId, startDate, endDate }
GET    /api/bookings/my

POST   /api/referral/generate     → generates/returns user's referral code+link
POST   /api/referral/apply        → { referralCode } (applied at signup)
GET    /api/referral/dashboard    → referral stats + wallet balance
GET    /api/wallet                → wallet balance + transaction history

POST   /api/ai/parse        → { query: "cheap room near college with veg tiffin" }
                                     → returns structured filters across categories
```

---

## 10. AI Integration Approach

1. **Input**: User types a free-text preference (or fills a form).
2. **Query Parsing**: Backend sends the text to an LLM (OpenAI/Gemini) with a system prompt instructing it to return structured JSON filters (budget, area, roomType, foodType, etc.).
3. **Filtering**: Use the parsed JSON to query MongoDB for matching rooms and tiffin services.
4. **Ranking & Reasoning**: Optionally send the shortlisted results back to the LLM to rank them and generate a short human-readable explanation per match.
5. **Response**: Send the final structured results + explanation to the frontend, rendered on the AI Search page via a TanStack Query mutation.

---

## 11. Milestones / Roadmap

- [ ] **Phase 1** – Setup MERN boilerplate, auth (JWT), basic room & tiffin CRUD
- [ ] **Phase 2** – Search & filter UI with TanStack Query integration
- [ ] **Phase 3** – Provider dashboard for managing listings
- [ ] **Phase 4** – ~~Add rental vehicle (scooty/bike) and rental device (laptop/PC) modules~~ *(removed from scope)*
- [ ] **Phase 5** – Booking/reservation flow for room tours and meal trials (with date/time slots)
- [ ] **Phase 6** – Integrate Generative AI query parsing + cross-category recommendation engine
- [ ] **Phase 7** – Build Refer & Earn system (referral codes, wallet, rewards dashboard)
- [ ] **Phase 8** – Reviews/ratings, image uploads, geo-based search
- [ ] **Phase 9** – Polish UI, deploy (frontend + backend + DB), write documentation
- [ ] **Phase 10 (stretch)** – Admin panel, AI chat assistant, payment gateway integration

---

## 12. Future Scope

- In-app payment integration (Razorpay/Stripe) for bookings and referral payouts.
- Real-time chat between renter and provider (Socket.io).
- AI-based fraud/spam detection for fake listings.
- Push notifications for new matching listings and referral reward updates.
- Multi-city expansion with localized pricing insights.
- Insurance/damage-protection add-ons for high-value rentals (possible future scope).
- Tiered referral rewards (e.g., higher payout after N successful referrals).

---

## 13. Getting Started

### 13.1 Prerequisites
- Node.js 18+ and npm
- MongoDB (local `mongod` or a free MongoDB Atlas cluster — the app falls back to in-memory demo data automatically when the DB is unreachable)

### 13.2 Setup

```bash
# Clone repo
git clone <repo-url>

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install

# Set up environment variables
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Then fill in `server/.env`:

| Variable | Required? | Notes |
| --- | --- | --- |
| `PORT` | No | Default `5000` (local dev uses `8080` to match the Vite proxy) |
| `MONGO_URI` | Yes | Atlas URI recommended for real listings; without it the mock catalog still works |
| `JWT_SECRET` | Yes | Any long random string |
| `GEMINI_API_KEY` | Optional | Powers the AI natural-language query parser (fallback keyword parser if absent) |
| `CLOUDINARY_*` | Optional | Listing image uploads; falls back to local `server/uploads/` serving when empty |

`client/.env` — `VITE_API_BASE_URL` is only needed for production (deploy API URL). In dev it stays empty and the Vite proxy handles `/api` and `/uploads`.

### 13.3 Run in development

```bash
# Option A: run both together (Windows)
npm run dev            # from repo root

# Option B: separate terminals
cd server && npm run dev   # backend API
cd client && npm run dev   # frontend (Vite proxies /api -> backend port)
```

Optional seed data:
```bash
npm run seed           # from repo root
```

### 13.4 Production build

```bash
# Frontend bundle
cd client && npm run build     # outputs to client/dist

# Serve the API
cd server && npm start         # Express serves /api and uploaded images
```

### 13.5 Deployment checklist

1. **Backend (Render / Railway / VPS)** — set `PORT`, `MONGO_URI`, `JWT_SECRET`, and optionally `CLOUDINARY_*` env vars; start command `npm start`. Set up an uptime ping against `/api/health`.
2. **Frontend (Vercel / Netlify)** — build command `npm run build` with root directory `client`; add `VITE_API_BASE_URL=https://<your-api-domain>` env var so the client talks to the deployed API.
3. **Database** — MongoDB Atlas free tier; create the DB user and allow access from anywhere (or from the hosting IPs).
4. **Images** — set the three `CLOUDINARY_*` values on the server so uploaded listing images persist across redeploys (local `uploads/` folder is ephemeral on most hosts).
5. **CORS** — the API currently allows all origins (`app.use(cors())`). Restrict it to your frontend domain for production.

---

## 14. License
MIT (or your preferred license)
