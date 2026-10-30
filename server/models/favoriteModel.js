import mongoose from "mongoose"

// Bookmark/favorite listings per user (README Section 4.1)
const favoriteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    listingId: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

// A user can only save a listing once
favoriteSchema.index({ user: 1, listingId: 1 }, { unique: true })

const Favorite = mongoose.model("Favorite", favoriteSchema)

export default Favorite
