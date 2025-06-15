import { 
  RecommendationRequest, 
  RecommendationResponse,
  CustomerSearchRequest,
  CustomerSearchResponse,
  AnalyticsRequest,
  AnalyticsResponse,
  SocialGraphRequest,
  SocialGraphResponse
} from '@/types/api'

// Fallback API that provides mock data when edge functions are unavailable
export class FallbackApi {
  
  async getRecommendations(request: RecommendationRequest): Promise<RecommendationResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const productTemplates = [
      // Home & Garden
      { name: 'White Hanging Heart T-Light Holder', category: 'Home & Garden', image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=200&h=200&fit=crop&crop=center' },
      { name: 'Ceramic Plant Pot Set', category: 'Home & Garden', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop&crop=center' },
      { name: 'Garden Lantern with LED', category: 'Home & Garden', image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=200&h=200&fit=crop&crop=center' },
      
      // Kitchen  
      { name: 'Stainless Steel Coffee Mug', category: 'Kitchen', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop&crop=center' },
      { name: 'Bamboo Cutting Board Set', category: 'Kitchen', image: 'https://images.unsplash.com/photo-1594736797933-d0401ba50ed0?w=200&h=200&fit=crop&crop=center' },
      { name: 'Glass Storage Jar with Cork Lid', category: 'Kitchen', image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=200&h=200&fit=crop&crop=center' },
      
      // Decorative
      { name: 'Vintage Picture Frame Gold', category: 'Decorative', image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=200&h=200&fit=crop&crop=center' },
      { name: 'Scented Candle Rose Garden', category: 'Decorative', image: 'https://images.unsplash.com/photo-1602874801006-a61e74989222?w=200&h=200&fit=crop&crop=center' },
      { name: 'Crystal Decorative Bowl', category: 'Decorative', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop&crop=center' },
      
      // Gifts
      { name: 'Leather Journal with Pen', category: 'Gifts', image: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=200&h=200&fit=crop&crop=center' },
      { name: 'Wooden Music Box Vintage', category: 'Gifts', image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=200&h=200&fit=crop&crop=center' },
      { name: 'Essential Oil Diffuser Set', category: 'Gifts', image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=200&h=200&fit=crop&crop=center' }
    ]
    
    const mockRecommendations = Array.from({ length: request.top_n }, (_, i) => {
      const template = productTemplates[i % productTemplates.length]
      return {
        stock_code: `${10000 + i}`,
        description: template.name,
        score: 0.9 - (i * 0.05),
        category: template.category,
        price: 25 + (i * 5),
        popularity_score: 0.8 - (i * 0.05),
        image_url: template.image
      }
    })

    return {
      recommendations: mockRecommendations,
      method_used: request.method,
      processing_time_ms: 120,
      customer_id: request.customer_id,
      total_results: mockRecommendations.length
    }
  }

  async searchCustomersAndProducts(request: CustomerSearchRequest): Promise<CustomerSearchResponse> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return {
      customers: [
        { 
          customer_id: '12345', 
          name: 'Sample Customer', 
          country: 'UK', 
          total_orders: 15,
          last_order_date: '2024-01-15'
        }
      ],
      products: [
        { 
          stock_code: '85123A', 
          description: 'WHITE HANGING HEART T-LIGHT HOLDER',
          category: 'Home & Garden',
          popularity_score: 0.85
        }
      ]
    }
  }

  async getAnalytics(request: AnalyticsRequest): Promise<AnalyticsResponse> {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    return {
      performance_metrics: {
        precision_at_10: 0.82,
        recall_at_10: 0.79,
        f1_score: 0.80,
        click_through_rate: 0.11,
        conversion_rate: 0.07
      },
      usage_stats: {
        total_requests: 1250,
        avg_response_time_ms: 150,
        active_users: 350,
        revenue_impact: 42000
      },
      trends: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        requests: 150 + Math.floor(Math.random() * 100),
        avg_latency: 120 + Math.floor(Math.random() * 60),
        click_through_rate: 0.08 + (Math.random() * 0.08)
      })),
      category_distribution: [
        { category: 'Home & Garden', count: 342, revenue: 8500 },
        { category: 'Kitchen', count: 289, revenue: 7200 },
        { category: 'Decorative', count: 187, revenue: 4600 },
        { category: 'Gifts', count: 156, revenue: 3900 }
      ]
    }
  }

  async getSocialGraph(request: SocialGraphRequest): Promise<SocialGraphResponse> {
    await new Promise(resolve => setTimeout(resolve, 600))
    
    return {
      nodes: [
        { 
          id: request.customer_id, 
          label: 'You', 
          size: 1.4, 
          color: 'hsl(var(--primary))',
          customer_data: {
            total_orders: 25,
            avg_order_value: 120,
            country: 'US'
          }
        },
        { 
          id: 'user2', 
          label: 'Similar User 1', 
          size: 1.0, 
          color: 'hsl(var(--secondary))',
          customer_data: {
            total_orders: 18,
            avg_order_value: 95,
            country: 'UK'
          }
        },
        { 
          id: 'user3', 
          label: 'Similar User 2', 
          size: 0.8, 
          color: 'hsl(var(--secondary))',
          customer_data: {
            total_orders: 12,
            avg_order_value: 75,
            country: 'CA'
          }
        }
      ],
      edges: [
        { source: request.customer_id, target: 'user2', weight: 0.8, similarity_type: 'purchase' },
        { source: request.customer_id, target: 'user3', weight: 0.6, similarity_type: 'browse' }
      ],
      influence_scores: {
        [request.customer_id]: 0.9,
        'user2': 0.7,
        'user3': 0.5
      }
    }
  }

  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return {
      status: 'ok (fallback)',
      timestamp: new Date().toISOString()
    }
  }
}

export const fallbackApi = new FallbackApi()