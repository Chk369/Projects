import { useAnalytics, usePrefetchAnalytics } from "@/hooks/useApi"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MetricsDashboard } from "@/components/ui/metrics-dashboard"
import { RecommendationAnalytics } from "@/components/ui/recommendation-analytics"
import { SocialGraph } from "@/components/ui/social-graph"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { CalendarIcon, DownloadIcon, RefreshCwIcon, ArrowLeft } from "lucide-react"
import { useState, useEffect } from "react"
import { AnalyticsRequest } from "@/types/api"
import { Skeleton } from "@/components/ui/skeleton"

const AnalyticsWithApi = () => {
  const navigate = useNavigate()
  const [timeRange, setTimeRange] = useState<AnalyticsRequest['time_range']>("7d")
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  
  const prefetchAnalytics = usePrefetchAnalytics()
  
  const analyticsParams: AnalyticsRequest = { time_range: timeRange }
  const { 
    data: analyticsData, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useAnalytics(analyticsParams)

  // Prefetch other time ranges
  useEffect(() => {
    const timeRanges: AnalyticsRequest['time_range'][] = ['1d', '30d', '90d']
    timeRanges.forEach(range => {
      if (range !== timeRange) {
        prefetchAnalytics({ time_range: range })
      }
    })
  }, [timeRange, prefetchAnalytics])

  const handleRefresh = async () => {
    await refetch()
    setLastRefresh(new Date())
  }

  const handleExport = () => {
    if (!analyticsData) return
    
    const dataStr = JSON.stringify(analyticsData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  // Mock social graph data for demonstration
  const socialNodes = [
    { id: "user1", label: "High Value", size: 1.2, color: "hsl(var(--primary))" },
    { id: "user2", label: "Regular", size: 1.0, color: "hsl(var(--secondary))" },
    { id: "user3", label: "New User", size: 0.8, color: "hsl(var(--secondary))" },
    { id: "user4", label: "Frequent", size: 0.9, color: "hsl(var(--secondary))" },
    { id: "user5", label: "Occasional", size: 0.7, color: "hsl(var(--secondary))" }
  ]

  const socialEdges = [
    { source: "user1", target: "user2", weight: 0.8 },
    { source: "user1", target: "user3", weight: 0.6 },
    { source: "user2", target: "user4", weight: 0.7 },
    { source: "user3", target: "user5", weight: 0.5 },
    { source: "user1", target: "user4", weight: 0.4 }
  ]

  if (isError) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <div className="flex items-center justify-between mb-8">
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
                <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
                <p className="mt-2 text-muted-foreground">
                  Real-time insights into recommendation system performance and user behavior.
                </p>
              </div>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <h2 className="text-lg font-semibold text-destructive mb-2">Failed to Load Analytics</h2>
                <p className="text-muted-foreground mb-4">
                  {error?.message || "Unable to connect to analytics API. The service may be temporarily unavailable."}
                </p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={handleRefresh} variant="outline">
                    <RefreshCwIcon className="h-4 w-4 mr-2" />
                    Retry
                  </Button>
                  <Button onClick={() => navigate(-1)} variant="secondary">
                    Go Back
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
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
              <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="mt-2 text-muted-foreground">
              Real-time insights into recommendation system performance and user behavior.
            </p>
              <p className="text-xs text-muted-foreground mt-1">
                Last updated: {lastRefresh.toLocaleTimeString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Select value={timeRange} onValueChange={(value: AnalyticsRequest['time_range']) => setTimeRange(value)}>
              <SelectTrigger className="w-[180px]">
                <CalendarIcon className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCwIcon className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleExport} disabled={!analyticsData}>
              <DownloadIcon className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="social">Social Graph</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {isLoading ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i}>
                    <CardHeader className="pb-2">
                      <Skeleton className="h-4 w-24" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-8 w-16 mb-2" />
                      <Skeleton className="h-3 w-20" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : analyticsData ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.usage_stats.total_requests.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">+12.5%</span> from last period
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.usage_stats.active_users.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">+8.2%</span> from last period
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.usage_stats.avg_response_time_ms}ms</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">-5ms</span> from last period
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Revenue Impact</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${analyticsData.usage_stats.revenue_impact.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">+23.1%</span> from last period
                    </p>
                  </CardContent>
                </Card>
              </div>
            ) : null}

            <MetricsDashboard data={analyticsData ? {
              performance: [
                { method: 'CF', precision: analyticsData.performance_metrics.precision_at_10, recall: analyticsData.performance_metrics.recall_at_10, f1: analyticsData.performance_metrics.f1_score },
                { method: 'CB', precision: 0.72, recall: 0.81, f1: 0.76 },
                { method: 'Hybrid', precision: 0.89, recall: 0.84, f1: 0.86 },
                { method: 'Social', precision: 0.87, recall: 0.82, f1: 0.84 }
              ],
              usage: analyticsData.trends,
              recommendations: analyticsData.category_distribution
            } : undefined} />
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            {isLoading ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-48" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : analyticsData ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Model Accuracy</CardTitle>
                    <CardDescription>Current precision and recall metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Precision@10</span>
                          <span className="font-medium">{(analyticsData.performance_metrics.precision_at_10 * 100).toFixed(1)}%</span>
                        </div>
                        <div className="mt-1 h-2 bg-muted rounded-full">
                          <div 
                            className="h-full bg-primary rounded-full" 
                            style={{ width: `${analyticsData.performance_metrics.precision_at_10 * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Recall@10</span>
                          <span className="font-medium">{(analyticsData.performance_metrics.recall_at_10 * 100).toFixed(1)}%</span>
                        </div>
                        <div className="mt-1 h-2 bg-muted rounded-full">
                          <div 
                            className="h-full bg-secondary rounded-full" 
                            style={{ width: `${analyticsData.performance_metrics.recall_at_10 * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>User Engagement</CardTitle>
                    <CardDescription>Interaction and conversion rates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Click Rate</span>
                          <span className="font-medium">{(analyticsData.performance_metrics.click_through_rate * 100).toFixed(1)}%</span>
                        </div>
                        <div className="mt-1 h-2 bg-muted rounded-full">
                          <div 
                            className="h-full bg-orange-500 rounded-full" 
                            style={{ width: `${analyticsData.performance_metrics.click_through_rate * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Conversion Rate</span>
                          <span className="font-medium">{(analyticsData.performance_metrics.conversion_rate * 100).toFixed(1)}%</span>
                        </div>
                        <div className="mt-1 h-2 bg-muted rounded-full">
                          <div 
                            className="h-full bg-purple-500 rounded-full" 
                            style={{ width: `${analyticsData.performance_metrics.conversion_rate * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>System Health</CardTitle>
                    <CardDescription>Infrastructure and response metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between text-sm">
                          <span>API Uptime</span>
                          <span className="font-medium">99.97%</span>
                        </div>
                        <div className="mt-1 h-2 bg-muted rounded-full">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: '99.97%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Avg Response</span>
                          <span className="font-medium">{analyticsData.usage_stats.avg_response_time_ms}ms</span>
                        </div>
                        <div className="mt-1 h-2 bg-muted rounded-full">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : null}

            <MetricsDashboard data={analyticsData ? {
              performance: [
                { method: 'CF', precision: analyticsData.performance_metrics.precision_at_10, recall: analyticsData.performance_metrics.recall_at_10, f1: analyticsData.performance_metrics.f1_score },
                { method: 'CB', precision: 0.72, recall: 0.81, f1: 0.76 },
                { method: 'Hybrid', precision: 0.89, recall: 0.84, f1: 0.86 },
                { method: 'Social', precision: 0.87, recall: 0.82, f1: 0.84 }
              ],
              usage: analyticsData.trends,
              recommendations: analyticsData.category_distribution
            } : undefined} />
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <RecommendationAnalytics />
          </TabsContent>

          <TabsContent value="social" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <SocialGraph 
                nodes={socialNodes} 
                edges={socialEdges}
                width={400}
                height={300}
              />
              
              <Card>
                <CardHeader>
                  <CardTitle>Social Influence Metrics</CardTitle>
                  <CardDescription>
                    Impact of social connections on recommendation performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-2">Network Statistics</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Total Nodes:</span>
                          <span className="font-medium ml-2">{socialNodes.length}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Total Edges:</span>
                          <span className="font-medium ml-2">{socialEdges.length}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Avg. Degree:</span>
                          <span className="font-medium ml-2">2.0</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Density:</span>
                          <span className="font-medium ml-2">0.5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default AnalyticsWithApi