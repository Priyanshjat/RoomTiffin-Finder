import dns from "dns"
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

import express from "express"
import dotenv from "dotenv"
import colors from "colors"
import cors from "cors"
import "express-async-errors"
import connectDB from "./config/dbConfig.js"

import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, ".env") })
dotenv.config()

import authRoutes from "./routes/authRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import providerRoutes from "./routes/providerRoutes.js"
import roomRoutes from "./routes/roomRoutes.js"
import tiffinRoutes from "./routes/tiffinRoutes.js"
import marketplaceRoutes from "./routes/marketplaceRoutes.js"
import errorHandler from "./middleware/errorHandler.js"
import { apiLimiter } from "./middleware/rateLimitMiddleware.js"

const PORT = process.env.PORT || 5000
const app = express()

// DB CONNECTION
connectDB()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(apiLimiter)

// Static uploads folder
app.use("/uploads", express.static("uploads"))

// Health check
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok", app: "RoomTiffin Finder API" })
})

// AUTH ROUTES (Mounted first so /api/auth goes directly to real authController)
app.use("/api/auth", authRoutes)

// MARKETPLACE & AI ROUTES
app.use("/api", marketplaceRoutes)

// ADMIN ROUTES
app.use("/api/admin", adminRoutes)

// PROVIDER ROUTES
app.use("/api/provider", providerRoutes)

// ROOM ROUTES
app.use("/api/rooms", roomRoutes)

// TIFFIN ROUTES
app.use("/api/tiffins", tiffinRoutes)

// Error Handler
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`SERVER IS RUNNING AT PORT : ${PORT}`.bgBlue)
})
