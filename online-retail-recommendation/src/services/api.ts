import { 
  RecommendationRequest, 
  RecommendationResponse,
  CustomerSearchRequest,
  CustomerSearchResponse,
  AnalyticsRequest,
  AnalyticsResponse,
  SocialGraphRequest,
  SocialGraphResponse,
  RecommendationApiError
} from '@/types/api'
import { supabase } from '@/integrations/supabase/client'
import { fallbackApi } from './fallback-api'

// Configuration - Using Supabase Edge Functions
const API_BASE_URL = 'https://vjdprmksxsckfufjyqqh.supabase.co/functions/v1' // Supabase Edge Functions
const API_TIMEOUT = 30000 // 30 seconds

class ApiClient {
  private baseUrl: string
  private timeout: number

  constructor(baseUrl: string = API_BASE_URL, timeout: number = API_TIMEOUT) {
    this.baseUrl = baseUrl
    this.timeout = timeout
    console.log('ApiClient initialized with baseUrl:', this.baseUrl)
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    console.log(`Making API request to: ${url}`)
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    // Get authentication headers from Supabase
    const { data: { session } } = await supabase.auth.getSession()
    const authHeaders: Record<string, string> = {}
    
    if (session?.access_token) {
      authHeaders['Authorization'] = `Bearer ${session.access_token}`
      authHeaders['x-user-id'] = session.user.id
      console.log('Using authenticated request with user:', session.user.email)
    } else {
      console.log('Making unauthenticated request')
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqZHBybWtzeHNja2Z1Zmp5cXFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MDc0MDMsImV4cCI6MjA2NTQ4MzQwM30.ciiWK8EGGsR6O632U_EyypaiFVEAg-f2SJN1s0Av_I8',
          ...authHeaders,
          ...options.headers,
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
      console.log(`API response status: ${response.status}`)

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`API Error (${response.status}):`, errorText)
        
        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch {
          errorData = { message: errorText || response.statusText, code: response.status.toString() }
        }
        
        throw new RecommendationApiError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          errorData.code || response.status.toString(),
          errorData
        )
      }

      const data = await response.json()
      console.log('API response data:', data)
      return data
    } catch (error) {
      clearTimeout(timeoutId)
      console.error('API request error:', error)
      
      if (error instanceof RecommendationApiError) {
        throw error
      }
      
      if (error.name === 'AbortError') {
        throw new RecommendationApiError('Request timeout - please try again', 'TIMEOUT')
      }
      
      // Handle network errors more specifically
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new RecommendationApiError(
          'Unable to connect to the recommendation service. Please check your internet connection and try again.',
          'NETWORK_ERROR',
          error
        )
      }
      
      throw new RecommendationApiError(
        error.message || 'An unexpected error occurred',
        'UNKNOWN_ERROR',
        error
      )
    }
  }

  // Recommendation endpoints
  async getRecommendations(request: RecommendationRequest): Promise<RecommendationResponse> {
    try {
      return await this.request<RecommendationResponse>('/recommendations', {
        method: 'POST',
        body: JSON.stringify(request),
      })
    } catch (error) {
      console.warn('Edge function failed, using fallback API:', error.message)
      return await fallbackApi.getRecommendations(request)
    }
  }

  // Customer search endpoints  
  async searchCustomersAndProducts(request: CustomerSearchRequest): Promise<CustomerSearchResponse> {
    try {
      const params = new URLSearchParams({
        query: request.query,
        limit: (request.limit || 10).toString(),
      })
      
      return await this.request<CustomerSearchResponse>(`/customer-search?${params}`)
    } catch (error) {
      console.warn('Customer search edge function failed, using fallback API:', error.message)
      return await fallbackApi.searchCustomersAndProducts(request)
    }
  }

  // Analytics endpoints
  async getAnalytics(request: AnalyticsRequest): Promise<AnalyticsResponse> {
    try {
      const params = new URLSearchParams({
        time_range: request.time_range,
        ...(request.customer_id && { customer_id: request.customer_id }),
        ...(request.method && { method: request.method }),
      })
      
      return await this.request<AnalyticsResponse>(`/analytics?${params}`)
    } catch (error) {
      console.warn('Analytics edge function failed, using fallback API:', error.message)
      return await fallbackApi.getAnalytics(request)
    }
  }

  // Social graph endpoints
  async getSocialGraph(request: SocialGraphRequest): Promise<SocialGraphResponse> {
    try {
      const params = new URLSearchParams({
        customer_id: request.customer_id,
        ...(request.depth && { depth: request.depth.toString() }),
        ...(request.min_similarity && { min_similarity: request.min_similarity.toString() }),
      })
      
      return await this.request<SocialGraphResponse>(`/social-graph?${params}`)
    } catch (error) {
      console.warn('Social graph edge function failed, using fallback API:', error.message)
      return await fallbackApi.getSocialGraph(request)
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('/health')
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// Export class for testing or custom instances
export { ApiClient }