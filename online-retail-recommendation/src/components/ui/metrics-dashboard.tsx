import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"

interface MetricsDashboardProps extends React.HTMLAttributes<HTMLDivElement> {
  data?: {
    performance: Array<{ method: string; precision: number; recall: number; f1: number }>
    usage: Array<{ date: string; requests: number; avg_latency?: number; avgLatency?: number }>
    recommendations: Array<{ category: string; count: number; revenue: number }>
  }
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))']

export function MetricsDashboard({ data, className, ...props }: MetricsDashboardProps) {
  const defaultData = {
    performance: [
      { method: 'CF', precision: 0.85, recall: 0.78, f1: 0.81 },
      { method: 'CB', precision: 0.72, recall: 0.81, f1: 0.76 },
      { method: 'Hybrid', precision: 0.89, recall: 0.84, f1: 0.86 },
      { method: 'Social', precision: 0.87, recall: 0.82, f1: 0.84 }
    ],
    usage: [
      { date: '2024-06-10', requests: 1250, avgLatency: 185 },
      { date: '2024-06-11', requests: 1380, avgLatency: 172 },
      { date: '2024-06-12', requests: 1520, avgLatency: 195 },
      { date: '2024-06-13', requests: 1670, avgLatency: 168 },
      { date: '2024-06-14', requests: 1890, avgLatency: 178 }
    ],
    recommendations: [
      { category: 'Home & Garden', count: 450, revenue: 12500 },
      { category: 'Kitchen', count: 320, revenue: 8900 },
      { category: 'Decorative', count: 280, revenue: 7200 },
      { category: 'Gifts', count: 180, revenue: 4800 }
    ]
  }

  const chartData = data || defaultData

  // Normalize the data if needed
  const processedUsageData = chartData.usage.map(item => ({
    ...item,
    avgLatency: item.avgLatency || item.avg_latency || 0
  }))

  return (
    <div className={cn("space-y-6", className)} {...props}>
      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Model Performance Comparison</CardTitle>
          <CardDescription>
            Precision, Recall, and F1-Score by recommendation method
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.performance}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="method" 
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
              <Bar dataKey="precision" fill="hsl(var(--primary))" name="Precision" />
              <Bar dataKey="recall" fill="hsl(var(--secondary))" name="Recall" />
              <Bar dataKey="f1" fill="hsl(var(--accent))" name="F1-Score" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* API Usage Trends */}
        <Card>
          <CardHeader>
            <CardTitle>API Usage & Latency</CardTitle>
            <CardDescription>
              Daily request volume and response times
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={processedUsageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                />
                <YAxis 
                  yAxisId="requests"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                />
                <YAxis 
                  yAxisId="latency"
                  orientation="right"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px"
                  }}
                />
                <Line 
                  yAxisId="requests"
                  type="monotone" 
                  dataKey="requests" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Requests"
                />
                <Line 
                  yAxisId="latency"
                  type="monotone" 
                  dataKey="avgLatency" 
                  stroke="hsl(var(--secondary))" 
                  strokeWidth={2}
                  name="Avg Latency (ms)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Recommendation Categories</CardTitle>
            <CardDescription>
              Distribution of recommended products by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartData.recommendations}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="count"
                  label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                  fontSize={10}
                >
                  {chartData.recommendations.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Click-Through Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">12.3%</div>
            <p className="text-xs text-muted-foreground">+2.1% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">8.7%</div>
            <p className="text-xs text-muted-foreground">+1.3% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">178ms</div>
            <p className="text-xs text-muted-foreground">-5ms from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Revenue Lift</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">15.2%</div>
            <p className="text-xs text-muted-foreground">+3.1% from last week</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}