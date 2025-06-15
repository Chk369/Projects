import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MetricsDashboard } from "@/components/ui/metrics-dashboard"
import { RecommendationAnalytics } from "@/components/ui/recommendation-analytics"
import { SocialGraph } from "@/components/ui/social-graph"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { CalendarIcon, DownloadIcon } from "lucide-react"

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("7d")

  // Mock social graph data
  const socialNodes = [
    { id: "user1", label: "Customer A", size: 1.2, color: "hsl(var(--primary))" },
    { id: "user2", label: "Customer B", size: 1.0, color: "hsl(var(--secondary))" },
    { id: "user3", label: "Customer C", size: 0.8, color: "hsl(var(--secondary))" },
    { id: "user4", label: "Customer D", size: 0.9, color: "hsl(var(--secondary))" },
    { id: "user5", label: "Customer E", size: 0.7, color: "hsl(var(--secondary))" }
  ]

  const socialEdges = [
    { source: "user1", target: "user2", weight: 0.8 },
    { source: "user1", target: "user3", weight: 0.6 },
    { source: "user2", target: "user4", weight: 0.7 },
    { source: "user3", target: "user5", weight: 0.5 },
    { source: "user1", target: "user4", weight: 0.4 }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="mt-2 text-muted-foreground">
              Comprehensive insights into recommendation system performance and user behavior.
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
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
            
            <Button variant="outline" size="sm">
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
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24,531</div>
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
                  <div className="text-2xl font-bold">2,847</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">+8.2%</span> from last period
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Avg Session Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4m 32s</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">+15.3%</span> from last period
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Revenue Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$47,892</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">+23.1%</span> from last period
                  </p>
                </CardContent>
              </Card>
            </div>

            <MetricsDashboard />
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
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
                        <span className="font-medium">89.2%</span>
                      </div>
                      <div className="mt-1 h-2 bg-muted rounded-full">
                        <div className="h-full bg-primary rounded-full" style={{ width: '89.2%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Recall@10</span>
                        <span className="font-medium">84.7%</span>
                      </div>
                      <div className="mt-1 h-2 bg-muted rounded-full">
                        <div className="h-full bg-secondary rounded-full" style={{ width: '84.7%' }}></div>
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
                        <span>Cache Hit Rate</span>
                        <span className="font-medium">94.3%</span>
                      </div>
                      <div className="mt-1 h-2 bg-muted rounded-full">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '94.3%' }}></div>
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
                        <span className="font-medium">12.8%</span>
                      </div>
                      <div className="mt-1 h-2 bg-muted rounded-full">
                        <div className="h-full bg-orange-500 rounded-full" style={{ width: '12.8%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Conversion Rate</span>
                        <span className="font-medium">8.9%</span>
                      </div>
                      <div className="mt-1 h-2 bg-muted rounded-full">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: '8.9%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <MetricsDashboard />
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
                          <span className="font-medium ml-2">5</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Total Edges:</span>
                          <span className="font-medium ml-2">5</span>
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
                    
                    <div>
                      <h4 className="font-medium mb-2">Influence Scores</h4>
                      <div className="space-y-2">
                        {socialNodes.map((node, index) => (
                          <div key={node.id} className="flex items-center justify-between text-sm">
                            <span>{node.label}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-2 bg-muted rounded-full">
                                <div 
                                  className="h-full bg-primary rounded-full" 
                                  style={{ width: `${node.size * 80}%` }}
                                ></div>
                              </div>
                              <span className="font-medium w-10">{Math.round(node.size * 100)}%</span>
                            </div>
                          </div>
                        ))}
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

export default Analytics