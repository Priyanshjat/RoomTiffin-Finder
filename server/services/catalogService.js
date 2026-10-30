import Room from "../models/roomModel.js"
import Tiffin from "../models/tiffinModel.js"
import mongoose from "mongoose"
import store from "./marketplaceStore.js"
import { dedupeListingImages } from "./listingImages.js"

const isDbConnected = () => mongoose.connection.readyState === 1

// ---------------------------------------------------------------------------
// Catalog service
// Combines real MongoDB listings (Room / Tiffin) with the existing in-memory
// mock listings, normalized to the exact marketplace listing shape the client
// cards/modals already expect.
// ---------------------------------------------------------------------------

// --- Normalizers: Mongo doc -> marketplace listing shape ---

const normalizeRoom = (room) => ({
    ...room,
    _id: String(room._id),
    id: String(room._id),
    category: "rooms",
    city: room.city || "Indore",
    approxLocation: room.locality || "",
    exactLocation: room.address || "",
    neighborhood: room.locality || "",
    distance: "0.4 km from area center",
    pricing: {
        amount: room.rent,
        period: "month",
        deposit: room.deposit,
        formatted: `₹${room.rent}/month`
    },
    rent: room.rent,
    deposit: room.deposit,
    provider: {
        name: room.owner?.name || "Verified Provider",
        verified: true,
        rating: room.rating || 4.5,
        reviewCount: room.numReviews || 0,
        phone: room.owner?.phone || "",
        whatsapp: room.owner?.phone || "",
        email: room.owner?.email || ""
    },
    rating: room.rating || 4.5,
    reviewCount: room.numReviews || 0,
    availability: room.isAvailable ? "Available immediately" : "Currently occupied",
    isAvailable: Boolean(room.isAvailable),
    wifi: (room.amenities || []).some(a => /wifi|internet/i.test(a)),
    ac: (room.amenities || []).some(a => /ac|air condition/i.test(a)),
    attachedBathroom: (room.amenities || []).some(a => /bathroom/i.test(a)),
    features: room.amenities || [],
    specs: {
        "Room Type": room.roomType || "",
        "Preferred Tenant": room.preferredTenant || "ANY",
        "Security Deposit": `₹${room.deposit} (Refundable)`
    },
    isFeatured: false,
    isPopular: false,
    isNewThisWeek: false
})

const normalizeTiffin = (tiffin) => {
    const mealTypeLabel = {
        VEG: "Pure Vegetarian",
        PURE_VEG: "Pure Vegetarian",
        NON_VEG: "Non-Vegetarian",
        JAIN: "Jain"
    }[tiffin.mealType] || "Vegetarian"

    return {
        ...tiffin,
        _id: String(tiffin._id),
        id: String(tiffin._id),
        category: "tiffin",
        city: tiffin.city || "Indore",
        foodType: mealTypeLabel,
        cuisineType: tiffin.cuisineType || "North Indian",
        mealTiming: tiffin.mealSchedule || [],
        approxLocation: (tiffin.deliveryAreas && tiffin.deliveryAreas[0]) || tiffin.neighborhood || "",
        exactLocation: tiffin.neighborhood || "",
        neighborhood: tiffin.neighborhood || "",
        distance: "Doorstep delivery",
        pricing: {
            amount: tiffin.monthlyPrice,
            period: "month",
            deposit: 0,
            formatted: `₹${tiffin.monthlyPrice}/month`
        },
        rent: tiffin.monthlyPrice,
        deposit: 0,
        provider: {
            name: tiffin.owner?.name || "Verified Tiffin Vendor",
            verified: true,
            rating: tiffin.rating || 4.8,
            reviewCount: tiffin.numReviews || 0,
            phone: tiffin.owner?.phone || "",
            whatsapp: tiffin.owner?.phone || "",
            email: tiffin.owner?.email || ""
        },
        rating: tiffin.rating || 4.8,
        reviewCount: tiffin.numReviews || 0,
        availability: tiffin.isAvailable ? "Subscriptions open" : "Currently full",
        isAvailable: Boolean(tiffin.isAvailable),
        features: tiffin.menuHighlights || [],
        specs: {
            "Meal Type": mealTypeLabel,
            "Cuisine": tiffin.cuisineType || "North Indian",
            "Meals Included": (tiffin.mealSchedule || []).join(" & "),
            "Price Per Meal": `₹${tiffin.pricePerMeal}`
        },
        isFeatured: false,
        isPopular: false,
        isNewThisWeek: false
    }
}

// All real Mongo listings, normalized. Returns null if DB is down/empty (caller falls back to mock)
export const getMongoListings = async () => {
    if (!isDbConnected()) return null

    try {
        const [rooms, tiffins] = await Promise.all([
            Room.find({}).populate("owner", "name phone email").lean(),
            Tiffin.find({}).populate("owner", "name phone email").lean()
        ])

        if (!rooms.length && !tiffins.length) return null

        return [
            ...rooms.map(r => normalizeRoom(r)),
            ...tiffins.map(t => normalizeTiffin(t))
        ]
    } catch (err) {
        console.log("Catalog fetch fallback:", err.message)
        return null
    }
}

// Combined catalog: real Mongo listings first, mock listings after (no duplicates)
export const getCombinedListings = async () => {
    const mongoListings = await getMongoListings()
    let combined
    if (mongoListings) {
        const mongoIds = new Set(mongoListings.map(l => String(l.id)))
        combined = [...mongoListings, ...store.listings.filter(m => !mongoIds.has(String(m.id || m._id)))]
    } else {
        combined = [...store.listings]
    }

    // One photo per listing across the whole catalog: rooms and tiffins
    // never share an image, and no two cards show the same picture.
    dedupeListingImages(
        combined.filter(l => l.category === "rooms"),
        combined.filter(l => l.category === "tiffin")
    )

    return combined
}

// Find a single listing across Mongo collections, then the mock store
export const getListingByIdFromAnySource = async (id) => {
    if (!id) return null

    if (isDbConnected() && mongoose.isValidObjectId(id)) {
        try {
            let doc = await Room.findById(id).populate("owner", "name phone email").lean()
            if (doc) return normalizeRoom(doc)

            doc = await Tiffin.findById(id).populate("owner", "name phone email").lean()
            if (doc) return normalizeTiffin(doc)
        } catch (err) {
            console.log("Listing by id fallback:", err.message)
        }
    }

    return store.listings.find(l => l.id === id || l._id === id) || null
}

// All listings owned by a user (provider dashboard), grouped by category
export const getListingsByOwner = async (userId) => {
    if (!isDbConnected() || !mongoose.isValidObjectId(String(userId))) return null

    try {
        const [rooms, tiffins] = await Promise.all([
            Room.find({ owner: userId }).populate("owner", "name phone email").lean(),
            Tiffin.find({ owner: userId }).populate("owner", "name phone email").lean()
        ])

        const all = [...rooms, ...tiffins]
        return {
            rooms,
            tiffins,
            counts: {
                totalListings: all.length,
                activeListings: all.filter(l => l.isAvailable !== false).length
            }
        }
    } catch (err) {
        console.log("Owner listings fallback:", err.message)
        return null
    }
}

// Normalized models list for controllers' CRUD (mongodb-first, mock fallback for reads)
export const catalogModels = { Room, Tiffin, normalizeRoom, normalizeTiffin }

export default {
    getMongoListings,
    getCombinedListings,
    getListingByIdFromAnySource,
    getListingsByOwner,
    catalogModels
}
