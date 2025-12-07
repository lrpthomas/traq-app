'use client'

/**
 * Team Selector Component
 * =============================================================================
 * Dropdown to select current team, shown in header
 */

import { useState } from 'react'
import { useTeam } from '@/hooks/useTeam'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Users, ChevronDown, Plus, Settings, Check, Loader2 } from 'lucide-react'
import Link from 'next/link'

export function TeamSelector() {
  const { isAuthenticated } = useAuth()
  const { teams, currentTeam, selectTeam, createTeam, isLoading } = useTeam()
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newTeamName, setNewTeamName] = useState('')
  const [newTeamDescription, setNewTeamDescription] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  if (!isAuthenticated) {
    return null
  }

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) return

    setIsCreating(true)
    setCreateError(null)

    const { error } = await createTeam(newTeamName.trim(), newTeamDescription.trim() || undefined)

    if (error) {
      setCreateError(error.message)
      setIsCreating(false)
    } else {
      setShowCreateDialog(false)
      setNewTeamName('')
      setNewTeamDescription('')
      setIsCreating(false)
    }
  }

  if (isLoading) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        Loading...
      </Button>
    )
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="max-w-[120px] truncate">
              {currentTeam?.name || 'Personal'}
            </span>
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Your Teams</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Personal workspace option */}
          <DropdownMenuItem
            onClick={() => selectTeam(null)}
            className="gap-2"
          >
            <Users className="h-4 w-4" />
            <span className="flex-1">Personal</span>
            {!currentTeam && <Check className="h-4 w-4" />}
          </DropdownMenuItem>

          {/* Team list */}
          {teams.map((team) => (
            <DropdownMenuItem
              key={team.id}
              onClick={() => selectTeam(team.id)}
              className="gap-2"
            >
              <Users className="h-4 w-4" />
              <span className="flex-1 truncate">{team.name}</span>
              {currentTeam?.id === team.id && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />

          {/* Create new team */}
          <DropdownMenuItem
            onClick={() => setShowCreateDialog(true)}
            className="gap-2 text-accent"
          >
            <Plus className="h-4 w-4" />
            <span>Create Team</span>
          </DropdownMenuItem>

          {/* Team settings (if team selected) */}
          {currentTeam && (
            <DropdownMenuItem asChild>
              <Link href="/team/settings" className="gap-2">
                <Settings className="h-4 w-4" />
                <span>Team Settings</span>
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Create Team Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Team</DialogTitle>
            <DialogDescription>
              Create a team to collaborate with others on assessments.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {createError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                {createError}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="team-name">Team Name</Label>
              <Input
                id="team-name"
                placeholder="My Team"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                disabled={isCreating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="team-description">Description (optional)</Label>
              <Textarea
                id="team-description"
                placeholder="What is this team for?"
                value={newTeamDescription}
                onChange={(e) => setNewTeamDescription(e.target.value)}
                disabled={isCreating}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateTeam}
              disabled={!newTeamName.trim() || isCreating}
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Team'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
