import Provider from "../../models/providerModel.js"
import Room from "../../models/roomModel.js"
import Tiffin from "../../models/tiffinModel.js"
import mongoose from "mongoose"
import { getListingsByOwner } from "../../services/catalogService.js"
import { pickUniqueImage } from "../../services/listingImages.js"
import { getUsedImageKeys } from "../../services/usedImages.js"
import Booking from "../../models/bookingModel.js"

// Local fallback store for providers
let localProviders = []

const isDbConnected = () => mongoose.connection.readyState === 1

const applyProvider = async (req, res) => {

    const { businessName, providerType, contactNumber, businessAddress, description, idProof } = req.body

    if (!businessName || !providerType || !contactNumber || !businessAddress) {
        res.status(409)
        throw new Error("Please Fill All Details!")
    }

    const userId = req.user._id

    // Check if provider profile already exists in DB
    if (isDbConnected() && mongoose.isValidObjectId(userId)) {
        try {
            const existing = await Provider.findOne({ user: userId })
            if (existing) {
                res.status(409)
                throw new Error("Provider Application Already Exists!")
            }

            const provider = await Provider.create({
                user: userId,
                businessName,
                providerType,
                contactNumber,
                businessAddress,
                description: description || "",
                idProof: idProof || "",
                isVerified: false
            })

            if (provider) {
                return res.status(201).json(provider)
            }
        } catch (dbErr) {
            if (dbErr.message.includes("Already Exists")) {
                throw dbErr
            }
        }
    }

    // In-memory fallback
    const existingLocal = localProviders.find(p => p.user?._id === userId || p.user === userId)
    if (existingLocal) {
        res.status(409)
        throw new Error("Provider Application Already Exists!")
    }

    const localProvider = {
        _id: "prov_" + Date.now(),
        user: {
            _id: userId,
            name: req.user.name,
            email: req.user.email,
            phone: req.user.phone,
            userType: req.user.userType
        },
        businessName,
        providerType,
        contactNumber,
        businessAddress,
        description: description || "",
        idProof: idProof || "",
        isVerified: true, // auto-verify local so user can immediately list
        isActive: true,
        createdAt: new Date().toISOString()
    }

    localProviders.push(localProvider)
    res.status(201).json(localProvider)
}

const getMyProviderProfile = async (req, res) => {
    const userId = req.user._id

    if (isDbConnected() && mongoose.isValidObjectId(userId)) {
        try {
            const provider = await Provider.findOne({ user: userId }).populate("user", "name email phone userType")
            if (provider) {
                return res.status(200).json(provider)
            }
        } catch (err) {
            // fallback
        }
    }

    const localProvider = localProviders.find(p => p.user?._id === userId || p.user === userId)
    if (localProvider) {
        return res.status(200).json(localProvider)
    }

    res.status(404)
    throw new Error("No Provider Profile Found!")
}

const updateMyProviderProfile = async (req, res) => {
    const userId = req.user._id
    const { businessName, providerType, contactNumber, businessAddress, description } = req.body

    if (
        (businessName !== undefined && !String(businessName).trim()) ||
        (providerType !== undefined && !String(providerType).trim()) ||
        (contactNumber !== undefined && !String(contactNumber).trim()) ||
        (businessAddress !== undefined && !String(businessAddress).trim())
    ) {
        res.status(400)
        throw new Error("Fields Cannot Be Empty!")
    }

    if (isDbConnected() && mongoose.isValidObjectId(userId)) {
        try {
            const provider = await Provider.findOne({ user: userId })
            if (provider) {
                if (businessName !== undefined) provider.businessName = businessName
                if (providerType !== undefined) provider.providerType = providerType
                if (contactNumber !== undefined) provider.contactNumber = contactNumber
                if (businessAddress !== undefined) provider.businessAddress = businessAddress
                if (description !== undefined) provider.description = description

                const updated = await provider.save()
                return res.status(200).json(updated)
            }
        } catch (err) {
            // fallback to local store below
        }
    }

    const localProvider = localProviders.find(p => p.user?._id === userId || p.user === userId)
    if (localProvider) {
        if (businessName !== undefined) localProvider.businessName = businessName
        if (providerType !== undefined) localProvider.providerType = providerType
        if (contactNumber !== undefined) localProvider.contactNumber = contactNumber
        if (businessAddress !== undefined) localProvider.businessAddress = businessAddress
        if (description !== undefined) localProvider.description = description
        return res.status(200).json(localProvider)
    }

    res.status(404)
    throw new Error("No Provider Profile Found!")
}

// GET /api/provider/my-listings — all listings owned by the provider (4 categories)
const getMyListings = async (req, res) => {
    const userId = req.user._id

    // A freshly verified provider owns zero listings, but their verified
    // application IS their service. One-time backfill: turn the application
    // data into a draft listing so the dashboard reflects it immediately.
    if (isDbConnected() && mongoose.isValidObjectId(String(userId))) {
        try {
            const provider = await Provider.findOne({ user: userId, isVerified: true })
            if (provider && !provider.draftListingCreated) {
                const [roomCount, tiffinCount] = await Promise.all([
                    Room.countDocuments({ owner: userId }),
                    Tiffin.countDocuments({ owner: userId })
                ])

                if (roomCount + tiffinCount === 0) {
                    const usedImages = await getUsedImageKeys()
                    if (provider.providerType === "TIFFIN") {
                        await Tiffin.create({
                            name: provider.businessName,
                            description: provider.description || `Homestyle tiffin service — ${provider.businessName}`,
                            mealType: "VEG",
                            pricePerMeal: 0,
                            monthlyPrice: 0,
                            deliveryAreas: [],
                            images: [pickUniqueImage(usedImages, "tiffin")],
                            owner: userId,
                            provider: provider._id,
                            isAvailable: true
                        })
                    } else {
                        await Room.create({
                            title: provider.businessName,
                            description: provider.description || `Rental rooms by ${provider.businessName}`,
                            roomType: "single",
                            rent: 0,
                            deposit: 0,
                            locality: provider.businessAddress,
                            address: provider.businessAddress,
                            preferredTenant: "ANY",
                            amenities: [],
                            images: [pickUniqueImage(usedImages, "room")],
                            owner: userId,
                            provider: provider._id,
                            isAvailable: true
                        })
                    }
                }

                provider.draftListingCreated = true
                await provider.save()
            }
        } catch (err) {
            console.log("Draft listing backfill skipped:", err.message)
        }
    }

    const groups = await getListingsByOwner(userId)

    if (!groups) {
        res.status(404)
        throw new Error("No Listings Found!")
    }

    res.status(200).json(groups)
}

// GET /api/provider/inquiries — bookings on the provider's listings
const getMyInquiries = async (req, res) => {
    const groups = await getListingsByOwner(req.user._id)

    if (!groups) {
        res.status(404)
        throw new Error("No Listings Found!")
    }

    const myIds = [
        ...groups.rooms.map(l => String(l._id)),
        ...groups.tiffins.map(l => String(l._id))
    ]

    let bookings = []

    try {
        bookings = await Booking.find({ listingId: { $in: myIds } })
            .populate("user", "name phone")
            .sort({ createdAt: -1 })
            .lean()
    } catch (err) {
        console.log("Inquiries fetch fallback:", err.message)
    }

    res.status(200).json({
        bookings,
        counts: {
            totalRequests: bookings.length
        }
    })
}

const providerService = {
    applyProvider,
    getMyProviderProfile,
    updateMyProviderProfile,
    getMyListings,
    getMyInquiries
}

export default providerService
