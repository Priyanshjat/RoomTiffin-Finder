// Shared listing image helpers.
// Goal: no photo should be reused across listings (rooms and tiffins never share
// an image), and every listing always has a category-correct photo.

const SUFFIX = "?auto=format&fit=crop&w=1000&q=80"

// Room / PG / flat interiors
export const ROOM_IMAGES = [
    "photo-1522771739844-6a9f6d5f14af",
    "photo-1598928506311-c55ded91a20c",
    "photo-1595526114035-0d45ed16cfbf",
    "photo-1555854877-bab0e564b8d5",
    "photo-1502672260266-1c1ef2d93688",
    "photo-1560448204-e02f11c3d0e2",
    "photo-1616594039964-ae9021a400a0",
    "photo-1493809842364-78817add7ffb",
    "photo-1484154218962-a197022b5858",
    "photo-1560185007-cde436f6a4d0",
    "photo-1540518614846-7eded433c457",
    "photo-1522708323590-d24dbb6b0267",
    "photo-1505693416388-ac5ce068fe85",
    "photo-1536376072261-38c75010e6c9",
    "photo-1502005229762-cf1b2da7c5d6",
    "photo-1554995207-c18c203602cb",
    "photo-1567767292278-a4f21aa2d36e",
    "photo-1586023492125-27b2c045efd7",
    "photo-1512918728675-ed5a9ecdebfd",
    "photo-1519710164239-da123dc03ef4",
    "photo-1493663284031-b7e3aefcae8e",
    "photo-1560448075-bb485b067938",
    "photo-1505691938895-1758d7feb511",
    "photo-1522444195799-478538b28823",
    "photo-1615529182904-14819c35db37",
    "photo-1600585154340-be6161a56a0c"
].map((id) => `https://images.unsplash.com/${id}${SUFFIX}`)

// Tiffin / thali / home food
export const TIFFIN_IMAGES = [
    "photo-1546833999-b9f581a1996d",
    "photo-1589301760014-d929f3979dbc",
    "photo-1626777552726-4a6b54c97e46",
    "photo-1589302168068-964664d93dc0",
    "photo-1630383249896-424e482df921",
    "photo-1631452180519-c014fe946bc7",
    "photo-1606491956689-2ea866880c84",
    "photo-1567188040759-fb8a883dc6d8",
    "photo-1585937421612-70a008356fbe",
    "photo-1546069901-ba9599a7e63c",
    "photo-1512621776951-a57141f2eefd",
    "photo-1565299624946-b28f40a0ae38",
    "photo-1567620905732-2d1ec7ab7445",
    "photo-1504674900247-0877df9cc836",
    "photo-1476224203421-9ac39bcb3327",
    "photo-1547592180-85f173990554",
    "photo-1543353071-873f17a7a088",
    "photo-1601050690597-df0568f70950",
    "photo-1596797038530-2c107229654b",
    "photo-1603133872878-684f208fb84b",
    "photo-1626074353765-517a681e40be",
    "photo-1593560708920-61dd98c46a4e"
].map((id) => `https://images.unsplash.com/${id}${SUFFIX}`)

// Stable identity for a photo regardless of its size/quality query params
export const photoKey = (url = "") => {
    const match = String(url).match(/photo-[A-Za-z0-9]+/)
    return match ? match[0] : String(url).split("?")[0]
}

// Provider uploads have unique random filenames, so they are always kept
export const isLocalUpload = (url) => typeof url === "string" && url.startsWith("/uploads/")

export const imagePool = (category) => (category === "tiffin" ? TIFFIN_IMAGES : ROOM_IMAGES)

// First pool photo that is not already used anywhere else
export const pickUniqueImage = (used = new Set(), category = "room") => {
    const pool = imagePool(category)
    return pool.find((url) => !used.has(photoKey(url))) || pool[0]
}

// Removes repeated photos inside a list of listings and fills empty galleries.
// Mutates the given objects (works for Mongo docs and plain objects alike).
export const dedupeListingImages = (rooms = [], tiffins = []) => {
    const used = new Set()

    const clean = (listing, category) => {
        const images = Array.isArray(listing.images) ? listing.images.filter(Boolean) : []
        const kept = []

        for (const image of images) {
            if (isLocalUpload(image)) {
                kept.push(image)
                continue
            }
            const key = photoKey(image)
            if (used.has(key)) continue
            used.add(key)
            kept.push(image)
        }

        if (kept.length === 0) {
            const pick = pickUniqueImage(used, category)
            used.add(photoKey(pick))
            kept.push(pick)
        }

        listing.images = kept
        return listing
    }

    rooms.forEach((room) => clean(room, "room"))
    tiffins.forEach((tiffin) => clean(tiffin, "tiffin"))

    return { rooms, tiffins }
}
