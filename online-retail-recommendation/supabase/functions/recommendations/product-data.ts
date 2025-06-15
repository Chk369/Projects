// Product templates and base recommendation generation
export const productTemplates = [
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
  { name: 'Essential Oil Diffuser Set', category: 'Gifts', image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=200&h=200&fit=crop&crop=center' },
  
  // Electronics
  { name: 'Bluetooth Wireless Speaker', category: 'Electronics', image: 'https://images.unsplash.com/photo-1501286353178-1ec881214838?w=200&h=200&fit=crop&crop=center' },
  { name: 'USB-C Fast Charger', category: 'Electronics', image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&h=200&fit=crop&crop=center' },
  
  // Fashion
  { name: 'Cotton Knit Scarf', category: 'Fashion', image: 'https://images.unsplash.com/photo-1562572159-4efc207f5aff?w=200&h=200&fit=crop&crop=center' },
  { name: 'Leather Crossbody Bag', category: 'Fashion', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop&crop=center' },
  
  // Sports
  { name: 'Yoga Mat Premium', category: 'Sports', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=center' },
  { name: 'Water Bottle Stainless Steel', category: 'Sports', image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=200&h=200&fit=crop&crop=center' },
  
  // Books
  { name: 'Hardcover Recipe Book', category: 'Books', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=center' },
  { name: 'Travel Guide European Cities', category: 'Books', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=200&fit=crop&crop=center' }
]

export function generateBaseRecommendations(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const template = productTemplates[Math.floor(Math.random() * productTemplates.length)]
    const stockCode = `${10000 + Math.floor(Math.random() * 90000)}`
    const basePrice = 10 + Math.random() * 190
    
    return {
      stock_code: stockCode,
      description: template.name,
      score: 0.5 + Math.random() * 0.5,
      category: template.category,
      price: Math.round(basePrice * 100) / 100,
      popularity_score: Math.random(),
      image_url: template.image
    }
  })
}