import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'
import { UserPlus, Shield } from 'lucide-react'

interface AdminRoleManagerProps {
  onRoleUpdated?: () => void
}

export const AdminRoleManager = ({ onRoleUpdated }: AdminRoleManagerProps) => {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'admin' | 'user'>('user')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleAssignRole = async () => {
    if (!email.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a valid email address"
      })
      return
    }

    setLoading(true)
    try {
      // Call the admin function to assign role
      const { error } = await supabase
        .rpc('assign_user_role' as any, {
          user_email: email.trim(),
          new_role: role
        })

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: `Failed to assign role: ${error.message}`
        })
      } else {
        toast({
          title: "Success",
          description: `Successfully assigned ${role} role to ${email}`
        })
        setEmail('')
        onRoleUpdated?.()
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Role Management
        </CardTitle>
        <CardDescription>
          Assign admin or user roles to system users
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="user-email">User Email</Label>
          <Input
            id="user-email"
            type="email"
            placeholder="user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="user-role">Role</Label>
          <Select value={role} onValueChange={(value) => setRole(value as 'admin' | 'user')}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleAssignRole} 
          disabled={loading}
          className="w-full gap-2"
        >
          <UserPlus className="h-4 w-4" />
          {loading ? 'Assigning...' : 'Assign Role'}
        </Button>
      </CardContent>
    </Card>
  )
}