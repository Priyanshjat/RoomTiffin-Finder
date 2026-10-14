import { v2 as cloudinary } from 'cloudinary'
import fs from "fs"
import dotenv from "dotenv"
dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadToCloudinary = async (fileLink) => {
    try {
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
            // Fallback placeholder if cloudinary credentials are not configured yet
            if (fs.existsSync(fileLink)) {
                fs.unlinkSync(fileLink)
            }
            return {
                secure_url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"
            }
        }

        const uploadResult = await cloudinary.uploader.upload(fileLink, {
            resource_type: "auto"
        })

        if (fs.existsSync(fileLink)) {
            fs.unlinkSync(fileLink)
        }

        return uploadResult
    } catch (error) {
        if (fs.existsSync(fileLink)) {
            fs.unlinkSync(fileLink)
        }
        console.log("Cloudinary error:", error.message)
        throw new Error("Image Upload Failed!")
    }
}

export default uploadToCloudinary
