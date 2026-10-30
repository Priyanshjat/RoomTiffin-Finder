import Room from "../../models/roomModel.js"
import { mockRooms } from "../../data/mockData.js"
import mongoose from "mongoose"
import { pickUniqueImage } from "../../services/listingImages.js"
import { getUsedImageKeys } from "../../services/usedImages.js"

// In-memory array for newly created rooms during fallback
let localRooms = [...mockRooms]

const isDbConnected = () => {
    return mongoose.connection.readyState === 1
}

const getRooms = async (req, res) => {

    const { locality, city, roomType, minRent, maxRent, preferredTenant, search } = req.query

    // Try MongoDB if connected
    if (isDbConnected()) {
        try {
            let filter = { isAvailable: true }

            if (locality) {
                filter.locality = { $regex: locality, $options: "i" }
            }
            if (city) {
                filter.city = { $regex: city, $options: "i" }
            }
            if (roomType) {
                filter.roomType = roomType
            }
            if (preferredTenant && preferredTenant !== "ANY") {
                filter.preferredTenant = { $in: [preferredTenant, "ANY"] }
            }
            if (minRent || maxRent) {
                filter.rent = {}
                if (minRent) filter.rent.$gte = Number(minRent)
                if (maxRent) filter.rent.$lte = Number(maxRent)
            }
            if (search) {
                filter.$or = [
                    { title: { $regex: search, $options: "i" } },
                    { locality: { $regex: search, $options: "i" } },
                    { description: { $regex: search, $options: "i" } }
                ]
            }

            const rooms = await Room.find(filter).populate("owner", "name phone email").sort({ createdAt: -1 })

            if (rooms && rooms.length > 0) {
                return res.status(200).json(rooms)
            }
        } catch (dbErr) {
            console.log("Room DB fetch fallback:", dbErr.message)
        }
    }

    // Resilient Fallback to Mock / In-Memory Rooms
    let filtered = [...localRooms]

    if (locality) {
        filtered = filtered.filter(r => r.locality.toLowerCase().includes(locality.toLowerCase()))
    }
    if (city) {
        filtered = filtered.filter(r => r.city.toLowerCase().includes(city.toLowerCase()))
    }
    if (roomType) {
        filtered = filtered.filter(r => r.roomType === roomType)
    }
    if (preferredTenant && preferredTenant !== "ANY") {
        filtered = filtered.filter(r => r.preferredTenant === preferredTenant || r.preferredTenant === "ANY")
    }
    if (minRent) {
        filtered = filtered.filter(r => r.rent >= Number(minRent))
    }
    if (maxRent) {
        filtered = filtered.filter(r => r.rent <= Number(maxRent))
    }
    if (search) {
        const q = search.toLowerCase()
        filtered = filtered.filter(r =>
            r.title.toLowerCase().includes(q) ||
            r.locality.toLowerCase().includes(q) ||
            r.description.toLowerCase().includes(q)
        )
    }

    res.status(200).json(filtered)
}

const getRoom = async (req, res) => {

    const rid = req.params.rid

    if (!rid) {
        res.status(409)
        throw new Error("Room ID is required!")
    }

    if (isDbConnected()) {
        try {
            const room = await Room.findById(rid).populate("owner", "name phone email")
            if (room) {
                return res.status(200).json(room)
            }
        } catch (err) {
            // Check in mock fallback
        }
    }

    const mockRoom = localRooms.find(r => r._id === rid)

    if (!mockRoom) {
        res.status(404)
        throw new Error("Room Not Found!")
    }

    res.status(200).json(mockRoom)
}

const createRoom = async (req, res) => {

    const {
        title,
        description,
        roomType,
        rent,
        deposit,
        locality,
        address,
        amenities,
        preferredTenant,
        images
    } = req.body

    if (!title || !description || !roomType || !rent || !deposit || !locality || !address) {
        res.status(409)
        throw new Error("Please Fill All Details!")
    }

    // Every new room gets its own photo - never one already used by another listing
    const roomImages = images && images.length > 0
        ? images
        : [pickUniqueImage(await getUsedImageKeys(), "room")]

    const roomData = {
        title,
        description,
        roomType,
        rent: Number(rent),
        deposit: Number(deposit),
        city: "Indore",
        locality,
        address,
        amenities: Array.isArray(amenities) ? amenities : (amenities ? amenities.split(",") : []),
        preferredTenant: preferredTenant || "ANY",
        images: roomImages,
        owner: req.user._id,
        isAvailable: true,
        rating: 4.8,
        numReviews: 1
    }

    if (isDbConnected()) {
        try {
            const created = await Room.create(roomData)
            if (created) {
                return res.status(201).json(created)
            }
        } catch (err) {
            console.log("DB create room fallback:", err.message)
        }
    }

    // In-memory fallback
    const newRoom = {
        _id: "room_indore_" + Date.now(),
        ...roomData,
        owner: {
            _id: req.user._id,
            name: req.user.name,
            phone: req.user.phone,
            email: req.user.email
        },
        createdAt: new Date().toISOString()
    }

    localRooms.unshift(newRoom)
    res.status(201).json(newRoom)
}

const updateRoom = async (req, res) => {

    const rid = req.params.rid

    if (isDbConnected()) {
        try {
            const room = await Room.findById(rid)
            if (room) {
                if (room.owner.toString() !== req.user._id.toString() && req.user.userType !== "ADMIN") {
                    res.status(401)
                    throw new Error("Unauthorized to update this room!")
                }
                const updated = await Room.findByIdAndUpdate(rid, req.body, { new: true })
                return res.status(200).json(updated)
            }
        } catch (err) {
            // Fallback
        }
    }

    const index = localRooms.findIndex(r => r._id === rid)
    if (index === -1) {
        res.status(404)
        throw new Error("Room Not Found!")
    }

    localRooms[index] = { ...localRooms[index], ...req.body }
    res.status(200).json(localRooms[index])
}

const deleteRoom = async (req, res) => {

    const rid = req.params.rid

    if (isDbConnected()) {
        try {
            const room = await Room.findById(rid)
            if (room) {
                if (room.owner.toString() !== req.user._id.toString() && req.user.userType !== "ADMIN") {
                    res.status(401)
                    throw new Error("Unauthorized to delete this room!")
                }
                await Room.findByIdAndDelete(rid)
                return res.status(200).json({ message: "Room Deleted Successfully!" })
            }
        } catch (err) {
            // Fallback
        }
    }

    localRooms = localRooms.filter(r => r._id !== rid)
    res.status(200).json({ message: "Room Deleted Successfully!" })
}

const getMyRooms = async (req, res) => {

    if (isDbConnected()) {
        try {
            const rooms = await Room.find({ owner: req.user._id })
            if (rooms && rooms.length > 0) {
                return res.status(200).json(rooms)
            }
        } catch (err) {
            // Fallback
        }
    }

    const myRooms = localRooms.filter(r =>
        (r.owner?._id && r.owner._id.toString() === req.user._id.toString()) ||
        (r.owner && r.owner.toString() === req.user._id.toString())
    )

    res.status(200).json(myRooms)
}

const roomService = {
    getRooms,
    getRoom,
    createRoom,
    updateRoom,
    deleteRoom,
    getMyRooms
}

export default roomService
