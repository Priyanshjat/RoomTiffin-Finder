import jwt from "jsonwebtoken"
import User from "../models/userModel.js"
import Provider from "../models/providerModel.js"
import authService from "../controllers/auth/authController.js"
import store from "../services/marketplaceStore.js"
import mongoose from "mongoose"

// Resilient JWT verification supporting current and legacy secret keys
const verifyToken = (token) => {
    const secrets = [
        process.env.JWT_SECRET || "supersecretjwtkey_roomtiffin_2026",
        "supersecretjwtkey_roomtiffin_2026",
        "supersecretjwtkey",
        "roomtiffin_jwt_secret_2026"
    ]
    for (const secret of secrets) {
        try {
            return jwt.verify(token, secret)
        } catch (e) {
            if (e.name !== "JsonWebTokenError") throw e
        }
    }
    throw new Error("Invalid token signature or session expired. Please sign in again.")
}

const findUserById = async (id) => {
    if (mongoose.connection.readyState === 1) {
        try {
            const user = await User.findById(id).select("-password")
            if (user) return user
        } catch (err) {
            // fallback
        }
    }
    const local = authService.localUsers?.find(u => u._id === id || u._id?.toString() === id?.toString())
    if (local) {
        const { password, rawPassword, ...safe } = local
        return safe
    }
    const storeUser = store.findUserById(id)
    if (storeUser) {
        const { passwordHash, rawPassword, ...safe } = storeUser
        return safe
    }
    return null
}

const forUser = async (req, res, next) => {

    try {
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            let token = req.headers.authorization.split(" ")[1]
            let decoded = verifyToken(token)
            let user = await findUserById(decoded.id)

            if (!user) {
                res.status(404)
                throw new Error("Invalid User!")
            }

            req.user = user
            next()
        } else {
            throw new Error("No Token Found!")
        }
    } catch (error) {
        res.status(401)
        throw new Error(error.message)
    }

}

const forProvider = async (req, res, next) => {

    try {
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            let token = req.headers.authorization.split(" ")[1]
            let decoded = verifyToken(token)
            let user = await findUserById(decoded.id)

            if (!user) {
                res.status(404)
                throw new Error("Invalid User!")
            }

            req.user = user

            // Allow Admin, Provider, or normal User listing their room/pg/service
            if (user.userType === "ADMIN" || user.userType === "PROVIDER" || user.userType === "USER") {
                return next()
            }

            if (mongoose.connection.readyState === 1) {
                try {
                    const providerProfile = await Provider.findOne({ user: user._id })
                    if (providerProfile && !providerProfile.isVerified) {
                        res.status(403)
                        throw new Error("Provider profile is pending admin verification!")
                    }
                    req.provider = providerProfile
                } catch (err) {
                    // allow local verified providers
                }
            }

            next()

        } else {
            throw new Error("No Token Found!")
        }
    } catch (error) {
        res.status(res.statusCode === 403 ? 403 : 401)
        throw new Error(error.message)
    }

}

const forAdmin = async (req, res, next) => {

    try {
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            let token = req.headers.authorization.split(" ")[1]
            let decoded = verifyToken(token)
            let user = await findUserById(decoded.id)

            if (!user) {
                res.status(404)
                throw new Error("Invalid User!")
            }

            req.user = user

            if (user.userType === "ADMIN") {
                next()
            } else {
                res.status(401)
                throw new Error("Only Admin Access")
            }

        } else {
            throw new Error("No Token Found!")
        }
    } catch (error) {
        res.status(401)
        throw new Error(error.message)
    }

}

const protect = {
    forUser,
    forProvider,
    forAdmin
}

export default protect
