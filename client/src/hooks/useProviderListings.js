import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import providerService from '../services/providerService.js'

// All listings owned by the logged-in provider (rooms / tiffins)
export const useMyProviderListings = (enabled = true) => {
  return useQuery({
    queryKey: ['my-provider-listings'],
    queryFn: providerService.fetchMyProviderListings,
    enabled: Boolean(enabled),
    staleTime: 10 * 1000
  })
}

// Bookings & rental requests received on the provider's listings
export const useProviderInquiries = (enabled = true) => {
  return useQuery({
    queryKey: ['provider-inquiries'],
    queryFn: providerService.fetchProviderInquiries,
    enabled: Boolean(enabled),
    staleTime: 15 * 1000
  })
}

// Upload images -> image URLs
export const useUploadImages = () => {
  return useMutation({
    mutationFn: (files) => providerService.uploadListingImages(files)
  })
}

// Create a listing in any category
export const useCreateListing = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ category, payload }) => providerService.createListing(category, payload),
    // Await the refetches so the new listing + stats are already on screen
    // the moment the form overlay closes.
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['my-provider-listings'] })
      await queryClient.invalidateQueries({ queryKey: ['listings'] })
    }
  })
}

// Update an existing listing
export const useUpdateListing = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ category, id, payload }) => providerService.updateListing(category, id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['my-provider-listings'] })
      await queryClient.invalidateQueries({ queryKey: ['listings'] })
    }
  })
}

// Delete an existing listing
export const useDeleteListing = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ category, id }) => providerService.deleteListing(category, id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['my-provider-listings'] })
      await queryClient.invalidateQueries({ queryKey: ['listings'] })
    }
  })
}
