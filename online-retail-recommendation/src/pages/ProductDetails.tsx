import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ArrowLeft, Heart, Star, ShoppingCart, Share2, Package, Tag, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/hooks/useAuth'
import { useFavorites } from '@/hooks/useFavorites'
import { useToast } from '@/hooks/use-toast'

interface ProductDetails {
  stock_code: string
  description: string
  category: string
  price: number
  score?: number
  imageUrl: string
  longDescription: string
  specifications: Record<string, string>
  inStock: boolean
  stockQuantity: number
  rating: number
  reviewCount: number
  brand: string
  tags: string[]
}

export default function ProductDetails() {
  const { stockCode } = useParams<{ stockCode: string }>()
  const { user } = useAuth()
  const { isItemSaved, toggleSave } = useFavorites()
  const { toast } = useToast()
  const [product, setProduct] = useState<ProductDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    if (!stockCode) return

    // Mock product data - in real app this would be an API call
    const mockProduct: ProductDetails = {
      stock_code: stockCode,
      description: `Premium ${getCategoryFromCode(stockCode)} Item ${stockCode}`,
      category: getCategoryFromCode(stockCode),
      price: Math.round(15 + Math.random() * 200),
      imageUrl: `https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=600&fit=crop`,
      longDescription: `This exceptional ${getCategoryFromCode(stockCode).toLowerCase()} item combines quality craftsmanship with modern design. Perfect for both everyday use and special occasions, it offers outstanding value and durability. Made with premium materials and attention to detail, this product has been carefully selected to meet the highest standards of quality and customer satisfaction.`,
      specifications: {
        'Material': 'Premium Quality',
        'Dimensions': '10" x 8" x 2"',
        'Weight': '1.2 lbs',
        'Care Instructions': 'Easy to clean',
        'Warranty': '1 Year Limited'
      },
      inStock: Math.random() > 0.1,
      stockQuantity: Math.floor(Math.random() * 50) + 1,
      rating: 4 + Math.random(),
      reviewCount: Math.floor(Math.random() * 200) + 10,
      brand: 'Premium Brand',
      tags: ['Popular', 'Best Seller', 'Premium Quality']
    }

    // Simulate API delay
    setTimeout(() => {
      setProduct(mockProduct)
      setLoading(false)
    }, 500)
  }, [stockCode])

  const getCategoryFromCode = (code: string) => {
    const num = parseInt(code) || 0
    switch (num % 4) {
      case 0: return 'Home & Garden'
      case 1: return 'Kitchen'
      case 2: return 'Decorative'
      default: return 'Gifts'
    }
  }

  const handleSave = () => {
    if (!product) return
    toggleSave({
      stock_code: product.stock_code,
      description: product.description,
      score: product.score,
      category: product.category,
      price: product.price,
      imageUrl: product.imageUrl
    })
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.description,
          url: window.location.href,
        })
      } catch (error) {
        // Handle share error silently
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied",
        description: "Product link copied to clipboard",
      })
    }
  }

  const mockImages = [
    'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop',
  ]

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-32 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="h-96 bg-muted rounded"></div>
              <div className="flex gap-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-20 w-20 bg-muted rounded"></div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-6 bg-muted rounded w-1/2"></div>
              <div className="h-20 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link to="/recommendations" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Recommendations
        </Link>
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Product not found</h2>
          <p className="text-muted-foreground">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/recommendations" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to Recommendations
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            <img
              src={mockImages[selectedImage]}
              alt={product.description}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-2">
            {mockImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-1 aspect-square rounded-lg overflow-hidden border-2 ${
                  selectedImage === index ? 'border-primary' : 'border-transparent'
                }`}
              >
                <img
                  src={image}
                  alt={`${product.description} view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-3xl font-bold">{product.description}</h1>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleShare}
                  className="shrink-0"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                {user && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleSave}
                    className="shrink-0"
                  >
                    <Heart 
                      className={`h-4 w-4 ${
                        isItemSaved(product.stock_code) ? 'fill-current text-red-500' : ''
                      }`} 
                    />
                  </Button>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{product.rating.toFixed(1)}</span>
                <span className="text-muted-foreground">({product.reviewCount} reviews)</span>
              </div>
              <Badge variant="secondary">{product.category}</Badge>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="text-3xl font-bold text-primary mb-4">
              ${product.price.toFixed(2)}
            </div>

            <div className="flex items-center gap-2 mb-6">
              {product.inStock ? (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  In Stock ({product.stockQuantity} available)
                </Badge>
              ) : (
                <Badge variant="destructive">
                  Out of Stock
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <Button 
              size="lg" 
              className="w-full"
              disabled={!product.inStock}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-3">Product Details</h3>
            <p className="text-muted-foreground leading-relaxed">
              {product.longDescription}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="font-medium">{key}:</span>
                    <span className="text-muted-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Product Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Stock Code:</span>
                  <span className="text-muted-foreground">{product.stock_code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Brand:</span>
                  <span className="text-muted-foreground">{product.brand}</span>
                </div>
                {product.score && (
                  <div className="flex justify-between">
                    <span className="font-medium">Recommendation Score:</span>
                    <span className="text-muted-foreground">{(product.score * 100).toFixed(0)}%</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}