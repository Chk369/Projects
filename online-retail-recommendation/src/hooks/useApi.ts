import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/services/api'
import { 
  RecommendationRequest,
  CustomerSearchRequest,
  AnalyticsRequest,
  SocialGraphRequest
} from '@/types/api'
import { useToast } from '@/hooks/use-toast'

// Query Keys
export const queryKeys = {
  recommendations: (params: RecommendationRequest) => 
    ['recommendations', params] as const,
  customerSearch: (query: string) => 
    ['customerSearch', query] as const,
  analytics: (params: AnalyticsRequest) => 
    ['analytics', params] as const,
  socialGraph: (customerId: string) => 
    ['socialGraph', customerId] as const,
  healthCheck: () => ['healthCheck'] as const,
}

// Recommendations Hook - Using real API
export const useRecommendations = () => {
  const { toast } = useToast()
  
  return useMutation({
    mutationFn: async (request: RecommendationRequest) => {
      return apiClient.getRecommendations(request)
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Recommendation Error",
        description: error.message || "Failed to get recommendations",
      })
    },
  })
}

// Customer Search Hook - Using real API
export const useCustomerSearch = (query: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.customerSearch(query),
    queryFn: async () => {
      return apiClient.searchCustomersAndProducts({ query, limit: 10 })
    },
    enabled: enabled && query.length > 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    retryDelay: 1000,
  })
}

// Analytics Hook - Using real API
export const useAnalytics = (params: AnalyticsRequest) => {
  return useQuery({
    queryKey: queryKeys.analytics(params),
    queryFn: async () => {
      return apiClient.getAnalytics(params)
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  })
}

// Social Graph Hook - Using real API
export const useSocialGraph = (customerId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.socialGraph(customerId),
    queryFn: async () => {
      return apiClient.getSocialGraph({ customer_id: customerId })
    },
    enabled: enabled && !!customerId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Health Check Hook
export const useHealthCheck = () => {
  return useQuery({
    queryKey: queryKeys.healthCheck(),
    queryFn: apiClient.healthCheck,
    refetchInterval: 30 * 1000, // Check every 30 seconds
    retry: 3,
    staleTime: 0, // Always considered stale
  })
}

// Custom hook for clearing recommendation cache
export const useClearRecommendationCache = () => {
  const queryClient = useQueryClient()
  
  return () => {
    queryClient.removeQueries({ 
      queryKey: ['recommendations'],
      exact: false 
    })
  }
}

// Custom hook for prefetching analytics - Using real API
export const usePrefetchAnalytics = () => {
  const queryClient = useQueryClient()
  
  return (params: AnalyticsRequest) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.analytics(params),
      queryFn: async () => {
        return apiClient.getAnalytics(params)
      },
      staleTime: 2 * 60 * 1000,
    })
  }
}