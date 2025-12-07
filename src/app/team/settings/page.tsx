'use client'

/**
 * Team Settings Page
 * =============================================================================
 * Manage team details, members, and permissions
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTeam } from '@/hooks/useTeam'
import { useAuth } from '@/hooks/useAuth'
import {
  getTeamMembers,
  updateMemberRole,
  removeTeamMember,
  inviteToTeam,
  getRoleDisplayName,
  getRoleDescription,
} from '@/services/teamService'
import type { TeamMember, TeamRole, User } from '@/types/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Users,
  Settings,
  UserPlus,
  Trash2,
  Save,
  Loader2,
  ArrowLeft,
  Crown,
  Shield,
  Edit3,
  Eye,
} from 'lucide-react'
import Link from 'next/link'

const ROLES: TeamRole[] = ['owner', 'admin', 'editor', 'viewer']

const ROLE_ICONS: Record<TeamRole, typeof Crown> = {
  owner: Crown,
  admin: Shield,
  editor: Edit3,
  viewer: Eye,
}

export default function TeamSettingsPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { currentTeam, currentRole, updateTeam, deleteTeam, canManageTeam, isOwner } = useTeam()

  // Team details state
  const [teamName, setTeamName] = useState('')
  const [teamDescription, setTeamDescription] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Members state
  const [members, setMembers] = useState<(TeamMember & { user: User })[]>([])
  const [isLoadingMembers, setIsLoadingMembers] = useState(true)

  // Invite state
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<TeamRole>('viewer')
  const [isInviting, setIsInviting] = useState(false)
  const [inviteError, setInviteError] = useState<string | null>(null)

  // Delete state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  // Load team data
  useEffect(() => {
    if (currentTeam) {
      setTeamName(currentTeam.name)
      setTeamDescription(currentTeam.description || '')
      loadMembers()
    }
  }, [currentTeam])

  const loadMembers = async () => {
    if (!currentTeam) return

    setIsLoadingMembers(true)
    const { data, error } = await getTeamMembers(currentTeam.id)
    if (!error && data) {
      setMembers(data)
    }
    setIsLoadingMembers(false)
  }

  // Handle save team details
  const handleSaveDetails = async () => {
    if (!currentTeam) return

    setIsSaving(true)
    setSaveError(null)
    setSaveSuccess(false)

    const { error } = await updateTeam(currentTeam.id, {
      name: teamName.trim(),
      description: teamDescription.trim() || undefined,
    })

    if (error) {
      setSaveError(error.message)
    } else {
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    }

    setIsSaving(false)
  }

  // Handle invite
  const handleInvite = async () => {
    if (!currentTeam || !inviteEmail.trim()) return

    setIsInviting(true)
    setInviteError(null)

    const { error } = await inviteToTeam(currentTeam.id, inviteEmail.trim(), inviteRole)

    if (error) {
      setInviteError(error.message)
      setIsInviting(false)
    } else {
      setShowInviteDialog(false)
      setInviteEmail('')
      setInviteRole('viewer')
      setIsInviting(false)
      loadMembers()
    }
  }

  // Handle role change
  const handleRoleChange = async (userId: string, newRole: TeamRole) => {
    if (!currentTeam) return

    const { error } = await updateMemberRole(currentTeam.id, userId, newRole)
    if (!error) {
      setMembers(prev =>
        prev.map(m => (m.user_id === userId ? { ...m, role: newRole } : m))
      )
    }
  }

  // Handle remove member
  const handleRemoveMember = async (userId: string) => {
    if (!currentTeam) return

    const { error } = await removeTeamMember(currentTeam.id, userId)
    if (!error) {
      setMembers(prev => prev.filter(m => m.user_id !== userId))
    }
  }

  // Handle delete team
  const handleDeleteTeam = async () => {
    if (!currentTeam || deleteConfirmation !== currentTeam.name) return

    setIsDeleting(true)
    const { error } = await deleteTeam(currentTeam.id)

    if (!error) {
      router.push('/')
    } else {
      setIsDeleting(false)
    }
  }

  // Redirect if not authenticated or no team selected
  if (!isAuthenticated) {
    return (
      <div className="container py-8">
        <p>Please sign in to access team settings.</p>
      </div>
    )
  }

  if (!currentTeam) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="py-8 text-center">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Team Selected</h2>
            <p className="text-gray-600 mb-4">
              Select a team from the header menu or create a new one.
            </p>
            <Button asChild>
              <Link href="/">Go to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!canManageTeam) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="py-8 text-center">
            <Shield className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">
              You don&apos;t have permission to manage this team.
            </p>
            <Button asChild variant="outline">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button asChild variant="ghost" size="icon">
          <Link href="/">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Team Settings</h1>
          <p className="text-gray-600">{currentTeam.name}</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Team Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Team Details
            </CardTitle>
            <CardDescription>
              Update your team&apos;s name and description
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {saveError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {saveError}
              </div>
            )}
            {saveSuccess && (
              <div className="bg-green-50 border border-green-200 text-accent px-4 py-3 rounded-lg text-sm">
                Team details saved successfully!
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="team-name">Team Name</Label>
              <Input
                id="team-name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="My Team"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="team-description">Description</Label>
              <Textarea
                id="team-description"
                value={teamDescription}
                onChange={(e) => setTeamDescription(e.target.value)}
                placeholder="What is this team for?"
                rows={3}
              />
            </div>

            <Button onClick={handleSaveDetails} disabled={isSaving || !teamName.trim()}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Team Members */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team Members
                </CardTitle>
                <CardDescription>
                  Manage who has access to this team
                </CardDescription>
              </div>
              <Button onClick={() => setShowInviteDialog(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Invite Member
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingMembers ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : members.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No members found</p>
            ) : (
              <div className="space-y-3">
                {members.map((member) => {
                  const RoleIcon = ROLE_ICONS[member.role]
                  const isCurrentUserOwner = isOwner
                  const isMemberOwner = member.role === 'owner'

                  return (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                          <span className="text-accent dark:text-green-400 font-medium">
                            {member.user?.display_name?.[0] || member.user?.email?.[0] || '?'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">
                            {member.user?.display_name || member.user?.email || 'Unknown User'}
                          </p>
                          <p className="text-sm text-muted-foreground">{member.user?.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Role selector - disabled for owner or if not owner */}
                        {isCurrentUserOwner && !isMemberOwner ? (
                          <Select
                            value={member.role}
                            onValueChange={(value) => handleRoleChange(member.user_id, value as TeamRole)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {ROLES.filter(r => r !== 'owner').map((role) => (
                                <SelectItem key={role} value={role}>
                                  {getRoleDisplayName(role)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="flex items-center gap-1 text-sm text-gray-600 px-3 py-1 bg-muted dark:bg-gray-700 rounded">
                            <RoleIcon className="h-4 w-4" />
                            {getRoleDisplayName(member.role)}
                          </div>
                        )}

                        {/* Remove button - not for owners */}
                        {isCurrentUserOwner && !isMemberOwner && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleRemoveMember(member.user_id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Danger Zone */}
        {isOwner && (
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible actions that affect your entire team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div>
                  <p className="font-medium">Delete this team</p>
                  <p className="text-sm text-gray-600">
                    This will permanently delete the team and all its data.
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Team
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Invite Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Enter the email address of the person you want to invite.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {inviteError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {inviteError}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="invite-email">Email Address</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="colleague@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                disabled={isInviting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="invite-role">Role</Label>
              <Select
                value={inviteRole}
                onValueChange={(value) => setInviteRole(value as TeamRole)}
                disabled={isInviting}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.filter(r => r !== 'owner').map((role) => (
                    <SelectItem key={role} value={role}>
                      <div>
                        <span className="font-medium">{getRoleDisplayName(role)}</span>
                        <span className="text-muted-foreground ml-2">- {getRoleDescription(role)}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInviteDialog(false)} disabled={isInviting}>
              Cancel
            </Button>
            <Button onClick={handleInvite} disabled={!inviteEmail.trim() || isInviting}>
              {isInviting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Inviting...
                </>
              ) : (
                'Send Invite'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Team</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the team
              <strong> {currentTeam.name}</strong> and all associated data.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="delete-confirmation">
                Type <strong>{currentTeam.name}</strong> to confirm
              </Label>
              <Input
                id="delete-confirmation"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder={currentTeam.name}
                disabled={isDeleting}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteTeam}
              disabled={deleteConfirmation !== currentTeam.name || isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Team'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
