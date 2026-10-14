import mongoose from "mongoose"

const roomSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please Enter Room Title!"]
    },
    description: {
        type: String,
        required: [true, "Please Enter Description!"]
    },
    roomType: {
        type: String,
        enum: ["single", "shared", "1rk", "1bhk", "flat"],
        required: [true, "Please Select Room Type!"]
    },
    rent: {
        type: Number,
        required: [true, "Please Enter Rent Amount!"]
    },
    deposit: {
        type: Number,
        required: [true, "Please Enter Deposit Amount!"]
    },
    city: {
        type: String,
        default: "Indore"
    },
    locality: {
        type: String,
        required: [true, "Please Enter Locality!"]
    },
    address: {
        type: String,
        required: [true, "Please Enter Full Address!"]
    },
    amenities: {
        type: [String],
        default: []
    },
    preferredTenant: {
        type: String,
        enum: ["ANY", "STUDENT", "WORKING_PROFESSIONAL", "BOYS", "GIRLS"],
        default: "ANY"
    },
    images: {
        type: [String],
        default: []
    },
    coordinates: {
        lat: { type: Number, default: 22.7196 },
        lng: { type: Number, default: 75.8577 }
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Provider"
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    rating: {
        type: Number,
        default: 4.5
    },
    numReviews: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})

const Room = mongoose.model("Room", roomSchema)

export default Room
