import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpenIcon, ImageIcon } from "lucide-react"
import { Link } from "react-router-dom"

const Home = () => {
  const stats = [
    { title: "Total Users", value: "12,547", description: "Active customers" },
    { title: "Products", value: "4,070", description: "Items in catalog" },
    { title: "Avg. Recommendations", value: "8.3", description: "Per user session" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Your Personalized <span className="text-primary">Shopping</span> Experience
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Discover products tailored to your preferences with our advanced recommendation engine. 
              Get intelligent suggestions based on your purchase history and browsing behavior.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg">
                <Link to="/recommendations">
                  Get Recommendations
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link to="/about">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <CardTitle className="text-3xl font-bold">{stat.value}</CardTitle>
                  <CardDescription className="text-lg font-medium">{stat.title}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Intelligent Recommendations
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Our system uses multiple algorithms to provide the most relevant product suggestions.
            </p>
          </div>
          
          <div className="mx-auto mt-16 max-w-5xl">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <BookOpenIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 font-semibold">Collaborative Filtering</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Recommendations based on similar users' preferences
                </p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <ImageIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 font-semibold">Content-Based</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Suggestions based on product characteristics
                </p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <BookOpenIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 font-semibold">Hybrid Model</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Combined approach for optimal accuracy
                </p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <ImageIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 font-semibold">Social Influence</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Network-based collaborative recommendations
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home