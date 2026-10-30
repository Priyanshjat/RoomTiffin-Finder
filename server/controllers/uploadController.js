import uploadToCloudinary from "../utils/uploadToCloudinary.js"

// POST /api/uploads — handles listing images for providers.
// Files are stored temporarily by multer, uploaded to Cloudinary, and the
// temporary copy is removed. If Cloudinary is not configured (or fails),
// the image stays in server/uploads and is served from /uploads/<file>.
const uploadImages = async (req, res) => {
    if (!req.files || req.files.length === 0) {
        res.status(400)
        throw new Error("Please Select Atleast One Image!")
    }

    const images = []

    for (const file of req.files) {
        try {
            const result = await uploadToCloudinary(file.path)
            images.push(result.secure_url)
        } catch (err) {
            // Cloudinary unavailable -> keep the local copy
            images.push(`/uploads/${file.filename}`)
        }
    }

    res.status(201).json({
        success: true,
        message: "Images Uploaded Successfully!",
        data: images
    })
}

const uploadService = {
    uploadImages
}

export default uploadService
