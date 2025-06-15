import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { RecommendationRequest, RecommendationResponse, ApiError, CustomerSearchResponse, AnalyticsResponse, SocialGraphResponse } from '@/types/api'

interface MockApiContextType {
  apiKey: string
  setApiKey: (key: string) => void
  isConfigured: boolean
  isError: boolean
  errorMessage: string | null
  clearError: () => void
}

const MockApiContext = createContext<MockApiContextType>({
  apiKey: '',
  setApiKey: () => {},
  isConfigured: false,
  isError: false,
  errorMessage: null,
  clearError: () => {}
})

export const useMockApi = () => useContext(MockApiContext)

interface MockApiProviderProps {
  children: ReactNode
}

export const MockApiProvider: React.FC<MockApiProviderProps> = ({ children }) => {
  const [apiKey, setApiKey] = useState<string>('')
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const clearError = useCallback(() => {
    setIsError(false)
    setErrorMessage(null)
  }, [])

  return (
    <MockApiContext.Provider
      value={{
        apiKey,
        setApiKey,
        isConfigured: !!apiKey,
        isError,
        errorMessage,
        clearError
      }}
    >
      {children}
    </MockApiContext.Provider>
  )
}

// Mock API response generators
export const mockRecommendationResponse = (request: RecommendationRequest): RecommendationResponse => {
  // Generate mock recommendations based on request parameters
  const mockRecs = Array.from({ length: request.top_n }, (_, i) => {
    const score = Math.max(0.65, Math.min(0.95, 0.95 - (i * 0.03)))
    const stockCode = `${10000 + i}`
    
    let category
    switch (i % 4) {
      case 0: category = 'Home & Garden'; break
      case 1: category = 'Kitchen'; break
      case 2: category = 'Decorative'; break
      default: category = 'Gifts'
    }
    
    return {
      stock_code: stockCode,
      description: `${category} item ${stockCode}`,
      score,
      category,
      price: Math.round(10 + Math.random() * 90) 
    }
  })
  
  return {
    recommendations: mockRecs,
    method_used: request.method,
    processing_time_ms: Math.round(50 + Math.random() * 150),
    customer_id: request.customer_id,
    total_results: mockRecs.length
  }
}

export const mockCustomerSearchResponse = (query: string): CustomerSearchResponse => {
  // Mock customer search results
  const customers = Array.from({ length: 3 }, (_, i) => ({
    customer_id: `${Math.floor(10000 + Math.random() * 90000)}`,
    name: `Customer ${i + 1}`,
    country: ['USA', 'UK', 'Canada', 'Germany', 'France'][Math.floor(Math.random() * 5)],
    total_orders: Math.floor(1 + Math.random() * 50),
    last_order_date: new Date().toISOString().split('T')[0]
  }))
  
  // Mock product search results
  const products = Array.from({ length: 5 }, (_, i) => {
    const stockCode = `${Math.floor(10000 + Math.random() * 90000)}`
    
    let category
    switch (i % 4) {
      case 0: category = 'Home & Garden'; break
      case 1: category = 'Kitchen'; break
      case 2: category = 'Decorative'; break
      default: category = 'Gifts'
    }
    
    return {
      stock_code: stockCode,
      description: `${category} item ${stockCode}`,
      category,
      popularity_score: Math.random()
    }
  })
  
  return {
    customers,
    products
  }
}

export const mockAnalyticsResponse = (timeRange: string): AnalyticsResponse => {
  // Mock performance metrics
  const performanceMetrics = {
    precision_at_10: 0.85 + (Math.random() * 0.1 - 0.05),
    recall_at_10: 0.82 + (Math.random() * 0.1 - 0.05),
    f1_score: 0.83 + (Math.random() * 0.1 - 0.05),
    click_through_rate: 0.12 + (Math.random() * 0.06 - 0.03),
    conversion_rate: 0.08 + (Math.random() * 0.04 - 0.02)
  }
  
  // Generate mock date points based on time range
  const daysCount = timeRange === '1d' ? 24 : 
                   timeRange === '7d' ? 7 : 
                   timeRange === '30d' ? 30 : 90
  
  // Mock usage trends
  const trends = Array.from({ length: daysCount }, (_, i) => {
    const date = new Date()
    if (timeRange === '1d') {
      date.setHours(date.getHours() - i)
    } else {
      date.setDate(date.getDate() - i)
    }
    
    return {
      date: timeRange === '1d' 
        ? `${date.getHours()}:00` 
        : date.toISOString().split('T')[0],
      requests: Math.floor(1000 + Math.random() * 1000),
      avg_latency: Math.floor(150 + Math.random() * 100),
      click_through_rate: 0.1 + (Math.random() * 0.06 - 0.03)
    }
  }).reverse()
  
  // Mock category distribution
  const categoryDistribution = [
    { category: 'Home & Garden', count: Math.floor(300 + Math.random() * 200), revenue: Math.floor(8000 + Math.random() * 5000) },
    { category: 'Kitchen', count: Math.floor(200 + Math.random() * 200), revenue: Math.floor(6000 + Math.random() * 4000) },
    { category: 'Decorative', count: Math.floor(150 + Math.random() * 150), revenue: Math.floor(4000 + Math.random() * 3000) },
    { category: 'Gifts', count: Math.floor(100 + Math.random() * 100), revenue: Math.floor(3000 + Math.random() * 2000) }
  ]
  
  // Mock usage stats
  const usageStats = {
    total_requests: trends.reduce((acc, curr) => acc + curr.requests, 0),
    avg_response_time_ms: Math.floor(trends.reduce((acc, curr) => acc + curr.avg_latency, 0) / trends.length),
    active_users: Math.floor(2000 + Math.random() * 1000),
    revenue_impact: Math.floor(40000 + Math.random() * 10000)
  }
  
  return {
    performance_metrics: performanceMetrics,
    usage_stats: usageStats,
    trends,
    category_distribution: categoryDistribution
  }
}

export const mockSocialGraphResponse = (customerId: string): SocialGraphResponse => {
  // Generate mock nodes
  const nodes = [
    { id: customerId, label: 'You', size: 1.2, color: 'hsl(var(--primary))', customer_data: { total_orders: 35, avg_order_value: 175, country: 'USA' } },
    { id: 'user2', label: 'Similar 1', size: 1.0, color: 'hsl(var(--secondary))', customer_data: { total_orders: 28, avg_order_value: 145, country: 'USA' } },
    { id: 'user3', label: 'Similar 2', size: 0.8, color: 'hsl(var(--secondary))', customer_data: { total_orders: 22, avg_order_value: 130, country: 'UK' } },
    { id: 'user4', label: 'Similar 3', size: 0.9, color: 'hsl(var(--secondary))', customer_data: { total_orders: 18, avg_order_value: 190, country: 'Germany' } },
    { id: 'user5', label: 'Similar 4', size: 0.7, color: 'hsl(var(--secondary))', customer_data: { total_orders: 12, avg_order_value: 110, country: 'France' } }
  ]
  
  // Generate mock edges
  const edges = [
    { source: customerId, target: 'user2', weight: 0.85, similarity_type: 'purchase' },
    { source: customerId, target: 'user3', weight: 0.75, similarity_type: 'browse' },
    { source: customerId, target: 'user4', weight: 0.65, similarity_type: 'purchase' },
    { source: customerId, target: 'user5', weight: 0.55, similarity_type: 'category' },
    { source: 'user2', target: 'user4', weight: 0.45, similarity_type: 'purchase' }
  ]
  
  // Generate mock influence scores
  const influenceScores: Record<string, number> = {
    [customerId]: 0.9,
    'user2': 0.85,
    'user3': 0.7,
    'user4': 0.75, 
    'user5': 0.6
  }
  
  return {
    nodes,
    edges,
    influence_scores: influenceScores
  }
}