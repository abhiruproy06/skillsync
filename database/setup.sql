-- =============================================================================
-- DBMS LAB 04 - LEVEL 3 EXPERIENTIAL LEARNING PROJECT
-- PROJECT TITLE: SkillSync: Intelligent Student Project Team Matching System
-- TEAM MEMBER 1: ABHIJNA MARATHE  SRN1: PES2UG24CS020
-- TEAM MEMBER 2: ABHIRUP ROY      SRN2: PES2UG24CS025
-- COURSE FACULTY: PROF. DEENA HAJIM
-- FILE: setup.sql (ALL-IN-ONE STANDALONE SETUP SCRIPT)
-- 
-- DESCRIPTION:
-- This script is completely self-contained. It creates the database, all 8
-- tables with constraints & cascades, B-tree & full-text indexes, 5 analytical
-- views, 4 stored procedures, 1 stored function, 4 triggers, and seed data.
-- It can be executed from ANY directory:
--    mysql -u root -p < setup.sql
-- =============================================================================

-- =============================================================================
-- DBMS LAB 04 - LEVEL 3 PROJECT
-- PROJECT TITLE: SkillSync: Intelligent Student Project Team Matching System
-- TEAM MEMBER 1: ABHIJNA MARATHE  SRN1: PES2UG24CS020
-- TEAM MEMBER 2: ABHIRUP ROY      SRN2: PES2UG24CS025
-- File: schema.sql
-- Description: Complete DDL - Relational Schema with tables, constraints,
--              foreign keys, CHECK constraints, and ENUMs.
-- Reference: 020_025.pdf & DBMS Level 3 Project Requirements
-- Engine: InnoDB | Charset: utf8mb4
-- =============================================================================

CREATE DATABASE IF NOT EXISTS skillsync_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE skillsync_db;

SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- 1. Table: users
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    user_id         INT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    email           VARCHAR(150) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    role            ENUM('STUDENT', 'ADMIN') NOT NULL DEFAULT 'STUDENT',
    bio             TEXT,
    interests       TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 2. Table: skills
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS skills;
CREATE TABLE skills (
    skill_id        INT AUTO_INCREMENT PRIMARY KEY,
    skill_name      VARCHAR(100) NOT NULL UNIQUE,
    category        VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 3. Table: user_skills
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS user_skills;
CREATE TABLE user_skills (
    user_id           INT NOT NULL,
    skill_id          INT NOT NULL,
    proficiency_level INT NOT NULL,
    PRIMARY KEY (user_id, skill_id),
    CONSTRAINT chk_user_skill_level CHECK (proficiency_level BETWEEN 1 AND 5),
    CONSTRAINT fk_user_skills_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_user_skills_skill FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 4. Table: projects
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS projects;
CREATE TABLE projects (
    project_id      INT AUTO_INCREMENT PRIMARY KEY,
    created_by      INT NOT NULL,
    title           VARCHAR(200) NOT NULL,
    description     TEXT NOT NULL,
    domain          VARCHAR(100) NOT NULL,
    max_team_size   INT NOT NULL,
    status          ENUM('OPEN', 'FULL', 'CLOSED') NOT NULL DEFAULT 'OPEN',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_max_team_size CHECK (max_team_size BETWEEN 2 AND 10),
    CONSTRAINT fk_projects_user FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 5. Table: project_skills
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS project_skills;
CREATE TABLE project_skills (
    project_id      INT NOT NULL,
    skill_id        INT NOT NULL,
    required_level  INT NOT NULL,
    PRIMARY KEY (project_id, skill_id),
    CONSTRAINT chk_required_skill_level CHECK (required_level BETWEEN 1 AND 5),
    CONSTRAINT fk_project_skills_project FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
    CONSTRAINT fk_project_skills_skill FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 6. Table: teams
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS teams;
CREATE TABLE teams (
    team_id         INT AUTO_INCREMENT PRIMARY KEY,
    project_id      INT NOT NULL UNIQUE,
    team_name       VARCHAR(150) NOT NULL UNIQUE,
    max_members     INT NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_max_members CHECK (max_members BETWEEN 2 AND 10),
    CONSTRAINT fk_teams_project FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 7. Table: team_members
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS team_members;
CREATE TABLE team_members (
    team_id         INT NOT NULL,
    user_id         INT NOT NULL,
    member_role     ENUM('LEADER', 'MEMBER') NOT NULL DEFAULT 'MEMBER',
    joined_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (team_id, user_id),
    CONSTRAINT fk_team_members_team FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE CASCADE,
    CONSTRAINT fk_team_members_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 8. Table: applications
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS applications;
CREATE TABLE applications (
    application_id      INT AUTO_INCREMENT PRIMARY KEY,
    user_id             INT NOT NULL,
    project_id          INT NOT NULL,
    message             TEXT,
    compatibility_score DECIMAL(5, 2),
    status              ENUM('PENDING', 'ACCEPTED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    applied_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_compatibility_score CHECK (
        compatibility_score IS NULL OR compatibility_score BETWEEN 0 AND 100
    ),
    CONSTRAINT uq_user_project_application UNIQUE (user_id, project_id),
    CONSTRAINT fk_applications_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_applications_project FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

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

-- =============================================================================
-- DBMS LAB 04 - LEVEL 3 PROJECT
-- PROJECT TITLE: SkillSync: Intelligent Student Project Team Matching System
-- TEAM MEMBER 1: ABHIJNA MARATHE  SRN1: PES2UG24CS020
-- TEAM MEMBER 2: ABHIRUP ROY      SRN2: PES2UG24CS025
-- File: seed.sql
-- Description: Comprehensive Seed Data with realistic student profiles, skills,
--              projects, teams, applications, and verified bcrypt password hashes.
-- Default Password for all accounts: password123
-- Bcrypt Hash: $2b$10$DrFayTHSh7/6CF2B9DgoUOS.KhZ58BQB9bVJl7Y41wZMtajNsN2e6
-- =============================================================================

USE skillsync_db;

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE applications;
TRUNCATE TABLE team_members;
TRUNCATE TABLE teams;
TRUNCATE TABLE project_skills;
TRUNCATE TABLE projects;
TRUNCATE TABLE user_skills;
TRUNCATE TABLE skills;
TRUNCATE TABLE users;

-- -----------------------------------------------------------------------------
-- 1. Seed Users (Faculty / Admins + PES University Students)
-- -----------------------------------------------------------------------------
INSERT INTO users (user_id, name, email, password_hash, role, bio, interests) VALUES
(1, 'Prof. Deena Hajim', 'deenahajim@pes.edu', '$2b$10$DrFayTHSh7/6CF2B9DgoUOS.KhZ58BQB9bVJl7Y41wZMtajNsN2e6', 'ADMIN', 'Assistant Professor, Department of Computer Science & Engineering. Course Faculty for Database Management Systems.', 'Database Systems, Data Modeling, Distributed Databases'),
(2, 'Admin Coordinator', 'admin@skillsync.pes.edu', '$2b$10$DrFayTHSh7/6CF2B9DgoUOS.KhZ58BQB9bVJl7Y41wZMtajNsN2e6', 'ADMIN', 'SkillSync System Administrator for CSE Experiential Learning Projects.', 'System Architecture, Platform Reliability, Cloud Infrastructure'),
(3, 'Abhijna Marathe', 'pes2ug24cs020@pes.edu', '$2b$10$DrFayTHSh7/6CF2B9DgoUOS.KhZ58BQB9bVJl7Y41wZMtajNsN2e6', 'STUDENT', 'CSE Student (SRN: PES2UG24CS020). Passionate about Database Systems, Backend Architecture, and Distributed Systems.', 'Relational Databases, Next.js, Applied Cryptography, Distributed Systems'),
(4, 'Abhirup Roy', 'pes2ug24cs025@pes.edu', '$2b$10$DrFayTHSh7/6CF2B9DgoUOS.KhZ58BQB9bVJl7Y41wZMtajNsN2e6', 'STUDENT', 'CSE Student (SRN: PES2UG24CS025). Full-stack developer with focus on intelligent matching algorithms and NoSQL databases.', 'NoSQL, Graph Databases, Machine Learning, UI/UX Design'),
(5, 'Sneha Reddy', 'pes2ug24cs045@pes.edu', '$2b$10$DrFayTHSh7/6CF2B9DgoUOS.KhZ58BQB9bVJl7Y41wZMtajNsN2e6', 'STUDENT', 'Passionate about Deep Learning and Natural Language Processing. Experience with PyTorch and Transformers.', 'NLP, LLMs, Vector Databases, Data Engineering'),
(6, 'Karthik Nair', 'pes2ug24cs088@pes.edu', '$2b$10$DrFayTHSh7/6CF2B9DgoUOS.KhZ58BQB9bVJl7Y41wZMtajNsN2e6', 'STUDENT', 'Cloud native and DevOps enthusiast. Docker, Kubernetes, and CI/CD pipelines builder.', 'DevOps, Microservices, Cloud Security, Linux Kernel'),
(7, 'Ananya Iyer', 'pes2ug24cs112@pes.edu', '$2b$10$DrFayTHSh7/6CF2B9DgoUOS.KhZ58BQB9bVJl7Y41wZMtajNsN2e6', 'STUDENT', 'Frontend engineer focused on accessible, high-performance web applications using React and Tailwind CSS.', 'Frontend, Figma, Design Systems, Mobile App Dev'),
(8, 'Vikram Malhotra', 'pes2ug24cs140@pes.edu', '$2b$10$DrFayTHSh7/6CF2B9DgoUOS.KhZ58BQB9bVJl7Y41wZMtajNsN2e6', 'STUDENT', 'Cybersecurity researcher and backend engineer working with Node.js and Redis caching layers.', 'Network Security, Redis, Cryptography, API Security');

-- -----------------------------------------------------------------------------
-- 2. Seed Skills Catalog
-- -----------------------------------------------------------------------------
INSERT INTO skills (skill_id, skill_name, category) VALUES
(1,  'MySQL',             'Database'),
(2,  'PostgreSQL',        'Database'),
(3,  'MongoDB',           'NoSQL Database'),
(4,  'Neo4j',             'Graph Database'),
(5,  'Next.js',           'Web Framework'),
(6,  'React',             'Web Framework'),
(7,  'TypeScript',        'Programming Language'),
(8,  'Python',            'Programming Language'),
(9,  'Docker',            'DevOps & Cloud'),
(10, 'PyTorch',           'Machine Learning'),
(11, 'Vector Embeddings', 'AI & Search'),
(12, 'Tailwind CSS',      'Frontend & UI'),
(13, 'FastAPI',           'Backend Framework'),
(14, 'Redis',             'Caching & Memory'),
(15, 'Git & GitHub',      'Software Engineering');

-- -----------------------------------------------------------------------------
-- 3. Seed User Skills with Proficiency Levels (1-5)
-- -----------------------------------------------------------------------------
-- Abhijna Marathe (User 3)
INSERT INTO user_skills (user_id, skill_id, proficiency_level) VALUES
(3, 1,  5), -- MySQL (Expert)
(3, 7,  4), -- TypeScript (Advanced)
(3, 5,  4), -- Next.js (Advanced)
(3, 9,  4), -- Docker (Advanced)
(3, 8,  4), -- Python (Advanced)
(3, 15, 5); -- Git & GitHub (Expert)

-- Abhirup Roy (User 4)
INSERT INTO user_skills (user_id, skill_id, proficiency_level) VALUES
(4, 3,  5), -- MongoDB (Expert)
(4, 5,  4), -- Next.js (Advanced)
(4, 8,  4), -- Python (Advanced)
(4, 11, 4), -- Vector Embeddings (Advanced)
(4, 6,  4), -- React (Advanced)
(4, 12, 4); -- Tailwind CSS (Advanced)

-- Sneha Reddy (User 5)
INSERT INTO user_skills (user_id, skill_id, proficiency_level) VALUES
(5, 8,  5), -- Python (Expert)
(5, 10, 5), -- PyTorch (Expert)
(5, 11, 4), -- Vector Embeddings (Advanced)
(5, 3,  3); -- MongoDB (Intermediate)

-- Karthik Nair (User 6)
INSERT INTO user_skills (user_id, skill_id, proficiency_level) VALUES
(6, 9,  5), -- Docker (Expert)
(6, 8,  3), -- Python (Intermediate)
(6, 14, 4), -- Redis (Advanced)
(6, 1,  3); -- MySQL (Intermediate)

-- Ananya Iyer (User 7)
INSERT INTO user_skills (user_id, skill_id, proficiency_level) VALUES
(7, 6,  5), -- React (Expert)
(7, 12, 5), -- Tailwind CSS (Expert)
(7, 7,  4), -- TypeScript (Advanced)
(7, 5,  3); -- Next.js (Intermediate)

-- Vikram Malhotra (User 8)
INSERT INTO user_skills (user_id, skill_id, proficiency_level) VALUES
(8, 8,  4), -- Python (Advanced)
(8, 14, 4), -- Redis (Advanced)
(8, 1,  3), -- MySQL (Intermediate)
(8, 13, 4); -- FastAPI (Advanced)

-- -----------------------------------------------------------------------------
-- 4. Seed Projects
-- -----------------------------------------------------------------------------
INSERT INTO projects (project_id, created_by, title, description, domain, max_team_size, status) VALUES
(1, 1, 
 'SkillSync: Intelligent Student Project Team Matching System', 
 'An intelligent platform utilizing MySQL relational schema, MongoDB activity logs, and vector cosine similarity to match students with projects and optimal teammates based on skill proficiency and requirements.',
 'Intelligent Systems & Databases', 4, 'OPEN'),

(2, 1, 
 'Distributed High-Throughput Food Order Stream Processing', 
 'Fault-tolerant distributed ordering pipeline with idempotency guarantees, dead-letter queues, real-time aggregation, and persistent analytical database storage.',
 'Distributed Systems', 3, 'OPEN'),

(3, 1, 
 'BioMedical Knowledge Graph & Clinical Query Engine', 
 'Graph-powered database system linking clinical trials, drug interactions, and medical ontology using Neo4j and PostgreSQL hybrid architecture.',
 'Healthcare & Bioinformatics', 4, 'OPEN'),

(4, 1, 
 'Autonomous Edge IoT Telemetry Aggregator', 
 'High-frequency sensor telemetry collector utilizing time-series modeling, edge Docker containers, and live WebSocket dashboards.',
 'IoT & Edge Computing', 3, 'FULL');

-- -----------------------------------------------------------------------------
-- 5. Seed Project Skill Requirements (with required level 1-5)
-- -----------------------------------------------------------------------------
-- Project 1 (SkillSync)
INSERT INTO project_skills (project_id, skill_id, required_level) VALUES
(1, 1,  4), -- MySQL (Level 4)
(1, 3,  3), -- MongoDB (Level 3)
(1, 5,  4), -- Next.js (Level 4)
(1, 7,  3), -- TypeScript (Level 3)
(1, 11, 3); -- Vector Embeddings (Level 3)

-- Project 2 (Distributed Food Order)
INSERT INTO project_skills (project_id, skill_id, required_level) VALUES
(2, 8,  4), -- Python (Level 4)
(2, 9,  4), -- Docker (Level 4)
(2, 14, 3), -- Redis (Level 3)
(2, 1,  3); -- MySQL (Level 3)

-- Project 3 (BioMedical Knowledge Graph)
INSERT INTO project_skills (project_id, skill_id, required_level) VALUES
(3, 4,  4), -- Neo4j (Level 4)
(3, 2,  4), -- PostgreSQL (Level 4)
(3, 8,  4), -- Python (Level 4)
(3, 11, 4); -- Vector Embeddings (Level 4)

-- Project 4 (Edge IoT Telemetry)
INSERT INTO project_skills (project_id, skill_id, required_level) VALUES
(4, 9,  4), -- Docker (Level 4)
(4, 8,  3), -- Python (Level 3)
(4, 14, 3); -- Redis (Level 3)

-- -----------------------------------------------------------------------------
-- 6. Seed Teams
-- -----------------------------------------------------------------------------
INSERT INTO teams (team_id, project_id, team_name, max_members) VALUES
(1, 1, 'SyncSquad - Team 20_25', 4),
(2, 2, 'StreamOps Order Forge', 3),
(3, 4, 'IoT Pulse Vanguard', 3);

-- -----------------------------------------------------------------------------
-- 7. Seed Team Members (with LEADER and MEMBER roles)
-- -----------------------------------------------------------------------------
-- Team 1 (SkillSync): Abhijna (Leader), Abhirup (Member)
INSERT INTO team_members (team_id, user_id, member_role) VALUES
(1, 3, 'LEADER'),
(1, 4, 'MEMBER');

-- Team 2 (Distributed Food Order): Vikram (Leader)
INSERT INTO team_members (team_id, user_id, member_role) VALUES
(2, 8, 'LEADER');

-- Team 3 (IoT Edge - FULL): Karthik (Leader), Ananya (Member), Vikram (Member)
INSERT INTO team_members (team_id, user_id, member_role) VALUES
(3, 6, 'LEADER'),
(3, 7, 'MEMBER');

-- -----------------------------------------------------------------------------
-- 8. Seed Applications
-- -----------------------------------------------------------------------------
INSERT INTO applications (application_id, user_id, project_id, message, compatibility_score, status) VALUES
(1, 3, 1, 'Proficient in MySQL stored procedures, complex views, and Next.js backend integration.', 95.00, 'ACCEPTED'),
(2, 4, 1, 'Specialized in MongoDB aggregations, vector similarity scoring, and responsive Tailwind UI.', 92.50, 'ACCEPTED'),
(3, 7, 1, 'Excited to contribute to frontend UI components and student dashboard ergonomics in Next.js.', 78.00, 'PENDING'),
(4, 5, 1, 'Have background in PyTorch and vector embeddings for semantic team recommendation engine.', 82.50, 'PENDING'),
(5, 6, 2, 'Interested in microservice containerization and Redis caching layer optimization.', 85.00, 'PENDING'),
(6, 5, 3, 'Extensive experience in healthcare NLP embeddings and scientific taxonomy graphs.', 88.00, 'PENDING');

SET FOREIGN_KEY_CHECKS = 1;

-- Verification summary
SELECT 'Database Seeding Completed Successfully' AS status,
       (SELECT COUNT(*) FROM users) AS total_users,
       (SELECT COUNT(*) FROM skills) AS total_skills,
       (SELECT COUNT(*) FROM projects) AS total_projects,
       (SELECT COUNT(*) FROM teams) AS total_teams,
       (SELECT COUNT(*) FROM applications) AS total_applications;
