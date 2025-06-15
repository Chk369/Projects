import { generateBaseRecommendations } from './product-data.ts'

// ML-Enhanced Recommendation Algorithms
export async function generateCollaborativeFiltering(customerId: string, topN: number, filters: any, history: any[]) {
  // Simulate collaborative filtering with user behavior analysis
  const baseRecommendations = generateBaseRecommendations(topN * 2)
  
  // Apply collaborative filtering logic based on similar users' preferences
  const cfScores = baseRecommendations.map(item => ({
    ...item,
    score: item.score * (0.8 + Math.random() * 0.4), // Simulate CF adjustments
    cf_factor: Math.random() * 0.3
  }))

  return cfScores.sort((a, b) => b.score - a.score)
}

export async function generateContentBased(customerId: string, topN: number, filters: any, userPrefs: any) {
  const baseRecommendations = generateBaseRecommendations(topN * 2)
  
  // Apply content-based filtering using user preferences
  const cbScores = baseRecommendations.map(item => {
    let scoreBoost = 1.0
    
    // Boost based on preferred categories
    if (userPrefs?.preferred_categories?.includes(item.category)) {
      scoreBoost += 0.2
    }
    
    // Boost based on price preferences
    if (userPrefs?.price_range_min && userPrefs?.price_range_max) {
      if (item.price >= userPrefs.price_range_min && item.price <= userPrefs.price_range_max) {
        scoreBoost += 0.15
      }
    }
    
    return {
      ...item,
      score: item.score * scoreBoost,
      cb_factor: scoreBoost - 1.0
    }
  })

  return cbScores.sort((a, b) => b.score - a.score)
}

export async function generateHybrid(customerId: string, topN: number, filters: any, userPrefs: any, history: any[]) {
  // Combine collaborative filtering and content-based approaches
  const cfResults = await generateCollaborativeFiltering(customerId, topN, filters, history)
  const cbResults = await generateContentBased(customerId, topN, filters, userPrefs)
  
  // Create hybrid scores
  const hybridMap = new Map()
  
  cfResults.forEach(item => {
    hybridMap.set(item.stock_code, {
      ...item,
      cf_score: item.score,
      hybrid_score: item.score * 0.6
    })
  })
  
  cbResults.forEach(item => {
    const existing = hybridMap.get(item.stock_code)
    if (existing) {
      existing.hybrid_score += item.score * 0.4
      existing.cb_score = item.score
    } else {
      hybridMap.set(item.stock_code, {
        ...item,
        cb_score: item.score,
        hybrid_score: item.score * 0.4
      })
    }
  })
  
  return Array.from(hybridMap.values())
    .map(item => ({ ...item, score: item.hybrid_score }))
    .sort((a, b) => b.score - a.score)
}

export async function generateSocialInfluence(customerId: string, topN: number, filters: any) {
  const baseRecommendations = generateBaseRecommendations(topN * 2)
  
  // Apply social influence factors
  const socialScores = baseRecommendations.map(item => ({
    ...item,
    score: item.score * (0.7 + Math.random() * 0.6), // Simulate social factors
    social_factor: Math.random() * 0.4
  }))

  return socialScores.sort((a, b) => b.score - a.score)
}