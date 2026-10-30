import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

import User from "./models/userModel.js"
import Provider from "./models/providerModel.js"
import Room from "./models/roomModel.js"
import Tiffin from "./models/tiffinModel.js"
import { dedupeListingImages } from "./services/listingImages.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, ".env") })
dotenv.config()

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/indore-hub"

// ---------- USERS ----------
const usersData = [
    { name: "Admin", email: "admin@indorehub.com", phone: "9000000001", userType: "ADMIN", referralCode: "ADMIN001", walletBalance: 0 },

    // Regular users
    { name: "Rahul Sharma", email: "rahul@example.com", phone: "9000000011", userType: "USER", referralCode: "RAHUL011", walletBalance: 250, address: "Vijay Nagar, Indore" },
    { name: "Priya Verma", email: "priya@example.com", phone: "9000000012", userType: "USER", referralCode: "PRIYA012", walletBalance: 100, referredBy: "RAHUL011", address: "Bhawarkua, Indore" },
    { name: "Amit Patel", email: "amit@example.com", phone: "9000000013", userType: "USER", referralCode: "AMIT013", walletBalance: 0, address: "Palasia, Indore" },
    { name: "Sneha Joshi", email: "sneha@example.com", phone: "9000000014", userType: "USER", referralCode: "SNEHA014", walletBalance: 500, address: "Rajendra Nagar, Indore" },
    { name: "Karan Singh", email: "karan@example.com", phone: "9000000015", userType: "USER", referralCode: "KARAN015", walletBalance: 50, referredBy: "AMIT013", address: "Scheme 78, Indore" },

    // Providers (room owners)
    { name: "Suresh Agrawal", email: "suresh@example.com", phone: "9000000021", userType: "PROVIDER", referralCode: "SURESH021", address: "Vijay Nagar, Indore" },
    { name: "Meena Gupta", email: "meena@example.com", phone: "9000000022", userType: "PROVIDER", referralCode: "MEENA022", address: "Bhawarkua, Indore" },
    { name: "Rajesh Jain", email: "rajesh@example.com", phone: "9000000023", userType: "PROVIDER", referralCode: "RAJESH023", address: "Palasia, Indore" },

    // Providers (tiffin owners)
    { name: "Sunita Bai", email: "sunita@example.com", phone: "9000000031", userType: "PROVIDER", referralCode: "SUNITA031", address: "Sudama Nagar, Indore" },
    { name: "Mahesh Tiwari", email: "mahesh@example.com", phone: "9000000032", userType: "PROVIDER", referralCode: "MAHESH032", address: "Khajrana, Indore" },
    { name: "Lakshmi Iyer", email: "lakshmi@example.com", phone: "9000000033", userType: "PROVIDER", referralCode: "LAKSHMI033", address: "Geeta Bhawan, Indore" }
]

// ---------- PROVIDERS (keyed by user email) ----------
const providersData = [
    { email: "suresh@example.com", businessName: "Agrawal Student Stays", providerType: "ROOM", contactNumber: "9000000021", businessAddress: "12, Vijay Nagar, Indore", description: "Affordable rooms near coaching hubs and IT parks.", isVerified: true },
    { email: "meena@example.com", businessName: "Gupta PG & Rooms", providerType: "ROOM", contactNumber: "9000000022", businessAddress: "45, Bhawarkua Main Road, Indore", description: "Safe and clean accommodation for students.", isVerified: true },
    { email: "rajesh@example.com", businessName: "Jain Properties", providerType: "ROOM", contactNumber: "9000000023", businessAddress: "7, Palasia Square, Indore", description: "Flats and 1BHKs for working professionals and families.", isVerified: false },
    { email: "sunita@example.com", businessName: "Sunita Ghar Ka Khana", providerType: "TIFFIN", contactNumber: "9000000031", businessAddress: "23, Sudama Nagar, Indore", description: "Homestyle meals made fresh every day.", isVerified: true },
    { email: "mahesh@example.com", businessName: "Malwa Rasoi", providerType: "TIFFIN", contactNumber: "9000000032", businessAddress: "88, Khajrana Road, Indore", description: "Authentic MP special thali and Indori flavours.", isVerified: true },
    { email: "lakshmi@example.com", businessName: "Annapurna Tiffin Service", providerType: "TIFFIN", contactNumber: "9000000033", businessAddress: "5, Geeta Bhawan, Indore", description: "South Indian and multi-cuisine tiffins.", isVerified: false }
]

// ---------- ROOMS (keyed by owner email) ----------
const roomsData = [
    {
        ownerEmail: "suresh@example.com",
        title: "Cozy Single Room near Vijay Nagar Square",
        description: "Well-ventilated single room with attached bathroom, 5 min walk from Vijay Nagar Square. Ideal for students and interns.",
        roomType: "single", rent: 5500, deposit: 5500, locality: "Vijay Nagar",
        address: "Plot 12, Sector B, Vijay Nagar, Indore",
        amenities: ["WiFi", "Attached Bathroom", "Water Cooler", "Study Table", "Power Backup"],
        preferredTenant: "STUDENT",
        images: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800", "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800"],
        coordinates: { lat: 22.7533, lng: 75.8937 }, rating: 4.6, numReviews: 18
    },
    {
        ownerEmail: "suresh@example.com",
        title: "Shared Room for Boys - Vijay Nagar",
        description: "Double sharing room with cupboard and bed for each tenant. Meals available nearby.",
        roomType: "shared", rent: 3500, deposit: 3000, locality: "Vijay Nagar",
        address: "Near Pipliyahana Chauraha, Vijay Nagar, Indore",
        amenities: ["WiFi", "Cupboard", "Water Purifier", "Laundry", "Power Backup"],
        preferredTenant: "BOYS",
        images: ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800"],
        coordinates: { lat: 22.7480, lng: 75.8890 }, rating: 4.2, numReviews: 9
    },
    {
        ownerEmail: "suresh@example.com",
        title: "Modern 1RK with Kitchenette",
        description: "Fully furnished 1RK with modular kitchenette, perfect for working professionals.",
        roomType: "1rk", rent: 8500, deposit: 17000, locality: "Scheme 78",
        address: "Scheme 78, Part 2, Indore",
        amenities: ["WiFi", "AC", "Geyser", "Fridge", "Modular Kitchen", "Parking"],
        preferredTenant: "WORKING_PROFESSIONAL",
        images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"],
        coordinates: { lat: 22.7510, lng: 75.8985 }, rating: 4.7, numReviews: 12
    },
    {
        ownerEmail: "meena@example.com",
        title: "Girls PG with Meals - Bhawarkua",
        description: "Safe, CCTV-monitored PG exclusively for girls. 24x7 security and warden. Near Medicaps and IPS Academy buses.",
        roomType: "shared", rent: 6000, deposit: 6000, locality: "Bhawarkua",
        address: "Lane 3, Bhawarkua Main Road, Indore",
        amenities: ["WiFi", "CCTV", "Meals Included", "Geyser", "Laundry", "Power Backup", "Security Guard"],
        preferredTenant: "GIRLS",
        images: ["https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800", "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800"],
        coordinates: { lat: 22.6955, lng: 75.8570 }, rating: 4.8, numReviews: 31
    },
    {
        ownerEmail: "meena@example.com",
        title: "Budget Single Room for Students",
        description: "Simple, clean single room within walking distance of coaching centres.",
        roomType: "single", rent: 4000, deposit: 4000, locality: "Bhawarkua",
        address: "Near Coaching Hub, Bhawarkua, Indore",
        amenities: ["WiFi", "Study Table", "Water Cooler", "Common Bathroom"],
        preferredTenant: "STUDENT",
        images: ["https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800"],
        coordinates: { lat: 22.6940, lng: 75.8545 }, rating: 4.0, numReviews: 6
    },
    {
        ownerEmail: "meena@example.com",
        title: "Spacious 1BHK Near Rajendra Nagar",
        description: "Airy 1BHK on the first floor with balcony. Quiet neighbourhood, close to the railway station.",
        roomType: "1bhk", rent: 9500, deposit: 19000, locality: "Rajendra Nagar",
        address: "B-21, Rajendra Nagar, Indore",
        amenities: ["WiFi", "Balcony", "Geyser", "Parking", "Water Supply 24x7"],
        preferredTenant: "ANY",
        images: ["https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800"],
        coordinates: { lat: 22.6880, lng: 75.8340 }, rating: 4.4, numReviews: 14
    },
    {
        ownerEmail: "rajesh@example.com",
        title: "2-Bed Flat in Palasia",
        description: "Semi-furnished flat in a prime location. Close to markets, hospitals and Treasure Island Mall.",
        roomType: "flat", rent: 16000, deposit: 32000, locality: "Palasia",
        address: "Flat 302, Shivam Apartments, Palasia, Indore",
        amenities: ["Lift", "Parking", "WiFi", "Modular Kitchen", "Wardrobes", "Power Backup", "Security Guard"],
        preferredTenant: "WORKING_PROFESSIONAL",
        images: ["https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800", "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800"],
        coordinates: { lat: 22.7239, lng: 75.8812 }, rating: 4.5, numReviews: 20
    },
    {
        ownerEmail: "rajesh@example.com",
        title: "Furnished 1BHK - Sudama Nagar",
        description: "Fully furnished 1BHK with AC in bedroom. Suitable for couples or a single professional.",
        roomType: "1bhk", rent: 12000, deposit: 24000, locality: "Sudama Nagar",
        address: "Near Sudama Nagar Garden, Indore",
        amenities: ["AC", "Fridge", "TV", "WiFi", "Washing Machine", "Parking"],
        preferredTenant: "ANY",
        images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"],
        coordinates: { lat: 22.6990, lng: 75.8180 }, rating: 4.3, numReviews: 8
    },
    {
        ownerEmail: "rajesh@example.com",
        title: "Single Room with Attached Bath - Khajrana",
        description: "Ground-floor single room with separate entry, 10 min from Khajrana Ganesh Mandir.",
        roomType: "single", rent: 4800, deposit: 4800, locality: "Khajrana",
        address: "Near Khajrana Square, Indore",
        amenities: ["Attached Bathroom", "WiFi", "Water Cooler", "Power Backup"],
        preferredTenant: "ANY",
        images: ["https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800"],
        coordinates: { lat: 22.7365, lng: 75.9020 }, rating: 4.1, numReviews: 5
    },
    {
        ownerEmail: "suresh@example.com",
        title: "Boys Shared Room - MR 10",
        description: "Triple sharing at budget rent. Common kitchen and study area available.",
        roomType: "shared", rent: 2800, deposit: 2500, locality: "MR 10",
        address: "MR 10 Road, Indore",
        amenities: ["WiFi", "Common Kitchen", "Study Area", "Water Purifier"],
        preferredTenant: "BOYS",
        images: ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800"],
        coordinates: { lat: 22.7500, lng: 75.8800 }, rating: 3.9, numReviews: 4, isAvailable: true
    },
    {
        ownerEmail: "meena@example.com",
        title: "Premium Girls Single Room - Annapurna",
        description: "Single occupancy room with AC and attached bath in a gated girls-only building.",
        roomType: "single", rent: 9000, deposit: 9000, locality: "Annapurna",
        address: "Annapurna Road, Indore",
        amenities: ["AC", "Attached Bathroom", "WiFi", "CCTV", "Meals Included", "Security Guard"],
        preferredTenant: "GIRLS",
        images: ["https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800"],
        coordinates: { lat: 22.6930, lng: 75.8280 }, rating: 4.9, numReviews: 27
    },
    {
        ownerEmail: "rajesh@example.com",
        title: "Unavailable 1RK - Saket (Currently Occupied)",
        description: "Compact 1RK near Saket Nagar. Will be vacant next month.",
        roomType: "1rk", rent: 7000, deposit: 14000, locality: "Saket",
        address: "Saket Nagar, Indore",
        amenities: ["WiFi", "Geyser", "Parking"],
        preferredTenant: "ANY",
        images: [],
        coordinates: { lat: 22.7050, lng: 75.8700 }, rating: 4.0, numReviews: 3, isAvailable: false
    }
]

// ---------- TIFFINS (keyed by owner email) ----------
const tiffinsData = [
    {
        ownerEmail: "sunita@example.com",
        name: "Sunita Ghar Ka Khana",
        description: "Fresh, homestyle North Indian meals cooked with minimal oil and no preservatives. Roti, sabzi, dal, rice, salad.",
        cuisineType: "North Indian", mealType: "PURE_VEG",
        pricePerMeal: 70, monthlyPrice: 1900,
        deliveryAreas: ["Sudama Nagar", "Bhawarkua", "Rajendra Nagar", "Annapurna"],
        mealSchedule: ["Lunch", "Dinner"],
        menuHighlights: ["4 Fresh Rotis", "Seasonal Sabzi", "Dal Tadka", "Jeera Rice", "Salad"],
        weeklyMenu: { Monday: "Aloo Gobhi, Dal Fry", Tuesday: "Paneer Bhurji, Dal Tadka", Wednesday: "Bhindi, Kadhi", Thursday: "Mix Veg, Dal Makhani", Friday: "Chole, Rice", Saturday: "Rajma, Jeera Rice", Sunday: "Special Paneer Thali" },
        images: ["https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800"],
        coordinates: { lat: 22.6990, lng: 75.8180 }, rating: 4.8, numReviews: 42
    },
    {
        ownerEmail: "sunita@example.com",
        name: "Sunita Jain Thali",
        description: "Strictly Jain meals - no onion, no garlic, no root vegetables.",
        cuisineType: "Jain", mealType: "JAIN",
        pricePerMeal: 80, monthlyPrice: 2200,
        deliveryAreas: ["Sudama Nagar", "Palasia", "Geeta Bhawan"],
        mealSchedule: ["Lunch"],
        menuHighlights: ["Jain Sabzi", "Dal", "Rice", "Phulka", "Sweet"],
        weeklyMenu: { Monday: "Lauki, Dal", Tuesday: "Paneer Masala (Jain)", Wednesday: "Tinda, Kadhi", Thursday: "Mix Veg (Jain), Dal", Friday: "Methi Matar Malai", Saturday: "Kaju Curry", Sunday: "Special Jain Thali" },
        images: ["https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800"],
        coordinates: { lat: 22.7239, lng: 75.8812 }, rating: 4.7, numReviews: 19
    },
    {
        ownerEmail: "mahesh@example.com",
        name: "Malwa Rasoi",
        description: "Authentic Malwa cuisine - dal bafla, poha, bhutte ka kees and more, delivered hot.",
        cuisineType: "MP Special", mealType: "VEG",
        pricePerMeal: 90, monthlyPrice: 2500,
        deliveryAreas: ["Khajrana", "Vijay Nagar", "Scheme 78", "MR 10"],
        mealSchedule: ["Lunch", "Dinner"],
        menuHighlights: ["Dal Bafla", "Bhutte Ka Kees", "Gatte Ki Sabzi", "Poha-Jalebi (Sunday)"],
        weeklyMenu: { Monday: "Gatte Ki Sabzi, Roti", Tuesday: "Palak Paneer, Dal", Wednesday: "Kadhi Pakoda, Rice", Thursday: "Sev Tamatar, Dal", Friday: "Dal Bafla", Saturday: "Bhutte Ka Kees, Roti", Sunday: "Poha-Jalebi Combo" },
        images: ["https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800"],
        coordinates: { lat: 22.7365, lng: 75.9020 }, rating: 4.9, numReviews: 56
    },
    {
        ownerEmail: "mahesh@example.com",
        name: "Malwa Non-Veg Dabba",
        description: "Home-style chicken and egg curries with roti and rice.",
        cuisineType: "North Indian", mealType: "NON_VEG",
        pricePerMeal: 120, monthlyPrice: 3300,
        deliveryAreas: ["Khajrana", "Vijay Nagar", "Scheme 78"],
        mealSchedule: ["Dinner"],
        menuHighlights: ["Chicken Curry", "Egg Curry", "Rice", "Roti", "Salad"],
        weeklyMenu: { Monday: "Egg Curry", Tuesday: "Chicken Curry", Wednesday: "Veg Day - Paneer", Thursday: "Chicken Masala", Friday: "Egg Bhurji", Saturday: "Chicken Biryani", Sunday: "Mutton Curry" },
        images: ["https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800"],
        coordinates: { lat: 22.7480, lng: 75.8890 }, rating: 4.5, numReviews: 23
    },
    {
        ownerEmail: "lakshmi@example.com",
        name: "Annapurna South Indian Tiffin",
        description: "Idli, dosa, sambhar, rice and curd rice - made by a Chennai-trained cook.",
        cuisineType: "South Indian", mealType: "PURE_VEG",
        pricePerMeal: 75, monthlyPrice: 2000,
        deliveryAreas: ["Geeta Bhawan", "Palasia", "Rajendra Nagar", "Saket"],
        mealSchedule: ["Breakfast", "Lunch", "Dinner"],
        menuHighlights: ["Idli Sambhar", "Masala Dosa", "Lemon Rice", "Curd Rice", "Filter Coffee"],
        weeklyMenu: { Monday: "Idli Sambhar", Tuesday: "Masala Dosa", Wednesday: "Lemon Rice, Rasam", Thursday: "Uttapam", Friday: "Bisi Bele Bath", Saturday: "Curd Rice, Pickle", Sunday: "Pongal & Vada" },
        images: ["https://images.unsplash.com/photo-1630383249896-424e482df921?w=800"],
        coordinates: { lat: 22.7100, lng: 75.8650 }, rating: 4.6, numReviews: 30
    },
    {
        ownerEmail: "lakshmi@example.com",
        name: "Annapurna Gujarati Thali",
        description: "Sweet-and-savoury Gujarati meals with farsan on weekends.",
        cuisineType: "Gujarati", mealType: "PURE_VEG",
        pricePerMeal: 85, monthlyPrice: 2300,
        deliveryAreas: ["Geeta Bhawan", "Palasia", "Vijay Nagar"],
        mealSchedule: ["Lunch", "Dinner"],
        menuHighlights: ["Dhokla", "Undhiyu", "Kadhi", "Khichdi", "Thepla"],
        weeklyMenu: { Monday: "Dal Dhokli", Tuesday: "Sev Tamatar, Thepla", Wednesday: "Undhiyu", Thursday: "Gujarati Kadhi, Khichdi", Friday: "Bhindi, Dal", Saturday: "Handvo & Chutney", Sunday: "Full Gujarati Thali" },
        images: ["https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800"],
        coordinates: { lat: 22.7239, lng: 75.8812 }, rating: 4.4, numReviews: 15
    },
    {
        ownerEmail: "sunita@example.com",
        name: "Student Special Budget Tiffin",
        description: "Pocket-friendly, filling meals for students - unlimited roti and rice.",
        cuisineType: "Multi-Cuisine", mealType: "VEG",
        pricePerMeal: 50, monthlyPrice: 1400,
        deliveryAreas: ["Bhawarkua", "Sudama Nagar", "Vijay Nagar", "MR 10"],
        mealSchedule: ["Lunch", "Dinner"],
        menuHighlights: ["Unlimited Roti", "Dal", "Sabzi", "Rice"],
        weeklyMenu: { Monday: "Aloo Matar", Tuesday: "Dal Fry", Wednesday: "Chana Masala", Thursday: "Mix Veg", Friday: "Kadhi", Saturday: "Rajma", Sunday: "Chole Bhature" },
        images: ["https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800"],
        coordinates: { lat: 22.6955, lng: 75.8570 }, rating: 4.3, numReviews: 64
    },
    {
        ownerEmail: "mahesh@example.com",
        name: "Closed Weekend Kitchen",
        description: "Currently not accepting new subscriptions.",
        cuisineType: "North Indian", mealType: "VEG",
        pricePerMeal: 95, monthlyPrice: 2600,
        deliveryAreas: ["Khajrana"],
        mealSchedule: ["Lunch"],
        menuHighlights: ["Paneer Thali"],
        weeklyMenu: { Monday: "Paneer Butter Masala" },
        images: [],
        coordinates: { lat: 22.7365, lng: 75.9020 }, rating: 4.0, numReviews: 2, isAvailable: false
    }
]

// Give every seeded listing its own photo (rooms and tiffins never share one)
dedupeListingImages(roomsData, tiffinsData)

// ---------- SEED ----------
const seed = async () => {
    try {
        await mongoose.connect(MONGO_URI)
        console.log("MongoDB connected")

        // Clear existing data
        await Promise.all([
            Room.deleteMany({}),
            Tiffin.deleteMany({}),
            Provider.deleteMany({}),
            User.deleteMany({})
        ])
        console.log("Old data cleared")

        // Users
        const hashedPassword = await bcrypt.hash("Password@123", 10)
        const users = await User.insertMany(
            usersData.map(u => ({ ...u, password: hashedPassword }))
        )
        const userByEmail = Object.fromEntries(users.map(u => [u.email, u]))
        console.log(`${users.length} users created`)

        // Providers
        const providers = await Provider.insertMany(
            providersData.map(({ email, ...rest }) => ({
                ...rest,
                user: userByEmail[email]._id
            }))
        )
        const providerByEmail = {}
        providersData.forEach((p, i) => { providerByEmail[p.email] = providers[i] })
        console.log(`${providers.length} providers created`)

        // Rooms
        const rooms = await Room.insertMany(
            roomsData.map(({ ownerEmail, ...rest }) => ({
                ...rest,
                owner: userByEmail[ownerEmail]._id,
                provider: providerByEmail[ownerEmail]._id
            }))
        )
        console.log(`${rooms.length} rooms created`)

        // Tiffins
        const tiffins = await Tiffin.insertMany(
            tiffinsData.map(({ ownerEmail, ...rest }) => ({
                ...rest,
                owner: userByEmail[ownerEmail]._id,
                provider: providerByEmail[ownerEmail]._id
            }))
        )
        console.log(`${tiffins.length} tiffin services created`)

        console.log("\nSeeding complete!")
        console.log("Login credentials (all users): Password@123")
        console.log("  Admin:    admin@indorehub.com")
        console.log("  User:     rahul@example.com")
        console.log("  Provider: suresh@example.com (rooms), sunita@example.com (tiffin)")

        process.exit(0)
    } catch (error) {
        console.error("Seeding failed:", error)
        process.exit(1)
    }
}

seed()