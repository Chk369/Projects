import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { SearchBar } from "@/components/ui/search-bar"
import { ResultsGrid } from "@/components/ui/results-grid"
import { SocialGraph } from "@/components/ui/social-graph"
import { RecommendationAnalytics } from "@/components/ui/recommendation-analytics"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

interface Recommendation {
  stock_code: string
  description: string
  score: number
  imageUrl?: string
}

const Recommendations = () => {
  const [customerId, setCustomerId] = useState("")
  const [method, setMethod] = useState("hybrid")
  const [topN, setTopN] = useState([10])
  const [loading, setLoading] = useState(false)
  const [showSocialGraph, setShowSocialGraph] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])

  // Mock social graph data
  const socialNodes = [
    { id: "customer1", label: "You", size: 1.2, color: "hsl(var(--primary))" },
    { id: "customer2", label: "Similar 1", size: 1.0, color: "hsl(var(--secondary))" },
    { id: "customer3", label: "Similar 2", size: 0.9, color: "hsl(var(--secondary))" },
    { id: "customer4", label: "Similar 3", size: 0.8, color: "hsl(var(--secondary))" }
  ]

  const socialEdges = [
    { source: "customer1", target: "customer2", weight: 0.8 },
    { source: "customer1", target: "customer3", weight: 0.6 },
    { source: "customer1", target: "customer4", weight: 0.5 }
  ]

  // Mock data for demonstration
  const mockSuggestions = [
    "Customer 12345",
    "Customer 67890", 
    "Customer 11111",
    "Product ABC123",
    "Product XYZ789"
  ]

  const mockRecommendations: Recommendation[] = [
    {
      stock_code: "85123A",
      description: "WHITE HANGING HEART T-LIGHT HOLDER",
      score: 0.92
    },
    {
      stock_code: "71053",
      description: "WHITE METAL LANTERN",
      score: 0.87
    },
    {
      stock_code: "84406B",
      description: "CREAM CUPID HEARTS COAT HANGER",
      score: 0.83
    },
    {
      stock_code: "22423",
      description: "REGENCY CAKESTAND 3 TIER",
      score: 0.81
    },
    {
      stock_code: "47566",
      description: "PARTY BUNTING",
      score: 0.78
    },
    {
      stock_code: "84879",
      description: "ASSORTED COLOUR BIRD ORNAMENT",
      score: 0.75
    },
    {
      stock_code: "22720",
      description: "SET OF 3 CAKE TINS PANTRY DESIGN",
      score: 0.72
    },
    {
      stock_code: "21730",
      description: "GLASS STAR FROSTED T-LIGHT HOLDER",
      score: 0.69
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerId.trim()) return

    setLoading(true)
    
    // Mock API call
    setTimeout(() => {
      setRecommendations(mockRecommendations.slice(0, topN[0]))
      setLoading(false)
    }, 1500)
  }

  const handleSaveItem = (stockCode: string) => {
    console.log("Saving item:", stockCode)
    // Implement save functionality
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Product Recommendations</h1>
            <p className="mt-2 text-muted-foreground">
              Get personalized product suggestions based on customer data and preferences.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Form Panel */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
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
                        suggestions={mockSuggestions}
                        onSearch={setCustomerId}
                        id="customer-search"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="method">Recommendation Method</Label>
                      <Select value={method} onValueChange={setMethod}>
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

                    <Button type="submit" className="w-full" disabled={loading || !customerId.trim()}>
                      {loading ? "Generating..." : "Get Recommendations"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Results Area */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {/* Social Graph Section */}
                {showSocialGraph && recommendations.length > 0 && (
                  <SocialGraph 
                    nodes={socialNodes}
                    edges={socialEdges}
                    width={600}
                    height={300}
                  />
                )}

                {/* Analytics Section */}
                {showAnalytics && recommendations.length > 0 && (
                  <RecommendationAnalytics />
                )}

                {/* Results Grid */}
                <div>
                  {(loading || recommendations.length > 0) && (
                    <div className="mb-4">
                      <h2 className="text-xl font-semibold">
                        {loading ? "Generating Recommendations..." : `Top ${recommendations.length} Recommendations`}
                      </h2>
                      {!loading && (
                        <p className="text-sm text-muted-foreground">
                          Method: {method.toUpperCase()} • Customer: {customerId}
                        </p>
                      )}
                    </div>
                  )}
                  
                  <ResultsGrid
                    recommendations={recommendations}
                    loading={loading}
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