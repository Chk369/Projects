import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CogIcon } from "lucide-react"
import { useMockApi } from "@/lib/mock-api-provider"
import { useToast } from "@/hooks/use-toast"
import { useClearRecommendationCache } from "@/hooks/useApi"

export function ApiConfigDialog() {
  const { toast } = useToast()
  const { apiKey, setApiKey, isConfigured } = useMockApi()
  const [tempApiKey, setTempApiKey] = useState(apiKey)
  const [open, setOpen] = useState(false)
  const clearCache = useClearRecommendationCache()

  const handleSave = () => {
    setApiKey(tempApiKey)
    clearCache()
    toast({
      title: "API Key Saved",
      description: "Your API key has been configured successfully.",
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <CogIcon className="h-4 w-4 mr-2" />
          {isConfigured ? "API Settings" : "Configure API"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>API Configuration</DialogTitle>
          <DialogDescription>
            Enter your API key to connect to the recommendation service. 
            For testing, any non-empty string will work as a valid API key.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="api-key" className="text-right">
              API Key
            </Label>
            <Input
              id="api-key"
              type="password"
              placeholder="Enter your API key"
              className="col-span-3"
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div></div>
            <div className="col-span-3 text-xs text-muted-foreground">
              {isConfigured 
                ? "Your API is currently configured." 
                : "You need to set an API key to use the recommendation system."}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave} disabled={!tempApiKey}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}