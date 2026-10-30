import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import User from "../models/userModel.js"
import WalletTransaction from "../models/walletModel.js"
import Favorite from "../models/favoriteModel.js"
import Referral from "../models/referralModel.js"
import store from "./marketplaceStore.js"
import { REFERRAL_CONFIG } from "../config/referralConfig.js"

// ---------------------------------------------------------------------------
// Identity & wallet service
// Unifies MongoDB-registered users (authController) with the in-memory
// marketplace store users, so referral/wallet/favorites feature flows work
// for BOTH worlds. MongoDB is the source of truth; the store is the fallback
// (same resilient pattern as the rest of the codebase).
// ---------------------------------------------------------------------------

const isDbConnected = () => mongoose.connection.readyState === 1

const maskEmail = (email) => (email || "").replace(/^(.{2})(.*)(@.*)$/, "$1***$3")

const userIdOf = (user) => (user ? String(user._id || user.id) : null)

// Resolve the authenticated user from the Bearer token.
// Returns the user object (Mongo doc marked __source="mongo" or store user
// marked __source="store"), or null for guests / invalid tokens.
export const resolveUser = async (req) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) return null

    const token = authHeader.split(" ")[1]

    let decoded
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecretjwtkey_roomtiffin_2026")
    } catch (err) {
        return null
    }

    // MongoDB user first
    if (isDbConnected() && mongoose.isValidObjectId(decoded.id)) {
        try {
            const mongoUser = await User.findById(decoded.id).select("-password").lean()
            if (mongoUser) {
                return { ...mongoUser, __source: "mongo" }
            }
        } catch (err) {
            // fallback below
        }
    }

    // In-memory store fallback
    const storeUser = store.findUserById(decoded.id)
    if (storeUser) {
        return { ...storeUser, __source: "store" }
    }

    return null
}

// Credit wallet (Mongo + transaction record, or store ledger fallback)
const creditWallet = async (user, amount, description) => {
    if (!user || !amount || amount <= 0) return

    const newBalance = (user.walletBalance || 0) + amount

    if (user.__source === "mongo") {
        try {
            await User.findByIdAndUpdate(user._id, { $inc: { walletBalance: amount } })
            await WalletTransaction.create({ user: user._id, type: "CREDIT", amount, description })
            return
        } catch (err) {
            // ignore: non-critical, wallet view reads fresh balance anyway
        }
    }

    // Store path
    user.walletBalance = newBalance
    store.walletLedger.push({
        id: "tx_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
        userId: userIdOf(user),
        type: "CREDIT",
        amount,
        description,
        createdAt: new Date().toISOString()
    })
}

// Debit wallet (used for applying credits to bookings). Clamped to balance.
export const debitWallet = async (user, requestedCredit) => {
    if (!user || !requestedCredit || requestedCredit <= 0) return 0
    const creditToDeduct = Math.min(user.walletBalance || 0, Number(requestedCredit))
    if (creditToDeduct <= 0) return 0

    if (user.__source === "mongo") {
        try {
            await User.findByIdAndUpdate(user._id, { $inc: { walletBalance: -creditToDeduct } })
            await WalletTransaction.create({
                user: user._id,
                type: "DEBIT",
                amount: creditToDeduct,
                description: "Wallet credits applied to booking discount"
            })
            return creditToDeduct
        } catch (err) {
            return 0
        }
    }

    user.walletBalance -= creditToDeduct
    store.walletLedger.push({
        id: "tx_" + Date.now() + "_disc",
        userId: userIdOf(user),
        type: "DEBIT",
        amount: creditToDeduct,
        description: "Wallet credits applied to booking discount",
        createdAt: new Date().toISOString()
    })
    return creditToDeduct
}

// GET /api/wallet view — same shape as store.getWallet
export const getWalletView = async (user) => {
    if (!user) {
        return { balance: 0, pending: 0, lifetimeEarned: 0, transactions: [] }
    }

    if (user.__source === "mongo") {
        try {
            const fresh = await User.findById(user._id).select("walletBalance referralCode").lean()
            const balance = fresh?.walletBalance || 0

            const txs = await WalletTransaction.find({ user: user._id }).sort({ createdAt: -1 }).lean()
            const lifetimeEarned = txs
                .filter(t => t.type === "CREDIT")
                .reduce((acc, t) => acc + t.amount, 0)

            const pendingCount = await Referral.countDocuments({ referrer: user._id, status: "Signed up" })
            const pending = pendingCount * REFERRAL_CONFIG.REFERRER_FIRST_REQUEST_CREDIT

            return {
                balance,
                pending,
                lifetimeEarned,
                transactions: txs.map(t => ({
                    id: t._id,
                    type: t.type,
                    amount: t.amount,
                    description: t.description,
                    createdAt: t.createdAt
                }))
            }
        } catch (err) {
            return { balance: user.walletBalance || 0, pending: 0, lifetimeEarned: 0, transactions: [] }
        }
    }

    return store.getWallet(userIdOf(user))
}

// Referral stats — same shape as store.getReferralStats
export const getReferralStatsForUser = async (user) => {
    if (!user) {
        return { referralCode: "RT-EXPLORER", stats: { totalInvited: 0, signedUp: 0, firstRequestCompleted: 0, rewardsCredited: 0 }, milestones: [] }
    }

    if (user.__source === "mongo") {
        try {
            const docs = await Referral.find({ referrer: user._id }).sort({ createdAt: -1 }).lean()

            const completed = docs.filter(r => r.status === "Reward credited" || r.status === "First request completed").length
            const signedUp = docs.length
            const rewardsCredited = docs.reduce((acc, curr) => acc + (curr.reward || 0), 0)

            const milestones = REFERRAL_CONFIG.MILESTONES.map(m => {
                const progress = Math.min(100, Math.round((completed / m.target) * 100))
                return {
                    ...m,
                    completedCount: completed,
                    achieved: completed >= m.target,
                    progressPercent: progress
                }
            })

            return {
                referralCode: user.referralCode || "RT-EXPLORER",
                stats: {
                    totalInvited: signedUp,
                    signedUp,
                    firstRequestCompleted: completed,
                    rewardsCredited
                },
                milestones
            }
        } catch (err) {
            // fallback below
        }
    }

    return store.getReferralStats(userIdOf(user))
}

// Referral history — same shape as store.getReferralHistory items
export const getReferralHistoryForUser = async (user) => {
    if (!user) return []

    if (user.__source === "mongo") {
        try {
            const docs = await Referral.find({ referrer: user._id }).sort({ createdAt: -1 }).lean()
            return docs.map(d => ({
                id: d._id,
                friendName: d.friendName,
                friendEmail: d.friendEmail,
                code: d.code,
                status: d.status,
                reward: d.reward,
                createdAt: d.createdAt
            }))
        } catch (err) {
            // fallback below
        }
    }

    return store.getReferralHistory(userIdOf(user))
}

// Find a referrer by referral code across BOTH worlds
const findReferrerByCode = async (code) => {
    if (isDbConnected()) {
        try {
            const mongoReferrer = await User.findOne({ referralCode: (code || "").toUpperCase() }).lean()
            if (mongoReferrer) return { ...mongoReferrer, __source: "mongo" }
        } catch (err) {
            // fallback below
        }
    }
    const storeReferrer = store.findUserByReferralCode(code)
    if (storeReferrer) {
        // Keep the LIVE store reference (not a copy) so wallet mutations persist
        Object.defineProperty(storeReferrer, "__source", { value: "store", enumerable: false, configurable: true })
        return storeReferrer
    }
    return null
}

// POST /api/referrals/apply
// Mirrors store.applyReferralCodeForUser messages exactly.
export const applyReferralCodeToUser = async (user, code) => {
    if (!user) throw new Error("User not found.")

    if (user.referredBy) {
        throw new Error("A referral code has already been applied to your account.")
    }

    const codeClean = String(code || "").trim().toUpperCase()
    const referrer = await findReferrerByCode(codeClean)

    if (!referrer) {
        throw new Error("Invalid referral code. Please check and try again.")
    }

    if (userIdOf(referrer) === userIdOf(user) || (referrer.email && referrer.email.toLowerCase() === (user.email || "").toLowerCase())) {
        throw new Error("You cannot use your own referral code.")
    }

    if (user.__source === "mongo") {
        try {
            await User.findByIdAndUpdate(user._id, { referredBy: referrer.referralCode })
            user.referredBy = referrer.referralCode

            await Referral.create({
                referrer: referrer.__source === "mongo" ? referrer._id : undefined,
                referrerCode: referrer.referralCode,
                referredUser: user._id,
                friendName: user.name,
                friendEmail: maskEmail(user.email),
                code: referrer.referralCode,
                status: "Signed up",
                reward: 0
            })

            await creditWallet(user, REFERRAL_CONFIG.FRIEND_WELCOME_CREDIT, `Welcome bonus for applying invite code ${referrer.referralCode}`)

            return {
                message: `Code applied! ₹${REFERRAL_CONFIG.FRIEND_WELCOME_CREDIT} has been credited to your wallet.`,
                walletBalance: user.walletBalance
            }
        } catch (err) {
            throw new Error(err.message || "Failed to apply referral code.")
        }
    }

    // Store path
    return store.applyReferralCodeForUser(userIdOf(user), code)
}

// Called after signup in authController so the referrer's dashboard shows the friend
export const recordSignupReferral = async (user, referrerDoc, referrerCode) => {
    if (!user || !referrerCode) return
    try {
        const exists = await Referral.findOne({
            code: referrerCode.trim().toUpperCase(),
            friendEmail: maskEmail(user.email)
        })
        if (exists) return

        await Referral.create({
            referrer: referrerDoc?._id ?? undefined,
            referrerCode: referrerCode.trim().toUpperCase(),
            referredUser: user._id,
            friendName: user.name,
            friendEmail: maskEmail(user.email),
            code: referrerCode.trim().toUpperCase(),
            status: "Signed up",
            reward: 0
        })

        await WalletTransaction.create({
            user: user._id,
            type: "CREDIT",
            amount: REFERRAL_CONFIG.FRIEND_WELCOME_CREDIT,
            description: `Welcome bonus for signing up with invite code ${referrerCode.trim().toUpperCase()}`
        })
    } catch (err) {
        // Non-blocking: registration itself must not fail because of tracking
        console.log("recordSignupReferral fallback:", err.message)
    }
}

// Referral completion trigger after first booking.
export const triggerReferralCompletion = async (user) => {
    if (!user || !user.referredBy) return

    if (user.__source !== "mongo") {
        return store.checkAndTriggerReferralCompletion(userIdOf(user))
    }

    try {
        let records = await Referral.find({
            code: String(user.referredBy).toUpperCase(),
            $or: [
                { referredUser: user._id },
                { referredUser: null, friendEmail: { $in: [user.email, maskEmail(user.email)] } }
            ]
        })

        // Already completed before → nothing to do
        const completed = await Referral.findOne({ referredUser: user._id, status: { $in: ["Reward credited", "First request completed"] } })
        if (records.length === 0) {
            if (completed) return
            // Referred at registration before tracking existed — create record now
            records = [await Referral.create({
                referrerCode: String(user.referredBy).toUpperCase(),
                referredUser: user._id,
                friendName: user.name,
                friendEmail: maskEmail(user.email),
                code: String(user.referredBy).toUpperCase(),
                status: "Signed up",
                reward: 0
            })]
        }

        const referrer = await findReferrerByCode(user.referredBy)

        // 1. Credit referrer ₹200
        if (referrer) {
            await creditWallet(referrer, REFERRAL_CONFIG.REFERRER_FIRST_REQUEST_CREDIT, `Referral reward! ${user.name} completed their first request`)
        }

        // 2. Give friend the completion bonus ₹100
        await creditWallet(user, REFERRAL_CONFIG.FRIEND_FIRST_REQUEST_BONUS, "First request bonus credit unlocked!")

        // 3. Mark referral records as rewarded
        for (const record of records) {
            record.status = "Reward credited"
            record.reward = referrer ? REFERRAL_CONFIG.REFERRER_FIRST_REQUEST_CREDIT : 0
            await record.save()
        }
    } catch (err) {
        console.log("Referral completion fallback:", err.message)
    }
}

// Favorites — persisted per user
export const getFavoritesForUser = async (user) => {
    if (!user) return []
    const ids = await getFavoriteIds(user)
    return store.listings.filter(l => ids.includes(String(l.id)) || ids.includes(String(l._id)))
}

const getFavoriteIds = async (user) => {
    if (user.__source === "mongo") {
        try {
            const favs = await Favorite.find({ user: user._id }).lean()
            return favs.map(f => String(f.listingId))
        } catch (err) {
            return []
        }
    }
    return store.favorites.filter(f => f.userId === userIdOf(user)).map(f => f.listingId)
}

export const addFavoriteForUser = async (user, listingId) => {
    if (!user || !listingId) return []

    if (user.__source === "mongo") {
        try {
            await Favorite.updateOne(
                { user: user._id, listingId },
                { user: user._id, listingId },
                { upsert: true }
            )
            return getFavoritesForUser(user)
        } catch (err) {
            // fallback below
        }
    }

    const exists = store.favorites.find(f => f.userId === userIdOf(user) && f.listingId === listingId)
    if (!exists) store.favorites.push({ userId: userIdOf(user), listingId })
    return store.getFavorites(userIdOf(user))
}

export const removeFavoriteForUser = async (user, listingId) => {
    if (!user) return []

    if (user.__source === "mongo") {
        try {
            await Favorite.deleteMany({ user: user._id, listingId })
            return getFavoritesForUser(user)
        } catch (err) {
            // fallback below
        }
    }

    store.favorites = store.favorites.filter(f => !(f.userId === userIdOf(user) && f.listingId === listingId))
    return store.getFavorites(userIdOf(user))
}

export default {
    resolveUser,
    debitWallet,
    getWalletView,
    getReferralStatsForUser,
    getReferralHistoryForUser,
    applyReferralCodeToUser,
    recordSignupReferral,
    triggerReferralCompletion,
    getFavoritesForUser,
    addFavoriteForUser,
    removeFavoriteForUser
}
