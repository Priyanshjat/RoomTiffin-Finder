import mongoose from "mongoose"
import Room from "../models/roomModel.js"
import Tiffin from "../models/tiffinModel.js"
import { photoKey, isLocalUpload } from "./listingImages.js"

// Every photo already used by a room or a tiffin (uploads excluded: they are unique files)
export const getUsedImageKeys = async () => {
    const used = new Set()

    if (mongoose.connection.readyState !== 1) return used

    try {
        const [rooms, tiffins] = await Promise.all([
            Room.find({}, "images").lean(),
            Tiffin.find({}, "images").lean()
        ])

        for (const doc of [...rooms, ...tiffins]) {
            for (const image of doc.images || []) {
                if (!isLocalUpload(image)) used.add(photoKey(image))
            }
        }
    } catch (err) {
        console.log("Could not read used images:", err.message)
    }

    return used
}
