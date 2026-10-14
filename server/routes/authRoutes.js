import express from "express"
import authService from "../controllers/auth/authController.js"
import protect from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/register", authService.registerUser)
router.post("/signup", authService.registerUser)
router.post("/login", authService.loginUser)
router.post("/demo-login", authService.demoLogin)
router.get("/me", protect.forUser, authService.getMyProfile)
router.put("/me", protect.forUser, authService.updateProfile)
router.get("/profile", protect.forUser, authService.getMyProfile)
router.put("/profile", protect.forUser, authService.updateProfile)

export default router
