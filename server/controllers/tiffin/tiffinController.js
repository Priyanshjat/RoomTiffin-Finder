import Tiffin from "../../models/tiffinModel.js"
import { mockTiffins } from "../../data/mockData.js"
import mongoose from "mongoose"
import { pickUniqueImage } from "../../services/listingImages.js"
import { getUsedImageKeys } from "../../services/usedImages.js"

// In-memory array for newly created tiffins during fallback
let localTiffins = [...mockTiffins]

const isDbConnected = () => {
    return mongoose.connection.readyState === 1
}

const getTiffins = async (req, res) => {

    const { mealType, cuisineType, deliveryArea, maxPricePerMeal, maxMonthlyPrice, search } = req.query

    // Try MongoDB if connected
    if (isDbConnected()) {
        try {
            let filter = { isAvailable: true }

            if (mealType && mealType !== "ALL") {
                filter.mealType = mealType
            }
            if (cuisineType) {
                filter.cuisineType = cuisineType
            }
            if (deliveryArea) {
                filter.deliveryAreas = { $regex: deliveryArea, $options: "i" }
            }
            if (maxPricePerMeal) {
                filter.pricePerMeal = { $lte: Number(maxPricePerMeal) }
            }
            if (maxMonthlyPrice) {
                filter.monthlyPrice = { $lte: Number(maxMonthlyPrice) }
            }
            if (search) {
                filter.$or = [
                    { name: { $regex: search, $options: "i" } },
                    { description: { $regex: search, $options: "i" } },
                    { cuisineType: { $regex: search, $options: "i" } },
                    { deliveryAreas: { $regex: search, $options: "i" } }
                ]
            }

            const tiffins = await Tiffin.find(filter).populate("owner", "name phone email").sort({ createdAt: -1 })

            if (tiffins && tiffins.length > 0) {
                return res.status(200).json(tiffins)
            }
        } catch (dbErr) {
            console.log("Tiffin DB fetch fallback:", dbErr.message)
        }
    }

    // Resilient Fallback to Mock / In-Memory Tiffins
    let filtered = [...localTiffins]

    if (mealType && mealType !== "ALL") {
        filtered = filtered.filter(t => t.mealType === mealType)
    }
    if (cuisineType) {
        filtered = filtered.filter(t => t.cuisineType.toLowerCase() === cuisineType.toLowerCase())
    }
    if (deliveryArea) {
        const area = deliveryArea.toLowerCase()
        filtered = filtered.filter(t =>
            t.deliveryAreas.some(a => a.toLowerCase().includes(area))
        )
    }
    if (maxPricePerMeal) {
        filtered = filtered.filter(t => t.pricePerMeal <= Number(maxPricePerMeal))
    }
    if (maxMonthlyPrice) {
        filtered = filtered.filter(t => t.monthlyPrice <= Number(maxMonthlyPrice))
    }
    if (search) {
        const q = search.toLowerCase()
        filtered = filtered.filter(t =>
            t.name.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q) ||
            t.cuisineType.toLowerCase().includes(q) ||
            t.deliveryAreas.some(a => a.toLowerCase().includes(q))
        )
    }

    res.status(200).json(filtered)
}

const getTiffin = async (req, res) => {

    const tid = req.params.tid

    if (!tid) {
        res.status(409)
        throw new Error("Tiffin ID is required!")
    }

    if (isDbConnected()) {
        try {
            const tiffin = await Tiffin.findById(tid).populate("owner", "name phone email")
            if (tiffin) {
                return res.status(200).json(tiffin)
            }
        } catch (err) {
            // Check fallback
        }
    }

    const mockTiffin = localTiffins.find(t => t._id === tid)

    if (!mockTiffin) {
        res.status(404)
        throw new Error("Tiffin Service Not Found!")
    }

    res.status(200).json(mockTiffin)
}

const createTiffin = async (req, res) => {

    const {
        name,
        description,
        cuisineType,
        mealType,
        pricePerMeal,
        monthlyPrice,
        deliveryAreas,
        mealSchedule,
        menuHighlights,
        weeklyMenu,
        images
    } = req.body

    if (!name || !description || !mealType || !pricePerMeal || !monthlyPrice) {
        res.status(409)
        throw new Error("Please Fill All Details!")
    }

    // Every new tiffin gets its own food photo - never one already used elsewhere
    const tiffinImages = images && images.length > 0
        ? images
        : [pickUniqueImage(await getUsedImageKeys(), "tiffin")]

    const tiffinData = {
        name,
        description,
        cuisineType: cuisineType || "North Indian",
        mealType,
        pricePerMeal: Number(pricePerMeal),
        monthlyPrice: Number(monthlyPrice),
        deliveryAreas: Array.isArray(deliveryAreas) ? deliveryAreas : (deliveryAreas ? deliveryAreas.split(",") : []),
        mealSchedule: Array.isArray(mealSchedule) ? mealSchedule : ["Lunch", "Dinner"],
        menuHighlights: Array.isArray(menuHighlights) ? menuHighlights : (menuHighlights ? menuHighlights.split(",") : []),
        weeklyMenu: weeklyMenu || {},
        images: tiffinImages,
        owner: req.user._id,
        isAvailable: true,
        rating: 4.9,
        numReviews: 1
    }

    if (isDbConnected()) {
        try {
            const created = await Tiffin.create(tiffinData)
            if (created) {
                return res.status(201).json(created)
            }
        } catch (err) {
            console.log("DB create tiffin fallback:", err.message)
        }
    }

    const newTiffin = {
        _id: "tiffin_indore_" + Date.now(),
        ...tiffinData,
        owner: {
            _id: req.user._id,
            name: req.user.name,
            phone: req.user.phone,
            email: req.user.email
        },
        createdAt: new Date().toISOString()
    }

    localTiffins.unshift(newTiffin)
    res.status(201).json(newTiffin)
}

const updateTiffin = async (req, res) => {

    const tid = req.params.tid

    if (isDbConnected()) {
        try {
            const tiffin = await Tiffin.findById(tid)
            if (tiffin) {
                if (tiffin.owner.toString() !== req.user._id.toString() && req.user.userType !== "ADMIN") {
                    res.status(401)
                    throw new Error("Unauthorized to update this tiffin service!")
                }
                const updated = await Tiffin.findByIdAndUpdate(tid, req.body, { new: true })
                return res.status(200).json(updated)
            }
        } catch (err) {
            // Fallback
        }
    }

    const index = localTiffins.findIndex(t => t._id === tid)
    if (index === -1) {
        res.status(404)
        throw new Error("Tiffin Service Not Found!")
    }

    localTiffins[index] = { ...localTiffins[index], ...req.body }
    res.status(200).json(localTiffins[index])
}

const deleteTiffin = async (req, res) => {

    const tid = req.params.tid

    if (isDbConnected()) {
        try {
            const tiffin = await Tiffin.findById(tid)
            if (tiffin) {
                if (tiffin.owner.toString() !== req.user._id.toString() && req.user.userType !== "ADMIN") {
                    res.status(401)
                    throw new Error("Unauthorized to delete this tiffin service!")
                }
                await Tiffin.findByIdAndDelete(tid)
                return res.status(200).json({ message: "Tiffin Service Deleted Successfully!" })
            }
        } catch (err) {
            // Fallback
        }
    }

    localTiffins = localTiffins.filter(t => t._id !== tid)
    res.status(200).json({ message: "Tiffin Service Deleted Successfully!" })
}

const getMyTiffins = async (req, res) => {

    if (isDbConnected()) {
        try {
            const tiffins = await Tiffin.find({ owner: req.user._id })
            if (tiffins && tiffins.length > 0) {
                return res.status(200).json(tiffins)
            }
        } catch (err) {
            // Fallback
        }
    }

    const myTiffins = localTiffins.filter(t =>
        (t.owner?._id && t.owner._id.toString() === req.user._id.toString()) ||
        (t.owner && t.owner.toString() === req.user._id.toString())
    )

    res.status(200).json(myTiffins)
}

const tiffinService = {
    getTiffins,
    getTiffin,
    createTiffin,
    updateTiffin,
    deleteTiffin,
    getMyTiffins
}

export default tiffinService
