# RoomTiffin Finder – AI-Powered Room, Tiffin, Vehicle & Gadget Rental Platform

A full-stack MERN application that helps users (students, working professionals, migrants) find **rental rooms**, **tiffin (home-food) services**, **rental scooty/bikes**, and **rental laptops/PCs** in a given city/area based on their **budget**, **location preference**, and other lifestyle preferences — with a **Generative AI layer** that understands natural-language input and gives smart, personalized recommendations across all categories. A built-in **Refer & Earn** program drives organic user growth.

---

## 1. Project Overview

Many people moving to a new city struggle to find two things simultaneously:
1. An affordable place to stay (PG/rented room) within their budget and preferred locality.
2. A reliable tiffin/mess service near that location that fits their food preferences and budget.

This project solves both problems in one platform. Users can either use structured filters (budget, area, food type, room type, etc.) or simply **describe what they need in plain language** (e.g., *"I need a room under ₹8000 near a college with a veg tiffin service nearby"*), and the AI will parse the intent and return matching rooms + tiffin services.

---

## 2. Objectives

- Build a unified platform listing **rental rooms, tiffin services, rental scooty/bikes, and rental laptops/PCs** for a given city/area.
- Allow users to search/filter listings by budget, location, category-specific preferences (room type, food type, vehicle type, device specs, etc.).
- Integrate a Generative AI feature that:
  - Understands natural language queries and converts them into structured filters across all four categories.
  - Recommends the best-matching combination of listings (e.g., room + tiffin + scooty near each other) based on user intent.
  - Explains *why* a particular listing or combo is a good match (AI-generated summary).
- Provide separate roles for **Users (Tenants/Renters)** and **Providers** (Room Owners, Tiffin Vendors, Vehicle Owners, Gadget Owners) to list and manage their services.
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
- View combined "Room + Tiffin" bundle suggestions near each other
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
- **Smart Recommendation Engine**: Rank and shortlist listings based on parsed preferences + proximity + past behavior.
- **AI-Generated Match Summary**: For each recommended room/tiffin pair, generate a short explanation like "This room is 500m from 2 affordable veg tiffin services and fits your ₹8,000 budget."
- **Chat-based Assistant (optional/stretch goal)**: Conversational interface where users can refine their search turn-by-turn.

### 4.4 Rental Scooty/Bike Feature
- Search vehicles by city/area, budget (per day/week/month), vehicle type (scooty, bike, electric, geared/non-geared)
- View vehicle details: mileage, fuel type, deposit amount, availability dates, images, owner rating
- Book/reserve a vehicle for a date range
- Providers can list their scooty/bike with pricing, documents required (DL, ID proof), and availability calendar
- AI can suggest a vehicle bundled with a room (e.g., "room + scooty near your workplace within budget")

### 4.5 Rental Laptop/PC Feature
- Search laptops/PCs by city/area, budget (per day/week/month), specs (RAM, processor, GPU, use-case: gaming/office/coding)
- View device details: condition, accessories included, deposit amount, availability, images, owner rating
- Book/reserve a device for a date range
- Providers can list their laptop/PC with specs, pricing, and availability calendar
- AI can recommend a suitable device based on stated use-case (e.g., "need a laptop for coding under ₹500/day")

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

**Vehicle** (Scooty/Bike)
- title, description, city, area, vehicleType (scooty/bike/electric), pricePerDay, pricePerWeek, pricePerMonth, depositAmount, fuelType, mileage, documentsRequired[], images[], ownerId, availability, location

**Device** (Laptop/PC)
- title, description, city, area, deviceType (laptop/PC), specs (ram, processor, gpu, storage), useCase[] (gaming/office/coding), pricePerDay, pricePerWeek, pricePerMonth, depositAmount, condition, accessoriesIncluded[], images[], ownerId, availability, location

**Booking** (generic, for room/vehicle/device reservations)
- userId, listingType (`room`/`vehicle`/`device`), listingId, startDate, endDate, status (pending/confirmed/completed/cancelled), amount

**Referral**
- referrerId, referredUserId, referralCode, status (pending/qualified/rewarded), rewardAmount, createdAt

**Wallet**
- userId, balance, transactions[] (type: credit/debit, amount, reason, timestamp)

**Preference/Query Log** (for AI context, optional)
- userId, rawQuery, parsedFilters (JSON), timestamp

**Review**
- userId, targetType (`room`/`tiffin`/`vehicle`/`device`), targetId, rating, comment

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

GET    /api/vehicles?city=&area=&vehicleType=&maxBudget=
POST   /api/vehicles             → (provider only)
PUT    /api/vehicles/:id
DELETE /api/vehicles/:id

GET    /api/devices?city=&area=&deviceType=&useCase=&maxBudget=
POST   /api/devices              → (provider only)
PUT    /api/devices/:id
DELETE /api/devices/:id

POST   /api/bookings             → { listingType, listingId, startDate, endDate }
GET    /api/bookings/my

POST   /api/referral/generate     → generates/returns user's referral code+link
POST   /api/referral/apply        → { referralCode } (applied at signup)
GET    /api/referral/dashboard    → referral stats + wallet balance
GET    /api/wallet                → wallet balance + transaction history

POST   /api/ai/parse-query        → { query: "cheap room near college with veg tiffin and a scooty" }
                                     → returns structured filters across categories
POST   /api/ai/recommend          → { filters }
                                     → returns ranked rooms/tiffin/vehicle/device combos with AI-generated reasoning
```

---

## 10. AI Integration Approach

1. **Input**: User types a free-text preference (or fills a form).
2. **Query Parsing**: Backend sends the text to an LLM (OpenAI/Gemini) with a system prompt instructing it to return structured JSON filters (budget, area, roomType, foodType, etc.).
3. **Filtering**: Use the parsed JSON to query MongoDB for matching rooms and tiffin services.
4. **Ranking & Reasoning**: Optionally send the shortlisted results back to the LLM to rank them and generate a short human-readable explanation per match.
5. **Response**: Send the final structured + explained results to the frontend, rendered via a TanStack Query hook (`useRecommendations`).

---

## 11. Milestones / Roadmap

- [ ] **Phase 1** – Setup MERN boilerplate, auth (JWT), basic room & tiffin CRUD
- [ ] **Phase 2** – Search & filter UI with TanStack Query integration
- [ ] **Phase 3** – Provider dashboard for managing listings
- [ ] **Phase 4** – Add rental vehicle (scooty/bike) and rental device (laptop/PC) modules (CRUD + search)
- [ ] **Phase 5** – Booking/reservation flow for rooms, vehicles, and devices (with date-range availability)
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
- Insurance/damage-protection add-ons for vehicle and device rentals.
- Tiered referral rewards (e.g., higher payout after N successful referrals).

---

## 13. Getting Started (to be filled in as development progresses)

```bash
# Clone repo
git clone <repo-url>

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install

# Set up environment variables
cp .env.example .env

# Run backend
cd server && npm run dev

# Run frontend
cd client && npm run dev
```

---

## 14. License
MIT (or your preferred license)
