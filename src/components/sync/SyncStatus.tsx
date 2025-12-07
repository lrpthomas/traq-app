'use client'

/**
 * Sync Status Component
 * =============================================================================
 * Displays current sync status and pending count
 * Can be placed in header or as a floating indicator
 */

import { useMemo, useState, useEffect } from 'react'
import { useSync } from '@/hooks/useSync'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Cloud,
  CloudOff,
  RefreshCw,
  Check,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SyncStatusProps {
  variant?: 'compact' | 'full'
  className?: string
}

export function SyncStatus({ variant = 'compact', className }: SyncStatusProps) {
  const { isAuthenticated } = useAuth()
  const {
    status,
    pendingCount,
    lastSyncedAt,
    isOnline,
    isSyncing,
    error,
    triggerSync,
  } = useSync()

  // Use state for current time to avoid impure Date.now() during render
  const [currentTime, setCurrentTime] = useState(() => Date.now())

  // Update time every minute for relative time display
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(Date.now()), 60000)
    return () => clearInterval(interval)
  }, [])

  const lastSyncText = useMemo(() => {
    if (!lastSyncedAt) return 'Never synced'
    const diff = currentTime - lastSyncedAt.getTime()
    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return lastSyncedAt.toLocaleDateString()
  }, [lastSyncedAt, currentTime])

  if (!isAuthenticated) return null

  const getStatusIcon = () => {
    if (!isOnline) {
      return <CloudOff className="h-4 w-4 text-gray-400" />
    }
    if (isSyncing) {
      return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
    }
    if (status === 'error') {
      return <AlertCircle className="h-4 w-4 text-red-500" />
    }
    if (pendingCount > 0) {
      return <RefreshCw className="h-4 w-4 text-amber-500" />
    }
    return <Check className="h-4 w-4 text-green-500" />
  }

  const getStatusText = () => {
    if (!isOnline) return 'Offline'
    if (isSyncing) return 'Syncing...'
    if (status === 'error') return 'Sync error'
    if (pendingCount > 0) return `${pendingCount} pending`
    return 'Synced'
  }

  if (variant === 'compact') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => isOnline && !isSyncing && triggerSync()}
              disabled={!isOnline || isSyncing}
              className={cn('gap-1.5 px-2', className)}
            >
              {getStatusIcon()}
              {pendingCount > 0 && (
                <span className="text-xs font-medium text-amber-600">
                  {pendingCount}
                </span>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-sm">
              <p className="font-medium">{getStatusText()}</p>
              <p className="text-gray-500">{lastSyncText}</p>
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  // Full variant
  return (
    <div className={cn('flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg', className)}>
      <div className="flex items-center gap-2">
        {getStatusIcon()}
        <div>
          <p className="text-sm font-medium">{getStatusText()}</p>
          <p className="text-xs text-gray-500">{lastSyncText}</p>
        </div>
      </div>

      {isOnline && !isSyncing && pendingCount > 0 && (
        <Button
          size="sm"
          variant="outline"
          onClick={triggerSync}
          className="ml-auto"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Sync Now
        </Button>
      )}

      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  )
}

/**
 * Floating sync indicator for mobile
 */
export function SyncFloatingIndicator() {
  const { isAuthenticated } = useAuth()
  const { pendingCount, isSyncing, isOnline, status } = useSync()

  if (!isAuthenticated) return null

  // Only show when there's something to indicate
  if (isOnline && !isSyncing && pendingCount === 0 && status !== 'error') {
    return null
  }

  return (
    <div className="fixed bottom-20 right-4 z-50">
      <div className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-full shadow-lg',
        !isOnline && 'bg-gray-100 text-gray-600',
        isSyncing && 'bg-blue-100 text-blue-700',
        status === 'error' && 'bg-red-100 text-red-700',
        pendingCount > 0 && status !== 'error' && !isSyncing && 'bg-amber-100 text-amber-700'
      )}>
        {!isOnline && <CloudOff className="h-4 w-4" />}
        {isSyncing && <Loader2 className="h-4 w-4 animate-spin" />}
        {status === 'error' && <AlertCircle className="h-4 w-4" />}
        {pendingCount > 0 && status !== 'error' && !isSyncing && (
          <Cloud className="h-4 w-4" />
        )}
        <span className="text-sm font-medium">
          {!isOnline && 'Offline'}
          {isSyncing && 'Syncing...'}
          {status === 'error' && 'Sync error'}
          {pendingCount > 0 && status !== 'error' && !isSyncing && `${pendingCount} pending`}
        </span>
      </div>
    </div>
  )
}
