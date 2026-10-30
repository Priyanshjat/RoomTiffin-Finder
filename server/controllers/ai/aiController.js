// AI Search Safety Controller (Natural Language Query Parser)
import { getGeminiClient, generateJson } from "../../config/geminiConfig.js"

// Valid filter keys per category (guards the Gemini reply)
const CATEGORY_FILTER_KEYS = {
    rooms: ["roomType", "preferredTenant", "wifi", "ac", "maxBudget", "neighborhood"],
    tiffin: ["foodType", "mealTiming", "maxBudget", "neighborhood"]
}

const ALLOWED_NEIGHBORHOODS = ["Bhawarkuan", "Vijay Nagar", "Palasia", "Rau", "Geeta Bhawan", "Sapna Sangeeta"]

export const parseNaturalLanguageQuery = async (req, res) => {
  const { query } = req.body

  if (!query || !query.trim()) {
    return res.status(400).json({
      success: false,
      message: "Please provide a search description.",
      data: null
    })
  }

  // 1. Real Gemini parse (README Section 4.3) — falls back to the rule-based
  //    engine below whenever the key is missing or the model call fails.
  const model = getGeminiClient()

  if (model) {
    try {
      const prompt = `You are the intent parser for "RoomTiffin Finder", a rental marketplace in Indore, India.
Categories: "rooms" (room/PG/flat rental), "tiffin" (homestyle meal subscription).

The user may write in English, Hindi (Devanagari script), Hinglish (Roman-script Hindi), or a mix — treat all as valid input.
Understand common Hindi/Hinglish rental words, e.g.: कमरा/kamra (room), फ्लैट/flat (flat), पीजी/PG (rooms), किराया/kiraya (rent), रहने की जगह (place to stay -> rooms), टिफिन/dabba/khana/टिफिन/डब्बा/खाना/भोजन (tiffin), शुद्ध शाकाहारी/shakahari (Pure Vegetarian), जैन (Jain), मांसाहारी/maansahari/non-veg (Non-Vegetarian), दोपहर/दिन का खाना (Lunch), रात/रात का खाना (Dinner), सिंगल (single), शेयर्ड/शेयरिंग (shared), वाईफाई (wifi), एसी (ac), sasta/sasti (cheap -> budget).
Convert all number formats to whole rupees for "budget": Devanagari digits (०-९), and Hindi words like हज़ार/हजार/hazaar/hajar (×1000), लाख/lakh (×100000) — e.g. "३ हज़ार" = 3000, "12 k" = 12000.
Use the English spelling closest to the Devanagari/Hinglish name when matching a neighborhood (e.g. भावरकुआ/भावरकुआं/bhavarkua -> Bhawarkuan, विजय नगर -> Vijay Nagar, पलासिया -> Palasia, गीता भवन -> Geeta Bhawan, सपना संगीता -> Sapna Sangeeta, राऊ -> Rau).

Parse the user's message and reply with ONLY a JSON object (no extra text) with exactly these keys:
{
  "status": "confirmed" if the intent is clear, "unclear" if too vague to pick a category,
  "confidence": "high" | "medium" | "low",
  "category": one of ["rooms","tiffin"], or null if status is "unclear",
  "explanation": one short friendly sentence for the user explaining the result. LANGUAGE RULE (must follow strictly): write it in the SAME language/script the user used — English message -> English reply, Hindi (Devanagari) message -> Hindi reply in Devanagari, Hinglish message -> Hinglish reply in Roman script. If "unclear", ask the clarifying question in that same language.
  "neighborhood": one of ["Bhawarkuan","Vijay Nagar","Palasia","Rau","Geeta Bhawan","Sapna Sangeeta"] if mentioned or implied, else "",
  "budget": monthly budget in whole rupees if mentioned, else null,
  "relevantFilters": an object with ONLY keys relevant to the chosen category:
    rooms -> roomType ("single"|"shared"|"1rk"|"1bhk"|"flat"), preferredTenant ("STUDENT"|"WORKING_PROFESSIONAL"), wifi (true), ac (true)
    tiffin -> foodType ("Pure Vegetarian"|"Non-Vegetarian"|"Jain"), mealTiming ("Lunch"|"Dinner")
  In relevantFilters omit every key you are not sure about. Use empty object when nothing applies. JSON string values in "explanation" only — all other values stay in English.

User message: "${query.trim()}"`

      const parsed = await generateJson(prompt)

      // Sanitize the model output before answering
      const category = ["rooms", "tiffin"].includes(parsed.category) ? parsed.category : null
      const status = parsed.status === "unclear" || !category ? (category ? "confirmed" : "unclear") : "confirmed"
      const neighborhood = ALLOWED_NEIGHBORHOODS.includes(parsed.neighborhood) ? parsed.neighborhood : null
      const budget = Number.isFinite(Number(parsed.budget))
        && Number(parsed.budget) >= 200 && Number(parsed.budget) <= 100000
        ? Number(parsed.budget)
        : null

      const validKeys = category ? CATEGORY_FILTER_KEYS[category] : []
      const relevantFilters = (parsed.relevantFilters && typeof parsed.relevantFilters === "object")
        ? Object.fromEntries(Object.entries(parsed.relevantFilters).filter(([k]) => validKeys.includes(k)).slice(0, 8))
        : {}

      if (neighborhood) relevantFilters.neighborhood = neighborhood
      if (budget) relevantFilters.maxBudget = budget

      const flagged = status === "unclear"
      const summary = `Parsed intent: ${category ? category.toUpperCase() : 'General'} search in ${neighborhood || 'Indore'}${budget ? ` under ₹${budget}` : ''}.`

      return res.status(200).json({
        success: true,
        message: flagged ? "Query flagged for confirmation by Gemini AI." : "Query parsed by Gemini AI.",
        data: {
          status,
          confidence: ["high", "medium", "low"].includes(parsed.confidence) ? parsed.confidence : "medium",
          summary,
          explanation: typeof parsed.explanation === "string" && parsed.explanation.trim().length < 300
            ? parsed.explanation.trim()
            : (flagged
              ? "Your request is broad. Are you looking for a rental Room/PG, or a homestyle Tiffin service?"
              : `Identified request for ${category || "general"} rental in Indore.`),
          category,
          neighborhood,
          budget,
          relevantFilters,
          flaggedForConfirmation: flagged
        }
      })
    } catch (err) {
      console.log("Gemini parse fallback:", err.message)
    }
  }

  // Zero-cost normalization so rule-based parsing understands Devanagari too.
  // Devanagari digits must become ASCII digits before any regex runs.
  const q = normalizeHindiText(query)

  // 1. Safety Rule: Ambiguity Detection (Never silently guess a category)
  // Check if query is too vague, e.g. "something affordable for work", "cheap stuff", "need help"
  const hasRoomWords = ["room","pg","flat","stay","coliving","kamra","kiraya","ghar","rehne","raha","कमरा","फ्लैट","पीजी","किराया","रहने","रहना"]
  const hasTiffinWords = ["tiffin","dabba","food","meal","lunch","dinner","veg","khana","bhojan","dopahar","raat","खाना","भोजन","टिफिन","डब्बा","शाकाहारी","मांसाहारी","दोपहर","रात का"]

  const isVague =
    q === "something affordable for work" ||
    q === "affordable for work" ||
    q === "cheap options" ||
    q === "need something for work" ||
    (
      !hasRoomWords.some(w => q.includes(w)) && !hasTiffinWords.some(w => q.includes(w))
    )

  if (isVague) {
    return res.status(200).json({
      success: true,
      message: "Query flagged for confirmation due to ambiguous intent.",
      data: {
        status: "unclear",
        confidence: "low",
        summary: "Broad request lacking specific category.",
        explanation: isHindiQuery(q)
          ? "आपकी मांग थोड़ी अस्पष्ट है। क्या आपको किराये का कमरा/PG चाहिए, या घर का टिफिन सर्विस?"
          : "Your request is broad. Are you looking for a rental Room/PG, or a homestyle Tiffin service?",
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

  if (q.includes("tiffin") || q.includes("dabba") || q.includes("food") || q.includes("meal") || q.includes("lunch") || q.includes("dinner") || q.includes("veg") ||
      q.includes("khana") || q.includes("bhojan") || q.includes("dopahar") || q.includes("raat") ||
      q.includes("खाना") || q.includes("भोजन") || q.includes("टिफिन") || q.includes("डब्बा") || q.includes("शाकाहारी") || q.includes("मांसाहारी") || q.includes("दोपहर") || q.includes("रात का")) {
    category = "tiffin"
    explanation = isHindiQuery(q)
      ? "इंदौर में टिफिन और खाने के प्लान की पहचान हुई।"
      : "Identified request for tiffin and meal plans in Indore."
    if (q.includes("pure veg") || q.includes("veg") || q.includes("shakahari") || q.includes("शाकाहारी") || q.includes("शुद्ध")) relevantFilters.foodType = "Pure Vegetarian"
    if (q.includes("jain") || q.includes("जैन")) relevantFilters.foodType = "Jain"
    if (q.includes("non-veg") || q.includes("nonveg") || q.includes("chicken") || q.includes("mutton") || q.includes("egg") || q.includes("maansahari") || q.includes("मांसाहारी") || q.includes("मांस")) relevantFilters.foodType = "Non-Vegetarian"
    if (q.includes("lunch") || q.includes("dopahar") || q.includes("दोपहर") || q.includes("दिन का")) relevantFilters.mealTiming = "Lunch"
    if (q.includes("dinner") || q.includes("raat") || q.includes("रात का") || q.includes("शाम")) relevantFilters.mealTiming = "Dinner"
  } else if (q.includes("room") || q.includes("pg") || q.includes("flat") || q.includes("stay") || q.includes("coliving") ||
             q.includes("kamra") || q.includes("kiraya") || q.includes("ghar") || q.includes("rehne") || q.includes("raha") ||
             q.includes("कमरा") || q.includes("फ्लैट") || q.includes("पीजी") || q.includes("किराया") || q.includes("रहने") || q.includes("रहना")) {
    category = "rooms"
    explanation = isHindiQuery(q)
      ? "इंदौर में कमरा/PG की तलाश की पहचान हुई।"
      : "Identified request for room/PG accommodation in Indore."
    if (q.includes("single") || q.includes("सिंगल") || q.includes("अकेला")) relevantFilters.roomType = "single"
    if (q.includes("shared") || q.includes("sharing") || q.includes("शेयर")) relevantFilters.roomType = "shared"
    if (q.includes("wifi") || q.includes("वाईफाई")) relevantFilters.wifi = true
    if (q.includes("ac") || q.includes("एसी") || q.includes("एc")) relevantFilters.ac = true
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

// Extraction helpers
function extractNeighborhood(str) {
  // Indore localities (English + Hinglish + Devanagari spellings)
  if (str.includes("bhawarkua") || str.includes("bhanwarkua") || str.includes("भावरकुआ") || str.includes("भानवरकुआ")) return "Bhawarkuan"
  if (str.includes("vijay nagar") || str.includes("scheme 54") || str.includes("scheme 78") || str.includes("विजय नगर") || str.includes("विजयनगर")) return "Vijay Nagar"
  if (str.includes("palasia") || str.includes("56 dukan") || str.includes("chappan") || str.includes("पलासिया") || str.includes("छप्पन")) return "Palasia"
  if (str.includes("rau") || str.includes("silicon city") || str.includes("ips") || str.includes("राऊ") || str.includes("राव")) return "Rau"
  if (str.includes("geeta bhawan") || str.includes("गीता भवन") || str.includes("गीताभवन")) return "Geeta Bhawan"
  if (str.includes("sapna sangeeta") || str.includes("सपना संगीता")) return "Sapna Sangeeta"
  return null
}

function extractBudget(str) {
  let text = normalizeHindiText(str)

  // Hindi/Hinglish multipliers: "3 hazaar", "3 हजार", "2k" ... -> whole rupees
  const multiplier = text.match(/(\d+(?:\.\d+)?)\s*(?:hazaar|hajar|thousand|हजार|k\b)/)
  if (multiplier) {
    const val = Math.round(parseFloat(multiplier[1]) * 1000)
    if (val >= 200 && val <= 100000) return val
  }

  const match = text.match(/(?:under|below|budget|less than|\b)\s*(\d{3,6})/i)
  if (match) {
    const val = parseInt(match[1], 10)
    if (val >= 200 && val <= 100000) return val
  }
  return null
}

// Devanagari digits -> ASCII, and nukta variants of letters collapsed, so the
// same keyword lists match हज़ार and हजार, ३००० and 3000, etc.
function normalizeHindiText(raw) {
  let text = String(raw || "").trim().toLowerCase()
  const digits = { "०": "0", "१": "1", "२": "2", "३": "3", "४": "4", "५": "5", "६": "6", "७": "7", "८": "8", "९": "9" }
  text = text.replace(/[०-९]/g, d => digits[d])
  text = text.replace(/ज़/g, "ज").replace(/फ़/g, "फ").replace(/ख़/g, "ख").replace(/ग़/g, "ग").replace(/ड़/g, "ड").replace(/ढ़/g, "ढ")
  return text
}

function isHindiQuery(str) {
  return /[\u0900-\u097F]/.test(str)
}

const aiController = {
  parseNaturalLanguageQuery,
}

export default aiController
