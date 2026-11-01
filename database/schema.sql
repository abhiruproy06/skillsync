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
