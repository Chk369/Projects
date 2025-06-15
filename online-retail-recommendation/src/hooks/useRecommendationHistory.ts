import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { RecommendationRequest } from '@/types/api'

interface RecommendationHistory {
  id: string
  customer_id: string
  method: string
  top_n: number
  filters: any
  recommendations: any[]
  created_at: string
}

interface SaveHistoryParams {
  request: RecommendationRequest
  recommendations: any[]
}

export const useRecommendationHistory = () => {
  const queryClient = useQueryClient()

  // Fetch recommendation history
  const { data: history = [], isLoading } = useQuery({
    queryKey: ['recommendationHistory'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []

      const { data, error } = await supabase
        .from('recommendation_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50) // Limit to last 50 requests

      if (error) throw error
      return data as RecommendationHistory[]
    },
    enabled: false, // Will be enabled when user is authenticated
  })

  // Save recommendation request to history
  const saveToHistoryMutation = useMutation({
    mutationFn: async ({ request, recommendations }: SaveHistoryParams) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return // Silently fail if not authenticated

      const { error } = await supabase
        .from('recommendation_history')
        .insert({
          user_id: user.id,
          customer_id: request.customer_id,
          method: request.method,
          top_n: request.top_n,
          filters: request.filters,
          recommendations: recommendations
        })

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recommendationHistory'] })
    },
    onError: (error) => {
      console.error('Failed to save recommendation history:', error)
      // Fail silently - don't show error to user for history saving
    }
  })

  return {
    history,
    isLoading,
    saveToHistory: saveToHistoryMutation.mutate,
    isSaving: saveToHistoryMutation.isPending
  }
}