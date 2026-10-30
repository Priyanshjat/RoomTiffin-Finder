import express from "express"
import {
  getListings,
  getListingById,
  signup,
  login,
  demoLogin,
  getMe,
  contactProvider,
  createBooking,
  getMyBookings,
  getReferralMe,
  getReferralHistory,
  applyReferralCode,
  validateReferralCode,
  getWallet,
  getFavorites,
  addFavorite,
  removeFavorite,
  getAreas,
  getAreaBySlug,
  getColleges
} from "../controllers/marketplaceController.js"
import { parseNaturalLanguageQuery } from "../controllers/ai/aiController.js"
import { aiRateLimiter } from "../middleware/rateLimitMiddleware.js"

const router = express.Router()

// Listings routes
router.get("/listings", getListings)
router.get("/listings/:id", getListingById)

// Indore Areas & Colleges routes
router.get("/areas", getAreas)
router.get("/areas/:slug", getAreaBySlug)
router.get("/colleges", getColleges)

// AI Natural Language Query Parser (Rate Limited)
router.post("/ai/parse", aiRateLimiter, parseNaturalLanguageQuery)

// Interaction & Protection Actions
router.post("/contact", contactProvider)
router.post("/bookings", createBooking)
router.get("/bookings/my", getMyBookings)

// Referral Program Routes
router.get("/referrals/me", getReferralMe)
router.get("/referrals/history", getReferralHistory)
router.post("/referrals/apply", applyReferralCode)
router.post("/referrals/validate", validateReferralCode)

// Wallet Route
router.get("/wallet", getWallet)

// Saved / Favorites Routes
router.get("/favorites", getFavorites)
router.post("/favorites", addFavorite)
router.delete("/favorites/:id", removeFavorite)

export default router
