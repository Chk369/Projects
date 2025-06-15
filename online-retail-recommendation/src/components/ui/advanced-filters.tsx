import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, Filter } from "lucide-react"

export interface FilterState {
  categories: string[]
  priceRange: [number, number]
  sortBy: 'score' | 'price' | 'popularity' | 'category'
  sortOrder: 'asc' | 'desc'
  minRating?: number
}

interface AdvancedFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  availableCategories?: string[]
  className?: string
}

const DEFAULT_CATEGORIES = [
  'Electronics', 'Clothing', 'Home & Garden', 'Books', 'Sports',
  'Beauty', 'Toys', 'Automotive', 'Health', 'Food & Beverage'
]

export function AdvancedFilters({
  filters,
  onFiltersChange,
  availableCategories = DEFAULT_CATEGORIES,
  className
}: AdvancedFiltersProps) {
  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category]
    
    onFiltersChange({ ...filters, categories: newCategories })
  }

  const handleClearFilters = () => {
    onFiltersChange({
      categories: [],
      priceRange: [0, 1000],
      sortBy: 'score',
      sortOrder: 'desc'
    })
  }

  const hasActiveFilters = filters.categories.length > 0 || 
    filters.priceRange[0] > 0 || 
    filters.priceRange[1] < 1000 ||
    filters.sortBy !== 'score'

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <CardTitle className="text-base">Advanced Filters</CardTitle>
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-xs"
            >
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Categories */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Categories</Label>
          <div className="flex flex-wrap gap-2">
            {availableCategories.map((category) => (
              <Badge
                key={category}
                variant={filters.categories.includes(category) ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/80 transition-colors"
                onClick={() => handleCategoryToggle(category)}
              >
                {category}
                {filters.categories.includes(category) && (
                  <X className="ml-1 h-3 w-3" />
                )}
              </Badge>
            ))}
          </div>
          {filters.categories.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {filters.categories.length} category{filters.categories.length !== 1 ? 'ies' : ''} selected
            </p>
          )}
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Price Range</Label>
            <span className="text-sm text-muted-foreground">
              ${filters.priceRange[0]} - ${filters.priceRange[1]}
            </span>
          </div>
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => 
              onFiltersChange({ ...filters, priceRange: value as [number, number] })
            }
            max={1000}
            min={0}
            step={10}
            className="w-full"
          />
        </div>

        {/* Sorting */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Sort By</Label>
            <Select
              value={filters.sortBy}
              onValueChange={(value: FilterState['sortBy']) =>
                onFiltersChange({ ...filters, sortBy: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="score">Relevance Score</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="category">Category</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Order</Label>
            <Select
              value={filters.sortOrder}
              onValueChange={(value: FilterState['sortOrder']) =>
                onFiltersChange({ ...filters, sortOrder: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">High to Low</SelectItem>
                <SelectItem value="asc">Low to High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filter Summary */}
        {hasActiveFilters && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              {filters.categories.length > 0 && `${filters.categories.length} categories, `}
              {(filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) && 
                `$${filters.priceRange[0]}-$${filters.priceRange[1]}, `}
              sorted by {filters.sortBy} ({filters.sortOrder === 'desc' ? 'descending' : 'ascending'})
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}