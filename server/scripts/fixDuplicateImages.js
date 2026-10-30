// One-off maintenance: make every existing listing use a different photo.
// - keeps provider uploads (/uploads/...) untouched
// - keeps the first use of each external photo
// - replaces repeated or missing photos with unused room / tiffin photos
//
// Usage (from the project root): node server/scripts/fixDuplicateImages.js

import mongoose from "mongoose"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

import Room from "../models/roomModel.js"
import Tiffin from "../models/tiffinModel.js"
import { dedupeListingImages } from "../services/listingImages.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, "..", ".env") })
dotenv.config()

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/roomtiffin-finder"

const run = async () => {
    await mongoose.connect(MONGO_URI)
    console.log("DB connected:", mongoose.connection.name)

    const rooms = await Room.find()
    const tiffins = await Tiffin.find()

    const before = new Map()
    for (const doc of [...rooms, ...tiffins]) {
        before.set(String(doc._id), JSON.stringify(doc.images || []))
    }

    dedupeListingImages(rooms, tiffins)

    let updated = 0
    for (const doc of [...rooms, ...tiffins]) {
        if (before.get(String(doc._id)) === JSON.stringify(doc.images)) continue
        doc.markModified("images")
        await doc.save()
        updated++
        console.log("updated:", doc.title || doc.name)
    }

    console.log(`Done. Rooms: ${rooms.length}, Tiffins: ${tiffins.length}, updated: ${updated}`)
    await mongoose.disconnect()
}

run().catch(async (err) => {
    console.error("Failed:", err.message)
    await mongoose.disconnect().catch(() => {})
    process.exit(1)
})
