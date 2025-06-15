import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from "recharts"

interface RecommendationAnalyticsProps extends React.HTMLAttributes<HTMLDivElement> {
  recommendationData?: {
    items: Array<{
      stockCode: string
      description: string
      score: number
      category: string
      popularity: number
      revenue: number
    }>
    trends: Array<{
      hour: number
      recommendations: number
      clickThrough: number
    }>
  }
}

export function RecommendationAnalytics({ 
  recommendationData, 
  className, 
  ...props 
}: RecommendationAnalyticsProps) {
  const defaultData = {
    items: [
      { stockCode: "85123A", description: "WHITE HANGING HEART T-LIGHT HOLDER", score: 0.92, category: "Home & Garden", popularity: 85, revenue: 450 },
      { stockCode: "71053", description: "WHITE METAL LANTERN", score: 0.87, category: "Home & Garden", popularity: 78, revenue: 380 },
      { stockCode: "84406B", description: "CREAM CUPID HEARTS COAT HANGER", score: 0.83, category: "Decorative", popularity: 72, revenue: 320 },
      { stockCode: "22423", description: "REGENCY CAKESTAND 3 TIER", score: 0.81, category: "Kitchen", popularity: 65, revenue: 280 },
      { stockCode: "47566", description: "PARTY BUNTING", score: 0.78, category: "Gifts", popularity: 58, revenue: 240 }
    ],
    trends: [
      { hour: 9, recommendations: 45, clickThrough: 12 },
      { hour: 10, recommendations: 62, clickThrough: 18 },
      { hour: 11, recommendations: 78, clickThrough: 25 },
      { hour: 12, recommendations: 95, clickThrough: 32 },
      { hour: 13, recommendations: 88, clickThrough: 28 },
      { hour: 14, recommendations: 102, clickThrough: 38 },
      { hour: 15, recommendations: 115, clickThrough: 45 },
      { hour: 16, recommendations: 98, clickThrough: 35 }
    ]
  }

  const data = recommendationData || defaultData

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Home & Garden": "hsl(var(--primary))",
      "Kitchen": "hsl(var(--secondary))",
      "Decorative": "hsl(var(--accent))",
      "Gifts": "hsl(var(--muted))"
    }
    return colors[category] || "hsl(var(--muted))"
  }

  return (
    <div className={cn("space-y-6", className)} {...props}>
      {/* Top Recommendations List */}
      <Card>
        <CardHeader>
          <CardTitle>Top Recommendation Items</CardTitle>
          <CardDescription>
            Current session's highest-scoring recommendations with performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.items.map((item, index) => (
              <div 
                key={item.stockCode} 
                className="flex items-center justify-between p-4 border border-border rounded-lg"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.description}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {item.stockCode}
                      </Badge>
                      <Badge 
                        variant="secondary" 
                        className="text-xs"
                        style={{ backgroundColor: getCategoryColor(item.category) + "20" }}
                      >
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-primary">{Math.round(item.score * 100)}%</div>
                    <div className="text-xs text-muted-foreground">Score</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{item.popularity}%</div>
                    <div className="text-xs text-muted-foreground">Popularity</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">${item.revenue}</div>
                    <div className="text-xs text-muted-foreground">Revenue</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Hourly Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Hourly Performance</CardTitle>
            <CardDescription>
              Recommendations served vs click-through rates by hour
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="hour" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px"
                  }}
                />
                <Bar dataKey="recommendations" fill="hsl(var(--primary))" name="Recommendations" />
                <Bar dataKey="clickThrough" fill="hsl(var(--secondary))" name="Click-Through" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Score vs Popularity Scatter */}
        <Card>
          <CardHeader>
            <CardTitle>Score vs Popularity</CardTitle>
            <CardDescription>
              Correlation between recommendation scores and item popularity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <ScatterChart data={data.items}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  type="number"
                  dataKey="score"
                  domain={[0.7, 1]}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  name="Score"
                />
                <YAxis 
                  type="number"
                  dataKey="popularity"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  name="Popularity"
                />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px"
                  }}
                  formatter={(value, name) => [value, name === 'score' ? 'Score' : 'Popularity %']}
                  labelFormatter={(label) => `Item: ${label}`}
                />
                <Scatter dataKey="popularity" fill="hsl(var(--primary))" />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
          <CardDescription>
            Key metrics and trends for current recommendation session
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Average Score</span>
                <span className="font-medium">84.2%</span>
              </div>
              <Progress value={84.2} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Category Diversity</span>
                <span className="font-medium">75%</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Revenue Potential</span>
                <span className="font-medium">92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}