import * as React from "react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookmarkIcon, ExternalLink } from "lucide-react"

interface RecommendationCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  imageUrl: string
  score: number
  stockCode?: string
  onSave?: () => void
}

export function RecommendationCard({
  title,
  imageUrl,
  score,
  stockCode,
  onSave,
  className,
  ...props
}: RecommendationCardProps) {
  return (
    <Card 
      className={cn("overflow-hidden transition-all hover:shadow-md", className)} 
      {...props}
    >
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={title}
          className="h-[200px] w-full object-cover"
          loading="lazy"
          width={200}
          height={200}
        />
        <Badge 
          className="absolute right-2 top-2 bg-primary/80 text-primary-foreground"
          variant="secondary"
        >
          {Math.round(score * 100)}% Match
        </Badge>
      </div>
      <CardContent className="p-4">
        <div className="space-y-3">
          <h3 className="line-clamp-2 font-medium leading-tight">{title}</h3>
          <div className="flex items-center justify-between gap-2">
            {stockCode && (
              <Button asChild variant="outline" size="sm">
                <Link to={`/product/${stockCode}`}>
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View Details
                </Link>
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0"
              onClick={onSave}
              title="Save item"
            >
              <BookmarkIcon className="h-4 w-4" />
              <span className="sr-only">Save</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}