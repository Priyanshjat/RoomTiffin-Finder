import React from 'react'
import RoomCard from './cards/RoomCard.jsx'
import TiffinCard from './cards/TiffinCard.jsx'
import VehicleCard from './cards/VehicleCard.jsx'
import LaptopCard from './cards/LaptopCard.jsx'

const ListingCard = ({ listing, onSelect }) => {
  if (!listing) return null

  switch (listing.category) {
    case 'rooms':
      return <RoomCard listing={listing} onSelect={onSelect} />
    case 'tiffin':
      return <TiffinCard listing={listing} onSelect={onSelect} />
    case 'vehicles':
      return <VehicleCard listing={listing} onSelect={onSelect} />
    case 'laptops':
      return <LaptopCard listing={listing} onSelect={onSelect} />
    default:
      return <RoomCard listing={listing} onSelect={onSelect} />
  }
}

export default ListingCard
