'use client';

import React from 'react';

export default function DocsPage() {
  return (
    <div className="space-y-10 max-w-5xl mx-auto py-4">
      {/* Document Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 md:p-12 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-blue-700">
          <span className="bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            DBMS LAB 04 • EXPERIENTIAL LEARNING LEVEL 3 PROJECT
          </span>
          <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200">
            PES UNIVERSITY • DEPARTMENT OF CSE
          </span>
        </div>

        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
          SkillSync: Intelligent Student Project Team Matching System
        </h1>

        <p className="text-base md:text-lg text-slate-600 leading-relaxed">
          Comprehensive Database Design, Implementation, and Web Application Report submitted for DBMS Level 3 Experiential Learning.
        </p>

        {/* Team Details Table */}
        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="text-slate-500 font-medium">Team Member 1</p>
            <p className="text-sm font-bold text-slate-900 mt-1">Abhijna Marathe</p>
            <p className="font-mono text-blue-600 mt-0.5">PES2UG24CS020</p>
            <p className="text-[11px] text-slate-500 mt-2">Database Architecture, DDL, Views, Stored Procedures, API Routes</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="text-slate-500 font-medium">Team Member 2</p>
            <p className="text-sm font-bold text-slate-900 mt-1">Abhirup Roy</p>
            <p className="font-mono text-blue-600 mt-0.5">PES2UG24CS025</p>
            <p className="text-[11px] text-slate-500 mt-2">ER Modeling, Triggers, Indexes, MongoDB &amp; Vector Cosine Match, UI</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="text-slate-500 font-medium">Course Faculty</p>
            <p className="text-sm font-bold text-slate-900 mt-1">Prof. Deena Hajim</p>
            <p className="text-[11px] text-purple-700 mt-0.5 font-semibold">Department of CSE</p>
            <p className="text-[11px] text-slate-500 mt-2">Database Management Systems (Level 3 Project)</p>
          </div>
        </div>
      </div>

      {/* 1. Problem Statement & Objectives */}
      <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">1. Problem Statement &amp; Objectives</h2>
        <div className="space-y-3 text-slate-700 text-sm leading-relaxed">
          <p>
            <strong>Problem:</strong> In undergraduate computer science experiential learning courses, team formation often occurs based purely on social circles rather than balanced technical competency. This results in severe skill imbalances—teams lacking critical database or backend expertise while others have redundant skill sets—leading to suboptimal project outcomes, missed learning opportunities, and uneven contribution burdens.
          </p>
          <p>
            <strong>Objectives:</strong>
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
            <li>Design and normalize an enterprise-grade 3NF relational database schema in MySQL managing users, verified skills, project requirements, teams, and applications.</li>
            <li>Enforce database integrity constraints, cascades, domain CHECKs, and automated business triggers.</li>
            <li>Implement transactional team creation and application processing with automatic capacity management.</li>
            <li>Deploy a multi-paradigm architecture combining MySQL relational structures with MongoDB activity logging and TF-IDF / Cosine Vector similarity search.</li>
            <li>Deliver an interactive, responsive Next.js web application supporting student and administrator workflows.</li>
          </ul>
        </div>
      </section>

      {/* 2. ER Diagram & Relational Schema */}
      <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">2. Entity-Relationship (ER) Diagram &amp; Relational Schema</h2>
          <p className="text-xs text-slate-500 mt-1">
            Converted from the submitted 020_025.pdf design into normalized 3NF relational structure.
          </p>
        </div>

        {/* ASCII / Visual Schema Diagram */}
        <div className="bg-slate-900 text-slate-200 p-6 rounded-2xl overflow-x-auto text-xs font-mono border border-slate-800 leading-tight">
          <pre>{`+--------------------+       1:N       +----------------------+
|       USERS        | <------------- |     USER_SKILLS      |
+--------------------+                +----------------------+
| PK  user_id        |                | PK,FK  user_id       |
|     name           |                | PK,FK  skill_id      |
| UQ  email          |                |        proficiency   | (1-5)
|     password_hash  |                +----------------------+
|     role           | (STUDENT,ADMIN)            |
|     bio, interests |                            | N:1
+--------------------+                            v
       |   |                           +----------------------+
       |   | 1:N                       |        SKILLS        |
       |   v                           +----------------------+
       | +--------------------+        | PK  skill_id         |
       | |    APPLICATIONS    |        | UQ  skill_name       |
       | +--------------------+        |     category         |
       | | PK  application_id |        +----------------------+
       | | FK  user_id        |                   ^
       | | FK  project_id     |                   | N:1
       | |     score (0-100)  |                   |
       | |     status         |        +----------------------+
       | +--------------------+        |    PROJECT_SKILLS    |
       |          |                    +----------------------+
       |          | N:1                | PK,FK  project_id    |
       v          v                    | PK,FK  skill_id      |
+----------------------+      1:N      |        required_level| (1-5)
|       PROJECTS       | ------------> +----------------------+
+----------------------+
| PK  project_id       |
| FK  created_by       |
|     title, desc      |
|     domain           |
|     max_team_size    |
|     status           | (OPEN, FULL, CLOSED)
+----------------------+
          |
          | 1:1
          v
+----------------------+      1:N      +----------------------+
|        TEAMS         | ------------> |     TEAM_MEMBERS     |
+----------------------+                +----------------------+
| PK  team_id          |                | PK,FK  team_id       |
| UQ,FK project_id     |                | PK,FK  user_id       |
| UQ  team_name        |                |        member_role   | (LEADER, MEMBER)
|     max_members      | (2-10)         |        joined_at     |
+----------------------+                +----------------------+`}</pre>
        </div>

        {/* Relational Schema Details */}
        <div className="space-y-3 text-xs text-slate-700">
          <h3 className="font-bold text-sm text-slate-900">Relational Schema Notation (3NF):</h3>
          <ul className="space-y-2 font-mono bg-slate-50 p-4 rounded-xl border border-slate-100">
            <li><strong>USERS</strong> (<u>user_id</u>, name, <em>email</em>, password_hash, role, bio, interests, created_at)</li>
            <li><strong>SKILLS</strong> (<u>skill_id</u>, <em>skill_name</em>, category)</li>
            <li><strong>USER_SKILLS</strong> (<u>user_id</u>*, <u>skill_id</u>*, proficiency_level)</li>
            <li><strong>PROJECTS</strong> (<u>project_id</u>, created_by*, title, description, domain, max_team_size, status, created_at)</li>
            <li><strong>PROJECT_SKILLS</strong> (<u>project_id</u>*, <u>skill_id</u>*, required_level)</li>
            <li><strong>TEAMS</strong> (<u>team_id</u>, <em>project_id</em>*, <em>team_name</em>, max_members, created_at)</li>
            <li><strong>TEAM_MEMBERS</strong> (<u>team_id</u>*, <u>user_id</u>*, member_role, joined_at)</li>
            <li><strong>APPLICATIONS</strong> (<u>application_id</u>, <em>user_id*</em>, <em>project_id*</em>, message, compatibility_score, status, applied_at)</li>
          </ul>
        </div>
      </section>

      {/* 3. Database Choice and Justification */}
      <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">3. Database Choice &amp; Paradigm Justification</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-2">
            <h3 className="font-bold text-blue-900 text-sm">MySQL (Relational SQL - Mandatory)</h3>
            <p className="text-slate-600 leading-relaxed">
              <strong>Justification:</strong> Project rosters, user identities, skill verifications, and application statuses require strict ACID guarantees and foreign key referential integrity. Team member additions cannot leave orphaned rows, and capacity constraints must be enforced atomically.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2">
            <h3 className="font-bold text-emerald-900 text-sm">MongoDB (NoSQL Document Store)</h3>
            <p className="text-slate-600 leading-relaxed">
              <strong>Justification:</strong> High-throughput student activity and audit telemetry (logins, application views, search query keywords, profile updates) exhibit polymorphic schema structures that evolve rapidly. MongoDB document collections and aggregation pipelines handle this append-heavy workload without impacting relational locks.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2">
            <h3 className="font-bold text-indigo-900 text-sm">Vector Embedding &amp; Cosine Match</h3>
            <p className="text-slate-600 leading-relaxed">
              <strong>Justification:</strong> Real-world student project descriptions are unstructured text. Vector similarity search computes cosine angles between student interest vectors and project domain requirements, allowing students interested in &quot;cryptography&quot; to discover &quot;secure distributed ledgers&quot; even without verbatim keyword overlap.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Advanced Database Features Implemented */}
      <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">4. Advanced Database Features Implementation</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold">
                <th className="py-3 px-3">#</th>
                <th className="py-3 px-3">Advanced Feature</th>
                <th className="py-3 px-3">Artifact Name</th>
                <th className="py-3 px-3">Technical Description &amp; Integrity Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr>
                <td className="py-2.5 px-3 font-bold text-slate-900">1</td>
                <td className="py-2.5 px-3 font-semibold text-blue-600">ACID Transactions</td>
                <td className="py-2.5 px-3 font-mono">sp_create_team_with_leader</td>
                <td className="py-2.5 px-3">Atomically creates team row &amp; registers leader with SQLEXCEPTION rollback.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-slate-900">2</td>
                <td className="py-2.5 px-3 font-semibold text-blue-600">Stored Procedure</td>
                <td className="py-2.5 px-3 font-mono">sp_calculate_compatibility_score</td>
                <td className="py-2.5 px-3">Computes weighted proficiency ratio for student-project skill pairings.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-slate-900">3</td>
                <td className="py-2.5 px-3 font-semibold text-blue-600">Stored Function</td>
                <td className="py-2.5 px-3 font-mono">fn_team_skill_coverage</td>
                <td className="py-2.5 px-3">Returns % of project required skills satisfied by team members.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-slate-900">4</td>
                <td className="py-2.5 px-3 font-semibold text-blue-600">Triggers</td>
                <td className="py-2.5 px-3 font-mono">trg_before_application_check</td>
                <td className="py-2.5 px-3">Validates project status is OPEN and signals SQLSTATE 45000 on violation.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-slate-900">5</td>
                <td className="py-2.5 px-3 font-semibold text-blue-600">Database Views</td>
                <td className="py-2.5 px-3 font-mono">v_student_project_compatibility</td>
                <td className="py-2.5 px-3">CROSS JOIN + GROUP BY view providing real-time ranking matrices.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-slate-900">6</td>
                <td className="py-2.5 px-3 font-semibold text-blue-600">Full-Text Search</td>
                <td className="py-2.5 px-3 font-mono">ft_projects_search</td>
                <td className="py-2.5 px-3">Natural language keyword relevance ranking over title and description.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-slate-900">7</td>
                <td className="py-2.5 px-3 font-semibold text-blue-600">NoSQL Aggregation</td>
                <td className="py-2.5 px-3 font-mono">db.activity_logs.aggregate()</td>
                <td className="py-2.5 px-3">Multi-stage pipeline grouping user activity trends and application velocity.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-slate-900">8</td>
                <td className="py-2.5 px-3 font-semibold text-blue-600">Vector Similarity</td>
                <td className="py-2.5 px-3 font-mono">Cosine Match Engine</td>
                <td className="py-2.5 px-3">70% relational skill levels + 30% semantic vector cosine ensemble.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. Team Responsibilities & Contributions */}
      <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">5. Team Member Contributions (Criteria 2 &amp; 15)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700">
          <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Abhijna Marathe</h3>
              <span className="font-mono text-blue-700 font-bold">PES2UG24CS020</span>
            </div>
            <ul className="list-disc pl-4 space-y-1.5 text-slate-600">
              <li>Designed normalized 3NF Relational Schema (8 tables in MySQL).</li>
              <li>Authored DDL statements with primary/foreign keys, cascades, and domain constraints.</li>
              <li>Engineered SQL Views (v_student_skill_profiles, v_student_project_compatibility).</li>
              <li>Developed stored procedures (sp_calculate_compatibility_score, sp_create_team_with_leader).</li>
              <li>Built Next.js backend API routes with MySQL connection pooling and JWT authentication.</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Abhirup Roy</h3>
              <span className="font-mono text-indigo-700 font-bold">PES2UG24CS025</span>
            </div>
            <ul className="list-disc pl-4 space-y-1.5 text-slate-600">
              <li>Formulated Entity-Relationship (ER) model and cardinality diagrams.</li>
              <li>Authored automated business triggers with SQLSTATE integrity signals.</li>
              <li>Implemented B-Tree performance indexes and FULLTEXT search indexing.</li>
              <li>Designed MongoDB activity logging and multi-stage NoSQL aggregation pipelines.</li>
              <li>Engineered Next.js responsive UI components, live match explorer, and interactive sandbox.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

