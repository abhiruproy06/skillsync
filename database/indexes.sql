-- =============================================================================
-- DBMS LAB 04 - LEVEL 3 PROJECT
-- PROJECT TITLE: SkillSync: Intelligent Student Project Team Matching System
-- TEAM MEMBER 1: ABHIJNA MARATHE  SRN1: PES2UG24CS020
-- TEAM MEMBER 2: ABHIRUP ROY      SRN2: PES2UG24CS025
-- File: indexes.sql
-- Description: DDL Indexes for query optimization and full-text search
-- =============================================================================

USE skillsync_db;

-- Indexes from submission document 020_025.pdf
CREATE INDEX idx_projects_domain ON projects(domain);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_user_skills_skill ON user_skills(skill_id);
CREATE INDEX idx_applications_project ON applications(project_id);
CREATE INDEX idx_applications_status ON applications(status);

-- Additional Performance & Advanced Optimization Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_projects_created_by ON projects(created_by);
CREATE INDEX idx_teams_project ON teams(project_id);
CREATE INDEX idx_team_members_user ON team_members(user_id);
CREATE INDEX idx_applications_user ON applications(user_id);
CREATE INDEX idx_applications_user_status ON applications(user_id, status);

-- Full-Text Index on Projects for Semantic/Keyword Search (Advanced Feature 6)
ALTER TABLE projects ADD FULLTEXT INDEX ft_projects_search (title, description);
