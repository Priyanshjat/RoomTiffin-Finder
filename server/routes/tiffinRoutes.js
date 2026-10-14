import express from "express"
import tiffinService from "../controllers/tiffin/tiffinController.js"
import protect from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/", tiffinService.getTiffins)
router.get("/my", protect.forProvider, tiffinService.getMyTiffins)
router.get("/:tid", tiffinService.getTiffin)
router.post("/", protect.forProvider, tiffinService.createTiffin)
router.put("/:tid", protect.forProvider, tiffinService.updateTiffin)
router.delete("/:tid", protect.forProvider, tiffinService.deleteTiffin)

export default router
