// Filter application logic
export function applyFilters(recommendations: any[], filters: any) {
  let filtered = [...recommendations]
  
  if (filters.categories && filters.categories.length > 0) {
    filtered = filtered.filter(item => filters.categories.includes(item.category))
  }
  
  if (filters.min_price !== undefined) {
    filtered = filtered.filter(item => item.price >= filters.min_price)
  }
  
  if (filters.max_price !== undefined) {
    filtered = filtered.filter(item => item.price <= filters.max_price)
  }
  
  // Apply sorting
  if (filters.sort_by) {
    filtered.sort((a, b) => {
      const aVal = a[filters.sort_by]
      const bVal = b[filters.sort_by]
      const comparison = filters.sort_order === 'asc' ? aVal - bVal : bVal - aVal
      return comparison
    })
  }
  
  return filtered
}