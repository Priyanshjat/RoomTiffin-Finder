import multer from "multer"
import crypto from "crypto"
import path from "path"
import fs from "fs"

const uploadDir = "uploads"
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads")
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname) || ".jpg"
        const fileName = crypto.randomUUID() + ext
        cb(null, fileName)
    }
})

const upload = multer({ storage: storage })

export default upload
