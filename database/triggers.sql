-- =============================================================================
-- DBMS LAB 04 - LEVEL 3 PROJECT
-- PROJECT TITLE: SkillSync: Intelligent Student Project Team Matching System
-- TEAM MEMBER 1: ABHIJNA MARATHE  SRN1: PES2UG24CS020
-- TEAM MEMBER 2: ABHIRUP ROY      SRN2: PES2UG24CS025
-- File: triggers.sql
-- Description: Triggers for data integrity, business constraints, and automation
-- =============================================================================

USE skillsync_db;

DELIMITER //

-- -----------------------------------------------------------------------------
-- Trigger 1: trg_before_application_check
-- Validates that the project is OPEN and student is not already enrolled in a team
-- for this project before an application can be inserted.
-- -----------------------------------------------------------------------------
DROP TRIGGER IF EXISTS trg_before_application_check //
CREATE TRIGGER trg_before_application_check
BEFORE INSERT ON applications
FOR EACH ROW
BEGIN
    DECLARE v_proj_status VARCHAR(20);
    DECLARE v_already_member INT DEFAULT 0;

    -- Check project status
    SELECT status INTO v_proj_status
    FROM projects
    WHERE project_id = NEW.project_id;

    IF v_proj_status != 'OPEN' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'APPLICATION_ERROR: Cannot apply. Project is not currently open for applications.';
    END IF;

    -- Check if applicant is already a member of the project team
    SELECT COUNT(*) INTO v_already_member
    FROM team_members tm
    JOIN teams t ON tm.team_id = t.team_id
    WHERE t.project_id = NEW.project_id AND tm.user_id = NEW.user_id;

    IF v_already_member > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'APPLICATION_ERROR: Student is already a member of this project team.';
    END IF;
END //

-- -----------------------------------------------------------------------------
-- Trigger 2: trg_check_team_capacity
-- Prevents adding members exceeding team's max_members threshold
-- -----------------------------------------------------------------------------
DROP TRIGGER IF EXISTS trg_check_team_capacity //
CREATE TRIGGER trg_check_team_capacity
BEFORE INSERT ON team_members
FOR EACH ROW
BEGIN
    DECLARE v_current_count INT DEFAULT 0;
    DECLARE v_max_allowed INT DEFAULT 0;

    SELECT max_members INTO v_max_allowed FROM teams WHERE team_id = NEW.team_id;
    SELECT COUNT(*) INTO v_current_count FROM team_members WHERE team_id = NEW.team_id;

    IF v_current_count >= v_max_allowed THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'TEAM_ERROR: Cannot add member. Team has reached maximum capacity.';
    END IF;
END //

-- -----------------------------------------------------------------------------
-- Trigger 3: trg_after_team_member_added
-- Automatically updates project status to FULL when max capacity is reached
-- -----------------------------------------------------------------------------
DROP TRIGGER IF EXISTS trg_after_team_member_added //
CREATE TRIGGER trg_after_team_member_added
AFTER INSERT ON team_members
FOR EACH ROW
BEGIN
    DECLARE v_current_count INT DEFAULT 0;
    DECLARE v_max_allowed INT DEFAULT 0;
    DECLARE v_proj_id INT;

    SELECT project_id, max_members INTO v_proj_id, v_max_allowed
    FROM teams WHERE team_id = NEW.team_id;

    SELECT COUNT(*) INTO v_current_count
    FROM team_members WHERE team_id = NEW.team_id;

    IF v_current_count >= v_max_allowed THEN
        UPDATE projects SET status = 'FULL' WHERE project_id = v_proj_id;
    END IF;
END //

-- -----------------------------------------------------------------------------
-- Trigger 4: trg_prevent_duplicate_leader
-- Ensures a user cannot be LEADER of more than 2 active teams simultaneously
-- -----------------------------------------------------------------------------
DROP TRIGGER IF EXISTS trg_prevent_duplicate_leader //
CREATE TRIGGER trg_prevent_duplicate_leader
BEFORE INSERT ON team_members
FOR EACH ROW
BEGIN
    DECLARE v_leading_count INT DEFAULT 0;

    IF NEW.member_role = 'LEADER' THEN
        SELECT COUNT(*) INTO v_leading_count
        FROM team_members tm
        JOIN teams t ON tm.team_id = t.team_id
        JOIN projects p ON t.project_id = p.project_id
        WHERE tm.user_id = NEW.user_id 
          AND tm.member_role = 'LEADER'
          AND p.status IN ('OPEN', 'FULL');

        IF v_leading_count >= 2 THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'ROLE_ERROR: A student cannot lead more than 2 active project teams simultaneously.';
        END IF;
    END IF;
END //

DELIMITER ;
