import mongoose from "mongoose"

// Referral tracker records (README Section 8 draft)
// referrer can be a Mongo ObjectId OR an in-memory store user id string,
// depending on where the referrer account lives.
const referralSchema = new mongoose.Schema({
    referrer: {
        type: mongoose.Schema.Types.Mixed,
        ref: "User"
    },
    referrerCode: {
        type: String,
        required: true
    },
    referredUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    friendName: {
        type: String,
        default: ""
    },
    friendEmail: {
        type: String,
        default: ""
    },
    code: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Signed up", "First request completed", "Reward credited"],
        default: "Signed up"
    },
    reward: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})

referralSchema.index({ referrer: 1 })
referralSchema.index({ referrerCode: 1 })

const Referral = mongoose.model("Referral", referralSchema)

export default Referral
