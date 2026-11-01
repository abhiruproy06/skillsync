-- =============================================================================
-- DBMS LAB 04 - LEVEL 3 PROJECT
-- PROJECT TITLE: SkillSync: Intelligent Student Project Team Matching System
-- TEAM MEMBER 1: ABHIJNA MARATHE  SRN1: PES2UG24CS020
-- TEAM MEMBER 2: ABHIRUP ROY      SRN2: PES2UG24CS025
-- File: queries.sql
-- Description: Demonstration Queries illustrating DML, JOINs, GROUP BY, HAVING,
--              Nested Subqueries, Correlated Subqueries, Full-Text Search,
--              Stored Procedures, and Transactions.
-- =============================================================================

USE skillsync_db;

-- =============================================================================
-- PART 1: ADVANCED SELECT QUERIES WITH JOINS & AGGREGATIONS
-- =============================================================================

-- Query 1.1: Multi-Table JOIN with GROUP BY & HAVING
-- Find all open projects requiring 3 or more distinct skills, listing the creator name
-- and the concatenated list of required skills.
SELECT 
    p.project_id,
    p.title AS project_title,
    p.domain,
    u.name AS faculty_name,
    COUNT(ps.skill_id) AS required_skill_count,
    GROUP_CONCAT(s.skill_name ORDER BY s.skill_name SEPARATOR ', ') AS skill_list
FROM projects p
INNER JOIN users u ON p.created_by = u.user_id
INNER JOIN project_skills ps ON p.project_id = ps.project_id
INNER JOIN skills s ON ps.skill_id = s.skill_id
WHERE p.status = 'OPEN'
GROUP BY p.project_id, p.title, p.domain, u.name
HAVING COUNT(ps.skill_id) >= 3
ORDER BY required_skill_count DESC;

-- Query 1.2: Correlated Subquery
-- Retrieve students whose average skill proficiency level is higher than the
-- overall average proficiency level of all students in the system.
SELECT 
    u.user_id,
    u.name,
    u.email,
    ROUND(AVG(us.proficiency_level), 2) AS student_avg_proficiency
FROM users u
JOIN user_skills us ON u.user_id = us.user_id
WHERE u.role = 'STUDENT'
GROUP BY u.user_id, u.name, u.email
HAVING AVG(us.proficiency_level) > (
    SELECT AVG(proficiency_level) FROM user_skills
)
ORDER BY student_avg_proficiency DESC;

-- Query 1.3: Nested Non-Correlated Subquery with NOT IN
-- Find all students who have not yet submitted any project application.
SELECT 
    u.user_id,
    u.name,
    u.email
FROM users u
WHERE u.role = 'STUDENT'
  AND u.user_id NOT IN (
      SELECT DISTINCT user_id FROM applications
  );

-- Query 1.4: LEFT JOIN with Aggregation and Conditional CASE
-- Project team capacity analysis showing filled slots, remaining slots, and fill percentage.
SELECT 
    t.team_id,
    t.team_name,
    p.title AS project_title,
    t.max_members,
    COUNT(tm.user_id) AS current_members,
    (t.max_members - COUNT(tm.user_id)) AS open_slots,
    ROUND((COUNT(tm.user_id) / t.max_members) * 100, 1) AS fill_percentage,
    CASE 
        WHEN COUNT(tm.user_id) >= t.max_members THEN 'COMPLETED'
        WHEN COUNT(tm.user_id) > 1 THEN 'FORMING'
        ELSE 'NEEDS_MEMBERS'
    END AS team_readiness
FROM teams t
JOIN projects p ON t.project_id = p.project_id
LEFT JOIN team_members tm ON t.team_id = tm.team_id
GROUP BY t.team_id, t.team_name, p.title, t.max_members
ORDER BY fill_percentage DESC;

-- Query 1.5: Full-Text Natural Language Search (Advanced Feature)
-- Search for projects matching keywords "matching intelligent systems"
SELECT 
    p.project_id,
    p.title,
    p.domain,
    ROUND(MATCH(p.title, p.description) AGAINST('intelligent matching systems' IN NATURAL LANGUAGE MODE), 4) AS search_relevance
FROM projects p
WHERE MATCH(p.title, p.description) AGAINST('intelligent matching systems' IN NATURAL LANGUAGE MODE)
ORDER BY search_relevance DESC;

-- =============================================================================
-- PART 2: STORED PROCEDURE AND FUNCTION EXECUTION
-- =============================================================================

-- 2.1 Calculate compatibility score between Abhijna Marathe (ID 3) and SkillSync (ID 1)
CALL sp_calculate_compatibility_score(3, 1, @score);
SELECT @score AS abhijna_skillsync_match_score;

-- 2.2 Calculate compatibility score between Sneha Reddy (ID 5) and BioMedical Graph (ID 3)
CALL sp_calculate_compatibility_score(5, 3, @score_sneha);
SELECT @score_sneha AS sneha_biomedical_match_score;

-- 2.3 Execute Team Skill Coverage Function for Team 1
SELECT 
    t.team_id,
    t.team_name,
    fn_team_skill_coverage(t.team_id) AS skill_coverage_percent
FROM teams t
WHERE t.team_id = 1;

-- =============================================================================
-- PART 3: ADVANCED VIEWS DEMONSTRATION
-- =============================================================================

-- Query view: Live student-project compatibility rankings
SELECT * FROM v_student_project_compatibility
ORDER BY weighted_compatibility_score DESC
LIMIT 10;

-- Query view: Project skill matrix
SELECT * FROM v_project_skill_matrix;

-- Query view: Team rosters with leader details
SELECT * FROM v_team_rosters;

-- Query view: Application status tracker
SELECT * FROM v_application_status_tracker;
