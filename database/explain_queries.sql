-- =============================================================================
-- SkillSync - Query Execution Plans (EXPLAIN & Optimization Analysis)
-- File: explain_queries.sql
-- Demonstrates query optimization and index utilization for faculty evaluation
-- =============================================================================

USE skillsync_db;

-- 1. Verify Full-Text Index on Projects
EXPLAIN SELECT * FROM projects 
WHERE MATCH(title, description) AGAINST('intelligent database matching' IN NATURAL LANGUAGE MODE);

-- 2. Verify Composite Index on User Skills
EXPLAIN SELECT * FROM user_skills 
WHERE user_id = 3 AND proficiency_level >= 4;

-- 3. Verify Foreign Key Index on Applications
EXPLAIN SELECT * FROM applications 
WHERE project_id = 1 AND status = 'PENDING';

-- 4. Verify View Execution Plan (Cross Join + Aggregation)
EXPLAIN SELECT * FROM v_student_project_compatibility 
WHERE user_id = 3;
