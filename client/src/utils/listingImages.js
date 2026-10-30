// Category-correct fallback photos for listings without an image.
// Rooms and tiffins use separate pools, and the pick is stable per listing,
// so two cards never fall back to the same photo by accident.

const SUFFIX = '?auto=format&fit=crop&w=1000&q=80'

export const ROOM_IMAGES = [
  'photo-1522771739844-6a9f6d5f14af',
  'photo-1598928506311-c55ded91a20c',
  'photo-1595526114035-0d45ed16cfbf',
  'photo-1555854877-bab0e564b8d5',
  'photo-1502672260266-1c1ef2d93688',
  'photo-1560448204-e02f11c3d0e2',
  'photo-1616594039964-ae9021a400a0',
  'photo-1493809842364-78817add7ffb',
  'photo-1484154218962-a197022b5858',
  'photo-1560185007-cde436f6a4d0',
  'photo-1540518614846-7eded433c457',
  'photo-1522708323590-d24dbb6b0267',
  'photo-1505693416388-ac5ce068fe85',
  'photo-1536376072261-38c75010e6c9',
  'photo-1502005229762-cf1b2da7c5d6',
  'photo-1554995207-c18c203602cb',
  'photo-1567767292278-a4f21aa2d36e',
  'photo-1586023492125-27b2c045efd7',
  'photo-1512918728675-ed5a9ecdebfd',
  'photo-1519710164239-da123dc03ef4',
  'photo-1493663284031-b7e3aefcae8e',
  'photo-1560448075-bb485b067938',
  'photo-1505691938895-1758d7feb511'
].map((id) => `https://images.unsplash.com/${id}${SUFFIX}`)

export const TIFFIN_IMAGES = [
  'photo-1546833999-b9f581a1996d',
  'photo-1589301760014-d929f3979dbc',
  'photo-1626777552726-4a6b54c97e46',
  'photo-1589302168068-964664d93dc0',
  'photo-1630383249896-424e482df921',
  'photo-1631452180519-c014fe946bc7',
  'photo-1606491956689-2ea866880c84',
  'photo-1567188040759-fb8a883dc6d8',
  'photo-1585937421612-70a008356fbe',
  'photo-1546069901-ba9599a7e63c',
  'photo-1543353071-873f17a7a088',
  'photo-1601050690597-df0568f70950',
  'photo-1596797038530-2c107229654b',
  'photo-1603133872878-684f208fb84b'
].map((id) => `https://images.unsplash.com/${id}${SUFFIX}`)

const isTiffin = (listing) => {
  const category = String(listing?.category || '').toLowerCase()
  return category.startsWith('tiffin') || Boolean(listing?.mealType) || Boolean(listing?.pricePerMeal)
}

// Stable hash so the same listing always falls back to the same photo
const hash = (value = '') => {
  let h = 0
  for (let i = 0; i < value.length; i++) h = (h * 31 + value.charCodeAt(i)) >>> 0
  return h
}

export const fallbackListingImage = (listing, category) => {
  const tiffin = category ? String(category).toLowerCase().startsWith('tiffin') : isTiffin(listing)
  const pool = tiffin ? TIFFIN_IMAGES : ROOM_IMAGES
  const key = String(listing?._id || listing?.id || listing?.title || listing?.name || 'listing')
  return pool[hash(key) % pool.length]
}

export const listingMainImage = (listing, category) => {
  const image = listing?.images?.find(Boolean)
  return image || fallbackListingImage(listing, category)
}
