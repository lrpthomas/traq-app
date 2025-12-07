/**
 * Team Service
 * =============================================================================
 * CRUD operations for teams and team members
 */

import { getSupabaseClient } from '@/lib/supabase/client'
import type { Team, TeamMember, TeamRole, User } from '@/types/supabase'

export interface TeamWithMembers extends Team {
  members: (TeamMember & { user: User })[]
  memberCount: number
}

export interface TeamInvite {
  id: string
  team_id: string
  email: string
  role: TeamRole
  invited_by: string
  created_at: string
  expires_at: string
}

// =============================================================================
// TEAM CRUD
// =============================================================================

/**
 * Get all teams the current user belongs to
 */
export async function getUserTeams(): Promise<{ data: Team[] | null; error: Error | null }> {
  const supabase = getSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { data: null, error: new Error('Not authenticated') }
  }

  // Get teams where user is owner or member
  const { data: memberTeams, error: memberError } = await supabase
    .from('team_members')
    .select('team_id')
    .eq('user_id', user.id)

  if (memberError) {
    return { data: null, error: memberError as Error }
  }

  const teamIds = (memberTeams as { team_id: string }[] | null)?.map(m => m.team_id) || []

  // Also include teams user owns directly
  const { data: ownedTeams, error: ownedError } = await supabase
    .from('teams')
    .select('*')
    .eq('owner_id', user.id)

  if (ownedError) {
    return { data: null, error: ownedError as Error }
  }

  // Get member teams
  let allTeams = (ownedTeams as Team[] | null) || []

  if (teamIds.length > 0) {
    const { data: teams, error: teamsError } = await supabase
      .from('teams')
      .select('*')
      .in('id', teamIds)

    if (teamsError) {
      return { data: null, error: teamsError as Error }
    }

    // Merge and deduplicate
    const teamMap = new Map<string, Team>()
    allTeams.forEach(t => teamMap.set(t.id, t))
    ;(teams as Team[] | null)?.forEach(t => teamMap.set(t.id, t))
    allTeams = Array.from(teamMap.values())
  }

  return { data: allTeams, error: null }
}

/**
 * Get a single team with its members
 */
export async function getTeamWithMembers(teamId: string): Promise<{ data: TeamWithMembers | null; error: Error | null }> {
  const supabase = getSupabaseClient()

  const { data: team, error: teamError } = await supabase
    .from('teams')
    .select('*')
    .eq('id', teamId)
    .single()

  if (teamError) {
    return { data: null, error: teamError as Error }
  }

  // Get members with user info
  const { data: members, error: membersError } = await supabase
    .from('team_members')
    .select(`
      *,
      user:users(*)
    `)
    .eq('team_id', teamId)

  if (membersError) {
    return { data: null, error: membersError as Error }
  }

  const teamData = team as Team

  return {
    data: {
      ...teamData,
      members: members as (TeamMember & { user: User })[],
      memberCount: members?.length || 0,
    },
    error: null,
  }
}

/**
 * Create a new team
 */
export async function createTeam(
  name: string,
  description?: string
): Promise<{ data: Team | null; error: Error | null }> {
  const supabase = getSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { data: null, error: new Error('Not authenticated') }
  }

  // Create team
  const { data: teamData, error: teamError } = await supabase
    .from('teams')
    .insert({
      name,
      description: description || null,
      owner_id: user.id,
    } as never)
    .select()
    .single()

  if (teamError) {
    return { data: null, error: teamError as Error }
  }

  const team = teamData as Team

  // Add owner as team member with 'owner' role
  const { error: memberError } = await supabase
    .from('team_members')
    .insert({
      team_id: team.id,
      user_id: user.id,
      role: 'owner',
      invited_by: user.id,
    } as never)

  if (memberError) {
    console.error('Error adding owner to team:', memberError)
  }

  return { data: team, error: null }
}

/**
 * Update a team
 */
export async function updateTeam(
  teamId: string,
  updates: { name?: string; description?: string }
): Promise<{ error: Error | null }> {
  const supabase = getSupabaseClient()

  const { error } = await supabase
    .from('teams')
    .update(updates as never)
    .eq('id', teamId)

  return { error: error as Error | null }
}

/**
 * Delete a team (owner only)
 */
export async function deleteTeam(teamId: string): Promise<{ error: Error | null }> {
  const supabase = getSupabaseClient()

  const { error } = await supabase
    .from('teams')
    .delete()
    .eq('id', teamId)

  return { error: error as Error | null }
}

// =============================================================================
// TEAM MEMBERS
// =============================================================================

/**
 * Get team members
 */
export async function getTeamMembers(teamId: string): Promise<{ data: (TeamMember & { user: User })[] | null; error: Error | null }> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from('team_members')
    .select(`
      *,
      user:users(*)
    `)
    .eq('team_id', teamId)
    .order('joined_at', { ascending: true })

  return { data: data as (TeamMember & { user: User })[] | null, error: error as Error | null }
}

/**
 * Add a member to a team
 */
export async function addTeamMember(
  teamId: string,
  userId: string,
  role: TeamRole = 'viewer'
): Promise<{ error: Error | null }> {
  const supabase = getSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: new Error('Not authenticated') }
  }

  const { error } = await supabase
    .from('team_members')
    .insert({
      team_id: teamId,
      user_id: userId,
      role,
      invited_by: user.id,
    } as never)

  return { error: error as Error | null }
}

/**
 * Update a team member's role
 */
export async function updateMemberRole(
  teamId: string,
  userId: string,
  role: TeamRole
): Promise<{ error: Error | null }> {
  const supabase = getSupabaseClient()

  const { error } = await supabase
    .from('team_members')
    .update({ role } as never)
    .eq('team_id', teamId)
    .eq('user_id', userId)

  return { error: error as Error | null }
}

/**
 * Remove a member from a team
 */
export async function removeTeamMember(
  teamId: string,
  userId: string
): Promise<{ error: Error | null }> {
  const supabase = getSupabaseClient()

  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('team_id', teamId)
    .eq('user_id', userId)

  return { error: error as Error | null }
}

/**
 * Leave a team
 */
export async function leaveTeam(teamId: string): Promise<{ error: Error | null }> {
  const supabase = getSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: new Error('Not authenticated') }
  }

  // Check if user is owner
  const { data: team } = await supabase
    .from('teams')
    .select('owner_id')
    .eq('id', teamId)
    .single()

  const teamData = team as { owner_id: string } | null
  if (teamData?.owner_id === user.id) {
    return { error: new Error('Team owner cannot leave. Transfer ownership or delete the team.') }
  }

  return removeTeamMember(teamId, user.id)
}

/**
 * Get the current user's role in a team
 */
export async function getUserRoleInTeam(teamId: string): Promise<{ data: TeamRole | null; error: Error | null }> {
  const supabase = getSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { data: null, error: new Error('Not authenticated') }
  }

  const { data, error } = await supabase
    .from('team_members')
    .select('role')
    .eq('team_id', teamId)
    .eq('user_id', user.id)
    .single()

  const memberData = data as { role: TeamRole } | null
  return { data: memberData?.role || null, error: error as Error | null }
}

// =============================================================================
// INVITATIONS (using email-based system)
// =============================================================================

/**
 * Invite a user to a team by email
 * Note: This creates a pending team member entry or sends an invite
 */
export async function inviteToTeam(
  teamId: string,
  email: string,
  role: TeamRole = 'viewer'
): Promise<{ error: Error | null }> {
  const supabase = getSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: new Error('Not authenticated') }
  }

  // Check if user exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single()

  const userData = existingUser as { id: string } | null
  if (userData) {
    // User exists, add them directly
    return addTeamMember(teamId, userData.id, role)
  }

  // User doesn't exist yet - we would typically store the invite
  // For now, return an error suggesting the user needs to sign up first
  return { error: new Error('User not found. They need to create an account first.') }
}

// =============================================================================
// PERMISSION HELPERS
// =============================================================================

/**
 * Check if user can edit in this team
 */
export function canEdit(role: TeamRole | null): boolean {
  return role === 'owner' || role === 'admin' || role === 'editor'
}

/**
 * Check if user can manage team settings
 */
export function canManageTeam(role: TeamRole | null): boolean {
  return role === 'owner' || role === 'admin'
}

/**
 * Check if user is team owner
 */
export function isOwner(role: TeamRole | null): boolean {
  return role === 'owner'
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: TeamRole): string {
  const names: Record<TeamRole, string> = {
    owner: 'Owner',
    admin: 'Admin',
    editor: 'Editor',
    viewer: 'Viewer',
  }
  return names[role]
}

/**
 * Get role description
 */
export function getRoleDescription(role: TeamRole): string {
  const descriptions: Record<TeamRole, string> = {
    owner: 'Full access, can delete team',
    admin: 'Manage members and settings',
    editor: 'Create and edit assessments',
    viewer: 'View assessments only',
  }
  return descriptions[role]
}
