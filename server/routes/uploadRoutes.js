import express from "express"
import upload from "../middleware/fileUploadMiddleware.js"
import uploadService from "../controllers/uploadController.js"
import protect from "../middleware/authMiddleware.js"

const router = express.Router()

// Provider image upload (muliple files, max 8 per request)
router.post("/", protect.forUser, upload.array("images", 8), uploadService.uploadImages)

export default router
