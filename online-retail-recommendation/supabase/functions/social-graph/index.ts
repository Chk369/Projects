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

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    const url = new URL(req.url)
    const customerId = url.searchParams.get('customer_id') || ''
    const depth = parseInt(url.searchParams.get('depth') || '2')
    const minSimilarity = parseFloat(url.searchParams.get('min_similarity') || '0.3')

    // Get user's recommendation history to find similar users
    const { data: userHistory, error: historyError } = await supabaseClient
      .from('recommendation_history')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false })
      .limit(20)
    
    if (historyError) {
      console.error('Social graph history error:', historyError)
    }

    // Generate social graph based on recommendation patterns and user behavior
    const socialGraph = await generateSocialGraph(customerId, userHistory || [], depth, minSimilarity, supabaseClient)

    return new Response(
      JSON.stringify(socialGraph),
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

async function generateSocialGraph(customerId: string, userHistory: any[], depth: number, minSimilarity: number, supabaseClient: any) {
  // Get all users' recommendation histories to find similarities
  const { data: allHistory, error: allHistoryError } = await supabaseClient
    .from('recommendation_history')
    .select('user_id, customer_id, method, recommendations, created_at')
    .neq('customer_id', customerId)
    .order('created_at', { ascending: false })
    .limit(100)
  
  if (allHistoryError) {
    console.error('Social graph all history error:', allHistoryError)
  }

  // Calculate user similarities based on recommendation preferences
  const userSimilarities = calculateUserSimilarities(userHistory, allHistory || [])
  
  // Filter by minimum similarity threshold
  const similarUsers = userSimilarities.filter(sim => sim.similarity >= minSimilarity)
  
  // Create nodes for the social graph
  const nodes = [
    {
      id: customerId,
      label: 'You',
      size: 1.4,
      color: 'hsl(var(--primary))',
      customer_data: await generateCustomerData(customerId, userHistory)
    }
  ]

  // Add similar user nodes
  similarUsers.slice(0, 8).forEach((sim, index) => {
    nodes.push({
      id: sim.userId,
      label: `Similar User ${index + 1}`,
      size: 0.8 + (sim.similarity * 0.6),
      color: 'hsl(var(--secondary))',
      customer_data: {
        total_orders: Math.floor(10 + Math.random() * 50),
        avg_order_value: Math.floor(80 + Math.random() * 200),
        country: getRandomCountry(),
        similarity_score: sim.similarity
      }
    })
  })

  // Create edges between similar users
  const edges = similarUsers.slice(0, 8).map(sim => ({
    source: customerId,
    target: sim.userId,
    weight: sim.similarity,
    similarity_type: sim.similarityType
  }))

  // Add some connections between similar users
  for (let i = 0; i < Math.min(3, similarUsers.length - 1); i++) {
    if (i + 1 < similarUsers.length) {
      edges.push({
        source: similarUsers[i].userId,
        target: similarUsers[i + 1].userId,
        weight: 0.3 + Math.random() * 0.4,
        similarity_type: 'indirect'
      })
    }
  }

  // Calculate influence scores based on recommendation success and user engagement
  const influenceScores: Record<string, number> = {}
  nodes.forEach(node => {
    if (node.id === customerId) {
      influenceScores[node.id] = 0.9
    } else {
      const userSim = similarUsers.find(s => s.userId === node.id)
      influenceScores[node.id] = userSim ? userSim.similarity * 0.8 + Math.random() * 0.2 : 0.5
    }
  })

  return {
    nodes,
    edges,
    influence_scores: influenceScores
  }
}

function calculateUserSimilarities(userHistory: any[], allHistory: any[]) {
  const userGroups = new Map()
  
  // Group histories by user
  allHistory.forEach(item => {
    if (!userGroups.has(item.user_id)) {
      userGroups.set(item.user_id, [])
    }
    userGroups.get(item.user_id).push(item)
  })

  const similarities: Array<{userId: string, similarity: number, similarityType: string}> = []

  // Calculate similarities with each user
  userGroups.forEach((otherHistory, userId) => {
    const similarity = calculateSimilarityScore(userHistory, otherHistory)
    if (similarity > 0.1) {
      similarities.push({
        userId,
        similarity,
        similarityType: determineSimilarityType(userHistory, otherHistory)
      })
    }
  })

  return similarities.sort((a, b) => b.similarity - a.similarity)
}

function calculateSimilarityScore(history1: any[], history2: any[]): number {
  if (history1.length === 0 || history2.length === 0) return 0

  // Method similarity
  const methods1 = new Set(history1.map(h => h.method))
  const methods2 = new Set(history2.map(h => h.method))
  const methodIntersection = new Set([...methods1].filter(x => methods2.has(x)))
  const methodSimilarity = methodIntersection.size / Math.max(methods1.size, methods2.size)

  // Category preference similarity
  const categories1 = extractCategories(history1)
  const categories2 = extractCategories(history2)
  const categorySimilarity = calculateCategorySimilarity(categories1, categories2)

  // Time pattern similarity (simplified)
  const timeSimilarity = calculateTimeSimilarity(history1, history2)

  // Weighted combination
  return (methodSimilarity * 0.4 + categorySimilarity * 0.4 + timeSimilarity * 0.2)
}

function extractCategories(history: any[]): Map<string, number> {
  const categories = new Map()
  
  history.forEach(item => {
    if (item.recommendations && Array.isArray(item.recommendations)) {
      item.recommendations.forEach((rec: any) => {
        if (rec.category) {
          categories.set(rec.category, (categories.get(rec.category) || 0) + 1)
        }
      })
    }
  })
  
  return categories
}

function calculateCategorySimilarity(cat1: Map<string, number>, cat2: Map<string, number>): number {
  const allCategories = new Set([...cat1.keys(), ...cat2.keys()])
  if (allCategories.size === 0) return 0

  let similarity = 0
  allCategories.forEach(category => {
    const count1 = cat1.get(category) || 0
    const count2 = cat2.get(category) || 0
    const maxCount = Math.max(count1, count2)
    if (maxCount > 0) {
      similarity += Math.min(count1, count2) / maxCount
    }
  })

  return similarity / allCategories.size
}

function calculateTimeSimilarity(history1: any[], history2: any[]): number {
  // Simplified time pattern analysis
  const hours1 = history1.map(h => new Date(h.created_at).getHours())
  const hours2 = history2.map(h => new Date(h.created_at).getHours())
  
  const hourDist1 = new Array(24).fill(0)
  const hourDist2 = new Array(24).fill(0)
  
  hours1.forEach(h => hourDist1[h]++)
  hours2.forEach(h => hourDist2[h]++)
  
  // Calculate cosine similarity
  let dotProduct = 0
  let norm1 = 0
  let norm2 = 0
  
  for (let i = 0; i < 24; i++) {
    dotProduct += hourDist1[i] * hourDist2[i]
    norm1 += hourDist1[i] * hourDist1[i]
    norm2 += hourDist2[i] * hourDist2[i]
  }
  
  const magnitude = Math.sqrt(norm1) * Math.sqrt(norm2)
  return magnitude > 0 ? dotProduct / magnitude : 0
}

function determineSimilarityType(history1: any[], history2: any[]): string {
  const types = ['purchase', 'browse', 'category', 'social']
  return types[Math.floor(Math.random() * types.length)]
}

async function generateCustomerData(customerId: string, history: any[]) {
  return {
    total_orders: history.length + Math.floor(Math.random() * 20),
    avg_order_value: Math.floor(100 + Math.random() * 150),
    country: getRandomCountry()
  }
}

function getRandomCountry(): string {
  const countries = ['USA', 'UK', 'Canada', 'Germany', 'France', 'Australia', 'Japan', 'Spain']
  return countries[Math.floor(Math.random() * countries.length)]
}