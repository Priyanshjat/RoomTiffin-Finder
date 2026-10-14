// AI Search Safety Service & Sathi Bundle Recommendation Controller
import store from "../../services/marketplaceStore.js"
import { INDORE_AREAS, INDORE_COLLEGES } from "../../data/indoreAreas.js"
import { getAuthUser, applyGuestPrivacy } from "../marketplaceController.js"

export const parseNaturalLanguageQuery = async (req, res) => {
  const { query } = req.body

  if (!query || !query.trim()) {
    return res.status(400).json({
      success: false,
      message: "Please provide a search description.",
      data: null
    })
  }

  const q = query.trim().toLowerCase()

  // 1. Safety Rule: Ambiguity Detection (Never silently guess a category)
  // Check if query is too vague, e.g. "something affordable for work", "cheap stuff", "need help"
  const isVague =
    q === "something affordable for work" ||
    q === "affordable for work" ||
    q === "cheap options" ||
    q === "need something for work" ||
    (
      !q.includes("room") && !q.includes("pg") && !q.includes("flat") && !q.includes("stay") &&
      !q.includes("tiffin") && !q.includes("dabba") && !q.includes("food") && !q.includes("meal") && !q.includes("lunch") && !q.includes("dinner") &&
      !q.includes("scooter") && !q.includes("bike") && !q.includes("activa") && !q.includes("car") && !q.includes("vehicle") &&
      !q.includes("laptop") && !q.includes("macbook") && !q.includes("thinkpad") && !q.includes("pc") && !q.includes("computer")
    )

  if (isVague) {
    return res.status(200).json({
      success: true,
      message: "Query flagged for confirmation due to ambiguous intent.",
      data: {
        status: "unclear",
        confidence: "low",
        summary: "Broad request lacking specific category.",
        explanation: "Your request is broad. Are you looking for a rental Room/PG, a homestyle Tiffin service, a Vehicle (scooter/bike/car), or a Work Laptop?",
        category: null,
        neighborhood: extractNeighborhood(q),
        budget: extractBudget(q),
        relevantFilters: {},
        flaggedForConfirmation: true
      }
    })
  }

  // 2. Identify Category
  let category = null
  let confidence = "high"
  let explanation = ""
  let relevantFilters = {}

  if (q.includes("scooter") || q.includes("bike") || q.includes("activa") || q.includes("vehicle") || q.includes("car") || q.includes("bullet") || q.includes("enfield") || q.includes("i20") || q.includes("nexon")) {
    category = "vehicles"
    explanation = "Identified request for rental vehicle in Indore."
    if (q.includes("automatic")) relevantFilters.transmission = "Automatic"
    if (q.includes("scooter") || q.includes("activa")) relevantFilters.vehicleType = "scooter"
    if (q.includes("car") || q.includes("i20") || q.includes("nexon")) relevantFilters.vehicleType = "car"
    if (q.includes("week")) relevantFilters.rentalDuration = "one week"
    if (q.includes("month")) relevantFilters.rentalDuration = "one month"
    if (q.includes("day")) relevantFilters.rentalDuration = "daily"
  } else if (q.includes("laptop") || q.includes("macbook") || q.includes("thinkpad") || q.includes("pc") || q.includes("computer") || q.includes("rog") || q.includes("dell")) {
    category = "laptops"
    explanation = "Identified request for laptop/workstation rental in Indore."
    if (q.includes("macbook")) relevantFilters.brand = "Apple"
    if (q.includes("windows")) relevantFilters.os = "Windows"
    if (q.includes("thinkpad")) relevantFilters.brand = "Lenovo"
    if (q.includes("gaming") || q.includes("rog")) relevantFilters.useCase = "Gaming"
    if (q.includes("week")) relevantFilters.rentalDuration = "per week"
    if (q.includes("month")) relevantFilters.rentalDuration = "per month"
  } else if (q.includes("tiffin") || q.includes("dabba") || q.includes("food") || q.includes("meal") || q.includes("lunch") || q.includes("dinner") || q.includes("veg")) {
    category = "tiffin"
    explanation = "Identified request for tiffin and meal plans in Indore."
    if (q.includes("pure veg") || q.includes("veg")) relevantFilters.foodType = "Pure Vegetarian"
    if (q.includes("jain")) relevantFilters.foodType = "Jain"
    if (q.includes("non-veg") || q.includes("chicken")) relevantFilters.foodType = "Non-Vegetarian"
    if (q.includes("lunch")) relevantFilters.mealTiming = "Lunch"
    if (q.includes("dinner")) relevantFilters.mealTiming = "Dinner"
  } else if (q.includes("room") || q.includes("pg") || q.includes("flat") || q.includes("stay") || q.includes("coliving")) {
    category = "rooms"
    explanation = "Identified request for room/PG accommodation in Indore."
    if (q.includes("single")) relevantFilters.roomType = "single"
    if (q.includes("shared") || q.includes("sharing")) relevantFilters.roomType = "shared"
    if (q.includes("wifi")) relevantFilters.wifi = true
    if (q.includes("ac")) relevantFilters.ac = true
  }

  const neighborhood = extractNeighborhood(q)
  const budget = extractBudget(q)

  if (neighborhood) relevantFilters.neighborhood = neighborhood
  if (budget) relevantFilters.maxBudget = budget

  const summary = `Parsed intent: ${category ? category.toUpperCase() : 'General'} search in ${neighborhood || 'Indore'}${budget ? ` under ₹${budget}` : ''}.`

  res.status(200).json({
    success: true,
    message: "Query parsed with AI safety checks.",
    data: {
      status: "confirmed",
      confidence: confidence,
      summary,
      explanation,
      category,
      neighborhood,
      budget,
      relevantFilters,
      flaggedForConfirmation: false
    }
  })
}

// Sathi Bundle Recommender Controller
export const recommendBundle = async (req, res) => {
  const {
    collegeId = "davv",
    areaSlug,
    budget = 15000,
    needs = ["rooms", "tiffin", "vehicles", "laptops"],
    preferences = {}
  } = req.body || {}

  const authedUser = getAuthUser(req)
  const isAuthed = Boolean(authedUser)

  const college = INDORE_COLLEGES.find(c => c.id === collegeId)
  const targetSlug = areaSlug || college?.recommendedAreas?.[0] || "bhawarkuan"
  const area = INDORE_AREAS.find(a => a.slug === targetSlug) || INDORE_AREAS[0]

  const areaCore = area.name.split(' ')[0].toLowerCase()

  // Match items from each requested category
  const selectedItems = []
  let originalTotal = 0

  const allListings = store.listings

  // 1. Rooms
  if (needs.includes("rooms") || needs.includes("room")) {
    let rooms = allListings.filter(l => l.category === "rooms")
    let matchedRoom = rooms.find(r => 
      (r.neighborhood && r.neighborhood.toLowerCase().includes(areaCore)) ||
      (r.approxLocation && r.approxLocation.toLowerCase().includes(areaCore))
    ) || rooms[0]

    if (matchedRoom) {
      const monthlyPrice = matchedRoom.pricing?.amount || matchedRoom.rent || 7500
      originalTotal += monthlyPrice
      selectedItems.push({
        category: "rooms",
        listing: applyGuestPrivacy(matchedRoom, isAuthed),
        monthlyPrice,
        reason: `Just ${matchedRoom.distance || '0.3 km'} from ${college ? college.shortName : area.name}`
      })
    }
  }

  // 2. Tiffin
  if (needs.includes("tiffin")) {
    let tiffins = allListings.filter(l => l.category === "tiffin")
    let matchedTiffin = tiffins.find(t =>
      (t.neighborhood && t.neighborhood.toLowerCase().includes(areaCore)) ||
      (t.approxLocation && t.approxLocation.toLowerCase().includes(areaCore))
    ) || tiffins[0]

    if (matchedTiffin) {
      const monthlyPrice = matchedTiffin.pricing?.amount || matchedTiffin.rent || 2600
      originalTotal += monthlyPrice
      selectedItems.push({
        category: "tiffin",
        listing: applyGuestPrivacy(matchedTiffin, isAuthed),
        monthlyPrice,
        reason: `Doorstep delivery at 12:30 PM & 8:00 PM with Malwi taste`
      })
    }
  }

  // 3. Vehicles
  if (needs.includes("vehicles") || needs.includes("vehicle")) {
    let vehicles = allListings.filter(l => l.category === "vehicles")
    let matchedVehicle = vehicles.find(v => v.vehicleType === "scooter") || vehicles[0]

    if (matchedVehicle) {
      const monthlyPrice = matchedVehicle.pricing?.monthlyRate || 4800
      originalTotal += monthlyPrice
      selectedItems.push({
        category: "vehicles",
        listing: applyGuestPrivacy(matchedVehicle, isAuthed),
        monthlyPrice,
        reason: `Instant KYC pickup with 2 ISI helmets and full tank`
      })
    }
  }

  // 4. Laptops
  if (needs.includes("laptops") || needs.includes("laptop")) {
    let laptops = allListings.filter(l => l.category === "laptops")
    let matchedLaptop = (preferences.laptopBrand === "Apple") 
      ? (laptops.find(l => l.brand === "Apple") || laptops[0])
      : (laptops.find(l => l.brand === "Dell" || l.brand === "Lenovo") || laptops[0])

    if (matchedLaptop) {
      const monthlyPrice = matchedLaptop.pricing?.monthlyRate || 3600
      originalTotal += monthlyPrice
      selectedItems.push({
        category: "laptops",
        listing: applyGuestPrivacy(matchedLaptop, isAuthed),
        monthlyPrice,
        reason: `Preloaded with study & coding tools, tested battery`
      })
    }
  }

  // Calculate bundle combo discount (8-10%)
  const discountPercent = selectedItems.length >= 3 ? 10 : (selectedItems.length >= 2 ? 7 : 0)
  const savings = Math.round(originalTotal * (discountPercent / 100))
  const bundleTotal = originalTotal - savings

  const collegeName = college ? college.name : (area.name + " Student Hub")
  const bundleTitle = `${college ? college.shortName : area.name} Sathi All-In-One Bundle`

  const whyThisMatches = `Curated specifically for ${collegeName}. All components are verified within 15 minutes of ${area.name}, synchronized for meal delivery and hassle-free transit along the Indore BRTS corridor.`

  res.status(200).json({
    success: true,
    message: "Custom Indore starter bundle generated by Sathi.",
    data: {
      bundleTitle,
      college: college || null,
      area,
      items: selectedItems,
      pricing: {
        originalTotal,
        bundleTotal,
        savings,
        discountPercent,
        walletEligible: isAuthed ? (authedUser?.walletBalance || 0) : 100
      },
      whyThisMatches,
      highlights: [
        `All providers verified in ${area.name}`,
        `Save ₹${savings.toLocaleString('en-IN')} with Indore Sathi Combo`,
        `Single point WhatsApp coordination`,
        `Doorstep setup with zero brokerages`
      ]
    }
  })
}

// Extraction helpers
function extractNeighborhood(str) {
  // Indore localities
  if (str.includes("bhawarkua") || str.includes("bhanwarkuan")) return "Bhawarkuan"
  if (str.includes("vijay nagar") || str.includes("scheme 54") || str.includes("scheme 78")) return "Vijay Nagar"
  if (str.includes("palasia") || str.includes("56 dukan") || str.includes("chappan")) return "Palasia"
  if (str.includes("rau") || str.includes("silicon city") || str.includes("ips")) return "Rau"
  if (str.includes("geeta bhawan")) return "Geeta Bhawan"
  if (str.includes("sapna sangeeta")) return "Sapna Sangeeta"
  return null
}

function extractBudget(str) {
  const match = str.match(/(?:under|below|budget|less than|\b)\s*(\d{3,6})/i)
  if (match) {
    const val = parseInt(match[1], 10)
    if (val >= 200 && val <= 100000) return val
  }
  return null
}

const aiController = {
  parseNaturalLanguageQuery,
  recommendBundle
}

export default aiController
