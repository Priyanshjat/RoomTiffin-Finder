import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import referralService from '../services/referralService.js'

export const useReferralStats = (enabled = true) => {
  return useQuery({
    queryKey: ['referral-stats'],
    queryFn: referralService.getReferralMe,
    enabled: Boolean(enabled),
    staleTime: 60 * 1000,
  })
}

export const useReferralHistory = (enabled = true) => {
  return useQuery({
    queryKey: ['referral-history'],
    queryFn: referralService.getReferralHistory,
    enabled: Boolean(enabled),
    staleTime: 60 * 1000,
  })
}

export const useApplyReferral = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (code) => referralService.applyReferralCode(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referral-stats'] })
      queryClient.invalidateQueries({ queryKey: ['wallet'] })
    }
  })
}

export const useWallet = (enabled = true) => {
  return useQuery({
    queryKey: ['wallet'],
    queryFn: referralService.getWallet,
    enabled: Boolean(enabled),
    staleTime: 30 * 1000,
  })
}

export const useFavorites = (enabled = true) => {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: referralService.getFavorites,
    enabled: Boolean(enabled),
    staleTime: 60 * 1000,
  })
}

export const useAddFavorite = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (listingId) => referralService.addFavorite(listingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    }
  })
}

export const useRemoveFavorite = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (listingId) => referralService.removeFavorite(listingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    }
  })
}
