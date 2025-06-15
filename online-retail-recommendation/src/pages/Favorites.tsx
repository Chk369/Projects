import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { useFavorites } from "@/hooks/useFavorites"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Heart, Trash2 } from "lucide-react"
import { useEffect } from "react"

const Favorites = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { savedRecommendations, isLoading, toggleSave, isSaving } = useFavorites()

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/auth')
    }
  }, [user, navigate])

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <div>
                <h1 className="text-3xl font-bold flex items-center space-x-2">
                  <Heart className="h-8 w-8 text-red-500" />
                  <span>Your Favorites</span>
                </h1>
                <p className="mt-2 text-muted-foreground">
                  View and manage your saved product recommendations.
                </p>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-48 bg-muted rounded mb-4"></div>
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-3 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : savedRecommendations.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start adding recommendations to your favorites to see them here.
                </p>
                <Button asChild>
                  <a href="/recommendations">Browse Recommendations</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedRecommendations.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="aspect-square bg-muted flex items-center justify-center">
                    <img
                      src={item.image_url || `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(item.description.slice(0, 20))}`}
                      alt={item.description}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(item.description.slice(0, 20))}`
                      }}
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm leading-tight">
                            {item.description}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            {item.stock_code}
                          </p>
                        </div>
                        {item.score && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            {(item.score * 100).toFixed(0)}%
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          {item.category && (
                            <Badge variant="outline" className="text-xs">
                              {item.category}
                            </Badge>
                          )}
                          {item.price && (
                            <p className="text-sm font-medium">
                              ${item.price.toFixed(2)}
                            </p>
                          )}
                        </div>
                        
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => toggleSave({
                            stock_code: item.stock_code,
                            description: item.description,
                            score: item.score || undefined,
                            category: item.category || undefined,
                            price: item.price || undefined,
                            imageUrl: item.image_url || undefined
                          })}
                          disabled={isSaving}
                          className="flex items-center space-x-1"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>Remove</span>
                        </Button>
                      </div>
                      
                      <p className="text-xs text-muted-foreground">
                        Saved {new Date(item.saved_at).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Favorites