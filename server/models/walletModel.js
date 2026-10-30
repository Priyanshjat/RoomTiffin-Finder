import mongoose from "mongoose"

// Wallet transactions (single source of truth for credits/debits) (README Section 8 draft)
const walletTransactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String,
        enum: ["CREDIT", "DEBIT"],
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 1
    },
    description: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
})

const WalletTransaction = mongoose.model("WalletTransaction", walletTransactionSchema)

export default WalletTransaction
