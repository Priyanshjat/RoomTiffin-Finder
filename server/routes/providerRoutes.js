import express from "express"
import providerService from "../controllers/provider/providerController.js"
import protect from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/apply", protect.forUser, providerService.applyProvider)
router.get("/profile", protect.forUser, providerService.getMyProviderProfile)

export default router
