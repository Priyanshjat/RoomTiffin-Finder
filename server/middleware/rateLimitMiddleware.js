import rateLimit from "express-rate-limit"

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many requests, please try again later." }
})

export const aiRateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "AI rate limit reached. Please wait 1 minute before trying again." }
})

const rateLimiters = {
    apiLimiter,
    aiRateLimiter
}

export default rateLimiters
