import multer from "multer"
import crypto from "crypto"
import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Always use server/uploads, no matter which folder the server was started from
// (npm run dev from the repo root, node server.js from server/, or /app in Docker).
const uploadDir = path.join(__dirname, "..", "uploads")
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname) || ".jpg"
        const fileName = crypto.randomUUID() + ext
        cb(null, fileName)
    }
})

const upload = multer({ storage: storage })

export default upload
