-- =============================================================================
-- SkillSync - Automated Database Verification Test Suite
-- Author: Abhijna Marathe (PES2UG24CS020) & Abhirup Roy (PES2UG24CS025)
-- File: tests.sql
-- Description: Unit test cases verifying constraints, procedures, and triggers
-- =============================================================================

USE skillsync_db;

-- -----------------------------------------------------------------------------
-- Test Case 1: Stored Procedure - sp_calculate_compatibility_score
-- -----------------------------------------------------------------------------
SELECT '--- RUNNING TEST CASE 1: sp_calculate_compatibility_score ---' AS test_header;
CALL sp_calculate_compatibility_score(3, 1, @test_score);
SELECT 
    CASE 
        WHEN @test_score >= 80.0 THEN 'TEST 1 PASSED: High match score correctly computed'
        ELSE 'TEST 1 FAILED: Score mismatch'
    END AS test_1_status,
    @test_score AS calculated_score;

-- -----------------------------------------------------------------------------
-- Test Case 2: Stored Function - fn_team_skill_coverage
-- -----------------------------------------------------------------------------
SELECT '--- RUNNING TEST CASE 2: fn_team_skill_coverage ---' AS test_header;
SET @coverage = fn_team_skill_coverage(1);
SELECT 
    CASE 
        WHEN @coverage > 0 THEN 'TEST 2 PASSED: Coverage calculation functional'
        ELSE 'TEST 2 FAILED: Zero coverage returned'
    END AS test_2_status,
    @coverage AS team_skill_coverage;

-- -----------------------------------------------------------------------------
-- Test Case 3: View Verification - v_student_project_compatibility
-- -----------------------------------------------------------------------------
SELECT '--- RUNNING TEST CASE 3: View Integrity ---' AS test_header;
SELECT COUNT(*) INTO @view_count FROM v_student_project_compatibility;
SELECT 
    CASE 
        WHEN @view_count > 0 THEN 'TEST 3 PASSED: Compatibility view populated'
        ELSE 'TEST 3 FAILED: View empty'
    END AS test_3_status,
    @view_count AS total_ranked_pairs;

-- -----------------------------------------------------------------------------
-- Test Case 4: Full-Text Natural Language Index
-- -----------------------------------------------------------------------------
SELECT '--- RUNNING TEST CASE 4: Fulltext Search Relevance ---' AS test_header;
SELECT project_id, title, 
       MATCH(title, description) AGAINST('database' IN NATURAL LANGUAGE MODE) AS relevance
FROM projects
WHERE MATCH(title, description) AGAINST('database' IN NATURAL LANGUAGE MODE);
