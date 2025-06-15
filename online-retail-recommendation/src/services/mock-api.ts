import { useMockApi, mockRecommendationResponse, mockCustomerSearchResponse, mockAnalyticsResponse, mockSocialGraphResponse } from "@/lib/mock-api-provider"
import { ApiClient } from "@/services/api"
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
} from "@/types/api"

// Fake delay to simulate API latency
const fakeDelay = (min = 300, max = 1500) => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min
  return new Promise(resolve => setTimeout(resolve, delay))
}

// Mock API client implementation
export class MockApiClient extends ApiClient {
  constructor() {
    super('https://mock-api.example.com')
  }

  override async getRecommendations(request: RecommendationRequest): Promise<RecommendationResponse> {
    const { apiKey, isConfigured } = useMockApi?.() || { apiKey: '', isConfigured: false }

    // Basic validation
    if (!isConfigured) {
      throw new RecommendationApiError(
        'API key not configured',
        'UNAUTHORIZED',
        { details: 'Please configure your API key in settings' }
      )
    }

    await fakeDelay()
    
    // Simulate successful response
    return mockRecommendationResponse(request)
  }

  override async searchCustomersAndProducts(request: CustomerSearchRequest): Promise<CustomerSearchResponse> {
    const { apiKey, isConfigured } = useMockApi?.() || { apiKey: '', isConfigured: false }
    
    // Basic validation
    if (!isConfigured) {
      throw new RecommendationApiError(
        'API key not configured',
        'UNAUTHORIZED',
        { details: 'Please configure your API key in settings' }
      )
    }
    
    if (!request.query || request.query.length < 2) {
      throw new RecommendationApiError(
        'Search query too short',
        'VALIDATION_ERROR',
        { details: 'Search query must be at least 2 characters' }
      )
    }
    
    await fakeDelay(200, 600)
    
    // Simulate successful response
    return mockCustomerSearchResponse(request.query)
  }

  override async getAnalytics(request: AnalyticsRequest): Promise<AnalyticsResponse> {
    const { apiKey, isConfigured } = useMockApi?.() || { apiKey: '', isConfigured: false }
    
    // Basic validation
    if (!isConfigured) {
      throw new RecommendationApiError(
        'API key not configured',
        'UNAUTHORIZED',
        { details: 'Please configure your API key in settings' }
      )
    }
    
    await fakeDelay(500, 2000)
    
    // Simulate successful response
    return mockAnalyticsResponse(request.time_range)
  }

  override async getSocialGraph(request: SocialGraphRequest): Promise<SocialGraphResponse> {
    const { apiKey, isConfigured } = useMockApi?.() || { apiKey: '', isConfigured: false }
    
    // Basic validation
    if (!isConfigured) {
      throw new RecommendationApiError(
        'API key not configured',
        'UNAUTHORIZED',
        { details: 'Please configure your API key in settings' }
      )
    }
    
    if (!request.customer_id) {
      throw new RecommendationApiError(
        'Customer ID is required',
        'VALIDATION_ERROR',
        { details: 'Customer ID must be provided' }
      )
    }
    
    await fakeDelay(800, 2500)
    
    // Simulate successful response
    return mockSocialGraphResponse(request.customer_id)
  }

  override async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const { apiKey, isConfigured } = useMockApi?.() || { apiKey: '', isConfigured: false }
    
    await fakeDelay(50, 200)
    
    return {
      status: isConfigured ? 'healthy' : 'api_key_missing',
      timestamp: new Date().toISOString()
    }
  }
}

// Export singleton instance
export const mockApiClient = new MockApiClient()