import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { useRecommendationHistory } from "@/hooks/useRecommendationHistory"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, History, Calendar, Hash, Filter } from "lucide-react"
import { useEffect } from "react"

const HistoryPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { history, isLoading } = useRecommendationHistory()

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/auth')
    }
  }, [user, navigate])

  if (!user) {
    return null
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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
                  <History className="h-8 w-8 text-blue-500" />
                  <span>Recommendation History</span>
                </h1>
                <p className="mt-2 text-muted-foreground">
                  View your past recommendation requests and results.
                </p>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-6 bg-muted rounded mb-4 w-1/3"></div>
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : history.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No history yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start making recommendation requests to see your history here.
                </p>
                <Button asChild>
                  <a href="/recommendations">Get Recommendations</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {history.map((entry) => (
                <Card key={entry.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Recommendations for Customer {entry.customer_id}
                      </CardTitle>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(entry.created_at)}</span>
                      </div>
                    </div>
                    <CardDescription>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <Badge variant="outline" className="flex items-center space-x-1">
                          <span>Method: {entry.method.toUpperCase()}</span>
                        </Badge>
                        <Badge variant="outline" className="flex items-center space-x-1">
                          <Hash className="h-3 w-3" />
                          <span>{entry.top_n} results</span>
                        </Badge>
                        {entry.filters && Object.keys(entry.filters).length > 0 && (
                          <Badge variant="outline" className="flex items-center space-x-1">
                            <Filter className="h-3 w-3" />
                            <span>Filtered</span>
                          </Badge>
                        )}
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {entry.filters && Object.keys(entry.filters).length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold mb-2">Applied Filters:</h4>
                          <div className="text-sm text-muted-foreground">
                            {entry.filters.categories && entry.filters.categories.length > 0 && (
                              <p>Categories: {entry.filters.categories.join(', ')}</p>
                            )}
                            {(entry.filters.min_price || entry.filters.max_price) && (
                              <p>
                                Price range: ${entry.filters.min_price || 0} - ${entry.filters.max_price || '∞'}
                              </p>
                            )}
                            <p>Sorted by: {entry.filters.sort_by} ({entry.filters.sort_order})</p>
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <h4 className="text-sm font-semibold mb-2">
                          Top Recommendations ({entry.recommendations.length} items):
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {entry.recommendations.slice(0, 6).map((rec: any, index: number) => (
                            <div 
                              key={index}
                              className="p-3 border rounded-lg bg-muted/50"
                            >
                              <p className="font-medium text-sm leading-tight">
                                {rec.description}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {rec.stock_code}
                              </p>
                              {rec.score && (
                                <Badge variant="secondary" className="mt-2 text-xs">
                                  {(rec.score * 100).toFixed(0)}% match
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
                        {entry.recommendations.length > 6 && (
                          <p className="text-sm text-muted-foreground mt-2">
                            ... and {entry.recommendations.length - 6} more items
                          </p>
                        )}
                      </div>
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

export default HistoryPage