# SkillSync: Intelligent Student Project Team Matching System

**DBMS Experiential Learning – Level 3 Project (DBMS LAB 04)**  
*Department of Computer Science and Engineering, PES University*

---

### Team Information
- **Team Member 1:** Abhijna Marathe (SRN: `PES2UG24CS020`)
- **Team Member 2:** Abhirup Roy (SRN: `PES2UG24CS025`)
- **Course Instructor:** Dr. Nagasundari S

---

## 1. Project Overview & Motivation
In undergraduate academic environments, project teams are typically assembled haphazardly via social networks, frequently resulting in severe technical imbalance—some groups possess redundant frontend skills but lack relational database knowledge, while others suffer from a complete absence of backend expertise.

**SkillSync** resolves this problem by implementing a multi-paradigm database system combining:
1. **MySQL Relational Schema (3NF):** Enforcing referential integrity, domain constraints, cascades, indexes, views, stored procedures, and ACID transactions.
2. **MongoDB NoSQL Document Store:** Recording fine-grained audit event streams and running analytics aggregation pipelines.
3. **Vector Semantic Search:** Computing TF-IDF / Cosine Vector Similarity between project scopes and student interests to deliver a 70% SQL + 30% Semantic hybrid recommendation ensemble.

---

## 2. System Architecture & Database Design

### Relational Schema (MySQL `skillsync_db`)
The database contains 8 normalized tables:
- **`users`**: Student and faculty user accounts with roles (`STUDENT`, `ADMIN`), bcrypt hashes, and interests.
- **`skills`**: Master taxonomy of technical proficiencies across languages, frameworks, and tools.
- **`user_skills`**: Composite key junction (`user_id`, `skill_id`) with `CHECK (proficiency_level BETWEEN 1 AND 5)`.
- **`projects`**: Project deliverables with `status ENUM('OPEN', 'FULL', 'CLOSED')` and `CHECK (max_team_size BETWEEN 2 AND 10)`.
- **`project_skills`**: Required skills with target competency levels (1-5).
- **`teams`**: Formed teams linked 1:1 with projects (`project_id UNIQUE`).
- **`team_members`**: Junction table maintaining roles (`LEADER`, `MEMBER`).
- **`applications`**: Student proposals with compatibility scores and `UNIQUE (user_id, project_id)`.

### Advanced Database Features Implemented (All 8 Demonstrated)
1. **ACID Transactions:** Stored procedures `sp_create_team_with_leader` and `sp_process_application` wrap multiple dependent DML operations in `START TRANSACTION ... COMMIT` with `ROLLBACK` on `SQLEXCEPTION`.
2. **Database Views (5 Views):**
   - `v_student_skill_profiles`: Student profiles joined with verified proficiencies.
   - `v_project_skill_matrix`: Aggregates required skills per project.
   - `v_student_project_compatibility`: Real-time cross-product matching view.
   - `v_team_rosters`: Aggregates team leaders, members, and open student slots.
   - `v_application_status_tracker`: Live application pipeline state.
3. **Stored Procedures & Functions:**
   - `sp_calculate_compatibility_score`: Mathematical proficiency ratio algorithm.
   - `sp_create_team_with_leader`: Transactional team creation + leader enrollment.
   - `sp_apply_with_auto_match`: Auto-scores and files application in one call.
   - `sp_process_application`: Transactional accept/reject with auto-capacity check.
   - `fn_team_skill_coverage`: Deterministic stored function returning team skill coverage %.
4. **Database Triggers (4 Triggers):**
   - `trg_before_application_check`: Validates project is OPEN and prevents duplicate applications.
   - `trg_check_team_capacity`: Signals `SQLSTATE '45000'` when team capacity is exceeded.
   - `trg_after_team_member_added`: Automatically sets project status to `FULL` when capacity is reached.
   - `trg_prevent_duplicate_leader`: Restricts users from leading excessive active teams simultaneously.
5. **Indexing & Optimization:**
   - B-Tree indexes on `domain`, `status`, foreign keys, and composite `(user_id, status)`.
6. **Full-Text Natural Language Search:**
   - `FULLTEXT INDEX ft_projects_search (title, description)` on `projects`.
7. **NoSQL MongoDB Aggregation:**
   - Multi-stage pipeline (`$group`, `$sum`, `$sort`) analyzing user engagement and application velocities.
8. **Vector Cosine Similarity:**
   - Ensembles relational SQL match points with semantic cosine distance over domain text.

---

## 3. Directory Structure
```
skillsync/
├── database/
│   ├── schema.sql        # Complete DDL tables and constraints
│   ├── indexes.sql       # B-Tree and FULLTEXT indexes
│   ├── views.sql         # 5 complex analytical views
│   ├── procedures.sql    # 4 stored procedures + 1 function
│   ├── triggers.sql      # 4 database business integrity triggers
│   ├── seed.sql          # Sample data with verified bcrypt hashes
│   ├── queries.sql       # DML demonstrations (JOIN, GROUP BY, HAVING, Subqueries)
│   └── setup.sql         # Single master execution script
├── src/
│   ├── app/
│   │   ├── page.tsx            # Landing page & overview
│   │   ├── dashboard/          # Student & Faculty dashboards
│   │   ├── projects/           # Project catalog & full-text search
│   │   ├── teams/              # Team rosters & transaction forms
│   │   ├── matching/           # Live Vector & SQL match engine
│   │   ├── playground/         # Interactive DBMS Lab 04 Sandbox
│   │   ├── docs/               # In-app complete documentation
│   │   └── api/                # Next.js App Router API endpoints
│   ├── components/Navbar.tsx   # Navigation & Persona switcher
│   ├── lib/
│   │   ├── db.ts               # MySQL connection pool
│   │   ├── mongodb.ts          # MongoDB client & logger
│   │   ├── auth.ts             # JWT authentication & session
│   │   └── mock-data.ts        # Built-in demo store for offline evaluation
│   └── types/index.ts          # TypeScript schema definitions
├── .env.example
├── .env.local
├── package.json
└── README.md
```

---

## 4. Setup and Execution Instructions

### Prerequisites
- Node.js (v18+)
- MySQL (v8.0+)
- MongoDB (optional for audit logging, fully supported)

### Step 1: Database Setup
1. Open MySQL terminal or MySQL Workbench:
   ```bash
   mysql -u root -p
   ```
2. Execute the setup script:
   ```sql
   SOURCE /path/to/skillsync/database/setup.sql;
   ```
   *(Alternatively, run each file in sequence: `schema.sql`, `indexes.sql`, `views.sql`, `procedures.sql`, `triggers.sql`, `seed.sql`)*

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env.local` and configure your credentials:
```bash
cp .env.example .env.local
```

### Step 3: Install Dependencies & Run Next.js
```bash
cd skillsync
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Demonstration & Evaluation Guide
1. **Interactive Persona Switcher (Top Right in Navbar):**
   - Click to switch between **Abhijna Marathe** (PES2UG24CS020), **Abhirup Roy** (PES2UG24CS025), and **Dr. Nagasundari S** (Faculty Admin).
2. **Live DBMS Lab 04 Playground (`/playground`):**
   - One-click testing console executing live MySQL Stored Procedures, Views, Triggers, and MongoDB Aggregations with full SQL statement and returned JSON output!
3. **Match Engine (`/matching`):**
   - Inspect the live breakdown between 70% Relational SQL Stored Procedure score and 30% Vector Cosine Similarity.
4. **Project Catalog & Full-Text Search (`/projects`):**
   - Search across projects using MySQL `MATCH(...) AGAINST(...)` natural language mode.
5. **Team Management & ACID Transactions (`/teams`):**
   - Form teams and accept applicants with automatic capacity checks and transactional consistency.

---

## 6. Individual Team Member Responsibilities
- **Abhijna Marathe (PES2UG24CS020):**
  - Database Schema & DDL Design (3NF Normalization)
  - Advanced Views (`v_student_skill_profiles`, `v_student_project_compatibility`)
  - Stored Procedures (`sp_calculate_compatibility_score`, `sp_create_team_with_leader`)
  - Backend Next.js API Routes & Connection Pooling
  - Relational Queries (Correlated Subqueries, JOINs, GROUP BY & HAVING)

- **Abhirup Roy (PES2UG24CS025):**
  - Entity-Relationship (ER) Modeling & Cardinality Mapping
  - Automated Business Triggers & Capacity Signals (`SQLSTATE '45000'`)
  - B-Tree Performance Indexes & Full-Text Indexing
  - MongoDB Activity Logging & NoSQL Aggregation Pipeline
  - Next.js Responsive UI Components, Match Engine Explorer & Playground
