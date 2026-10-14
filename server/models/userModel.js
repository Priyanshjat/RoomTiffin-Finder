import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Name!"]
    },
    email: {
        type: String,
        required: [true, "Please Enter Email!"],
        unique: true
    },
    phone: {
        type: String,
        required: [true, "Please Enter Phone!"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please Enter Password!"]
    },
    userType: {
        type: String,
        enum: ["USER", "PROVIDER", "ADMIN"],
        default: "USER",
        required: true
    },
    referralCode: {
        type: String,
        unique: true,
        sparse: true
    },
    referredBy: {
        type: String,
        default: null
    },
    walletBalance: {
        type: Number,
        default: 0
    },
    address: {
        type: String,
        default: ""
    },
    avatar: {
        type: String,
        default: ""
    },
    isActive: {
        type: Boolean,
        default: true,
        required: true
    }
}, {
    timestamps: true
})

const User = mongoose.model('User', userSchema)

export default User
