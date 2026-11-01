-- =============================================================================
-- DBMS LAB 04 - LEVEL 3 PROJECT
-- PROJECT TITLE: SkillSync: Intelligent Student Project Team Matching System
-- TEAM MEMBER 1: ABHIJNA MARATHE  SRN1: PES2UG24CS020
-- TEAM MEMBER 2: ABHIRUP ROY      SRN2: PES2UG24CS025
-- File: setup.sql
-- Description: Master installation script that creates the complete database,
--              schema, indexes, views, stored procedures, triggers, and seed data.
-- =============================================================================

CREATE DATABASE IF NOT EXISTS skillsync_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE skillsync_db;

SOURCE schema.sql;
SOURCE indexes.sql;
SOURCE views.sql;
SOURCE procedures.sql;
SOURCE triggers.sql;
SOURCE seed.sql;

SELECT 'SkillSync Database Setup Completed Successfully!' AS result;

