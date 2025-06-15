// API Types
export interface RecommendationRequest {
  customer_id: string
  method: 'cf' | 'cb' | 'hybrid' | 'social'
  top_n: number
  filters?: {
    categories?: string[]
    country?: string
    min_price?: number
    max_price?: number
    sort_by?: 'score' | 'price' | 'popularity' | 'category'
    sort_order?: 'asc' | 'desc'
  }
}

export interface RecommendationResponse {
  recommendations: Array<{
    stock_code: string
    description: string
    score: number
    category?: string
    price?: number
    image_url?: string
  }>
  method_used: string
  processing_time_ms: number
  customer_id: string
  total_results: number
}

export interface CustomerSearchRequest {
  query: string
  limit?: number
}

export interface CustomerSearchResponse {
  customers: Array<{
    customer_id: string
    name?: string
    country?: string
    total_orders: number
    last_order_date: string
  }>
  products: Array<{
    stock_code: string
    description: string
    category?: string
    popularity_score: number
  }>
}

export interface AnalyticsRequest {
  time_range: '1d' | '7d' | '30d' | '90d'
  customer_id?: string
  method?: string
}

export interface AnalyticsResponse {
  performance_metrics: {
    precision_at_10: number
    recall_at_10: number
    f1_score: number
    click_through_rate: number
    conversion_rate: number
  }
  usage_stats: {
    total_requests: number
    avg_response_time_ms: number
    active_users: number
    revenue_impact: number
  }
  trends: Array<{
    date: string
    requests: number
    avg_latency: number
    click_through_rate: number
  }>
  category_distribution: Array<{
    category: string
    count: number
    revenue: number
  }>
}

export interface SocialGraphRequest {
  customer_id: string
  depth?: number
  min_similarity?: number
}

export interface SocialGraphResponse {
  nodes: Array<{
    id: string
    label: string
    size: number
    color: string
    customer_data: {
      total_orders: number
      avg_order_value: number
      country: string
    }
  }>
  edges: Array<{
    source: string
    target: string
    weight: number
    similarity_type: string
  }>
  influence_scores: Record<string, number>
}

// API Error Types
export interface ApiError {
  message: string
  code: string
  details?: any
}

export class RecommendationApiError extends Error {
  code: string
  details?: any

  constructor(message: string, code: string, details?: any) {
    super(message)
    this.name = 'RecommendationApiError'
    this.code = code
    this.details = details
  }
}