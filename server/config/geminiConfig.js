import { GoogleGenerativeAI } from "@google/generative-ai"

// ---------------------------------------------------------------------------
// Gemini AI config (README Section 10)
// Returns null when GEMINI_API_KEY is missing so callers fall back to the
// rule-based mock behaviour instead of crashing.
// Set GEMINI_MODEL to pin an exact version, e.g. GEMINI_MODEL=gemini-3.5-flash
// ---------------------------------------------------------------------------
const PRIMARY_MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash"
// Aliases that always resolve to a current flash model, so the app keeps
// working when specific versions retire or face temporary "high demand" 503s.
const FALLBACK_MODELS = ["gemini-flash-latest", "gemini-flash-lite-latest"]

const isGeminiConfigured = () => Boolean(process.env.GEMINI_API_KEY)

const createModel = (name) => {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    return genAI.getGenerativeModel({ model: name })
}

export const getGeminiClient = () => {
    if (!isGeminiConfigured()) return null

    try {
        return createModel(PRIMARY_MODEL)
    } catch (err) {
        console.log("Gemini init fallback:", err.message)
        return null
    }
}

// Guard against slow/hanging model calls
const withTimeout = (promise, ms = 12000) => Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error("Gemini timeout")), ms))
])

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const parseJsonReply = (text) => {
    // Models often wrap JSON inside ```json fences
    const cleaned = (text || "").replace(/```json/gi, "").replace(/```/g, "").trim()
    const start = cleaned.indexOf("{")
    const end = cleaned.lastIndexOf("}")

    if (start === -1 || end === -1 || end <= start) {
        throw new Error("No JSON found in Gemini reply")
    }

    return JSON.parse(cleaned.slice(start, end + 1))
}

// Generate content and safely extract a JSON object from the reply.
// Tries the primary model, then fallbacks, with retries for transient errors —
// bounded by an overall deadline so HTTP requests never hang.
export const generateJson = async (prompt) => {
    if (!isGeminiConfigured()) {
        throw new Error("GEMINI_API_KEY not configured")
    }

    const deadline = Date.now() + 30000
    const candidates = [PRIMARY_MODEL, ...FALLBACK_MODELS]
    let lastErr = null

    for (const name of candidates) {
        if (Date.now() > deadline) break

        try {
            const model = createModel(name)

            for (let attempt = 1; attempt <= 2; attempt++) {
                if (Date.now() > deadline) break

                try {
                    const result = await withTimeout(model.generateContent(prompt))
                    return parseJsonReply(result.response.text())
                } catch (err) {
                    lastErr = err
                    if (attempt < 2) await sleep(1200)
                }
            }
        } catch (err) {
            lastErr = err
        }
    }

    throw lastErr || new Error("Gemini request failed")
}

const geminiService = {
    getGeminiClient,
    generateJson
}

export default geminiService
