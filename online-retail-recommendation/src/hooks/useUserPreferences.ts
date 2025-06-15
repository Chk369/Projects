import { useState, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

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
  created_at?: string
  updated_at?: string
}

const DEFAULT_PREFERENCES: UserPreference = {
  preferred_categories: [],
  price_range_min: 0,
  price_range_max: 1000,
  preferred_methods: ['hybrid'],
  default_sort_by: 'score',
  default_sort_order: 'desc',
  max_results: 10
}

// Fetch user preferences
export const useUserPreferences = () => {
  return useQuery({
    queryKey: ['userPreferences'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return DEFAULT_PREFERENCES

      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (error) {
        console.error('Error fetching user preferences:', error)
        return DEFAULT_PREFERENCES
      }

      return data || DEFAULT_PREFERENCES
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Save user preferences
export const useSaveUserPreferences = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (preferences: UserPreference) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('User must be logged in to save preferences')
      }

      const preferencesData = {
        user_id: user.id,
        preferred_categories: preferences.preferred_categories,
        price_range_min: preferences.price_range_min,
        price_range_max: preferences.price_range_max,
        preferred_methods: preferences.preferred_methods,
        default_sort_by: preferences.default_sort_by,
        default_sort_order: preferences.default_sort_order,
        max_results: preferences.max_results
      }

      const { data, error } = await supabase
        .from('user_preferences')
        .upsert(preferencesData, {
          onConflict: 'user_id'
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPreferences'] })
      toast({
        title: "Success",
        description: "Your preferences have been saved successfully"
      })
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save preferences"
      })
    }
  })
}

// Hook for managing preferences state with local changes
export const usePreferencesManager = () => {
  const { data: savedPreferences, isLoading } = useUserPreferences()
  const savePreferences = useSaveUserPreferences()
  const [localPreferences, setLocalPreferences] = useState<UserPreference>(DEFAULT_PREFERENCES)

  useEffect(() => {
    if (savedPreferences) {
      setLocalPreferences(savedPreferences)
    }
  }, [savedPreferences])

  const updatePreferences = (preferences: UserPreference) => {
    setLocalPreferences(preferences)
  }

  const saveToDatabase = () => {
    savePreferences.mutate(localPreferences)
  }

  const resetToDefaults = () => {
    setLocalPreferences(DEFAULT_PREFERENCES)
  }

  const resetToSaved = () => {
    if (savedPreferences) {
      setLocalPreferences(savedPreferences)
    }
  }

  return {
    preferences: localPreferences,
    savedPreferences,
    isLoading,
    isSaving: savePreferences.isPending,
    updatePreferences,
    saveToDatabase,
    resetToDefaults,
    resetToSaved,
    hasUnsavedChanges: JSON.stringify(localPreferences) !== JSON.stringify(savedPreferences)
  }
}