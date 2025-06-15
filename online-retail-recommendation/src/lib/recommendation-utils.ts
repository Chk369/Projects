import { FilterState } from '@/components/ui/advanced-filters'

export interface Recommendation {
  stock_code: string
  description: string
  score: number
  category?: string
  price?: number
  imageUrl?: string
}

export function sortRecommendations(
  recommendations: Recommendation[],
  sortBy: FilterState['sortBy'],
  sortOrder: FilterState['sortOrder']
): Recommendation[] {
  const sorted = [...recommendations].sort((a, b) => {
    let comparison = 0

    switch (sortBy) {
      case 'score':
        comparison = a.score - b.score
        break
      case 'price':
        const priceA = a.price || 0
        const priceB = b.price || 0
        comparison = priceA - priceB
        break
      case 'category':
        const categoryA = a.category || ''
        const categoryB = b.category || ''
        comparison = categoryA.localeCompare(categoryB)
        break
      case 'popularity':
        // For now, use score as popularity indicator
        comparison = a.score - b.score
        break
      default:
        comparison = 0
    }

    return sortOrder === 'desc' ? -comparison : comparison
  })

  return sorted
}

export function filterRecommendations(
  recommendations: Recommendation[],
  filters: FilterState
): Recommendation[] {
  return recommendations.filter(rec => {
    // Category filter
    if (filters.categories.length > 0) {
      if (!rec.category || !filters.categories.includes(rec.category)) {
        return false
      }
    }

    // Price filter
    const price = rec.price || 0
    if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
      return false
    }

    return true
  })
}

export function applyFiltersAndSorting(
  recommendations: Recommendation[],
  filters: FilterState
): Recommendation[] {
  const filtered = filterRecommendations(recommendations, filters)
  return sortRecommendations(filtered, filters.sortBy, filters.sortOrder)
}

export function extractCategoriesFromRecommendations(
  recommendations: Recommendation[]
): string[] {
  const categories = new Set<string>()
  recommendations.forEach(rec => {
    if (rec.category) {
      categories.add(rec.category)
    }
  })
  return Array.from(categories).sort()
}