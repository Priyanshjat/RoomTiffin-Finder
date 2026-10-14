import Provider from "../../models/providerModel.js"
import mongoose from "mongoose"

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

const providerService = {
    applyProvider,
    getMyProviderProfile
}

export default providerService
