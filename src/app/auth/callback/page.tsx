'use client'

/**
 * Auth Callback Page
 * =============================================================================
 * Handles OAuth redirects from Google, Apple, etc.
 * This is a client-side page that works with static export for Capacitor.
 */

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'
import { Suspense } from 'react'

function AuthCallbackHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = getSupabaseClient()

      // Check for error in URL params (from OAuth provider)
      const errorParam = searchParams.get('error')
      const errorDescription = searchParams.get('error_description')

      if (errorParam) {
        setError(errorDescription || errorParam)
        setTimeout(() => {
          router.push(`/login?error=${encodeURIComponent(errorParam)}`)
        }, 2000)
        return
      }

      // Check for auth code
      const code = searchParams.get('code')
      const next = searchParams.get('next') ?? '/'

      if (code) {
        try {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

          if (exchangeError) {
            console.error('Error exchanging code:', exchangeError)
            setError(exchangeError.message)
            setTimeout(() => {
              router.push('/login?error=auth_callback_error')
            }, 2000)
            return
          }

          // Success - redirect to intended destination
          router.push(next)
        } catch (err) {
          console.error('Auth callback error:', err)
          setError('An unexpected error occurred')
          setTimeout(() => {
            router.push('/login?error=auth_callback_error')
          }, 2000)
        }
      } else {
        // No code - check if session already exists (hash fragment auth)
        const { data: { session } } = await supabase.auth.getSession()

        if (session) {
          router.push(next)
        } else {
          // Try to get session from URL hash (for implicit grant flow)
          const hashParams = new URLSearchParams(window.location.hash.substring(1))
          const accessToken = hashParams.get('access_token')

          if (accessToken) {
            // Session should be automatically set by Supabase
            router.push(next)
          } else {
            setError('No authentication code received')
            setTimeout(() => {
              router.push('/login')
            }, 2000)
          }
        }
      }
    }

    handleCallback()
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      {error ? (
        <div className="text-center">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-6 py-4 rounded-lg mb-4">
            {error}
          </div>
          <p className="text-gray-500">Redirecting to login...</p>
        </div>
      ) : (
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Completing sign in...</p>
        </div>
      )}
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
      <p className="text-gray-600 dark:text-gray-400">Loading...</p>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AuthCallbackHandler />
    </Suspense>
  )
}
