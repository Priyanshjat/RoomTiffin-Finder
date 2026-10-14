import store from "../services/marketplaceStore.js"
import jwt from "jsonwebtoken"
import { INDORE_AREAS, INDORE_COLLEGES } from "../data/indoreAreas.js"

// Helper to extract authenticated user or null
export const getAuthUser = (req) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null
  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecretjwtkey_roomtiffin_2026")
    return store.findUserById(decoded.id) || null
  } catch (err) {
    return null
  }
}

// Mask private data for guests per GUEST PRIVACY RULE
export const applyGuestPrivacy = (listing, isAuthed) => {
  if (isAuthed) {
    return {
      ...listing,
      isLocked: false
    }
  }

  // Mask exact location and full phone/whatsapp numbers
  return {
    ...listing,
    isLocked: true,
    exactLocation: "Sign in to unlock exact address and doorstep directions.",
    provider: {
      ...listing.provider,
      phone: listing.provider?.phone ? listing.provider.phone.replace(/\d{4}$/, "****") : "+91 98260 *****",
      whatsapp: listing.provider?.whatsapp ? listing.provider.whatsapp.replace(/\d{4}$/, "****") : "+91 98260 *****",
      email: "Sign in to view provider contact"
    }
  }
}

// GET /api/listings
export const getListings = async (req, res) => {
  const { category, search, neighborhood, maxBudget, minBudget, foodType, roomType, vehicleType, transmission, brand, tag } = req.query
  const authedUser = getAuthUser(req)

  let result = [...store.listings]

  // Filter by category
  if (category && category !== "all") {
    result = result.filter(item => item.category === category.toLowerCase())
  }

  // Filter by tag (featured, popular, newThisWeek)
  if (tag === "featured") {
    result = result.filter(item => item.isFeatured)
  } else if (tag === "popular") {
    result = result.filter(item => item.isPopular)
  } else if (tag === "newThisWeek") {
    result = result.filter(item => item.isNewThisWeek)
  }

  // Filter by search keyword
  if (search && search.trim()) {
    const q = search.trim().toLowerCase()
    result = result.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      (item.neighborhood && item.neighborhood.toLowerCase().includes(q)) ||
      (item.approxLocation && item.approxLocation.toLowerCase().includes(q)) ||
      (item.features && item.features.some(f => f.toLowerCase().includes(q)))
    )
  }

  // Filter by neighborhood
  if (neighborhood && neighborhood !== "all") {
    const n = neighborhood.toLowerCase()
    result = result.filter(item =>
      (item.neighborhood && item.neighborhood.toLowerCase().includes(n)) ||
      (item.approxLocation && item.approxLocation.toLowerCase().includes(n))
    )
  }

  // Filter by budget
  if (maxBudget) {
    result = result.filter(item => item.pricing.amount <= Number(maxBudget))
  }
  if (minBudget) {
    result = result.filter(item => item.pricing.amount >= Number(minBudget))
  }

  // Category specific filters
  if (foodType && foodType !== "all") {
    result = result.filter(item => item.foodType && item.foodType.toLowerCase().includes(foodType.toLowerCase()))
  }
  if (roomType && roomType !== "all") {
    result = result.filter(item => item.roomType === roomType.toLowerCase())
  }
  if (vehicleType && vehicleType !== "all") {
    result = result.filter(item => item.vehicleType && item.vehicleType.toLowerCase().includes(vehicleType.toLowerCase()))
  }
  if (transmission && transmission !== "all") {
    result = result.filter(item => item.transmission && item.transmission.toLowerCase().includes(transmission.toLowerCase()))
  }
  if (brand && brand !== "all") {
    result = result.filter(item =>
      item.title.toLowerCase().includes(brand.toLowerCase()) ||
      (item.specs && item.specs["Brand & Model"]?.toLowerCase().includes(brand.toLowerCase())) ||
      (item.brand && item.brand.toLowerCase() === brand.toLowerCase())
    )
  }

  const safeListings = result.map(l => applyGuestPrivacy(l, Boolean(authedUser)))

  res.status(200).json({
    success: true,
    message: "Listings fetched successfully",
    data: safeListings
  })
}

// GET /api/listings/:id
export const getListingById = async (req, res) => {
  const { id } = req.params
  const authedUser = getAuthUser(req)

  const found = store.listings.find(l => l.id === id || l._id === id)

  if (!found) {
    return res.status(404).json({
      success: false,
      message: "Listing not found or no longer active",
      data: null
    })
  }

  res.status(200).json({
    success: true,
    message: "Listing details fetched successfully",
    data: applyGuestPrivacy(found, Boolean(authedUser))
  })
}

// POST /api/auth/signup (and /api/auth/register)
export const signup = async (req, res) => {
  const { name, email, password, phone, referralCode, userType } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide full name, email, and password.",
      data: null
    })
  }

  try {
    const authResult = store.createUser({
      name,
      email,
      phone,
      password,
      referralCode,
      userType
    })

    res.status(201).json({
      success: true,
      message: "Welcome to RoomTiffin Finder! Your account has been created.",
      data: authResult
    })
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
      data: null
    })
  }
}

// POST /api/auth/login
export const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please enter your email and password.",
      data: null
    })
  }

  try {
    const authResult = store.loginUser(email, password)
    res.status(200).json({
      success: true,
      message: "Signed in successfully. Welcome back!",
      data: authResult
    })
  } catch (err) {
    res.status(401).json({
      success: false,
      message: err.message || "Invalid credentials.",
      data: null
    })
  }
}

// POST /api/auth/demo-login (Developer-only helper)
export const demoLogin = async (req, res) => {
  try {
    const authResult = store.loginUser("demo@roomtiffin.in", "demo123")
    res.status(200).json({
      success: true,
      message: "Developer session active: Seeded account loaded.",
      data: authResult
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Demo account not seeded.",
      data: null
    })
  }
}

// GET /api/auth/me
export const getMe = async (req, res) => {
  const authedUser = getAuthUser(req)

  if (!authedUser) {
    return res.status(401).json({
      success: false,
      message: "Session expired or unauthenticated. Please sign in.",
      data: null
    })
  }

  const { passwordHash: _, rawPassword: __, ...safeUser } = authedUser

  res.status(200).json({
    success: true,
    message: "User session valid",
    data: safeUser
  })
}

// POST /api/contact
export const contactProvider = async (req, res) => {
  const { listingId, message } = req.body
  const authedUser = getAuthUser(req)

  if (!listingId) {
    return res.status(400).json({
      success: false,
      message: "Listing ID is required",
      data: null
    })
  }

  res.status(200).json({
    success: true,
    message: "Inquiry sent! The verified owner will reach out via WhatsApp or phone shortly.",
    data: {
      inquiryId: "inq_" + Date.now(),
      status: "SENT",
      deliveredAt: new Date().toISOString()
    }
  })
}

// POST /api/bookings (Room Tour / Meal Trial)
export const createBooking = async (req, res) => {
  const { listingId, category, date, slot, notes, applyCredit = 0 } = req.body
  const authedUser = getAuthUser(req)

  if (!listingId) {
    return res.status(400).json({
      success: false,
      message: "Listing ID is required",
      data: null
    })
  }

  const actionName = category === "rooms" ? "Room Tour" : "Sample Meal Trial"
  let discountApplied = 0

  if (authedUser) {
    if (applyCredit > 0) {
      discountApplied = store.applyWalletDiscount(authedUser._id, applyCredit)
    }
    // Check if this fulfills a first request referral completion
    store.checkAndTriggerReferralCompletion(authedUser._id)
  }

  const booking = {
    bookingId: "bk_" + Date.now(),
    listingId,
    category: category || "rooms",
    date: date || new Date().toISOString().split("T")[0],
    slot: slot || "Morning (10:00 AM - 12:00 PM)",
    notes,
    discountApplied,
    status: "CONFIRMED",
    createdAt: new Date().toISOString()
  }

  store.bookings.push(booking)

  res.status(201).json({
    success: true,
    message: `${actionName} requested successfully! Provider has been notified.${discountApplied > 0 ? ` ₹${discountApplied} wallet credit applied!` : ""}`,
    data: booking
  })
}

// POST /api/rental-requests (Vehicle / Laptop)
export const createRentalRequest = async (req, res) => {
  const { listingId, category, duration, startDate, deliveryOption, applyCredit = 0 } = req.body
  const authedUser = getAuthUser(req)

  if (!listingId) {
    return res.status(400).json({
      success: false,
      message: "Listing ID is required",
      data: null
    })
  }

  const actionName = category === "vehicles" ? "Vehicle Rental" : "Laptop Rental"
  let discountApplied = 0

  if (authedUser) {
    if (applyCredit > 0) {
      discountApplied = store.applyWalletDiscount(authedUser._id, applyCredit)
    }
    store.checkAndTriggerReferralCompletion(authedUser._id)
  }

  const requestRecord = {
    requestId: "req_" + Date.now(),
    listingId,
    category: category || "vehicles",
    duration: duration || "1 Week",
    startDate: startDate || new Date().toISOString().split("T")[0],
    deliveryOption: deliveryOption || "Doorstep Delivery",
    discountApplied,
    status: "CONFIRMED",
    createdAt: new Date().toISOString()
  }

  store.rentalRequests.push(requestRecord)

  res.status(201).json({
    success: true,
    message: `${actionName} placed successfully! Provider will coordinate handover via WhatsApp.${discountApplied > 0 ? ` ₹${discountApplied} wallet credit applied!` : ""}`,
    data: requestRecord
  })
}

// GET /api/referrals/me
export const getReferralMe = async (req, res) => {
  const authedUser = getAuthUser(req)

  if (!authedUser) {
    return res.status(401).json({
      success: false,
      message: "Sign in to access your referral link and rewards.",
      data: null
    })
  }

  const stats = store.getReferralStats(authedUser._id)

  res.status(200).json({
    success: true,
    message: "Referral program details fetched successfully",
    data: stats
  })
}

// GET /api/referrals/history
export const getReferralHistory = async (req, res) => {
  const authedUser = getAuthUser(req)

  if (!authedUser) {
    return res.status(401).json({
      success: false,
      message: "Sign in to view referral history.",
      data: null
    })
  }

  const history = store.getReferralHistory(authedUser._id)

  res.status(200).json({
    success: true,
    message: "Referral history fetched successfully",
    data: history
  })
}

// POST /api/referrals/apply
export const applyReferralCode = async (req, res) => {
  const { code } = req.body
  const authedUser = getAuthUser(req)

  if (!authedUser) {
    return res.status(401).json({
      success: false,
      message: "Please sign in to apply a referral code.",
      data: null
    })
  }

  if (!code || !code.trim()) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid referral code.",
      data: null
    })
  }

  try {
    const result = store.applyReferralCodeForUser(authedUser._id, code)
    res.status(200).json({
      success: true,
      message: result.message,
      data: result
    })
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
      data: null
    })
  }
}

// POST /api/referrals/validate
export const validateReferralCode = async (req, res) => {
  const { code } = req.body

  if (!code || !code.trim()) {
    return res.status(400).json({
      success: false,
      message: "Referral code cannot be blank.",
      data: { isValid: false }
    })
  }

  const found = store.findUserByReferralCode(code.trim().toUpperCase())

  if (found) {
    res.status(200).json({
      success: true,
      message: "Valid referral code! You'll receive ₹100 welcome credit upon signup.",
      data: { isValid: true, code: code.trim().toUpperCase() }
    })
  } else {
    res.status(200).json({
      success: false,
      message: "This referral code does not exist or has expired.",
      data: { isValid: false }
    })
  }
}

// GET /api/wallet
export const getWallet = async (req, res) => {
  const authedUser = getAuthUser(req)

  if (!authedUser) {
    return res.status(401).json({
      success: false,
      message: "Sign in to view your wallet balance.",
      data: null
    })
  }

  const wallet = store.getWallet(authedUser._id)

  res.status(200).json({
    success: true,
    message: "Wallet details fetched successfully",
    data: wallet
  })
}

// GET /api/favorites
export const getFavorites = async (req, res) => {
  const authedUser = getAuthUser(req)

  if (!authedUser) {
    return res.status(200).json({
      success: true,
      message: "Guest favorites (empty)",
      data: []
    })
  }

  const favorites = store.getFavorites(authedUser._id)

  res.status(200).json({
    success: true,
    message: "Saved favorites fetched successfully",
    data: favorites
  })
}

// POST /api/favorites
export const addFavorite = async (req, res) => {
  const { listingId } = req.body
  const authedUser = getAuthUser(req)

  if (!authedUser) {
    return res.status(401).json({
      success: false,
      message: "Sign in to save listings to your favorites.",
      data: null
    })
  }

  if (!listingId) {
    return res.status(400).json({
      success: false,
      message: "Listing ID is required.",
      data: null
    })
  }

  const updatedFavs = store.addFavorite(authedUser._id, listingId)

  res.status(200).json({
    success: true,
    message: "Listing saved to favorites!",
    data: updatedFavs
  })
}

// DELETE /api/favorites/:id
export const removeFavorite = async (req, res) => {
  const { id } = req.params
  const authedUser = getAuthUser(req)

  if (!authedUser) {
    return res.status(401).json({
      success: false,
      message: "Sign in to manage saved listings.",
      data: null
    })
  }

  const updatedFavs = store.removeFavorite(authedUser._id, id)

  res.status(200).json({
    success: true,
    message: "Listing removed from favorites.",
    data: updatedFavs
  })
}

// GET /api/areas
export const getAreas = async (req, res) => {
  res.status(200).json({
    success: true,
    data: INDORE_AREAS
  })
}

// GET /api/areas/:slug
export const getAreaBySlug = async (req, res) => {
  const { slug } = req.params
  const area = INDORE_AREAS.find(a => a.slug.toLowerCase() === slug.toLowerCase())
  if (!area) {
    return res.status(404).json({
      success: false,
      message: `Area '${slug}' not found in Indore.`,
      data: null
    })
  }

  const authedUser = getAuthUser(req)
  const isAuthed = Boolean(authedUser)

  const areaNameCore = area.name.split(' ')[0].toLowerCase()

  // Find listings in this area
  const areaListings = store.listings
    .filter(l => {
      const matchNeigh = l.neighborhood && l.neighborhood.toLowerCase().includes(areaNameCore)
      const matchApprox = l.approxLocation && l.approxLocation.toLowerCase().includes(areaNameCore)
      return matchNeigh || matchApprox
    })
    .map(l => applyGuestPrivacy(l, isAuthed))

  res.status(200).json({
    success: true,
    data: {
      ...area,
      listings: areaListings
    }
  })
}

// GET /api/colleges
export const getColleges = async (req, res) => {
  res.status(200).json({
    success: true,
    data: INDORE_COLLEGES
  })
}

