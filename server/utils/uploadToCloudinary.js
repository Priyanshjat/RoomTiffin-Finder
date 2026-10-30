import fs from "node:fs"
import cloudinary, { isCloudinaryConfigured } from "../config/cloudinary.js"

// Deletes the temporary file multer saved to server/uploads
const removeTempFile = (fileLink) => {
    try {
        if (fs.existsSync(fileLink)) fs.unlinkSync(fileLink)
    } catch (err) {
        console.log("Could not remove temp file:", err.message)
    }
}

// Uploads a local file to Cloudinary and returns the upload result.
// The local temp file is removed only when the upload succeeds, so the caller
// can still fall back to /uploads/<file> if Cloudinary is unreachable.
const uploadToCloudinary = async (fileLink, options = {}) => {
    if (!isCloudinaryConfigured()) {
        const error = new Error("Cloudinary credentials are not configured")
        error.code = "CLOUDINARY_NOT_CONFIGURED"
        throw error
    }

    try {
        const uploadResult = await cloudinary.uploader.upload(fileLink, {
            resource_type: "auto",
            folder: "roomtiffin-listings",
            ...options
        })

        removeTempFile(fileLink)
        return uploadResult
    } catch (error) {
        console.log("Cloudinary error:", error.message)
        throw error
    }
}

export default uploadToCloudinary
