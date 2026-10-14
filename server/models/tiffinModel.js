import mongoose from "mongoose"

const tiffinSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Tiffin Service Name!"]
    },
    description: {
        type: String,
        required: [true, "Please Enter Description!"]
    },
    cuisineType: {
        type: String,
        enum: ["North Indian", "MP Special", "South Indian", "Gujarati", "Jain", "Multi-Cuisine"],
        default: "North Indian"
    },
    mealType: {
        type: String,
        enum: ["VEG", "NON_VEG", "JAIN", "PURE_VEG"],
        required: [true, "Please Select Meal Type!"]
    },
    pricePerMeal: {
        type: Number,
        required: [true, "Please Enter Price Per Meal!"]
    },
    monthlyPrice: {
        type: Number,
        required: [true, "Please Enter Monthly Price!"]
    },
    deliveryAreas: {
        type: [String],
        default: []
    },
    mealSchedule: {
        type: [String],
        default: ["Lunch", "Dinner"]
    },
    menuHighlights: {
        type: [String],
        default: []
    },
    weeklyMenu: {
        type: Map,
        of: String,
        default: {}
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
        default: 4.8
    },
    numReviews: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})

const Tiffin = mongoose.model("Tiffin", tiffinSchema)

export default Tiffin
