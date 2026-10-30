import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import mongoose from "mongoose"
import User from "../../models/userModel.js"
import { REFERRAL_CONFIG } from "../../config/referralConfig.js"
import { recordSignupReferral } from "../../services/userContext.js"

// All pre-seeded users matching server/seed.js + RoomTiffin standards
const localUsers = [
    // ===================================
    // ADMIN (seed.js)
    // ===================================
    {
        _id: "user_seed_admin_001",
        name: "Super Admin",
        email: "admin@example.com",
        phone: "9876500001",
        password: bcrypt.hashSync("Admin@123", 10),
        rawPassword: "Admin@123",
        address: "MG Road, Indore",
        userType: "ADMIN",
        referralCode: "ADM001",
        walletBalance: 1000,
        createdAt: new Date().toISOString()
    },
    {
        _id: "user_admin_rt",
        name: "Super Admin",
        email: "admin@roomtiffin.in",
        phone: "9876500001",
        password: bcrypt.hashSync("admin123", 10),
        rawPassword: "admin123",
        address: "MG Road, Indore",
        userType: "ADMIN",
        referralCode: "RT-ADMIN01",
        walletBalance: 1000,
        createdAt: new Date().toISOString()
    },

    // ===================================
    // PROVIDERS (seed.js)
    // ===================================
    {
        _id: "user_seed_prov_001",
        name: "Sunil Sharma",
        email: "sunil.rooms@example.com",
        phone: "9876500002",
        password: bcrypt.hashSync("Provider@123", 10),
        rawPassword: "Provider@123",
        address: "Vijay Nagar, Indore",
        userType: "PROVIDER",
        referralCode: "SUN002",
        walletBalance: 200,
        createdAt: new Date().toISOString()
    },
    {
        _id: "user_seed_prov_002",
        name: "Annapurna Rasoi (Meena Devi)",
        email: "annapurna.tiffin@example.com",
        phone: "9876500003",
        password: bcrypt.hashSync("Provider@123", 10),
        rawPassword: "Provider@123",
        address: "Bhawarkua, Indore",
        userType: "PROVIDER",
        referralCode: "ANN003",
        walletBalance: 200,
        createdAt: new Date().toISOString()
    },
    {
        _id: "user_seed_prov_005",
        name: "Vikas Patel (Applicant)",
        email: "vikas.pending@example.com",
        phone: "9876500006",
        password: bcrypt.hashSync("Provider@123", 10),
        rawPassword: "Provider@123",
        address: "Rau, Indore",
        userType: "USER",
        referralCode: "VIK006",
        walletBalance: 50,
        createdAt: new Date().toISOString()
    },

    // ===================================
    // REGULAR USERS / TENANTS (seed.js)
    // ===================================
    {
        _id: "user_seed_tenant_001",
        name: "Rahul Verma",
        email: "rahul@example.com",
        phone: "9876500010",
        password: bcrypt.hashSync("Password@123", 10),
        rawPassword: "Password@123",
        address: "Bhawarkua, Indore",
        userType: "USER",
        referralCode: "RAH010",
        walletBalance: 100,
        createdAt: new Date().toISOString()
    },
    {
        _id: "user_seed_tenant_002",
        name: "Priya Sharma",
        email: "priya@example.com",
        phone: "9876500011",
        password: bcrypt.hashSync("Password@123", 10),
        rawPassword: "Password@123",
        address: "Vijay Nagar, Indore",
        userType: "USER",
        referralCode: "PRI011",
        referredBy: "RAH010",
        walletBalance: 50,
        createdAt: new Date().toISOString()
    },
    {
        _id: "user_seed_tenant_003",
        name: "Aman Jain",
        email: "aman@example.com",
        phone: "9876500012",
        password: bcrypt.hashSync("Password@123", 10),
        rawPassword: "Password@123",
        address: "Geeta Bhawan, Indore",
        userType: "USER",
        referralCode: "AMA012",
        walletBalance: 0,
        createdAt: new Date().toISOString()
    },
    {
        _id: "user_tenant_rt",
        name: "Rahul Verma",
        email: "user@roomtiffin.in",
        phone: "9876500010",
        password: bcrypt.hashSync("user123", 10),
        rawPassword: "user123",
        address: "Bhawarkua, Indore",
        userType: "USER",
        referralCode: "RT-RAHUL01",
        walletBalance: 150,
        createdAt: new Date().toISOString()
    },
    {
        _id: "user_demo_rt",
        name: "Aarav Sharma",
        email: "demo@roomtiffin.in",
        phone: "9826000123",
        password: bcrypt.hashSync("demo123", 10),
        rawPassword: "demo123",
        address: "Bhawarkua, Indore",
        userType: "USER",
        referralCode: "RT-AARAV24",
        walletBalance: 250,
        createdAt: new Date().toISOString()
    }
]

const isDbConnected = () => {
    return mongoose.connection.readyState === 1
}

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || "supersecretjwtkey_roomtiffin_2026", { expiresIn: '10d' })
}

// Generate unique referral code
const generateReferralCode = (name) => {
    const cleanName = (name || "REF").replace(/[^a-zA-Z]/g, "").substring(0, 3).toUpperCase()
    const randomHex = crypto.randomBytes(2).toString('hex').toUpperCase()
    return `${cleanName}${randomHex}`
}

// POST /api/auth/register or POST /api/auth/signup
const registerUser = async (req, res) => {
    const { name, email, phone, password, referralCode } = req.body

    if (!name || !email || !phone || !password) {
        res.status(409)
        throw new Error("Please fill all details!!!")
    }

    const cleanEmail = email.toLowerCase().trim()

    // Try MongoDB if connected
    if (isDbConnected()) {
        try {
            const emailExist = await User.findOne({ email: cleanEmail })
            const phoneExist = await User.findOne({ phone })

            if (emailExist || phoneExist) {
                res.status(409)
                throw new Error("User Already Exists!")
            }

            let validReferrerCode = null
            let referrerDoc = null
            let welcomeBonus = 0

            if (referralCode) {
                const referrer = await User.findOne({ referralCode: referralCode.trim().toUpperCase() })
                if (referrer && referrer.email.toLowerCase() !== cleanEmail) {
                    referrerDoc = referrer
                    validReferrerCode = referrer.referralCode
                    // Unified with the marketplace referral program rewards
                    welcomeBonus = REFERRAL_CONFIG.FRIEND_WELCOME_CREDIT
                }
            }

            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)
            const newReferralCode = generateReferralCode(name)

            const user = await User.create({
                name,
                email: cleanEmail,
                phone,
                password: hashedPassword,
                referralCode: newReferralCode,
                referredBy: validReferrerCode,
                walletBalance: welcomeBonus,
                // Public signup always creates a USER — providers are upgraded
                // after admin verification, admins are created manually.
                userType: "USER"
            })

            if (user) {
                // Track the referral + wallet transaction so referrer dashboards show it
                if (validReferrerCode) {
                    await recordSignupReferral(user, referrerDoc, validReferrerCode)
                }

                return res.status(201).json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    userType: user.userType,
                    referralCode: user.referralCode,
                    walletBalance: user.walletBalance,
                    createdAt: user.createdAt,
                    token: generateToken(user._id)
                })
            }
        } catch (dbErr) {
            if (dbErr.message.includes("Already Exists")) {
                throw dbErr
            }
            console.log("DB Register fallback:", dbErr.message)
        }
    }

    // In-memory Fallback
    const existing = localUsers.find(u => u.email.toLowerCase() === cleanEmail || u.phone === phone)
    if (existing) {
        res.status(409)
        throw new Error("User Already Exists!")
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const newRefCode = generateReferralCode(name)

    const newUser = {
        _id: "user_" + Date.now(),
        name,
        email: cleanEmail,
        phone,
        password: hashedPassword,
        rawPassword: password,
        referralCode: newRefCode,
        referredBy: referralCode || null,
        walletBalance: referralCode ? REFERRAL_CONFIG.FRIEND_WELCOME_CREDIT : 0,
        userType: "USER",
        createdAt: new Date().toISOString()
    }

    localUsers.push(newUser)

    res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        userType: newUser.userType,
        referralCode: newUser.referralCode,
        walletBalance: newUser.walletBalance,
        createdAt: newUser.createdAt,
        token: generateToken(newUser._id)
    })
}

// POST /api/auth/login
const loginUser = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        res.status(409)
        throw new Error("Please fill all details!!!")
    }

    const cleanEmail = email.toLowerCase().trim()

    // 1. Try MongoDB first (searches users created via seed.js or register)
    if (isDbConnected()) {
        try {
            const user = await User.findOne({ email: cleanEmail })
            if (user && await bcrypt.compare(password, user.password)) {
                return res.status(200).json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    userType: user.userType,
                    referralCode: user.referralCode,
                    walletBalance: user.walletBalance ?? 0,
                    createdAt: user.createdAt,
                    token: generateToken(user._id)
                })
            }
        } catch (dbErr) {
            console.log("DB Login fallback:", dbErr.message)
        }
    }

    // 2. Fallback to local users (contains all seed.js users + demo accounts)
    const foundUser = localUsers.find(u => u.email.toLowerCase() === cleanEmail)
    if (foundUser) {
        let isMatch = false
        if (foundUser.password && (foundUser.password.startsWith("$2a$") || foundUser.password.startsWith("$2b$"))) {
            isMatch = await bcrypt.compare(password, foundUser.password)
        }
        if (!isMatch) {
            isMatch = password === foundUser.password || password === foundUser.rawPassword
        }

        if (isMatch) {
            return res.status(200).json({
                _id: foundUser._id,
                name: foundUser.name,
                email: foundUser.email,
                phone: foundUser.phone,
                userType: foundUser.userType,
                referralCode: foundUser.referralCode,
                walletBalance: foundUser.walletBalance ?? 0,
                createdAt: foundUser.createdAt,
                token: generateToken(foundUser._id)
            })
        }
    }

    res.status(401)
    throw new Error("Invalid Credentials")
}

// GET /api/auth/me or GET /api/auth/profile
const getMyProfile = async (req, res) => {
    const userId = req.user._id || req.user.id

    if (isDbConnected() && mongoose.isValidObjectId(userId)) {
        try {
            const user = await User.findById(userId).select("-password")
            if (user) return res.status(200).json(user)
        } catch (err) {
            // fallback
        }
    }

    if (req.user) {
        const { password, rawPassword, passwordHash, ...safe } = req.user
        return res.status(200).json(safe)
    }

    res.status(404)
    throw new Error("No User Found!")
}

// PUT /api/auth/me or PUT /api/auth/profile
const updateProfile = async (req, res) => {
    const { userType } = req.body

    if (userType) {
        res.status(401)
        throw new Error("Only Admin Can Change User Type!!!")
    }

    const userId = req.user._id || req.user.id

    if (isDbConnected() && mongoose.isValidObjectId(userId)) {
        try {
            const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true }).select("-password")
            if (updatedUser) {
                return res.status(200).json(updatedUser)
            }
        } catch (err) {
            // fallback
        }
    }

    const foundIdx = localUsers.findIndex(u => u._id === userId || u.id === userId)
    if (foundIdx !== -1) {
        localUsers[foundIdx] = { ...localUsers[foundIdx], ...req.body }
        const { password, rawPassword, ...safe } = localUsers[foundIdx]
        return res.status(200).json(safe)
    }

    res.status(404)
    throw new Error("No User Found!")
}

// POST /api/auth/demo-login
const demoLogin = async (req, res) => {
    const role = (req.body?.role || req.body?.email || "user").toLowerCase()

    let targetEmail = "rahul@example.com"
    let targetPass = "Password@123"

    if (role.includes("admin")) {
        targetEmail = "admin@example.com"
        targetPass = "Admin@123"
    } else if (role.includes("provider") || role.includes("room")) {
        targetEmail = "sunil.rooms@example.com"
        targetPass = "Provider@123"
    }

    req.body.email = targetEmail
    req.body.password = targetPass
    return loginUser(req, res)
}

const authService = {
    registerUser,
    loginUser,
    getMyProfile,
    updateProfile,
    demoLogin,
    localUsers
}

export default authService
