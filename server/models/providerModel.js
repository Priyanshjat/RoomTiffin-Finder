import mongoose from "mongoose"

const providerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    businessName: {
        type: String,
        required: [true, "Please Enter Business Name!"]
    },
    providerType: {
        type: String,
        enum: ["ROOM", "TIFFIN", "VEHICLE", "DEVICE"],
        required: [true, "Please Select Provider Type!"]
    },
    contactNumber: {
        type: String,
        required: [true, "Please Enter Contact Number!"]
    },
    businessAddress: {
        type: String,
        required: [true, "Please Enter Business Address!"]
    },
    description: {
        type: String,
        default: ""
    },
    idProof: {
        type: String,
        default: ""
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

const Provider = mongoose.model('Provider', providerSchema)

export default Provider
