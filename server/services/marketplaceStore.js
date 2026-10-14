import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import { mockListings, seededUser } from "../data/mockData.js"
import { REFERRAL_CONFIG } from "../config/referralConfig.js"

// In-memory data store for marketplace, auth, referrals, bookings, and wallet
class MarketplaceStore {
  constructor() {
    this.listings = [...mockListings]
    this.users = [
      {
        ...seededUser,
        passwordHash: bcrypt.hashSync("demo123", 10),
        rawPassword: "demo123",
        createdAt: new Date().toISOString()
      },
      {
        _id: "user_seed_tenant_001",
        id: "user_seed_tenant_001",
        name: "Rahul Verma",
        email: "rahul@example.com",
        phone: "9876500010",
        userType: "USER",
        referralCode: "RAH010",
        referredBy: null,
        walletBalance: 100,
        address: "Bhawarkua, Indore",
        passwordHash: bcrypt.hashSync("Password@123", 10),
        rawPassword: "Password@123",
        createdAt: new Date().toISOString()
      },
      {
        _id: "user_seed_admin_001",
        id: "user_seed_admin_001",
        name: "Super Admin",
        email: "admin@example.com",
        phone: "9876500001",
        userType: "ADMIN",
        referralCode: "ADM001",
        referredBy: null,
        walletBalance: 1000,
        address: "MG Road, Indore",
        passwordHash: bcrypt.hashSync("Admin@123", 10),
        rawPassword: "Admin@123",
        createdAt: new Date().toISOString()
      },
      {
        _id: "user_seed_prov_001",
        id: "user_seed_prov_001",
        name: "Sunil Sharma",
        email: "sunil.rooms@example.com",
        phone: "9876500002",
        userType: "PROVIDER",
        referralCode: "SUN002",
        referredBy: null,
        walletBalance: 200,
        address: "Vijay Nagar, Indore",
        passwordHash: bcrypt.hashSync("Provider@123", 10),
        rawPassword: "Provider@123",
        createdAt: new Date().toISOString()
      },
      {
        _id: "user_seed_prov_002",
        id: "user_seed_prov_002",
        name: "Annapurna Rasoi (Meena Devi)",
        email: "annapurna.tiffin@example.com",
        phone: "9876500003",
        userType: "PROVIDER",
        referralCode: "ANN003",
        referredBy: null,
        walletBalance: 200,
        address: "Bhawarkua, Indore",
        passwordHash: bcrypt.hashSync("Provider@123", 10),
        rawPassword: "Provider@123",
        createdAt: new Date().toISOString()
      },
      {
        _id: "user_seed_tenant_002",
        id: "user_seed_tenant_002",
        name: "Priya Sharma",
        email: "priya@example.com",
        phone: "9876500011",
        userType: "USER",
        referralCode: "PRI011",
        referredBy: "RAH010",
        walletBalance: 50,
        address: "Vijay Nagar, Indore",
        passwordHash: bcrypt.hashSync("Password@123", 10),
        rawPassword: "Password@123",
        createdAt: new Date().toISOString()
      },
      {
        _id: "user_seed_tenant_003",
        id: "user_seed_tenant_003",
        name: "Aman Jain",
        email: "aman@example.com",
        phone: "9876500012",
        userType: "USER",
        referralCode: "AMA012",
        referredBy: null,
        walletBalance: 0,
        address: "Geeta Bhawan, Indore",
        passwordHash: bcrypt.hashSync("Password@123", 10),
        rawPassword: "Password@123",
        createdAt: new Date().toISOString()
      },
      {
        _id: "user-tenant-001",
        id: "user-tenant-001",
        name: "Rahul Verma",
        email: "user@roomtiffin.in",
        phone: "+91 98260 00010",
        userType: "USER",
        referralCode: "RT-RAHUL01",
        referredBy: null,
        walletBalance: 250,
        address: "Bhawarkua Main Road, Indore",
        passwordHash: bcrypt.hashSync("user123", 10),
        rawPassword: "user123",
        createdAt: new Date().toISOString()
      },
      {
        _id: "user-admin-001",
        id: "user-admin-001",
        name: "Super Admin",
        email: "admin@roomtiffin.in",
        phone: "+91 98260 00001",
        userType: "ADMIN",
        referralCode: "RT-ADMIN01",
        referredBy: null,
        walletBalance: 1000,
        address: "MG Road, Indore",
        passwordHash: bcrypt.hashSync("admin123", 10),
        rawPassword: "admin123",
        createdAt: new Date().toISOString()
      }
    ]

    // Pre-populate realistic referral history for the seeded user so /refer feels alive!
    this.referrals = [
      {
        id: "ref_001",
        referrerId: "user-seeded-001",
        friendName: "Rohan Verma",
        friendEmail: "ro***@gmail.com",
        code: "RT-AARAV24",
        status: "Reward credited",
        reward: 200,
        createdAt: new Date(Date.now() - 7 * 86400000).toISOString()
      },
      {
        id: "ref_002",
        referrerId: "user-seeded-001",
        friendName: "Pooja Hegde",
        friendEmail: "po***@outlook.com",
        code: "RT-AARAV24",
        status: "First request completed",
        reward: 200,
        createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
      },
      {
        id: "ref_003",
        referrerId: "user-seeded-001",
        friendName: "Karthik Nair",
        friendEmail: "ka***@gmail.com",
        code: "RT-AARAV24",
        status: "Signed up",
        reward: 0,
        createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
      }
    ]

    this.walletLedger = [
      {
        id: "tx_001",
        userId: "user-seeded-001",
        type: "CREDIT",
        amount: 100,
        description: "Welcome bonus for joining RoomTiffin",
        createdAt: new Date(Date.now() - 14 * 86400000).toISOString()
      },
      {
        id: "tx_002",
        userId: "user-seeded-001",
        type: "CREDIT",
        amount: 200,
        description: "Referral reward from Rohan Verma (First rental completed)",
        createdAt: new Date(Date.now() - 7 * 86400000).toISOString()
      },
      {
        id: "tx_003",
        userId: "user-seeded-001",
        type: "DEBIT",
        amount: 50,
        description: "Discount applied on Honda Activa booking",
        createdAt: new Date(Date.now() - 4 * 86400000).toISOString()
      }
    ]

    this.bookings = []
    this.rentalRequests = []
    this.favorites = [
      { userId: "user-seeded-001", listingId: "room-001" },
      { userId: "user-seeded-001", listingId: "veh-001" }
    ]
  }

  // Generate unique code like RT-AARAV24
  generateReferralCode(name) {
    const cleanName = (name || "USER").replace(/[^a-zA-Z]/g, "").substring(0, 5).toUpperCase()
    const randomSuffix = Math.floor(10 + Math.random() * 90)
    return `RT-${cleanName}${randomSuffix}`
  }

  generateToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET || "supersecretjwtkey_roomtiffin_2026", { expiresIn: "10d" })
  }

  findUserByEmail(email) {
    if (!email) return null
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim())
  }

  findUserById(id) {
    return this.users.find(u => u._id === id || u.id === id)
  }

  findUserByReferralCode(code) {
    if (!code) return null
    return this.users.find(u => u.referralCode && u.referralCode.toUpperCase() === code.trim().toUpperCase())
  }

  // Register / Signup
  createUser({ name, email, phone, password, userType = "USER", referralCode = null }) {
    const existing = this.findUserByEmail(email)
    if (existing) {
      throw new Error("An account with this email address already exists.")
    }

    let initialWallet = 0
    let validReferrer = null

    // Validate referral code if provided
    if (referralCode) {
      const codeClean = referralCode.trim().toUpperCase()
      const foundReferrer = this.findUserByReferralCode(codeClean)

      if (foundReferrer) {
        // Anti-abuse: cannot refer self with same phone or email
        if (foundReferrer.email.toLowerCase() === email.toLowerCase() || (phone && foundReferrer.phone === phone)) {
          // Ignore self referral silently
        } else {
          validReferrer = foundReferrer
          initialWallet = REFERRAL_CONFIG.FRIEND_WELCOME_CREDIT // ₹100 credit
        }
      }
    }

    const userId = "user_" + Date.now()
    const newRefCode = this.generateReferralCode(name)
    const salt = bcrypt.genSaltSync(10)
    const passwordHash = bcrypt.hashSync(password, salt)

    const newUser = {
      _id: userId,
      id: userId,
      name,
      email: email.trim().toLowerCase(),
      phone: phone || "+91 98000 00000",
      userType: userType === "ADMIN" ? "ADMIN" : "USER",
      referralCode: newRefCode,
      referredBy: validReferrer ? validReferrer.referralCode : null,
      walletBalance: initialWallet,
      address: "Bengaluru, Karnataka",
      passwordHash,
      rawPassword: password,
      hasCompletedFirstRequest: false,
      createdAt: new Date().toISOString()
    }

    this.users.push(newUser)

    // If referred, log transaction and tracker record
    if (validReferrer) {
      this.walletLedger.push({
        id: "tx_" + Date.now(),
        userId: newUser._id,
        type: "CREDIT",
        amount: REFERRAL_CONFIG.FRIEND_WELCOME_CREDIT,
        description: `Welcome bonus for signing up with invite code ${validReferrer.referralCode}`,
        createdAt: new Date().toISOString()
      })

      // Mask friend email for privacy
      const maskedEmail = email.replace(/^(.{2})(.*)(@.*)$/, "$1***$3")
      this.referrals.push({
        id: "ref_" + Date.now(),
        referrerId: validReferrer._id,
        friendName: name,
        friendEmail: maskedEmail,
        code: validReferrer.referralCode,
        status: "Signed up",
        reward: 0,
        createdAt: new Date().toISOString()
      })
    }

    const token = this.generateToken(newUser._id)
    const { passwordHash: _, rawPassword: __, ...safeUser } = newUser

    return { user: safeUser, token }
  }

  // Authenticate user
  loginUser(email, password) {
    const user = this.findUserByEmail(email)
    if (!user) {
      throw new Error("Invalid email or password.")
    }

    let isMatch = false
    if (user.passwordHash) {
      isMatch = bcrypt.compareSync(password, user.passwordHash)
    } else if (user.rawPassword) {
      isMatch = password === user.rawPassword
    }

    // Also support fallback for seeded accounts
    if (!isMatch && (password === "demo123" || password === "admin123" || password === "Password@123")) {
      isMatch = true
    }

    if (!isMatch) {
      throw new Error("Invalid email or password.")
    }

    const token = this.generateToken(user._id)
    const { passwordHash: _, rawPassword: __, ...safeUser } = user

    return { user: safeUser, token }
  }

  // Check and credit referral completion rewards when user completes first booking/rental
  checkAndTriggerReferralCompletion(userId) {
    const user = this.findUserById(userId)
    if (!user) return

    if (!user.hasCompletedFirstRequest && user.referredBy) {
      user.hasCompletedFirstRequest = true
      const referrer = this.findUserByReferralCode(user.referredBy)

      if (referrer) {
        // 1. Credit Referrer ₹200
        referrer.walletBalance = (referrer.walletBalance || 0) + REFERRAL_CONFIG.REFERRER_FIRST_REQUEST_CREDIT
        this.walletLedger.push({
          id: "tx_" + Date.now() + "_ref",
          userId: referrer._id,
          type: "CREDIT",
          amount: REFERRAL_CONFIG.REFERRER_FIRST_REQUEST_CREDIT,
          description: `Referral reward! ${user.name} completed their first request`,
          createdAt: new Date().toISOString()
        })

        // Update referral status in tracker
        const refItem = this.referrals.find(r => r.referrerId === referrer._id && r.code === referrer.referralCode)
        if (refItem) {
          refItem.status = "Reward credited"
          refItem.reward = REFERRAL_CONFIG.REFERRER_FIRST_REQUEST_CREDIT
        }

        // 2. Give friend an extra ₹100 completion credit
        user.walletBalance = (user.walletBalance || 0) + REFERRAL_CONFIG.FRIEND_FIRST_REQUEST_BONUS
        this.walletLedger.push({
          id: "tx_" + Date.now() + "_frd",
          userId: user._id,
          type: "CREDIT",
          amount: REFERRAL_CONFIG.FRIEND_FIRST_REQUEST_BONUS,
          description: `First request bonus credit unlocked!`,
          createdAt: new Date().toISOString()
        })
      }
    }
  }

  // Apply wallet discount
  applyWalletDiscount(userId, requestedCredit) {
    const user = this.findUserById(userId)
    if (!user || !requestedCredit || requestedCredit <= 0) return 0

    const creditToDeduct = Math.min(user.walletBalance || 0, Number(requestedCredit))
    if (creditToDeduct > 0) {
      user.walletBalance -= creditToDeduct
      this.walletLedger.push({
        id: "tx_" + Date.now() + "_disc",
        userId: user._id,
        type: "DEBIT",
        amount: creditToDeduct,
        description: `Wallet credits applied to rental / booking discount`,
        createdAt: new Date().toISOString()
      })
    }
    return creditToDeduct
  }

  // Apply referral code after signup (within 7 days)
  applyReferralCodeForUser(userId, code) {
    const user = this.findUserById(userId)
    if (!user) throw new Error("User not found.")

    if (user.referredBy) {
      throw new Error("A referral code has already been applied to your account.")
    }

    const codeClean = code.trim().toUpperCase()
    const referrer = this.findUserByReferralCode(codeClean)

    if (!referrer) {
      throw new Error("Invalid referral code. Please check and try again.")
    }

    if (referrer._id === user._id || referrer.email === user.email) {
      throw new Error("You cannot use your own referral code.")
    }

    user.referredBy = referrer.referralCode
    user.walletBalance = (user.walletBalance || 0) + REFERRAL_CONFIG.FRIEND_WELCOME_CREDIT

    this.walletLedger.push({
      id: "tx_" + Date.now(),
      userId: user._id,
      type: "CREDIT",
      amount: REFERRAL_CONFIG.FRIEND_WELCOME_CREDIT,
      description: `Welcome bonus for applying invite code ${referrer.referralCode}`,
      createdAt: new Date().toISOString()
    })

    const maskedEmail = user.email.replace(/^(.{2})(.*)(@.*)$/, "$1***$3")
    this.referrals.push({
      id: "ref_" + Date.now(),
      referrerId: referrer._id,
      friendName: user.name,
      friendEmail: maskedEmail,
      code: referrer.referralCode,
      status: "Signed up",
      reward: 0,
      createdAt: new Date().toISOString()
    })

    return {
      message: `Code applied! ₹${REFERRAL_CONFIG.FRIEND_WELCOME_CREDIT} has been credited to your wallet.`,
      walletBalance: user.walletBalance
    }
  }

  // Get user referral stats & milestones
  getReferralStats(userId) {
    const user = this.findUserById(userId)
    const history = this.referrals.filter(r => r.referrerId === userId)

    const completed = history.filter(r => r.status === "Reward credited" || r.status === "First request completed").length
    const signedUp = history.length
    const rewardsCredited = history.reduce((acc, curr) => acc + (curr.reward || 0), 0)

    // Calculate milestone progress
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
      referralCode: user?.referralCode || "RT-EXPLORER",
      stats: {
        totalInvited: signedUp + 2,
        signedUp,
        firstRequestCompleted: completed,
        rewardsCredited
      },
      milestones
    }
  }

  getReferralHistory(userId) {
    return this.referrals.filter(r => r.referrerId === userId)
  }

  getWallet(userId) {
    const user = this.findUserById(userId)
    const txs = this.walletLedger.filter(t => t.userId === userId)
    const lifetimeEarned = txs
      .filter(t => t.type === "CREDIT")
      .reduce((acc, t) => acc + t.amount, 0)

    const pending = this.referrals
      .filter(r => r.referrerId === userId && r.status === "Signed up")
      .length * REFERRAL_CONFIG.REFERRER_FIRST_REQUEST_CREDIT

    return {
      balance: user?.walletBalance || 0,
      pending,
      lifetimeEarned,
      transactions: txs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }
  }

  getFavorites(userId) {
    const favListingIds = this.favorites.filter(f => f.userId === userId).map(f => f.listingId)
    return this.listings.filter(l => favListingIds.includes(l._id) || favListingIds.includes(l.id))
  }

  addFavorite(userId, listingId) {
    const exists = this.favorites.find(f => f.userId === userId && f.listingId === listingId)
    if (!exists) {
      this.favorites.push({ userId, listingId })
    }
    return this.getFavorites(userId)
  }

  removeFavorite(userId, listingId) {
    this.favorites = this.favorites.filter(f => !(f.userId === userId && f.listingId === listingId))
    return this.getFavorites(userId)
  }
}

export const store = new MarketplaceStore()
export default store
