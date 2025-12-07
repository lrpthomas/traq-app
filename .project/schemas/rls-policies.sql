-- =============================================================================
-- TRAQ Row Level Security (RLS) Policies
-- =============================================================================
-- Run this AFTER supabase-schema.sql
-- Ensures users can only access their own data and team data with permissions
-- =============================================================================

-- ============================================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE field_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_risk_rows ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_mitigations ENABLE ROW LEVEL SECURITY;
ALTER TABLE crown_failure_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- USERS POLICIES
-- ============================================================================
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile (on signup)
CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================================================
-- TEAMS POLICIES
-- ============================================================================
-- Users can view teams they own or are members of
CREATE POLICY "Users can view their teams" ON teams
  FOR SELECT USING (
    owner_id = auth.uid()
    OR id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  );

-- Users can create teams (they become owner)
CREATE POLICY "Users can create teams" ON teams
  FOR INSERT WITH CHECK (owner_id = auth.uid());

-- Only team owner can update team
CREATE POLICY "Owners can update team" ON teams
  FOR UPDATE USING (owner_id = auth.uid());

-- Only team owner can delete team
CREATE POLICY "Owners can delete team" ON teams
  FOR DELETE USING (owner_id = auth.uid());

-- ============================================================================
-- TEAM MEMBERS POLICIES
-- ============================================================================
-- Users can view members of their teams
CREATE POLICY "Users can view team members" ON team_members
  FOR SELECT USING (
    team_id IN (
      SELECT id FROM teams WHERE owner_id = auth.uid()
    )
    OR team_id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  );

-- Team owner/admin can add members
CREATE POLICY "Admins can add team members" ON team_members
  FOR INSERT WITH CHECK (
    team_id IN (
      SELECT id FROM teams WHERE owner_id = auth.uid()
    )
    OR team_id IN (
      SELECT team_id FROM team_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- Team owner/admin can update member roles
CREATE POLICY "Admins can update team members" ON team_members
  FOR UPDATE USING (
    team_id IN (
      SELECT id FROM teams WHERE owner_id = auth.uid()
    )
    OR team_id IN (
      SELECT team_id FROM team_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- Team owner/admin can remove members
CREATE POLICY "Admins can remove team members" ON team_members
  FOR DELETE USING (
    team_id IN (
      SELECT id FROM teams WHERE owner_id = auth.uid()
    )
    OR team_id IN (
      SELECT team_id FROM team_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- ============================================================================
-- APP SETTINGS POLICIES
-- ============================================================================
CREATE POLICY "Users can view own settings" ON app_settings
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own settings" ON app_settings
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own settings" ON app_settings
  FOR UPDATE USING (user_id = auth.uid());

-- ============================================================================
-- FIELD MEMORIES POLICIES
-- ============================================================================
CREATE POLICY "Users can view own memories" ON field_memories
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own memories" ON field_memories
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own memories" ON field_memories
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own memories" ON field_memories
  FOR DELETE USING (user_id = auth.uid());

-- ============================================================================
-- ASSESSMENTS POLICIES
-- ============================================================================
-- Users can view: own assessments OR team assessments they have access to
CREATE POLICY "Users can view assessments" ON assessments
  FOR SELECT USING (
    user_id = auth.uid()
    OR (
      team_id IS NOT NULL
      AND team_id IN (
        SELECT team_id FROM team_members WHERE user_id = auth.uid()
      )
    )
  );

-- Users can create assessments (owned by them)
CREATE POLICY "Users can create assessments" ON assessments
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can update: own assessments OR team assessments if editor/admin/owner
CREATE POLICY "Users can update assessments" ON assessments
  FOR UPDATE USING (
    user_id = auth.uid()
    OR (
      team_id IS NOT NULL
      AND team_id IN (
        SELECT team_id FROM team_members
        WHERE user_id = auth.uid() AND role IN ('owner', 'admin', 'editor')
      )
    )
  );

-- Users can delete only their own assessments
CREATE POLICY "Users can delete own assessments" ON assessments
  FOR DELETE USING (user_id = auth.uid());

-- ============================================================================
-- ASSESSMENT TARGETS POLICIES (cascade from parent)
-- ============================================================================
CREATE POLICY "Users can view assessment targets" ON assessment_targets
  FOR SELECT USING (
    assessment_id IN (
      SELECT id FROM assessments WHERE user_id = auth.uid()
    )
    OR assessment_id IN (
      SELECT a.id FROM assessments a
      JOIN team_members tm ON a.team_id = tm.team_id
      WHERE tm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own assessment targets" ON assessment_targets
  FOR ALL USING (
    assessment_id IN (
      SELECT id FROM assessments WHERE user_id = auth.uid()
    )
    OR assessment_id IN (
      SELECT a.id FROM assessments a
      JOIN team_members tm ON a.team_id = tm.team_id
      WHERE tm.user_id = auth.uid() AND tm.role IN ('owner', 'admin', 'editor')
    )
  );

-- ============================================================================
-- ASSESSMENT RISK ROWS POLICIES (cascade from parent)
-- ============================================================================
CREATE POLICY "Users can view risk rows" ON assessment_risk_rows
  FOR SELECT USING (
    assessment_id IN (
      SELECT id FROM assessments WHERE user_id = auth.uid()
    )
    OR assessment_id IN (
      SELECT a.id FROM assessments a
      JOIN team_members tm ON a.team_id = tm.team_id
      WHERE tm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own risk rows" ON assessment_risk_rows
  FOR ALL USING (
    assessment_id IN (
      SELECT id FROM assessments WHERE user_id = auth.uid()
    )
    OR assessment_id IN (
      SELECT a.id FROM assessments a
      JOIN team_members tm ON a.team_id = tm.team_id
      WHERE tm.user_id = auth.uid() AND tm.role IN ('owner', 'admin', 'editor')
    )
  );

-- ============================================================================
-- ASSESSMENT MITIGATIONS POLICIES (cascade from parent)
-- ============================================================================
CREATE POLICY "Users can view mitigations" ON assessment_mitigations
  FOR SELECT USING (
    assessment_id IN (
      SELECT id FROM assessments WHERE user_id = auth.uid()
    )
    OR assessment_id IN (
      SELECT a.id FROM assessments a
      JOIN team_members tm ON a.team_id = tm.team_id
      WHERE tm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own mitigations" ON assessment_mitigations
  FOR ALL USING (
    assessment_id IN (
      SELECT id FROM assessments WHERE user_id = auth.uid()
    )
    OR assessment_id IN (
      SELECT a.id FROM assessments a
      JOIN team_members tm ON a.team_id = tm.team_id
      WHERE tm.user_id = auth.uid() AND tm.role IN ('owner', 'admin', 'editor')
    )
  );

-- ============================================================================
-- CROWN FAILURE ASSESSMENTS POLICIES (cascade from parent)
-- ============================================================================
CREATE POLICY "Users can view crown failures" ON crown_failure_assessments
  FOR SELECT USING (
    assessment_id IN (
      SELECT id FROM assessments WHERE user_id = auth.uid()
    )
    OR assessment_id IN (
      SELECT a.id FROM assessments a
      JOIN team_members tm ON a.team_id = tm.team_id
      WHERE tm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own crown failures" ON crown_failure_assessments
  FOR ALL USING (
    assessment_id IN (
      SELECT id FROM assessments WHERE user_id = auth.uid()
    )
    OR assessment_id IN (
      SELECT a.id FROM assessments a
      JOIN team_members tm ON a.team_id = tm.team_id
      WHERE tm.user_id = auth.uid() AND tm.role IN ('owner', 'admin', 'editor')
    )
  );

-- ============================================================================
-- MEDIA ATTACHMENTS POLICIES
-- ============================================================================
CREATE POLICY "Users can view media" ON media_attachments
  FOR SELECT USING (
    user_id = auth.uid()
    OR assessment_id IN (
      SELECT a.id FROM assessments a
      JOIN team_members tm ON a.team_id = tm.team_id
      WHERE tm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own media" ON media_attachments
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
    AND assessment_id IN (
      SELECT id FROM assessments WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own media" ON media_attachments
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own media" ON media_attachments
  FOR DELETE USING (user_id = auth.uid());

-- ============================================================================
-- SYNC QUEUE POLICIES
-- ============================================================================
CREATE POLICY "Users can view own sync queue" ON sync_queue
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own sync entries" ON sync_queue
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own sync entries" ON sync_queue
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own sync entries" ON sync_queue
  FOR DELETE USING (user_id = auth.uid());

-- ============================================================================
-- AUDIT LOGS POLICIES
-- ============================================================================
-- Users can view audit logs for their actions or their team's actions
CREATE POLICY "Users can view audit logs" ON audit_logs
  FOR SELECT USING (
    user_id = auth.uid()
    OR team_id IN (
      SELECT team_id FROM team_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- System inserts audit logs (no user insert allowed)
-- In production, use a service role key for audit log inserts

-- ============================================================================
-- END OF RLS POLICIES
-- ============================================================================
