import { useState, useCallback, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { SearchBar } from "@/components/ui/search-bar"
import { ResultsGrid } from "@/components/ui/results-grid"
import { SocialGraph } from "@/components/ui/social-graph"
import { RecommendationAnalytics } from "@/components/ui/recommendation-analytics"
import { AdvancedFilters, FilterState } from "@/components/ui/advanced-filters"
import { UserPreferences } from "@/components/ui/user-preferences"
import { useRecommendations, useCustomerSearch, useSocialGraph } from "@/hooks/useApi"
import { usePreferencesManager } from "@/hooks/useUserPreferences"
import { useRecommendationHistory } from "@/hooks/useRecommendationHistory"
import { useExport } from "@/hooks/useExport"
import { useAuth } from "@/hooks/useAuth"
import { RecommendationRequest } from "@/types/api"
import { useToast } from "@/hooks/use-toast"
import { AlertCircleIcon, WifiOffIcon, ArrowLeft, Download, FileText } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { applyFiltersAndSorting, extractCategoriesFromRecommendations } from "@/lib/recommendation-utils"

interface Recommendation {
  stock_code: string
  description: string
  score: number
  imageUrl?: string
  category?: string
  price?: number
}

const Recommendations = () => {
  const navigate = useNavigate()
  const [customerId, setCustomerId] = useState("")
  const [method, setMethod] = useState<RecommendationRequest['method']>("hybrid")
  const [topN, setTopN] = useState([10])
  const [showSocialGraph, setShowSocialGraph] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  
  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, 1000],
    sortBy: 'score',
    sortOrder: 'desc'
  })
  
  const { toast } = useToast()
  const { user } = useAuth()
  const { saveToHistory } = useRecommendationHistory()
  const { exportToCSV, exportToPDF } = useExport()
  
  // User preferences
  const {
    preferences,
    updatePreferences,
    saveToDatabase,
    resetToDefaults,
    hasUnsavedChanges,
    isLoading: preferencesLoading,
    isSaving: preferencesSaving
  } = usePreferencesManager()
  
  // API Hooks
  const recommendationMutation = useRecommendations()
  const { data: searchData, isLoading: searchLoading } = useCustomerSearch(searchQuery, searchQuery.length > 2)
  const { data: socialGraphData, isLoading: socialLoading } = useSocialGraph(customerId, showSocialGraph && !!customerId)

  // Apply user preferences to form state when loaded
  useEffect(() => {
    if (preferences && !preferencesLoading) {
      setMethod(preferences.preferred_methods[0] as RecommendationRequest['method'] || 'hybrid')
      setTopN([preferences.max_results || 10])
      setFilters({
        categories: preferences.preferred_categories || [],
        priceRange: [preferences.price_range_min || 0, preferences.price_range_max || 1000],
        sortBy: preferences.default_sort_by as FilterState['sortBy'] || 'score',
        sortOrder: preferences.default_sort_order as FilterState['sortOrder'] || 'desc'
      })
    }
  }, [preferences, preferencesLoading])

  // Handle search suggestions
  const searchSuggestions = searchData ? [
    ...searchData.customers.map(c => `Customer ${c.customer_id}`),
    ...searchData.products.map(p => `${p.stock_code} - ${p.description}`)
  ] : []

  const handleSearch = useCallback((value: string) => {
    setCustomerId(value)
    setSearchQuery(value)
  }, [])

  // Extract available categories from current recommendations
  const availableCategories = useMemo(() => {
    return extractCategoriesFromRecommendations(recommendations)
  }, [recommendations])

  // Apply filters and sorting to recommendations
  const filteredAndSortedRecommendations = useMemo(() => {
    return applyFiltersAndSorting(recommendations, filters)
  }, [recommendations, filters])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerId.trim()) {
      // Use default customer ID for demo
      setCustomerId("12345")
    }

    const request: RecommendationRequest = {
      customer_id: customerId.trim() || "12345",
      method,
      top_n: topN[0],
      filters: {
        categories: filters.categories.length > 0 ? filters.categories : undefined,
        min_price: filters.priceRange[0] > 0 ? filters.priceRange[0] : undefined,
        max_price: filters.priceRange[1] < 1000 ? filters.priceRange[1] : undefined,
        sort_by: filters.sortBy,
        sort_order: filters.sortOrder
      }
    }

    try {
      const response = await recommendationMutation.mutateAsync(request)
      const transformedRecommendations = response.recommendations.map(rec => ({
        stock_code: rec.stock_code,
        description: rec.description,
        score: rec.score,
        category: rec.category,
        price: rec.price,
        imageUrl: rec.image_url || `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(rec.description.slice(0, 20))}`
      }))
      
      setRecommendations(transformedRecommendations)
      
      // Save to history if user is authenticated
      if (user) {
        saveToHistory({ request, recommendations: transformedRecommendations })
      }
      
      toast({
        title: "Success",
        description: `Generated ${response.recommendations.length} recommendations in ${response.processing_time_ms}ms`,
      })
    } catch (error) {
      // Error handling is done in the hook
      console.error('Recommendation error:', error)
    }
  }

  const handleSaveItem = (stockCode: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save recommendations to your favorites",
        action: (
          <Button variant="outline" size="sm" onClick={() => navigate('/auth')}>
            Sign In
          </Button>
        ),
      })
      return
    }
    
    toast({
      title: "Item Saved",
      description: `Product ${stockCode} has been saved to your favorites`,
    })
  }

  // Connection status indicator
  const isConnected = !recommendationMutation.isError
  const isLoading = recommendationMutation.isPending

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <div className="flex items-center justify-between">
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
                   <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                     <div>
                       <h1 className="text-3xl font-bold">Product Recommendations</h1>
                       <p className="mt-2 text-muted-foreground">
                         Get personalized product suggestions based on customer data and preferences.
                       </p>
                     </div>
                     {recommendations.length > 0 && (
                       <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                           <Button variant="outline" className="gap-2">
                             <Download className="h-4 w-4" />
                             Export
                           </Button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent>
                           <DropdownMenuItem onClick={() => exportToCSV(recommendations)}>
                             <FileText className="h-4 w-4 mr-2" />
                             Export as CSV
                           </DropdownMenuItem>
                           <DropdownMenuItem onClick={() => exportToPDF(recommendations)}>
                             <FileText className="h-4 w-4 mr-2" />
                             Export as TXT
                           </DropdownMenuItem>
                         </DropdownMenuContent>
                       </DropdownMenu>
                     )}
                   </div>
                 </div>
              </div>
              
              {/* Connection Status */}
              <div className="flex items-center space-x-2">
                {isConnected ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <div className="h-2 w-2 rounded-full bg-green-600 mr-1" />
                    API Connected
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <WifiOffIcon className="h-3 w-3 mr-1" />
                    API Disconnected
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {/* Form Panel */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                <div className="sticky top-8 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recommendation Parameters</CardTitle>
                    <CardDescription>
                      Configure your recommendation settings below.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="customer-search">Customer ID or Product</Label>
                      <SearchBar
                        placeholder="Search customers or products..."
                        suggestions={searchSuggestions}
                        onSearch={handleSearch}
                        id="customer-search"
                      />
                      {searchLoading && (
                        <p className="text-xs text-muted-foreground">Searching...</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="method">Recommendation Method</Label>
                      <Select value={method} onValueChange={(value: RecommendationRequest['method']) => setMethod(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cf">Collaborative Filtering</SelectItem>
                          <SelectItem value="cb">Content-Based</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                          <SelectItem value="social">Social Influence</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="top-n">Number of Recommendations</Label>
                        <span className="text-sm text-muted-foreground">{topN[0]}</span>
                      </div>
                      <Slider
                        id="top-n"
                        min={5}
                        max={20}
                        step={1}
                        value={topN}
                        onValueChange={setTopN}
                        className="w-full"
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="social-graph"
                        checked={showSocialGraph}
                        onCheckedChange={setShowSocialGraph}
                      />
                      <Label htmlFor="social-graph">Show Social Graph</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="analytics"
                        checked={showAnalytics}
                        onCheckedChange={setShowAnalytics}
                      />
                      <Label htmlFor="analytics">Show Analytics</Label>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Generating..." : "Get Recommendations"}
                    </Button>
                  </form>

                  {/* Error Display */}
                  {recommendationMutation.isError && (
                    <div className="mt-4 p-3 border border-destructive/20 rounded-lg bg-destructive/10">
                      <div className="flex items-center space-x-2 text-sm text-destructive">
                        <AlertCircleIcon className="h-4 w-4" />
                        <span>API Error: {recommendationMutation.error?.message}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
                </Card>

                {/* User Preferences */}
                <UserPreferences
                  preferences={preferences}
                  onPreferencesChange={updatePreferences}
                  onSave={saveToDatabase}
                  onReset={resetToDefaults}
                  loading={preferencesSaving}
                />

                {/* Advanced Filters */}
                <AdvancedFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                  availableCategories={availableCategories.length > 0 ? availableCategories : undefined}
                />
                </div>
              </div>
            </div>

            {/* Results Area */}
            <div className="lg:col-span-3 min-h-[500px]">
              <div className="space-y-6">
                {/* Social Graph Section */}
                {showSocialGraph && customerId && (
                  <div>
                    {socialLoading ? (
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-center h-48">
                            <p className="text-muted-foreground">Loading social graph...</p>
                          </div>
                        </CardContent>
                      </Card>
                    ) : socialGraphData ? (
                      <SocialGraph 
                        nodes={socialGraphData.nodes}
                        edges={socialGraphData.edges}
                        width={600}
                        height={300}
                      />
                    ) : (
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-center h-48">
                            <p className="text-muted-foreground">No social graph data available</p>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}

                {/* Analytics Section */}
                {showAnalytics && recommendations.length > 0 && (
                  <RecommendationAnalytics />
                )}

                {/* Results Grid */}
                <div>
                  {(isLoading || recommendations.length > 0) && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-xl font-semibold">
                            {isLoading ? "Generating Recommendations..." : 
                             filteredAndSortedRecommendations.length === recommendations.length ? 
                             `Top ${recommendations.length} Recommendations` :
                             `${filteredAndSortedRecommendations.length} of ${recommendations.length} Recommendations`}
                          </h2>
                          {!isLoading && recommendations.length > 0 && (
                            <p className="text-sm text-muted-foreground">
                              Method: {method.toUpperCase()} • Customer: {customerId}
                              {filteredAndSortedRecommendations.length !== recommendations.length && 
                                ` • Filtered by ${filters.categories.length > 0 ? `${filters.categories.length} categories, ` : ''}price range, sorted by ${filters.sortBy}`}
                            </p>
                          )}
                        </div>
                        {hasUnsavedChanges && (
                          <Badge variant="outline" className="text-xs">
                            Unsaved preferences changes
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <ResultsGrid
                    recommendations={filteredAndSortedRecommendations}
                    loading={isLoading}
                    onSaveItem={handleSaveItem}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Recommendations