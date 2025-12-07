'use client'

/**
 * Auth Context Provider
 * =============================================================================
 * Provides authentication state and methods throughout the app
 */

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { getSupabaseClient } from '@/lib/supabase/client'
import type { User as DbUser, InsertTables } from '@/types/supabase'

interface AuthState {
  user: User | null
  profile: DbUser | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<{ error: Error | null }>
  signInWithApple: () => Promise<{ error: Error | null }>
  resetPassword: (email: string) => Promise<{ error: Error | null }>
  updateProfile: (updates: Partial<DbUser>) => Promise<{ error: Error | null }>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,
  })

  const supabase = getSupabaseClient()

  // Fetch user profile from our users table
  const fetchProfile = useCallback(async (userId: string): Promise<DbUser | null> => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return null
    }

    return data
  }, [supabase])

  // Create user profile if it doesn't exist
  const ensureProfile = useCallback(async (user: User): Promise<DbUser | null> => {
    // First try to fetch existing profile
    let profile = await fetchProfile(user.id)

    if (!profile) {
      // Create new profile - using type assertion due to @supabase/ssr type inference issues
      const insertData = {
        id: user.id,
        email: user.email!,
        display_name: user.user_metadata?.name || user.user_metadata?.full_name || null,
        avatar_url: user.user_metadata?.avatar_url || null,
      } as InsertTables<'users'>
      const { data, error } = await supabase
        .from('users')
        .insert(insertData as never)
        .select()
        .single()

      if (error) {
        console.error('Error creating profile:', error)
        return null
      }

      profile = data
    }

    return profile
  }, [supabase, fetchProfile])

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        if (session?.user) {
          const profile = await ensureProfile(session.user)
          setState({
            user: session.user,
            profile,
            session,
            isLoading: false,
            isAuthenticated: true,
          })
        } else {
          setState({
            user: null,
            profile: null,
            session: null,
            isLoading: false,
            isAuthenticated: false,
          })
        }
      } catch (error) {
        console.error('Auth init error:', error)
        setState(prev => ({ ...prev, isLoading: false }))
      }
    }

    initAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const profile = await ensureProfile(session.user)
          setState({
            user: session.user,
            profile,
            session,
            isLoading: false,
            isAuthenticated: true,
          })
        } else if (event === 'SIGNED_OUT') {
          setState({
            user: null,
            profile: null,
            session: null,
            isLoading: false,
            isAuthenticated: false,
          })
        } else if (event === 'TOKEN_REFRESHED' && session) {
          setState(prev => ({
            ...prev,
            session,
            user: session.user,
          }))
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, ensureProfile])

  // Sign in with email/password
  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    return { error: error as Error | null }
  }, [supabase])

  // Sign up with email/password
  const signUp = useCallback(async (email: string, password: string, displayName?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: displayName,
        },
      },
    })

    return { error: error as Error | null }
  }, [supabase])

  // Sign out
  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
  }, [supabase])

  // Sign in with Google
  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    return { error: error as Error | null }
  }, [supabase])

  // Sign in with Apple
  const signInWithApple = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    return { error: error as Error | null }
  }, [supabase])

  // Reset password
  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    return { error: error as Error | null }
  }, [supabase])

  // Update user profile
  const updateProfile = useCallback(async (updates: Partial<DbUser>) => {
    if (!state.user) {
      return { error: new Error('Not authenticated') }
    }

    const { error } = await supabase
      .from('users')
      .update(updates as never)
      .eq('id', state.user.id)

    if (!error) {
      setState(prev => ({
        ...prev,
        profile: prev.profile ? { ...prev.profile, ...updates } : null,
      }))
    }

    return { error: error as Error | null }
  }, [supabase, state.user])

  // Refresh session
  const refreshSession = useCallback(async () => {
    const { data: { session } } = await supabase.auth.refreshSession()
    if (session) {
      setState(prev => ({
        ...prev,
        session,
        user: session.user,
      }))
    }
  }, [supabase])

  const value: AuthContextType = {
    ...state,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    signInWithApple,
    resetPassword,
    updateProfile,
    refreshSession,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
