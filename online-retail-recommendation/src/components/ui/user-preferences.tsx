import * as React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Settings, Save, RefreshCw, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export interface UserPreference {
  id?: string
  user_id?: string
  preferred_categories: string[]
  price_range_min: number
  price_range_max: number
  preferred_methods: string[]
  default_sort_by: string
  default_sort_order: string
  max_results: number
}

interface UserPreferencesProps {
  preferences?: UserPreference
  onPreferencesChange: (preferences: UserPreference) => void
  onSave?: () => void
  onReset?: () => void
  loading?: boolean
  className?: string
}

const DEFAULT_CATEGORIES = [
  'Electronics', 'Clothing', 'Home & Garden', 'Books', 'Sports',
  'Beauty', 'Toys', 'Automotive', 'Health', 'Food & Beverage'
]

const RECOMMENDATION_METHODS = [
  { value: 'cf', label: 'Collaborative Filtering' },
  { value: 'cb', label: 'Content-Based' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'social', label: 'Social Influence' }
]

export function UserPreferences({
  preferences,
  onPreferencesChange,
  onSave,
  onReset,
  loading = false,
  className
}: UserPreferencesProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { toast } = useToast()

  const currentPrefs: UserPreference = preferences || {
    preferred_categories: [],
    price_range_min: 0,
    price_range_max: 1000,
    preferred_methods: ['hybrid'],
    default_sort_by: 'score',
    default_sort_order: 'desc',
    max_results: 10
  }

  const handleCategoryToggle = (category: string) => {
    const newCategories = currentPrefs.preferred_categories.includes(category)
      ? currentPrefs.preferred_categories.filter(c => c !== category)
      : [...currentPrefs.preferred_categories, category]
    
    onPreferencesChange({
      ...currentPrefs,
      preferred_categories: newCategories
    })
  }

  const handleMethodToggle = (method: string) => {
    const newMethods = currentPrefs.preferred_methods.includes(method)
      ? currentPrefs.preferred_methods.filter(m => m !== method)
      : [...currentPrefs.preferred_methods, method]
    
    if (newMethods.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "At least one recommendation method must be selected"
      })
      return
    }

    onPreferencesChange({
      ...currentPrefs,
      preferred_methods: newMethods
    })
  }

  const handlePriceRangeChange = (value: number[]) => {
    onPreferencesChange({
      ...currentPrefs,
      price_range_min: value[0],
      price_range_max: value[1]
    })
  }

  const handleSave = () => {
    onSave?.()
    toast({
      title: "Preferences Saved",
      description: "Your recommendation preferences have been updated"
    })
  }

  const handleReset = () => {
    onReset?.()
    toast({
      title: "Preferences Reset",
      description: "Your preferences have been reset to defaults"
    })
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <div>
              <CardTitle className="text-base">User Preferences</CardTitle>
              <CardDescription className="text-xs">
                Customize your recommendation experience
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={isExpanded}
              onCheckedChange={setIsExpanded}
              id="expand-preferences"
            />
            <Label htmlFor="expand-preferences" className="text-xs">
              {isExpanded ? 'Collapse' : 'Expand'}
            </Label>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6">
          {/* Preferred Categories */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Preferred Categories</Label>
            <div className="flex flex-wrap gap-2">
              {DEFAULT_CATEGORIES.map((category) => (
                <Badge
                  key={category}
                  variant={currentPrefs.preferred_categories.includes(category) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/80 transition-colors"
                  onClick={() => handleCategoryToggle(category)}
                >
                  {category}
                  {currentPrefs.preferred_categories.includes(category) && (
                    <X className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Preferred Price Range */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Preferred Price Range</Label>
              <span className="text-sm text-muted-foreground">
                ${currentPrefs.price_range_min} - ${currentPrefs.price_range_max}
              </span>
            </div>
            <Slider
              value={[currentPrefs.price_range_min, currentPrefs.price_range_max]}
              onValueChange={handlePriceRangeChange}
              max={1000}
              min={0}
              step={10}
              className="w-full"
            />
          </div>

          <Separator />

          {/* Preferred Methods */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Preferred Recommendation Methods</Label>
            <div className="grid grid-cols-2 gap-2">
              {RECOMMENDATION_METHODS.map((method) => (
                <Badge
                  key={method.value}
                  variant={currentPrefs.preferred_methods.includes(method.value) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/80 transition-colors justify-center p-2"
                  onClick={() => handleMethodToggle(method.value)}
                >
                  {method.label}
                  {currentPrefs.preferred_methods.includes(method.value) && (
                    <X className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Default Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Default Sort</Label>
              <Select
                value={currentPrefs.default_sort_by}
                onValueChange={(value) =>
                  onPreferencesChange({ ...currentPrefs, default_sort_by: value })
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
              <Label className="text-sm font-medium">Sort Order</Label>
              <Select
                value={currentPrefs.default_sort_order}
                onValueChange={(value) =>
                  onPreferencesChange({ ...currentPrefs, default_sort_order: value })
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

          {/* Max Results */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Default Results Count</Label>
              <span className="text-sm text-muted-foreground">{currentPrefs.max_results}</span>
            </div>
            <Slider
              value={[currentPrefs.max_results]}
              onValueChange={(value) =>
                onPreferencesChange({ ...currentPrefs, max_results: value[0] })
              }
              max={50}
              min={5}
              step={5}
              className="w-full"
            />
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={loading}
              className="w-full"
            >
              <Save className="h-3 w-3 mr-1" />
              {loading ? 'Saving...' : 'Save Preferences'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={loading}
              className="w-full"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Reset to Defaults
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}