import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    const url = new URL(req.url)
    const query = url.searchParams.get('query') || ''
    const limit = parseInt(url.searchParams.get('limit') || '10')

    // Simulate customer and product search
    const customers = generateCustomerResults(query, Math.min(limit, 5))
    const products = generateProductResults(query, Math.min(limit, 10))

    return new Response(
      JSON.stringify({
        customers,
        products
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

function generateCustomerResults(query: string, limit: number) {
  const countries = ['USA', 'UK', 'Canada', 'Germany', 'France', 'Australia', 'Japan', 'Brazil']
  const names = ['John Smith', 'Emma Johnson', 'Michael Brown', 'Sarah Davis', 'David Wilson', 'Lisa Anderson', 'James Garcia', 'Maria Rodriguez']
  
  return Array.from({ length: limit }, (_, i) => ({
    customer_id: `${Math.floor(10000 + Math.random() * 90000)}`,
    name: names[Math.floor(Math.random() * names.length)],
    country: countries[Math.floor(Math.random() * countries.length)],
    total_orders: Math.floor(1 + Math.random() * 100),
    last_order_date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    relevance_score: Math.random()
  })).filter(customer => 
    query === '' || 
    customer.name.toLowerCase().includes(query.toLowerCase()) ||
    customer.customer_id.includes(query)
  )
}

function generateProductResults(query: string, limit: number) {
  const categories = ['Home & Garden', 'Kitchen', 'Decorative', 'Gifts', 'Electronics', 'Fashion', 'Sports', 'Books']
  const adjectives = ['Premium', 'Deluxe', 'Classic', 'Modern', 'Vintage', 'Eco-Friendly', 'Smart', 'Professional']
  
  return Array.from({ length: limit }, (_, i) => {
    const category = categories[Math.floor(Math.random() * categories.length)]
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
    const stockCode = `${Math.floor(10000 + Math.random() * 90000)}`
    
    return {
      stock_code: stockCode,
      description: `${adjective} ${category} item ${stockCode}`,
      category,
      popularity_score: Math.random(),
      price: Math.round((10 + Math.random() * 190) * 100) / 100,
      relevance_score: Math.random()
    }
  }).filter(product => 
    query === '' || 
    product.description.toLowerCase().includes(query.toLowerCase()) ||
    product.stock_code.includes(query) ||
    product.category.toLowerCase().includes(query.toLowerCase())
  )
}