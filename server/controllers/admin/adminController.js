import User from "../../models/userModel.js"
import Provider from "../../models/providerModel.js"

const getAllUsers = async (req, res) => {

    const users = await User.find().select("-password")

    if (!users) {
        res.status(404)
        throw new Error("Users Not Found!")
    }

    res.status(200).json(users)
}

const getAllProviders = async (req, res) => {

    const providers = await Provider.find().populate("user", "name email phone userType")

    if (!providers) {
        res.status(404)
        throw new Error("Providers Not Found!")
    }

    res.status(200).json(providers)
}

const updateProvider = async (req, res) => {

    const { isVerified } = req.body
    const pid = req.params.pid

    const provider = await Provider.findByIdAndUpdate(pid, { isVerified }, { new: true }).populate("user", "name email phone userType")

    if (!provider) {
        res.status(404)
        throw new Error("Provider Not Found!")
    }

    // Set userType = PROVIDER when verified
    if (isVerified) {
        await User.findByIdAndUpdate(provider.user._id, { userType: "PROVIDER" }, { new: true })
    }

    res.status(200).json(provider)
}

const adminService = {
    getAllUsers,
    getAllProviders,
    updateProvider
}

export default adminService
