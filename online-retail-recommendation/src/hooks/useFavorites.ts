import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface SavedRecommendation {
  id: string
  stock_code: string
  description: string
  score?: number
  category?: string
  price?: number
  image_url?: string
  saved_at: string
}

interface RecommendationToSave {
  stock_code: string
  description: string
  score?: number
  category?: string
  price?: number
  imageUrl?: string
}

export const useFavorites = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Fetch saved recommendations
  const { data: savedRecommendations = [], isLoading } = useQuery({
    queryKey: ['savedRecommendations'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []

      const { data, error } = await supabase
        .from('saved_recommendations')
        .select('*')
        .eq('user_id', user.id)
        .order('saved_at', { ascending: false })

      if (error) throw error
      return data as SavedRecommendation[]
    },
    enabled: false, // Will be enabled when user is authenticated
  })

  // Check if item is saved
  const isItemSaved = (stockCode: string) => {
    return savedRecommendations.some(item => item.stock_code === stockCode)
  }

  // Save recommendation
  const saveRecommendationMutation = useMutation({
    mutationFn: async (recommendation: RecommendationToSave) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User must be logged in')

      const { data, error } = await supabase
        .from('saved_recommendations')
        .insert({
          user_id: user.id,
          stock_code: recommendation.stock_code,
          description: recommendation.description,
          score: recommendation.score,
          category: recommendation.category,
          price: recommendation.price,
          image_url: recommendation.imageUrl
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['savedRecommendations'] })
      toast({
        title: "Saved!",
        description: `${data.description} has been added to your favorites`
      })
    },
    onError: (error: any) => {
      if (error.code === '23505') { // Unique constraint violation
        toast({
          title: "Already saved",
          description: "This item is already in your favorites"
        })
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to save recommendation"
        })
      }
    }
  })

  // Remove recommendation
  const removeRecommendationMutation = useMutation({
    mutationFn: async (stockCode: string) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User must be logged in')

      const { error } = await supabase
        .from('saved_recommendations')
        .delete()
        .eq('user_id', user.id)
        .eq('stock_code', stockCode)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedRecommendations'] })
      toast({
        title: "Removed",
        description: "Item removed from favorites"
      })
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove recommendation"
      })
    }
  })

  // Toggle save/unsave
  const toggleSave = (recommendation: RecommendationToSave) => {
    if (isItemSaved(recommendation.stock_code)) {
      removeRecommendationMutation.mutate(recommendation.stock_code)
    } else {
      saveRecommendationMutation.mutate(recommendation)
    }
  }

  // Enable query when user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        queryClient.invalidateQueries({ queryKey: ['savedRecommendations'] })
      }
    }
    checkAuth()
  }, [queryClient])

  return {
    savedRecommendations,
    isLoading,
    isItemSaved,
    toggleSave,
    isSaving: saveRecommendationMutation.isPending || removeRecommendationMutation.isPending
  }
}