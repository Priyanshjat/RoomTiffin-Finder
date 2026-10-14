import express from "express"
import roomService from "../controllers/room/roomController.js"
import protect from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/", roomService.getRooms)
router.get("/my", protect.forProvider, roomService.getMyRooms)
router.get("/:rid", roomService.getRoom)
router.post("/", protect.forProvider, roomService.createRoom)
router.put("/:rid", protect.forProvider, roomService.updateRoom)
router.delete("/:rid", protect.forProvider, roomService.deleteRoom)

export default router
