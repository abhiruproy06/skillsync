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
(1, 'Dr. Nagasundari S', 'nagasundari@pes.edu', '$2b$10$DrFayTHSh7/6CF2B9DgoUOS.KhZ58BQB9bVJl7Y41wZMtajNsN2e6', 'ADMIN', 'Associate Professor, Department of Computer Science & Engineering. Course Instructor for Database Management Systems.', 'Database Systems, Data Mining, Distributed Databases'),
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
