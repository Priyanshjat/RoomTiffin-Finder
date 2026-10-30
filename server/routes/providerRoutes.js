import express from "express"
import providerService from "../controllers/provider/providerController.js"
import protect from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/apply", protect.forUser, providerService.applyProvider)
router.get("/profile", protect.forUser, providerService.getMyProviderProfile)
router.put("/profile", protect.forUser, providerService.updateMyProviderProfile)
router.get("/my-listings", protect.forUser, providerService.getMyListings)
router.get("/inquiries", protect.forUser, providerService.getMyInquiries)

export default router
