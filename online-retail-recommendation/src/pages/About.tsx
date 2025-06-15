import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const About = () => {
  const techStack = [
    "React", "TypeScript", "Tailwind CSS", "Shadcn UI",
    "Python", "Scikit-learn", "Surprise", "FastAPI",
    "Postgres", "Redis", "Docker", "Kubernetes"
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">About Shopping Seer</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              An intelligent recommendation system for online retail, delivering personalized 
              product suggestions to boost customer engagement and sales.
            </p>
          </div>

          <div className="space-y-8">
            {/* Architecture Overview */}
            <Card>
              <CardHeader>
                <CardTitle>System Architecture</CardTitle>
                <CardDescription>
                  High-level overview of our recommendation system components
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-64 items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-muted-foreground">Architecture Diagram</h3>
                    <p className="text-sm text-muted-foreground">System flow visualization placeholder</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Technology Stack */}
            <Card>
              <CardHeader>
                <CardTitle>Technology Stack</CardTitle>
                <CardDescription>
                  Modern technologies powering our recommendation engine
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Key Features */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🤝 Collaborative Filtering
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Uses SVD matrix factorization to find patterns in user-item interactions, 
                    recommending products based on similar users' preferences.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    📊 Content-Based Filtering
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Leverages TF-IDF analysis of product descriptions to suggest items 
                    similar to those in a customer's purchase history.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🔄 Hybrid Approach
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Combines collaborative and content-based methods with configurable 
                    weights to optimize recommendation accuracy.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🌐 Social Influence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Incorporates social network analysis to boost recommendations 
                    from customers with similar purchase patterns.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Performance & Metrics</CardTitle>
                <CardDescription>
                  Key performance indicators and success metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">&lt; 200ms</div>
                    <div className="text-sm text-muted-foreground">API Response Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">85%+</div>
                    <div className="text-sm text-muted-foreground">Precision@10</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">10%</div>
                    <div className="text-sm text-muted-foreground">Avg. Basket Increase</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Pipeline */}
            <Card>
              <CardHeader>
                <CardTitle>Data Pipeline</CardTitle>
                <CardDescription>
                  End-to-end data processing and model training workflow
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">Data Ingestion</h4>
                      <p className="text-sm text-muted-foreground">
                        Load and clean historical transaction data from CSV sources
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">Feature Engineering</h4>
                      <p className="text-sm text-muted-foreground">
                        Extract temporal features, compute spend metrics, and build interaction matrices
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium">Model Training</h4>
                      <p className="text-sm text-muted-foreground">
                        Train collaborative filtering and content-based models with cross-validation
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                      4
                    </div>
                    <div>
                      <h4 className="font-medium">API Deployment</h4>
                      <p className="text-sm text-muted-foreground">
                        Serve real-time recommendations through FastAPI with Redis caching
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About