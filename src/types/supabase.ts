/**
 * Supabase Database Types
 * =============================================================================
 * Generated types for the TRAQ database schema
 *
 * To regenerate after schema changes:
 *   npm run sync:types
 *
 * Or manually with Supabase CLI:
 *   supabase gen types typescript --project-id pactyosvovffbhhhugox > src/types/supabase.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// =============================================================================
// ENUM TYPES
// =============================================================================

export type AssessmentStatus = 'draft' | 'complete'
export type DataStatus = 'preliminary' | 'final'
export type MediaType = 'photo' | 'video' | 'document'
export type TeamRole = 'owner' | 'admin' | 'editor' | 'viewer'
export type LoadOnDefect = 'n/a' | 'minor' | 'moderate' | 'significant'
export type LikelihoodOfFailure = 'improbable' | 'possible' | 'probable' | 'imminent'
export type LikelihoodOfImpact = 'very-low' | 'low' | 'medium' | 'high'
export type FailureAndImpact = 'unlikely' | 'somewhat' | 'likely' | 'very-likely'
export type Consequences = 'negligible' | 'minor' | 'significant' | 'severe'
export type RiskRating = 'low' | 'moderate' | 'high' | 'extreme'
export type ResidualRiskRating = 'none' | 'low' | 'moderate' | 'high' | 'extreme'
export type TreePart = 'branches' | 'trunk' | 'root-collar' | 'roots' | 'soil'
export type Vigor = 'low' | 'normal' | 'high'
export type WindExposure = 'protected' | 'partial' | 'full'
export type CrownSize = 'small' | 'medium' | 'large'
export type CrownDensity = 'sparse' | 'normal' | 'dense'
export type InteriorBranches = 'few' | 'normal' | 'dense'
export type OccupancyRate = '1' | '2' | '3' | '4'
export type Theme = 'light' | 'dark' | 'system'
export type UnitDiameter = 'in' | 'cm'
export type UnitLength = 'ft' | 'm'

// =============================================================================
// DATABASE INTERFACE
// =============================================================================

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          display_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      teams: {
        Row: {
          id: string
          name: string
          description: string | null
          owner_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          owner_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          owner_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      team_members: {
        Row: {
          id: string
          team_id: string
          user_id: string
          role: TeamRole
          invited_by: string | null
          joined_at: string
        }
        Insert: {
          id?: string
          team_id: string
          user_id: string
          role?: TeamRole
          invited_by?: string | null
          joined_at?: string
        }
        Update: {
          id?: string
          team_id?: string
          user_id?: string
          role?: TeamRole
          invited_by?: string | null
          joined_at?: string
        }
      }
      app_settings: {
        Row: {
          id: string
          user_id: string
          default_time_frame: string
          default_unit_diameter: UnitDiameter
          default_unit_height: UnitLength
          default_unit_distance: UnitLength
          auto_save_interval: number
          enable_memory: boolean
          theme: Theme
          assessor_name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          default_time_frame?: string
          default_unit_diameter?: UnitDiameter
          default_unit_height?: UnitLength
          default_unit_distance?: UnitLength
          auto_save_interval?: number
          enable_memory?: boolean
          theme?: Theme
          assessor_name?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          default_time_frame?: string
          default_unit_diameter?: UnitDiameter
          default_unit_height?: UnitLength
          default_unit_distance?: UnitLength
          auto_save_interval?: number
          enable_memory?: boolean
          theme?: Theme
          assessor_name?: string
          created_at?: string
          updated_at?: string
        }
      }
      field_memories: {
        Row: {
          id: string
          user_id: string
          field_path: string
          value: Json
          enabled: boolean
          last_used: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          field_path: string
          value: Json
          enabled?: boolean
          last_used?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          field_path?: string
          value?: Json
          enabled?: boolean
          last_used?: string
          created_at?: string
          updated_at?: string
        }
      }
      assessments: {
        Row: {
          id: string
          user_id: string
          team_id: string | null
          status: AssessmentStatus
          data_status: DataStatus
          // GPS
          gps_latitude: number | null
          gps_longitude: number | null
          gps_address: string | null
          gps_accuracy: number | null
          gps_timestamp: string | null
          // Header
          header_client: string
          header_date: string
          header_time: string | null
          header_address: string
          header_tree_no: string | null
          header_sheet_number: number
          header_sheet_total: number
          header_tree_species: string | null
          header_dbh: string | null
          header_height: string | null
          header_crown_spread: string | null
          header_assessors: string
          header_tools_used: string | null
          header_time_frame: string
          // Site Factors
          site_history_of_failures: string | null
          site_topography_flat: boolean
          site_topography_slope_percent: number | null
          site_topography_aspect: string | null
          site_changes_none: boolean
          site_changes_grade_change: boolean
          site_changes_clearing: boolean
          site_changes_soil_hydrology: boolean
          site_changes_root_cuts: boolean
          site_changes_describe: string | null
          site_soil_limited_volume: boolean
          site_soil_saturated: boolean
          site_soil_shallow: boolean
          site_soil_compacted: boolean
          site_soil_pavement_percent: number | null
          site_soil_describe: string | null
          site_prevailing_wind: string | null
          site_weather_strong_winds: boolean
          site_weather_ice: boolean
          site_weather_snow: boolean
          site_weather_heavy_rain: boolean
          site_weather_describe: string | null
          // Health
          health_vigor: Vigor | null
          health_foliage_none_seasonal: boolean
          health_foliage_none_dead: boolean
          health_foliage_normal_percent: number | null
          health_foliage_chlorotic_percent: number | null
          health_foliage_necrotic_percent: number | null
          health_pests_biotic: string | null
          health_abiotic: string | null
          health_species_failure_branches: boolean
          health_species_failure_trunk: boolean
          health_species_failure_roots: boolean
          health_species_failure_describe: string | null
          // Load
          load_wind_exposure: WindExposure | null
          load_wind_funneling: string | null
          load_relative_crown_size: CrownSize | null
          load_crown_density: CrownDensity | null
          load_interior_branches: InteriorBranches | null
          load_vines_mistletoe_moss: string | null
          load_recent_change: string | null
          // Crown (abbreviated - full fields in DB)
          crown_unbalanced: boolean
          crown_lcr_percent: number | null
          // ... many more crown fields
          // Trunk (abbreviated)
          trunk_dead_missing_bark: boolean
          // ... many more trunk fields
          // Roots (abbreviated)
          roots_collar_buried: boolean
          // ... many more roots fields
          // Risk Results
          overall_tree_risk_rating: RiskRating | null
          overall_residual_risk: ResidualRiskRating | null
          recommended_inspection_interval: string | null
          advanced_assessment_needed: boolean
          advanced_assessment_reason: string | null
          // Limits
          limits_none: boolean
          limits_visibility: boolean
          limits_access: boolean
          limits_vines: boolean
          limits_root_collar_buried: boolean
          limits_describe: string | null
          // Notes & Timestamps
          notes: string | null
          created_at: string
          updated_at: string
          synced_at: string | null
          local_updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          team_id?: string | null
          status?: AssessmentStatus
          header_client: string
          header_date: string
          header_address: string
          header_assessors: string
          [key: string]: unknown
        }
        Update: {
          [key: string]: unknown
        }
      }
      assessment_targets: {
        Row: {
          id: string
          assessment_id: string
          target_number: number
          target_description: string | null
          target_protection: string | null
          within_drip_line: boolean
          within_1x_height: boolean
          within_1_5x_height: boolean
          occupancy_rate: OccupancyRate | null
          practical_to_move: boolean | null
          restriction_practical: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          assessment_id: string
          target_number: number
          target_description?: string | null
          target_protection?: string | null
          within_drip_line?: boolean
          within_1x_height?: boolean
          within_1_5x_height?: boolean
          occupancy_rate?: OccupancyRate | null
          practical_to_move?: boolean | null
          restriction_practical?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          assessment_id?: string
          target_number?: number
          target_description?: string | null
          target_protection?: string | null
          within_drip_line?: boolean
          within_1x_height?: boolean
          within_1_5x_height?: boolean
          occupancy_rate?: OccupancyRate | null
          practical_to_move?: boolean | null
          restriction_practical?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      assessment_risk_rows: {
        Row: {
          id: string
          assessment_id: string
          target: string
          tree_part: TreePart | null
          conditions_of_concern: string | null
          likelihood_failure: LikelihoodOfFailure | null
          likelihood_impact: LikelihoodOfImpact | null
          failure_and_impact: FailureAndImpact | null
          consequences: Consequences | null
          risk_rating: RiskRating | null
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          assessment_id: string
          target: string
          tree_part?: TreePart | null
          conditions_of_concern?: string | null
          likelihood_failure?: LikelihoodOfFailure | null
          likelihood_impact?: LikelihoodOfImpact | null
          failure_and_impact?: FailureAndImpact | null
          consequences?: Consequences | null
          risk_rating?: RiskRating | null
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          assessment_id?: string
          target?: string
          tree_part?: TreePart | null
          conditions_of_concern?: string | null
          likelihood_failure?: LikelihoodOfFailure | null
          likelihood_impact?: LikelihoodOfImpact | null
          failure_and_impact?: FailureAndImpact | null
          consequences?: Consequences | null
          risk_rating?: RiskRating | null
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      assessment_mitigations: {
        Row: {
          id: string
          assessment_id: string
          option_number: number
          description: string | null
          residual_risk: ResidualRiskRating | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          assessment_id: string
          option_number: number
          description?: string | null
          residual_risk?: ResidualRiskRating | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          assessment_id?: string
          option_number?: number
          description?: string | null
          residual_risk?: ResidualRiskRating | null
          created_at?: string
          updated_at?: string
        }
      }
      media_attachments: {
        Row: {
          id: string
          user_id: string
          assessment_id: string
          type: MediaType
          filename: string
          mime_type: string
          storage_path: string
          caption: string | null
          file_size_bytes: number | null
          gps_latitude: number | null
          gps_longitude: number | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          assessment_id: string
          type: MediaType
          filename: string
          mime_type: string
          storage_path: string
          caption?: string | null
          file_size_bytes?: number | null
          gps_latitude?: number | null
          gps_longitude?: number | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          assessment_id?: string
          type?: MediaType
          filename?: string
          mime_type?: string
          storage_path?: string
          caption?: string | null
          file_size_bytes?: number | null
          gps_latitude?: number | null
          gps_longitude?: number | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      sync_queue: {
        Row: {
          id: string
          user_id: string
          operation: 'create' | 'update' | 'delete'
          entity_type: string
          entity_id: string
          entity_data: Json | null
          status: 'pending' | 'synced' | 'failed' | 'conflict'
          error_message: string | null
          retry_count: number
          synced_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          operation: 'create' | 'update' | 'delete'
          entity_type: string
          entity_id: string
          entity_data?: Json | null
          status?: 'pending' | 'synced' | 'failed' | 'conflict'
          error_message?: string | null
          retry_count?: number
          synced_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          operation?: 'create' | 'update' | 'delete'
          entity_type?: string
          entity_id?: string
          entity_data?: Json | null
          status?: 'pending' | 'synced' | 'failed' | 'conflict'
          error_message?: string | null
          retry_count?: number
          synced_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          team_id: string | null
          assessment_id: string | null
          action: string
          entity_type: string
          entity_id: string | null
          old_data: Json | null
          new_data: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          team_id?: string | null
          assessment_id?: string | null
          action: string
          entity_type: string
          entity_id?: string | null
          old_data?: Json | null
          new_data?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          team_id?: string | null
          assessment_id?: string | null
          action?: string
          entity_type?: string
          entity_id?: string | null
          old_data?: Json | null
          new_data?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      assessment_status: AssessmentStatus
      data_status: DataStatus
      media_type: MediaType
      team_role: TeamRole
      load_on_defect: LoadOnDefect
      likelihood_of_failure: LikelihoodOfFailure
      likelihood_of_impact: LikelihoodOfImpact
      failure_and_impact: FailureAndImpact
      consequences: Consequences
      risk_rating: RiskRating
      residual_risk_rating: ResidualRiskRating
      tree_part: TreePart
      vigor: Vigor
      wind_exposure: WindExposure
      crown_size: CrownSize
      crown_density: CrownDensity
      interior_branches: InteriorBranches
      occupancy_rate: OccupancyRate
      theme: Theme
      unit_diameter: UnitDiameter
      unit_length: UnitLength
    }
  }
}

// =============================================================================
// CONVENIENCE TYPES
// =============================================================================

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']

export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T]

// Shorthand types
export type User = Tables<'users'>
export type Team = Tables<'teams'>
export type TeamMember = Tables<'team_members'>
export type AppSettings = Tables<'app_settings'>
export type FieldMemory = Tables<'field_memories'>
export type Assessment = Tables<'assessments'>
export type AssessmentTarget = Tables<'assessment_targets'>
export type AssessmentRiskRow = Tables<'assessment_risk_rows'>
export type AssessmentMitigation = Tables<'assessment_mitigations'>
export type MediaAttachment = Tables<'media_attachments'>
export type SyncQueueItem = Tables<'sync_queue'>
export type AuditLog = Tables<'audit_logs'>
