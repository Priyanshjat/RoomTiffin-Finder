import dns from "dns";
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/userModel.js";
import Provider from "./models/providerModel.js";

dotenv.config({ path: "./.env" });

// =====================================================
// USERS (Indore Focus)
// =====================================================

const users = [
    // =========================
    // ADMIN
    // =========================
    {
        name: "Super Admin",
        email: "admin@example.com",
        phone: "9876500001",
        password: "Admin@123",
        address: "MG Road, Indore",
        userType: "ADMIN",
        referralCode: "ADM001",
        walletBalance: 1000,
        isActive: true
    },

    // =========================
    // PROVIDERS
    // =========================
    {
        name: "Sunil Sharma",
        email: "sunil.rooms@example.com",
        phone: "9876500002",
        password: "Provider@123",
        address: "Vijay Nagar, Indore",
        userType: "PROVIDER",
        referralCode: "SUN002",
        walletBalance: 200,
        isActive: true
    },
    {
        name: "Annapurna Rasoi (Meena Devi)",
        email: "annapurna.tiffin@example.com",
        phone: "9876500003",
        password: "Provider@123",
        address: "Bhawarkua, Indore",
        userType: "PROVIDER",
        referralCode: "ANN003",
        walletBalance: 200,
        isActive: true
    },
    {
        name: "Indore Ride Rentals (Vikram)",
        email: "indore.bikes@example.com",
        phone: "9876500004",
        password: "Provider@123",
        address: "Palasia, Indore",
        userType: "PROVIDER",
        referralCode: "BIK004",
        walletBalance: 150,
        isActive: true
    },
    {
        name: "TechRent Hub (Rajesh Verma)",
        email: "techrent.devices@example.com",
        phone: "9876500005",
        password: "Provider@123",
        address: "Scheme No. 54, Indore",
        userType: "PROVIDER",
        referralCode: "TEC005",
        walletBalance: 150,
        isActive: true
    },
    {
        name: "Vikas Patel (Applicant)",
        email: "vikas.pending@example.com",
        phone: "9876500006",
        password: "Provider@123",
        address: "Rau, Indore",
        userType: "USER",
        referralCode: "VIK006",
        walletBalance: 50,
        isActive: true
    },

    // =========================
    // REGULAR USERS / TENANTS
    // =========================
    {
        name: "Rahul Verma",
        email: "rahul@example.com",
        phone: "9876500010",
        password: "Password@123",
        address: "Bhawarkua, Indore",
        userType: "USER",
        referralCode: "RAH010",
        walletBalance: 100,
        isActive: true
    },
    {
        name: "Priya Sharma",
        email: "priya@example.com",
        phone: "9876500011",
        password: "Password@123",
        address: "Vijay Nagar, Indore",
        userType: "USER",
        referralCode: "PRI011",
        referredBy: "RAH010",
        walletBalance: 50,
        isActive: true
    },
    {
        name: "Aman Jain",
        email: "aman@example.com",
        phone: "9876500012",
        password: "Password@123",
        address: "Geeta Bhawan, Indore",
        userType: "USER",
        referralCode: "AMA012",
        walletBalance: 0,
        isActive: true
    }
];

// =====================================================
// PROVIDER PROFILES
// =====================================================

const providerProfiles = [
    {
        email: "sunil.rooms@example.com",
        businessName: "Sharma PG & Room Rentals",
        providerType: "ROOM",
        contactNumber: "9876500002",
        businessAddress: "Scheme 54, Near C21 Mall, Vijay Nagar, Indore",
        description: "Premium single, double and flat-sharing rooms for students and working professionals.",
        isVerified: true
    },
    {
        email: "annapurna.tiffin@example.com",
        businessName: "Annapurna Ghar Ka Khana",
        providerType: "TIFFIN",
        contactNumber: "9876500003",
        businessAddress: "Tower Square, Bhawarkua, Indore",
        description: "Hygienic, homestyle pure veg MP & North Indian tiffin service with timely delivery.",
        isVerified: true
    },
    {
        email: "indore.bikes@example.com",
        businessName: "Indore Quick Ride Scooty & Bike Rentals",
        providerType: "VEHICLE",
        contactNumber: "9876500004",
        businessAddress: "Industry House, Old Palasia, Indore",
        description: "Well maintained Activa, Jupiter and Pulsar available on daily, weekly, and monthly rentals.",
        isVerified: true
    },
    {
        email: "techrent.devices@example.com",
        businessName: "TechRent Laptop & PC Rentals",
        providerType: "DEVICE",
        contactNumber: "9876500005",
        businessAddress: "Silver Mall, RNT Marg, Indore",
        description: "High performance coding laptops, graphic design PCs, and MacBooks on easy monthly rentals.",
        isVerified: true
    },
    {
        email: "vikas.pending@example.com",
        businessName: "Vikas Boys Hostel & Rooms",
        providerType: "ROOM",
        contactNumber: "9876500006",
        businessAddress: "AB Road, Rau, Indore",
        description: "Affordable student hostel rooms near IET and Medicaps college.",
        isVerified: false // Testing pending verification workflow
    }
];

// =====================================================
// SEED DATABASE
// =====================================================

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/roomtiffin-finder");
        console.log("MongoDB Connected");

        // Clear existing auth & provider data
        await User.deleteMany({});
        await Provider.deleteMany({});
        console.log("Existing user and provider data cleared");

        // Hash passwords
        const hashedUsers = await Promise.all(
            users.map(async (u) => {
                const hashedPassword = await bcrypt.hash(u.password, 10);
                return {
                    ...u,
                    password: hashedPassword
                };
            })
        );

        // Create Users
        const createdUsers = await User.insertMany(hashedUsers);
        console.log(`Users created: ${createdUsers.length}`);

        // Create Provider Profiles linked to created users
        const providersToCreate = providerProfiles.map((profile) => {
            const user = createdUsers.find((u) => u.email === profile.email);
            if (!user) throw new Error(`User not found for ${profile.email}`);
            const { email, ...providerData } = profile;
            return {
                ...providerData,
                user: user._id
            };
        });

        const createdProviders = await Provider.insertMany(providersToCreate);
        console.log(`Providers created: ${createdProviders.length}`);

        console.log("\n================================");
        console.log("       STEP 1 SEED COMPLETED");
        console.log("================================");
        console.log(`Users      : ${createdUsers.length}`);
        console.log(`Providers  : ${createdProviders.length}`);

        console.log("\nLOGIN CREDENTIALS (PASSWORD: same as below):");
        console.log("Admin    : admin@example.com / Admin@123");
        console.log("Provider : sunil.rooms@example.com / Provider@123");
        console.log("Tiffin   : annapurna.tiffin@example.com / Provider@123");
        console.log("Vehicle  : indore.bikes@example.com / Provider@123");
        console.log("Device   : techrent.devices@example.com / Provider@123");
        console.log("Applicant: vikas.pending@example.com / Provider@123 (pending verification)");
        console.log("Tenant   : rahul@example.com / Password@123");

        await mongoose.connection.close();
        console.log("\nDatabase connection closed");
        process.exit(0);

    } catch (error) {
        console.error("\nSEEDING FAILED:", error);
        await mongoose.connection.close();
        process.exit(1);
    }
};

seedDatabase();
