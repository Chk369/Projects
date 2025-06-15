import * as React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { SearchIcon } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface SearchBarProps extends React.HTMLAttributes<HTMLDivElement> {
  onSearch?: (value: string) => void
  placeholder?: string
  suggestions?: string[]
}

export function SearchBar({ 
  onSearch, 
  placeholder = "Search customers or products...", 
  suggestions = [],
  className,
  ...props 
}: SearchBarProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")

  const handleSelect = (selectedValue: string) => {
    setValue(selectedValue)
    setOpen(false)
    onSearch?.(selectedValue)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      onSearch?.(value)
      setOpen(false)
    }
  }

  return (
    <div className={cn("relative w-full", className)} {...props}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="pl-10"
              onFocus={() => suggestions.length > 0 && setOpen(true)}
            />
          </div>
        </PopoverTrigger>
        {suggestions && suggestions.length > 0 && (
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput placeholder={placeholder} value={value} onValueChange={setValue} />
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {suggestions.map((suggestion, index) => (
                  <CommandItem
                    key={index}
                    onSelect={() => handleSelect(suggestion)}
                  >
                    {suggestion}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        )}
      </Popover>
    </div>
  )
}