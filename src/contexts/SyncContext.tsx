'use client'

/**
 * Sync Context Provider
 * =============================================================================
 * Manages sync state across the app, handles background sync,
 * and provides sync status to components
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useTeam } from '@/hooks/useTeam'
import {
  getSyncState,
  processQueue,
  fullSync,
  queueAssessmentSync,
  type SyncState,
  type SyncOperation,
} from '@/services/syncService'
import type { Assessment } from '@/types/traq'
import { getSupabaseClient } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface SyncContextType extends SyncState {
  // Manual sync triggers
  triggerSync: () => Promise<void>
  triggerFullSync: () => Promise<void>

  // Queue operations
  queueAssessment: (assessment: Assessment, operation: SyncOperation) => void

  // Sync progress
  syncProgress: string | null
  isSyncing: boolean
}

const SyncContext = createContext<SyncContextType | undefined>(undefined)

// Sync interval in milliseconds (5 minutes)
const SYNC_INTERVAL = 5 * 60 * 1000

// Retry delay for failed syncs (30 seconds)
const RETRY_DELAY = 30 * 1000

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth()
  const { currentTeam } = useTeam()

  const [state, setState] = useState<SyncState>({
    status: 'idle',
    lastSyncedAt: null,
    pendingCount: 0,
    error: null,
    isOnline: true,
  })

  const [syncProgress, setSyncProgress] = useState<string | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)

  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const realtimeChannelRef = useRef<RealtimeChannel | null>(null)

  // Update state from localStorage
  const refreshState = useCallback(() => {
    const newState = getSyncState()
    setState(prev => ({
      ...prev,
      ...newState,
      status: prev.status, // Keep current status
    }))
  }, [])

  // Initialize state
  useEffect(() => {
    refreshState()
  }, [refreshState])

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => {
      setState(prev => ({ ...prev, isOnline: true, status: 'idle' }))
      // Trigger sync when coming back online
      if (isAuthenticated && user) {
        triggerSync()
      }
    }

    const handleOffline = () => {
      setState(prev => ({ ...prev, isOnline: false, status: 'offline' }))
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [isAuthenticated, user])

  // Trigger sync (push only)
  const triggerSync = useCallback(async () => {
    if (!isAuthenticated || !user || isSyncing || !state.isOnline) return

    setIsSyncing(true)
    setState(prev => ({ ...prev, status: 'syncing', error: null }))
    setSyncProgress('Syncing...')

    try {
      const result = await processQueue(
        user.id,
        currentTeam?.id || null,
        (processed, total) => {
          setSyncProgress(`Syncing ${processed}/${total}...`)
        }
      )

      if (result.failed > 0) {
        setState(prev => ({
          ...prev,
          status: 'error',
          error: `${result.failed} items failed to sync`,
        }))
      } else {
        setState(prev => ({
          ...prev,
          status: 'idle',
          error: null,
        }))
      }

      refreshState()
    } catch (error) {
      setState(prev => ({
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : 'Sync failed',
      }))
    } finally {
      setIsSyncing(false)
      setSyncProgress(null)
    }
  }, [isAuthenticated, user, currentTeam, isSyncing, state.isOnline, refreshState])

  // Trigger full sync (push + pull)
  const triggerFullSync = useCallback(async () => {
    if (!isAuthenticated || !user || isSyncing || !state.isOnline) return

    setIsSyncing(true)
    setState(prev => ({ ...prev, status: 'syncing', error: null }))

    try {
      await fullSync(
        user.id,
        currentTeam?.id || null,
        (status) => setSyncProgress(status)
      )

      setState(prev => ({
        ...prev,
        status: 'idle',
        error: null,
      }))

      refreshState()
    } catch (error) {
      setState(prev => ({
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : 'Sync failed',
      }))
    } finally {
      setIsSyncing(false)
      setSyncProgress(null)
    }
  }, [isAuthenticated, user, currentTeam, isSyncing, state.isOnline, refreshState])

  // Queue assessment for sync
  const queueAssessment = useCallback((assessment: Assessment, operation: SyncOperation) => {
    queueAssessmentSync(assessment, operation)
    refreshState()

    // Trigger sync after a short delay (debounce)
    setTimeout(() => {
      if (state.isOnline && isAuthenticated) {
        triggerSync()
      }
    }, 2000)
  }, [state.isOnline, isAuthenticated, triggerSync, refreshState])

  // Background sync interval
  useEffect(() => {
    if (!isAuthenticated || !state.isOnline) return

    // Initial sync
    triggerSync()

    // Set up interval
    syncIntervalRef.current = setInterval(() => {
      if (state.pendingCount > 0) {
        triggerSync()
      }
    }, SYNC_INTERVAL)

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current)
      }
    }
  }, [isAuthenticated, state.isOnline])

  // Real-time subscriptions
  useEffect(() => {
    if (!isAuthenticated || !user) return

    const supabase = getSupabaseClient()

    // Subscribe to assessment changes
    realtimeChannelRef.current = supabase
      .channel('assessment-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'assessments',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Realtime update:', payload)
          // Could trigger a pull here for the specific assessment
          refreshState()
        }
      )
      .subscribe()

    return () => {
      if (realtimeChannelRef.current) {
        supabase.removeChannel(realtimeChannelRef.current)
      }
    }
  }, [isAuthenticated, user, refreshState])

  const value: SyncContextType = {
    ...state,
    triggerSync,
    triggerFullSync,
    queueAssessment,
    syncProgress,
    isSyncing,
  }

  return (
    <SyncContext.Provider value={value}>
      {children}
    </SyncContext.Provider>
  )
}

export function useSync() {
  const context = useContext(SyncContext)
  if (context === undefined) {
    throw new Error('useSync must be used within a SyncProvider')
  }
  return context
}
