import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchListings,
  fetchListingById,
  parseAiQuery,
  sendContactInquiry,
  requestBooking,
  fetchMyBookings
} from '../services/listingService.js'

// Hook to query listings with filters
export const useListings = (params = {}) => {
  return useQuery({
    queryKey: ['listings', params],
    queryFn: () => fetchListings(params),
    staleTime: 2 * 60 * 1000,
  })
}

// Hook to query single listing details
export const useListing = (id) => {
  return useQuery({
    queryKey: ['listing', id],
    queryFn: () => fetchListingById(id),
    enabled: Boolean(id),
  })
}

// Mutation for AI natural language parsing
export const useAiParse = () => {
  return useMutation({
    mutationFn: (query) => parseAiQuery(query),
  })
}

// Mutation to contact provider
export const useContactProvider = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => sendContactInquiry(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['listing', variables.listingId] })
    }
  })
}

// Mutation to book room tour or meal trial
export const useCreateBooking = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => requestBooking(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['listing', variables.listingId] })
      queryClient.invalidateQueries({ queryKey: ['my-requests'] })
    }
  })
}

// Hook for the Requests page — room tour / meal trial requests
export const useMyRequests = (enabled = true) => {
  return useQuery({
    queryKey: ['my-requests'],
    queryFn: fetchMyBookings,
    enabled: Boolean(enabled),
    staleTime: 15 * 1000
  })
}
