'use client'

/**
 * Team Context Provider
 * =============================================================================
 * Manages team state across the app
 */

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import type { Team, TeamRole } from '@/types/supabase'
import {
  getUserTeams,
  createTeam as createTeamService,
  updateTeam as updateTeamService,
  deleteTeam as deleteTeamService,
  getUserRoleInTeam,
  canEdit as canEditCheck,
  canManageTeam as canManageTeamCheck,
  isOwner as isOwnerCheck,
} from '@/services/teamService'

const SELECTED_TEAM_KEY = 'traq-selected-team'

interface TeamState {
  teams: Team[]
  currentTeam: Team | null
  currentRole: TeamRole | null
  isLoading: boolean
  error: string | null
}

interface TeamContextType extends TeamState {
  // Team selection
  selectTeam: (teamId: string | null) => Promise<void>

  // Team CRUD
  createTeam: (name: string, description?: string) => Promise<{ data: Team | null; error: Error | null }>
  updateTeam: (teamId: string, updates: { name?: string; description?: string }) => Promise<{ error: Error | null }>
  deleteTeam: (teamId: string) => Promise<{ error: Error | null }>

  // Refresh
  refreshTeams: () => Promise<void>

  // Permission helpers
  canEdit: boolean
  canManageTeam: boolean
  isOwner: boolean
}

const TeamContext = createContext<TeamContextType | undefined>(undefined)

export function TeamProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  const [state, setState] = useState<TeamState>({
    teams: [],
    currentTeam: null,
    currentRole: null,
    isLoading: true,
    error: null,
  })

  // Load teams when authenticated
  const loadTeams = useCallback(async () => {
    if (!isAuthenticated) {
      setState({
        teams: [],
        currentTeam: null,
        currentRole: null,
        isLoading: false,
        error: null,
      })
      return
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    const { data: teams, error } = await getUserTeams()

    if (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message,
      }))
      return
    }

    // Try to restore previously selected team
    const savedTeamId = localStorage.getItem(SELECTED_TEAM_KEY)
    let selectedTeam: Team | null = null
    let selectedRole: TeamRole | null = null

    if (savedTeamId && teams) {
      selectedTeam = teams.find(t => t.id === savedTeamId) || null
    }

    // If no saved team or saved team not found, select first team
    if (!selectedTeam && teams && teams.length > 0) {
      selectedTeam = teams[0]
    }

    // Get role for selected team
    if (selectedTeam) {
      const { data: role } = await getUserRoleInTeam(selectedTeam.id)
      selectedRole = role
      localStorage.setItem(SELECTED_TEAM_KEY, selectedTeam.id)
    }

    setState({
      teams: teams || [],
      currentTeam: selectedTeam,
      currentRole: selectedRole,
      isLoading: false,
      error: null,
    })
  }, [isAuthenticated])

  // Load teams on auth change
  useEffect(() => {
    if (!authLoading) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- valid data loading pattern
      loadTeams()
    }
  }, [authLoading, loadTeams])

  // Select a team
  const selectTeam = useCallback(async (teamId: string | null) => {
    if (!teamId) {
      localStorage.removeItem(SELECTED_TEAM_KEY)
      setState(prev => ({
        ...prev,
        currentTeam: null,
        currentRole: null,
      }))
      return
    }

    const team = state.teams.find(t => t.id === teamId)
    if (!team) return

    const { data: role } = await getUserRoleInTeam(teamId)

    localStorage.setItem(SELECTED_TEAM_KEY, teamId)
    setState(prev => ({
      ...prev,
      currentTeam: team,
      currentRole: role,
    }))
  }, [state.teams])

  // Create team
  const createTeam = useCallback(async (name: string, description?: string) => {
    const result = await createTeamService(name, description)

    if (result.data) {
      // Refresh teams list and select the new team
      await loadTeams()
      await selectTeam(result.data.id)
    }

    return result
  }, [loadTeams, selectTeam])

  // Update team
  const updateTeam = useCallback(async (teamId: string, updates: { name?: string; description?: string }) => {
    const result = await updateTeamService(teamId, updates)

    if (!result.error) {
      // Update local state
      setState(prev => ({
        ...prev,
        teams: prev.teams.map(t =>
          t.id === teamId ? { ...t, ...updates } : t
        ),
        currentTeam: prev.currentTeam?.id === teamId
          ? { ...prev.currentTeam, ...updates }
          : prev.currentTeam,
      }))
    }

    return result
  }, [])

  // Delete team
  const deleteTeam = useCallback(async (teamId: string) => {
    const result = await deleteTeamService(teamId)

    if (!result.error) {
      // Remove from local state
      const newTeams = state.teams.filter(t => t.id !== teamId)

      setState(prev => ({
        ...prev,
        teams: newTeams,
        currentTeam: prev.currentTeam?.id === teamId
          ? (newTeams[0] || null)
          : prev.currentTeam,
      }))

      // Update selected team if needed
      if (state.currentTeam?.id === teamId) {
        if (newTeams.length > 0) {
          await selectTeam(newTeams[0].id)
        } else {
          localStorage.removeItem(SELECTED_TEAM_KEY)
        }
      }
    }

    return result
  }, [state.teams, state.currentTeam, selectTeam])

  // Refresh teams
  const refreshTeams = useCallback(async () => {
    await loadTeams()
  }, [loadTeams])

  // Permission helpers
  const canEdit = canEditCheck(state.currentRole)
  const canManageTeam = canManageTeamCheck(state.currentRole)
  const isOwner = isOwnerCheck(state.currentRole)

  const value: TeamContextType = {
    ...state,
    selectTeam,
    createTeam,
    updateTeam,
    deleteTeam,
    refreshTeams,
    canEdit,
    canManageTeam,
    isOwner,
  }

  return (
    <TeamContext.Provider value={value}>
      {children}
    </TeamContext.Provider>
  )
}

export function useTeam() {
  const context = useContext(TeamContext)
  if (context === undefined) {
    throw new Error('useTeam must be used within a TeamProvider')
  }
  return context
}
