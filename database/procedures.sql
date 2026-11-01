-- =============================================================================
-- DBMS LAB 04 - LEVEL 3 PROJECT
-- PROJECT TITLE: SkillSync: Intelligent Student Project Team Matching System
-- TEAM MEMBER 1: ABHIJNA MARATHE  SRN1: PES2UG24CS020
-- TEAM MEMBER 2: ABHIRUP ROY      SRN2: PES2UG24CS025
-- File: procedures.sql
-- Description: Stored Procedures & Functions demonstrating Transactions,
--              Algorithms, and Business Logic
-- =============================================================================

USE skillsync_db;

DELIMITER //

-- -----------------------------------------------------------------------------
-- Procedure 1: sp_calculate_compatibility_score
-- Calculates a weighted match score between a student and a project based on
-- required vs possessed skills and proficiency levels (1-5).
-- -----------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_calculate_compatibility_score //
CREATE PROCEDURE sp_calculate_compatibility_score(
    IN p_user_id INT,
    IN p_project_id INT,
    OUT p_score DECIMAL(5,2)
)
BEGIN
    DECLARE v_total_skills INT DEFAULT 0;
    DECLARE v_sum_points DECIMAL(10,2) DEFAULT 0.0;

    -- Count total required skills for the project
    SELECT COUNT(*) INTO v_total_skills
    FROM project_skills
    WHERE project_id = p_project_id;

    IF v_total_skills = 0 THEN
        SET p_score = 100.0;
    ELSE
        -- Calculate weighted proficiency ratio:
        -- Full credit if student level >= required level, fractional credit if below
        SELECT COALESCE(SUM(
            CASE 
                WHEN us.proficiency_level >= ps.required_level THEN 1.0
                WHEN us.proficiency_level > 0 THEN (us.proficiency_level / ps.required_level)
                ELSE 0.0
            END
        ), 0.0) INTO v_sum_points
        FROM project_skills ps
        LEFT JOIN user_skills us ON ps.skill_id = us.skill_id AND us.user_id = p_user_id
        WHERE ps.project_id = p_project_id;

        SET p_score = ROUND((v_sum_points / v_total_skills) * 100.0, 2);
    END IF;
END //

-- -----------------------------------------------------------------------------
-- Procedure 2: sp_create_team_with_leader (Transaction demonstration)
-- Atomically creates a new team and registers the creator as the LEADER
-- -----------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_create_team_with_leader //
CREATE PROCEDURE sp_create_team_with_leader(
    IN p_project_id INT,
    IN p_team_name VARCHAR(150),
    IN p_leader_id INT,
    IN p_max_members INT,
    OUT p_team_id INT,
    OUT p_status_message VARCHAR(255)
)
proc_label: BEGIN
    DECLARE v_existing_team INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_team_id = NULL;
        SET p_status_message = 'TRANSACTION_FAILED: An error occurred during team creation.';
    END;

    START TRANSACTION;

    -- Verify project doesn't already have a team
    SELECT COUNT(*) INTO v_existing_team FROM teams WHERE project_id = p_project_id;
    IF v_existing_team > 0 THEN
        ROLLBACK;
        SET p_team_id = NULL;
        SET p_status_message = 'ERROR: A team already exists for this project.';
        LEAVE proc_label;
    END IF;

    -- Insert team
    INSERT INTO teams (project_id, team_name, max_members)
    VALUES (p_project_id, p_team_name, p_max_members);

    SET p_team_id = LAST_INSERT_ID();

    -- Add creator as LEADER in team_members
    INSERT INTO team_members (team_id, user_id, member_role)
    VALUES (p_team_id, p_leader_id, 'LEADER');

    COMMIT;
    SET p_status_message = 'SUCCESS: Team created and leader enrolled.';
END //

-- -----------------------------------------------------------------------------
-- Procedure 3: sp_apply_with_auto_match
-- Calculates compatibility score and creates application in a single step
-- -----------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_apply_with_auto_match //
CREATE PROCEDURE sp_apply_with_auto_match(
    IN p_user_id INT,
    IN p_project_id INT,
    IN p_message TEXT,
    OUT p_application_id INT,
    OUT p_calc_score DECIMAL(5,2),
    OUT p_result VARCHAR(100)
)
BEGIN
    DECLARE v_exists INT;
    
    -- Check if user already applied
    SELECT COUNT(*) INTO v_exists 
    FROM applications 
    WHERE user_id = p_user_id AND project_id = p_project_id;

    IF v_exists > 0 THEN
        SET p_application_id = NULL;
        SET p_calc_score = 0.0;
        SET p_result = 'ALREADY_APPLIED';
    ELSE
        -- Call scoring procedure
        CALL sp_calculate_compatibility_score(p_user_id, p_project_id, p_calc_score);

        INSERT INTO applications (user_id, project_id, message, compatibility_score, status)
        VALUES (p_user_id, p_project_id, p_message, p_calc_score, 'PENDING');

        SET p_application_id = LAST_INSERT_ID();
        SET p_result = 'APPLICATION_SUBMITTED';
    END IF;
END //

-- -----------------------------------------------------------------------------
-- Procedure 4: sp_process_application (Transaction demonstration)
-- Accepts an application, inserts into team_members, checks capacity, and updates status
-- -----------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_process_application //
CREATE PROCEDURE sp_process_application(
    IN p_application_id INT,
    IN p_decision ENUM('ACCEPTED', 'REJECTED'),
    OUT p_result_message VARCHAR(255)
)
proc_app: BEGIN
    DECLARE v_user_id INT;
    DECLARE v_project_id INT;
    DECLARE v_team_id INT;
    DECLARE v_current_members INT;
    DECLARE v_max_members INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_result_message = 'TRANSACTION_FAILED: Error processing application.';
    END;

    START TRANSACTION;

    SELECT user_id, project_id INTO v_user_id, v_project_id
    FROM applications
    WHERE application_id = p_application_id;

    IF v_user_id IS NULL THEN
        ROLLBACK;
        SET p_result_message = 'ERROR: Application not found.';
        LEAVE proc_app;
    END IF;

    IF p_decision = 'REJECTED' THEN
        UPDATE applications SET status = 'REJECTED' WHERE application_id = p_application_id;
        COMMIT;
        SET p_result_message = 'Application rejected successfully.';
        LEAVE proc_app;
    END IF;

    -- For ACCEPTED:
    SELECT team_id, max_members INTO v_team_id, v_max_members
    FROM teams WHERE project_id = v_project_id;

    IF v_team_id IS NULL THEN
        ROLLBACK;
        SET p_result_message = 'ERROR: No team formed yet for this project.';
        LEAVE proc_app;
    END IF;

    -- Check current team size
    SELECT COUNT(*) INTO v_current_members FROM team_members WHERE team_id = v_team_id;

    IF v_current_members >= v_max_members THEN
        ROLLBACK;
        SET p_result_message = 'ERROR: Team has already reached maximum capacity.';
        LEAVE proc_app;
    END IF;

    -- Update application status
    UPDATE applications SET status = 'ACCEPTED' WHERE application_id = p_application_id;

    -- Insert into team members
    INSERT INTO team_members (team_id, user_id, member_role)
    VALUES (v_team_id, v_user_id, 'MEMBER');

    -- If team is now full, auto-update project status to FULL and reject other pending
    IF (v_current_members + 1) >= v_max_members THEN
        UPDATE projects SET status = 'FULL' WHERE project_id = v_project_id;
        UPDATE applications 
        SET status = 'REJECTED' 
        WHERE project_id = v_project_id AND status = 'PENDING';
    END IF;

    COMMIT;
    SET p_result_message = 'Application accepted and student enrolled in team.';
END //

-- -----------------------------------------------------------------------------
-- Function: fn_team_skill_coverage
-- Computes the percentage of a project's required skills covered by team members
-- -----------------------------------------------------------------------------
DROP FUNCTION IF EXISTS fn_team_skill_coverage //
CREATE FUNCTION fn_team_skill_coverage(p_team_id INT)
RETURNS DECIMAL(5,2)
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_project_id INT;
    DECLARE v_total_req INT DEFAULT 0;
    DECLARE v_covered INT DEFAULT 0;

    SELECT project_id INTO v_project_id FROM teams WHERE team_id = p_team_id;
    IF v_project_id IS NULL THEN
        RETURN 0.0;
    END IF;

    SELECT COUNT(*) INTO v_total_req FROM project_skills WHERE project_id = v_project_id;
    IF v_total_req = 0 THEN
        RETURN 100.0;
    END IF;

    -- Count distinct required skills possessed by at least one team member
    SELECT COUNT(DISTINCT ps.skill_id) INTO v_covered
    FROM project_skills ps
    JOIN team_members tm ON tm.team_id = p_team_id
    JOIN user_skills us ON us.user_id = tm.user_id AND us.skill_id = ps.skill_id
    WHERE ps.project_id = v_project_id;

    RETURN ROUND((v_covered / v_total_req) * 100.0, 2);
END //

DELIMITER ;
