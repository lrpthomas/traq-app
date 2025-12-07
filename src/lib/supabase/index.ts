/**
 * Supabase Client Exports
 * =============================================================================
 * Centralized exports for Supabase clients
 */

// Browser client (for React components)
export { createClient, getSupabaseClient } from './client'

// Server client (for Server Components, Route Handlers, Server Actions)
export { createClient as createServerClient, createServiceClient } from './server'

// Middleware helper
export { updateSession } from './middleware'
