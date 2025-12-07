-- =============================================================================
-- TRAQ Supabase Database Schema
-- =============================================================================
-- Generated from PROJECT_STATUS.yaml
-- Run this in Supabase SQL Editor to create all tables
-- =============================================================================

-- ============================================================================
-- EXTENSIONS
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- CUSTOM TYPES (ENUMS)
-- ============================================================================

-- Assessment Status
CREATE TYPE assessment_status AS ENUM ('draft', 'complete');

-- Data Status
CREATE TYPE data_status AS ENUM ('preliminary', 'final');

-- Media Type
CREATE TYPE media_type AS ENUM ('photo', 'video', 'document');

-- Team Roles
CREATE TYPE team_role AS ENUM ('owner', 'admin', 'editor', 'viewer');

-- Risk Assessment Enums
CREATE TYPE load_on_defect AS ENUM ('n/a', 'minor', 'moderate', 'significant');
CREATE TYPE likelihood_of_failure AS ENUM ('improbable', 'possible', 'probable', 'imminent');
CREATE TYPE likelihood_of_impact AS ENUM ('very-low', 'low', 'medium', 'high');
CREATE TYPE failure_and_impact AS ENUM ('unlikely', 'somewhat', 'likely', 'very-likely');
CREATE TYPE consequences AS ENUM ('negligible', 'minor', 'significant', 'severe');
CREATE TYPE risk_rating AS ENUM ('low', 'moderate', 'high', 'extreme');
CREATE TYPE residual_risk_rating AS ENUM ('none', 'low', 'moderate', 'high', 'extreme');
CREATE TYPE tree_part AS ENUM ('branches', 'trunk', 'root-collar', 'roots', 'soil');

-- Tree Health Enums
CREATE TYPE vigor AS ENUM ('low', 'normal', 'high');
CREATE TYPE wind_exposure AS ENUM ('protected', 'partial', 'full');
CREATE TYPE crown_size AS ENUM ('small', 'medium', 'large');
CREATE TYPE crown_density AS ENUM ('sparse', 'normal', 'dense');
CREATE TYPE interior_branches AS ENUM ('few', 'normal', 'dense');
CREATE TYPE occupancy_rate AS ENUM ('1', '2', '3', '4');

-- Settings Enums
CREATE TYPE theme AS ENUM ('light', 'dark', 'system');
CREATE TYPE unit_diameter AS ENUM ('in', 'cm');
CREATE TYPE unit_length AS ENUM ('ft', 'm');

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- USERS TABLE (extends auth.users)
-- ============================================================================
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE TRIGGER update_users_timestamp BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ============================================================================
-- TEAMS TABLE
-- ============================================================================
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_teams_owner ON teams(owner_id);
CREATE TRIGGER update_teams_timestamp BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ============================================================================
-- TEAM MEMBERS TABLE
-- ============================================================================
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role team_role NOT NULL DEFAULT 'viewer',
  invited_by UUID REFERENCES users(id),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

CREATE INDEX idx_team_members_team ON team_members(team_id);
CREATE INDEX idx_team_members_user ON team_members(user_id);
CREATE INDEX idx_team_members_role ON team_members(team_id, role);

-- ============================================================================
-- APP SETTINGS TABLE (per user)
-- ============================================================================
CREATE TABLE app_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  default_time_frame TEXT DEFAULT '1 year',
  default_unit_diameter unit_diameter DEFAULT 'in',
  default_unit_height unit_length DEFAULT 'ft',
  default_unit_distance unit_length DEFAULT 'ft',
  auto_save_interval INTEGER DEFAULT 30000,
  enable_memory BOOLEAN DEFAULT TRUE,
  theme theme DEFAULT 'system',
  assessor_name TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX idx_settings_user ON app_settings(user_id);
CREATE TRIGGER update_settings_timestamp BEFORE UPDATE ON app_settings
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ============================================================================
-- FIELD MEMORIES TABLE (per user)
-- ============================================================================
CREATE TABLE field_memories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  field_path TEXT NOT NULL,
  value JSONB NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  last_used TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, field_path)
);

CREATE INDEX idx_memories_user ON field_memories(user_id);
CREATE INDEX idx_memories_user_enabled ON field_memories(user_id, enabled);
CREATE INDEX idx_memories_field_path ON field_memories(user_id, field_path);
CREATE TRIGGER update_memories_timestamp BEFORE UPDATE ON field_memories
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ============================================================================
-- ASSESSMENTS TABLE (main data)
-- ============================================================================
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  status assessment_status DEFAULT 'draft',
  data_status data_status DEFAULT 'preliminary',

  -- GPS Location
  gps_latitude DECIMAL(10, 8),
  gps_longitude DECIMAL(11, 8),
  gps_address TEXT,
  gps_accuracy INTEGER,
  gps_timestamp TIMESTAMPTZ,

  -- Header Info
  header_client TEXT NOT NULL,
  header_date DATE NOT NULL,
  header_time TIME,
  header_address TEXT NOT NULL,
  header_tree_no TEXT,
  header_sheet_number INTEGER DEFAULT 1,
  header_sheet_total INTEGER DEFAULT 1,
  header_tree_species TEXT,
  header_dbh TEXT,
  header_height TEXT,
  header_crown_spread TEXT,
  header_assessors TEXT NOT NULL,
  header_tools_used TEXT,
  header_time_frame TEXT DEFAULT '1 year',

  -- Site Factors
  site_history_of_failures TEXT,
  site_topography_flat BOOLEAN DEFAULT FALSE,
  site_topography_slope_percent INTEGER,
  site_topography_aspect TEXT,
  site_changes_none BOOLEAN DEFAULT TRUE,
  site_changes_grade_change BOOLEAN DEFAULT FALSE,
  site_changes_clearing BOOLEAN DEFAULT FALSE,
  site_changes_soil_hydrology BOOLEAN DEFAULT FALSE,
  site_changes_root_cuts BOOLEAN DEFAULT FALSE,
  site_changes_describe TEXT,
  site_soil_limited_volume BOOLEAN DEFAULT FALSE,
  site_soil_saturated BOOLEAN DEFAULT FALSE,
  site_soil_shallow BOOLEAN DEFAULT FALSE,
  site_soil_compacted BOOLEAN DEFAULT FALSE,
  site_soil_pavement_percent INTEGER,
  site_soil_describe TEXT,
  site_prevailing_wind TEXT,
  site_weather_strong_winds BOOLEAN DEFAULT FALSE,
  site_weather_ice BOOLEAN DEFAULT FALSE,
  site_weather_snow BOOLEAN DEFAULT FALSE,
  site_weather_heavy_rain BOOLEAN DEFAULT FALSE,
  site_weather_describe TEXT,

  -- Tree Health
  health_vigor vigor,
  health_foliage_none_seasonal BOOLEAN DEFAULT FALSE,
  health_foliage_none_dead BOOLEAN DEFAULT FALSE,
  health_foliage_normal_percent INTEGER,
  health_foliage_chlorotic_percent INTEGER,
  health_foliage_necrotic_percent INTEGER,
  health_pests_biotic TEXT,
  health_abiotic TEXT,
  health_species_failure_branches BOOLEAN DEFAULT FALSE,
  health_species_failure_trunk BOOLEAN DEFAULT FALSE,
  health_species_failure_roots BOOLEAN DEFAULT FALSE,
  health_species_failure_describe TEXT,

  -- Load Factors
  load_wind_exposure wind_exposure,
  load_wind_funneling TEXT,
  load_relative_crown_size crown_size,
  load_crown_density crown_density,
  load_interior_branches interior_branches,
  load_vines_mistletoe_moss TEXT,
  load_recent_change TEXT,

  -- Crown and Branches
  crown_unbalanced BOOLEAN DEFAULT FALSE,
  crown_lcr_percent INTEGER,
  crown_dead_twigs_present BOOLEAN DEFAULT FALSE,
  crown_dead_twigs_percent INTEGER,
  crown_dead_twigs_max_dia TEXT,
  crown_broken_hangers_present BOOLEAN DEFAULT FALSE,
  crown_broken_hangers_number INTEGER,
  crown_broken_hangers_max_dia TEXT,
  crown_over_extended BOOLEAN DEFAULT FALSE,
  crown_pruning_cleaned BOOLEAN DEFAULT FALSE,
  crown_pruning_thinned BOOLEAN DEFAULT FALSE,
  crown_pruning_raised BOOLEAN DEFAULT FALSE,
  crown_pruning_reduced BOOLEAN DEFAULT FALSE,
  crown_pruning_topped BOOLEAN DEFAULT FALSE,
  crown_pruning_lion_tailed BOOLEAN DEFAULT FALSE,
  crown_pruning_flush_cuts BOOLEAN DEFAULT FALSE,
  crown_pruning_other TEXT,
  crown_cracks_present BOOLEAN DEFAULT FALSE,
  crown_cracks_describe TEXT,
  crown_lightning BOOLEAN DEFAULT FALSE,
  crown_codominant_present BOOLEAN DEFAULT FALSE,
  crown_codominant_describe TEXT,
  crown_included_bark BOOLEAN DEFAULT FALSE,
  crown_weak_attachments_present BOOLEAN DEFAULT FALSE,
  crown_weak_attachments_describe TEXT,
  crown_cavity_present BOOLEAN DEFAULT FALSE,
  crown_cavity_percent_circ INTEGER,
  crown_previous_failures_present BOOLEAN DEFAULT FALSE,
  crown_previous_failures_describe TEXT,
  crown_similar_branches BOOLEAN DEFAULT FALSE,
  crown_dead_missing_bark BOOLEAN DEFAULT FALSE,
  crown_cankers_galls BOOLEAN DEFAULT FALSE,
  crown_sapwood_damage BOOLEAN DEFAULT FALSE,
  crown_conks BOOLEAN DEFAULT FALSE,
  crown_heartwood_decay_present BOOLEAN DEFAULT FALSE,
  crown_heartwood_decay_describe TEXT,
  crown_response_growth TEXT,
  crown_conditions_of_concern TEXT,

  -- Trunk
  trunk_dead_missing_bark BOOLEAN DEFAULT FALSE,
  trunk_abnormal_bark BOOLEAN DEFAULT FALSE,
  trunk_codominant BOOLEAN DEFAULT FALSE,
  trunk_included_bark BOOLEAN DEFAULT FALSE,
  trunk_cracks BOOLEAN DEFAULT FALSE,
  trunk_sapwood_damage BOOLEAN DEFAULT FALSE,
  trunk_cankers_galls BOOLEAN DEFAULT FALSE,
  trunk_sap_ooze BOOLEAN DEFAULT FALSE,
  trunk_lightning BOOLEAN DEFAULT FALSE,
  trunk_heartwood_decay BOOLEAN DEFAULT FALSE,
  trunk_conks_mushrooms BOOLEAN DEFAULT FALSE,
  trunk_cavity_present BOOLEAN DEFAULT FALSE,
  trunk_cavity_percent_circ INTEGER,
  trunk_cavity_depth TEXT,
  trunk_poor_taper BOOLEAN DEFAULT FALSE,
  trunk_lean_present BOOLEAN DEFAULT FALSE,
  trunk_lean_degrees INTEGER,
  trunk_lean_corrected TEXT,
  trunk_response_growth TEXT,
  trunk_conditions_of_concern TEXT,
  trunk_part_size TEXT,
  trunk_fall_distance TEXT,
  trunk_load_on_defect load_on_defect,
  trunk_likelihood_failure likelihood_of_failure,

  -- Roots and Root Collar
  roots_collar_buried BOOLEAN DEFAULT FALSE,
  roots_collar_depth TEXT,
  roots_stem_girdling BOOLEAN DEFAULT FALSE,
  roots_dead BOOLEAN DEFAULT FALSE,
  roots_decay BOOLEAN DEFAULT FALSE,
  roots_conks_mushrooms BOOLEAN DEFAULT FALSE,
  roots_ooze BOOLEAN DEFAULT FALSE,
  roots_cavity_present BOOLEAN DEFAULT FALSE,
  roots_cavity_percent_circ INTEGER,
  roots_cracks BOOLEAN DEFAULT FALSE,
  roots_cut_damaged_present BOOLEAN DEFAULT FALSE,
  roots_cut_damaged_distance TEXT,
  roots_plate_lifting BOOLEAN DEFAULT FALSE,
  roots_soil_weakness BOOLEAN DEFAULT FALSE,
  roots_response_growth TEXT,
  roots_conditions_of_concern TEXT,
  roots_part_size TEXT,
  roots_fall_distance TEXT,
  roots_load_on_defect load_on_defect,
  roots_likelihood_failure likelihood_of_failure,

  -- Risk Assessment Results
  overall_tree_risk_rating risk_rating,
  overall_residual_risk residual_risk_rating,
  recommended_inspection_interval TEXT,
  advanced_assessment_needed BOOLEAN DEFAULT FALSE,
  advanced_assessment_reason TEXT,

  -- Inspection Limitations
  limits_none BOOLEAN DEFAULT TRUE,
  limits_visibility BOOLEAN DEFAULT FALSE,
  limits_access BOOLEAN DEFAULT FALSE,
  limits_vines BOOLEAN DEFAULT FALSE,
  limits_root_collar_buried BOOLEAN DEFAULT FALSE,
  limits_describe TEXT,

  -- Notes
  notes TEXT,

  -- Timestamps & Sync
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  synced_at TIMESTAMPTZ,
  local_updated_at TIMESTAMPTZ
);

CREATE INDEX idx_assessments_user ON assessments(user_id);
CREATE INDEX idx_assessments_team ON assessments(team_id);
CREATE INDEX idx_assessments_user_status ON assessments(user_id, status);
CREATE INDEX idx_assessments_user_updated ON assessments(user_id, updated_at DESC);
CREATE INDEX idx_assessments_client ON assessments(user_id, header_client);
CREATE INDEX idx_assessments_location ON assessments(user_id, header_address);
CREATE TRIGGER update_assessments_timestamp BEFORE UPDATE ON assessments
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ============================================================================
-- ASSESSMENT TARGETS TABLE (1-4 per assessment)
-- ============================================================================
CREATE TABLE assessment_targets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  target_number SMALLINT NOT NULL CHECK (target_number BETWEEN 1 AND 4),
  target_description TEXT,
  target_protection TEXT,
  within_drip_line BOOLEAN DEFAULT FALSE,
  within_1x_height BOOLEAN DEFAULT FALSE,
  within_1_5x_height BOOLEAN DEFAULT FALSE,
  occupancy_rate occupancy_rate,
  practical_to_move BOOLEAN,
  restriction_practical BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(assessment_id, target_number)
);

CREATE INDEX idx_targets_assessment ON assessment_targets(assessment_id);
CREATE TRIGGER update_targets_timestamp BEFORE UPDATE ON assessment_targets
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ============================================================================
-- ASSESSMENT RISK ROWS TABLE
-- ============================================================================
CREATE TABLE assessment_risk_rows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  target TEXT NOT NULL,
  tree_part tree_part,
  conditions_of_concern TEXT,
  likelihood_failure likelihood_of_failure,
  likelihood_impact likelihood_of_impact,
  failure_and_impact failure_and_impact,
  consequences consequences,
  risk_rating risk_rating,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_risk_rows_assessment ON assessment_risk_rows(assessment_id);
CREATE TRIGGER update_risk_rows_timestamp BEFORE UPDATE ON assessment_risk_rows
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ============================================================================
-- ASSESSMENT MITIGATIONS TABLE (1-4 per assessment)
-- ============================================================================
CREATE TABLE assessment_mitigations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  option_number SMALLINT NOT NULL CHECK (option_number BETWEEN 1 AND 4),
  description TEXT,
  residual_risk residual_risk_rating,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(assessment_id, option_number)
);

CREATE INDEX idx_mitigations_assessment ON assessment_mitigations(assessment_id);
CREATE TRIGGER update_mitigations_timestamp BEFORE UPDATE ON assessment_mitigations
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ============================================================================
-- CROWN FAILURE ASSESSMENTS TABLE (max 2 per assessment)
-- ============================================================================
CREATE TABLE crown_failure_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  part_size TEXT,
  fall_distance TEXT,
  load_on_defect load_on_defect,
  likelihood_failure likelihood_of_failure,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_crown_failures_assessment ON crown_failure_assessments(assessment_id);
CREATE TRIGGER update_crown_failures_timestamp BEFORE UPDATE ON crown_failure_assessments
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ============================================================================
-- MEDIA ATTACHMENTS TABLE
-- ============================================================================
CREATE TABLE media_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  type media_type NOT NULL,
  filename TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  caption TEXT,
  file_size_bytes INTEGER,
  gps_latitude DECIMAL(10, 8),
  gps_longitude DECIMAL(11, 8),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_media_user ON media_attachments(user_id);
CREATE INDEX idx_media_assessment ON media_attachments(assessment_id);
CREATE INDEX idx_media_type ON media_attachments(assessment_id, type);
CREATE TRIGGER update_media_timestamp BEFORE UPDATE ON media_attachments
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ============================================================================
-- SYNC QUEUE TABLE (for offline sync tracking)
-- ============================================================================
CREATE TABLE sync_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  operation TEXT NOT NULL CHECK (operation IN ('create', 'update', 'delete')),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  entity_data JSONB,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'synced', 'failed', 'conflict')),
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sync_queue_user_status ON sync_queue(user_id, status);
CREATE INDEX idx_sync_queue_created ON sync_queue(created_at);
CREATE TRIGGER update_sync_queue_timestamp BEFORE UPDATE ON sync_queue
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ============================================================================
-- AUDIT LOG TABLE
-- ============================================================================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  team_id UUID REFERENCES teams(id),
  assessment_id UUID REFERENCES assessments(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_team ON audit_logs(team_id);
CREATE INDEX idx_audit_assessment ON audit_logs(assessment_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
