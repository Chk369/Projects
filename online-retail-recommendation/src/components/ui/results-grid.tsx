import * as React from "react"
import { cn } from "@/lib/utils"
import { RecommendationCard } from "./recommendation-card"
import { Skeleton } from "./skeleton"
import { useFavorites } from "@/hooks/useFavorites"
import { useAuth } from "@/hooks/useAuth"

interface Recommendation {
  stock_code: string
  description: string
  score: number
  imageUrl?: string
}

interface ResultsGridProps extends React.HTMLAttributes<HTMLDivElement> {
  recommendations: Recommendation[]
  loading?: boolean
  onSaveItem?: (stockCode: string) => void
}

export function ResultsGrid({ 
  recommendations, 
  loading = false,
  onSaveItem,
  className,
  ...props 
}: ResultsGridProps) {
  const { user } = useAuth()
  const { isItemSaved, toggleSave } = useFavorites()
  if (loading) {
    return (
      <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", className)} {...props}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-[200px] w-full" />
            <div className="space-y-2 p-4">
              <Skeleton className="h-4 w-[80%]" />
              <Skeleton className="h-4 w-[60%]" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (recommendations.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-12", className)} {...props}>
        <div className="text-center">
          <h3 className="text-lg font-medium text-muted-foreground">No recommendations found</h3>
          <p className="text-sm text-muted-foreground">Try adjusting your search criteria or method.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", className)} {...props}>
      {recommendations.map((rec, index) => (
        <RecommendationCard
          key={`${rec.stock_code}-${index}`}
          title={rec.description}
          imageUrl={rec.imageUrl || `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(rec.description.slice(0, 20))}`}
          score={rec.score}
          stockCode={rec.stock_code}
          onSave={() => onSaveItem?.(rec.stock_code)}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        />
      ))}
    </div>
  )
}