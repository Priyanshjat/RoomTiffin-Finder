import mongoose from "mongoose"

// Generic booking for Room Tour / Meal Trial requests (README Section 8 draft)
const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    listingId: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ["rooms", "tiffin"],
        default: "rooms"
    },
    listingType: {
        type: String,
        enum: ["room", "tiffin"],
        default: "room"
    },
    date: {
        type: String,
        default: ""
    },
    slot: {
        type: String,
        default: ""
    },
    notes: {
        type: String,
        default: ""
    },
    discountApplied: {
        type: Number,
        default: 0
    },
    amount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"],
        default: "CONFIRMED"
    }
}, {
    timestamps: true
})

const Booking = mongoose.model("Booking", bookingSchema)

export default Booking
