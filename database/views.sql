-- =============================================================================
-- DBMS LAB 04 - LEVEL 3 PROJECT
-- PROJECT TITLE: SkillSync: Intelligent Student Project Team Matching System
-- TEAM MEMBER 1: ABHIJNA MARATHE  SRN1: PES2UG24CS020
-- TEAM MEMBER 2: ABHIRUP ROY      SRN2: PES2UG24CS025
-- File: views.sql
-- Description: Advanced Views for abstraction, reporting, and matching
-- =============================================================================

USE skillsync_db;

-- -----------------------------------------------------------------------------
-- View 1: v_student_skill_profiles
-- Consolidates student profile with their acquired skills and proficiency
-- -----------------------------------------------------------------------------
DROP VIEW IF EXISTS v_student_skill_profiles;
CREATE VIEW v_student_skill_profiles AS
SELECT 
    u.user_id,
    u.name AS student_name,
    u.email,
    s.skill_id,
    s.skill_name,
    s.category,
    us.proficiency_level,
    CASE 
        WHEN us.proficiency_level = 5 THEN 'Expert'
        WHEN us.proficiency_level = 4 THEN 'Advanced'
        WHEN us.proficiency_level = 3 THEN 'Intermediate'
        WHEN us.proficiency_level = 2 THEN 'Elementary'
        ELSE 'Beginner'
    END AS proficiency_label
FROM users u
JOIN user_skills us ON u.user_id = us.user_id
JOIN skills s ON us.skill_id = s.skill_id
WHERE u.role = 'STUDENT';

-- -----------------------------------------------------------------------------
-- View 2: v_project_skill_matrix
-- Aggregates required skills per project with mandatory skill list
-- -----------------------------------------------------------------------------
DROP VIEW IF EXISTS v_project_skill_matrix;
CREATE VIEW v_project_skill_matrix AS
SELECT 
    p.project_id,
    p.title,
    p.domain,
    p.max_team_size,
    p.status AS project_status,
    u.name AS faculty_creator,
    COUNT(ps.skill_id) AS total_skills_required,
    GROUP_CONCAT(CONCAT(s.skill_name, ' (Lvl ', ps.required_level, ')') ORDER BY s.skill_name SEPARATOR ', ') AS skill_requirements_list
FROM projects p
JOIN users u ON p.created_by = u.user_id
LEFT JOIN project_skills ps ON p.project_id = ps.project_id
LEFT JOIN skills s ON ps.skill_id = s.skill_id
GROUP BY p.project_id, p.title, p.domain, p.max_team_size, p.status, u.name;

-- -----------------------------------------------------------------------------
-- View 3: v_student_project_compatibility (Complex Join + Subquery + Aggregates)
-- Real-time match scoring between every student and every open project
-- -----------------------------------------------------------------------------
DROP VIEW IF EXISTS v_student_project_compatibility;
CREATE VIEW v_student_project_compatibility AS
SELECT 
    u.user_id,
    u.name AS student_name,
    u.email,
    p.project_id,
    p.title AS project_title,
    p.domain,
    COUNT(ps.skill_id) AS total_required_skills,
    COUNT(us.skill_id) AS matched_skills,
    ROUND(
        (COUNT(us.skill_id) / NULLIF(COUNT(ps.skill_id), 0)) * 100, 2
    ) AS skill_coverage_percent,
    ROUND(
        COALESCE(SUM(
            CASE 
                WHEN us.proficiency_level >= ps.required_level THEN 1.0
                WHEN us.proficiency_level > 0 THEN (us.proficiency_level / ps.required_level)
                ELSE 0.0 
            END
        ) / NULLIF(COUNT(ps.skill_id), 0) * 100, 0), 2
    ) AS weighted_compatibility_score
FROM users u
CROSS JOIN projects p
JOIN project_skills ps ON p.project_id = ps.project_id
LEFT JOIN user_skills us ON u.user_id = us.user_id AND ps.skill_id = us.skill_id
WHERE u.role = 'STUDENT' AND p.status = 'OPEN'
GROUP BY u.user_id, u.name, u.email, p.project_id, p.title, p.domain;

-- -----------------------------------------------------------------------------
-- View 4: v_team_rosters
-- Roster showing teams, current member counts, leader details, and open slots
-- -----------------------------------------------------------------------------
DROP VIEW IF EXISTS v_team_rosters;
CREATE VIEW v_team_rosters AS
SELECT 
    t.team_id,
    t.team_name,
    t.project_id,
    p.title AS project_title,
    p.domain,
    t.max_members,
    COUNT(tm.user_id) AS current_members,
    (t.max_members - COUNT(tm.user_id)) AS open_slots,
    MAX(CASE WHEN tm.member_role = 'LEADER' THEN u.name ELSE NULL END) AS leader_name,
    MAX(CASE WHEN tm.member_role = 'LEADER' THEN u.email ELSE NULL END) AS leader_email,
    GROUP_CONCAT(CONCAT(u.name, ' (', tm.member_role, ')') ORDER BY tm.member_role DESC, u.name SEPARATOR ', ') AS member_list
FROM teams t
JOIN projects p ON t.project_id = p.project_id
LEFT JOIN team_members tm ON t.team_id = tm.team_id
LEFT JOIN users u ON tm.user_id = u.user_id
GROUP BY t.team_id, t.team_name, t.project_id, p.title, p.domain, t.max_members;

-- -----------------------------------------------------------------------------
-- View 5: v_application_status_tracker
-- Complete application pipeline with applicant info, project info, and team status
-- -----------------------------------------------------------------------------
DROP VIEW IF EXISTS v_application_status_tracker;
CREATE VIEW v_application_status_tracker AS
SELECT 
    a.application_id,
    a.project_id,
    p.title AS project_title,
    t.team_name,
    a.user_id AS applicant_id,
    u.name AS applicant_name,
    u.email AS applicant_email,
    a.compatibility_score,
    a.status AS application_status,
    a.message,
    a.applied_at
FROM applications a
JOIN users u ON a.user_id = u.user_id
JOIN projects p ON a.project_id = p.project_id
LEFT JOIN teams t ON p.project_id = t.project_id;
