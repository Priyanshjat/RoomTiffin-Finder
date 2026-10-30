import { v2 as cloudinary } from "cloudinary"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

// Load .env here as well: this module can be evaluated before server.js calls
// dotenv.config(), which would leave the Cloudinary keys undefined.
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, "..", ".env") })
dotenv.config()

// Cloudinary setup (keys stay in .env, never in code)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dqdejbfnx",
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

export const isCloudinaryConfigured = () =>
    Boolean(process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)

export default cloudinary
