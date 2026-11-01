'use client';

import React, { useState } from 'react';

export default function PlaygroundPage() {
  const [activeQuery, setActiveQuery] = useState<string | null>(null);
  const [queryResult, setQueryResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const executeDemo = async (type: string) => {
    setActiveQuery(type);
    setLoading(true);
    setQueryResult(null);
    try {
      const res = await fetch('/api/demo/execute-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query_type: type }),
      });
      const data = await res.json();
      setQueryResult(data);
    } catch (err) {
      setQueryResult({ success: false, error: 'Query failed' });
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      id: 'PROC_COMPATIBILITY',
      name: '1. Stored Procedure: sp_calculate_compatibility_score',
      type: 'Stored Procedure',
      desc: 'Executes mathematical proficiency ratio matching between student Abhijna Marathe (ID 3) and SkillSync project (ID 1).',
      badge: 'SQL Procedure',
    },
    {
      id: 'FUNC_COVERAGE',
      name: '2. Stored Function: fn_team_skill_coverage',
      type: 'Stored Function',
      desc: 'Calculates the distinct percentage of required skills covered across all team members of SyncSquad (Team 1).',
      badge: 'SQL Function',
    },
    {
      id: 'VIEW_COMPATIBILITY',
      name: '3. View: v_student_project_compatibility',
      type: 'Database View',
      desc: 'Multi-table CROSS JOIN + GROUP BY + subquery calculating real-time dynamic compatibility scores.',
      badge: 'View & Aggregates',
    },
    {
      id: 'VIEW_ROSTERS',
      name: '4. View: v_team_rosters',
      type: 'Database View',
      desc: 'Aggregates team leaders, member rosters, max capacity, and open student slots in real time.',
      badge: 'View & Aggregates',
    },
    {
      id: 'COMPLEX_SUBQUERY',
      name: '5. Correlated Subquery with HAVING',
      type: 'Advanced DML',
      desc: 'Finds students whose average skill proficiency is strictly above the average proficiency of all students.',
      badge: 'Subquery & HAVING',
    },
    {
      id: 'NOSQL_AGGREGATION',
      name: '6. MongoDB NoSQL Aggregation Pipeline',
      type: 'NoSQL Paradigm',
      desc: 'Executes multi-stage MongoDB aggregation ($group, $sum, $max, $sort) on activity and audit event logs.',
      badge: 'MongoDB Pipeline',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white rounded-3xl p-6 md:p-10 shadow-xl space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold">
          <span>⚡ Faculty Evaluation &amp; Demonstration Sandbox</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          DBMS Lab 04 Advanced Features Playground
        </h1>
        <p className="text-slate-300 text-sm md:text-base max-w-3xl leading-relaxed">
          Demonstrating compliance with all Level 3 Project criteria set by Dr. Nagasundari S.
          Click any card below to dispatch and inspect the live execution of Stored Procedures, Functions, Views, Transactions, and NoSQL pipelines.
        </p>
        <div className="pt-2 flex flex-wrap gap-3 text-xs">
          <span className="bg-white/10 px-3 py-1 rounded-lg border border-white/10">
            Abhijna Marathe (<strong className="text-sky-300 font-mono">PES2UG24CS020</strong>)
          </span>
          <span className="bg-white/10 px-3 py-1 rounded-lg border border-white/10">
            Abhirup Roy (<strong className="text-sky-300 font-mono">PES2UG24CS025</strong>)
          </span>
          <span className="bg-white/10 px-3 py-1 rounded-lg border border-white/10">
            Database: <strong className="text-emerald-300 font-mono">MySQL (skillsync_db) + MongoDB</strong>
          </span>
        </div>
      </div>

      {/* Feature Execution Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f) => (
          <div
            key={f.id}
            className={`p-6 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
              activeQuery === f.id
                ? 'bg-blue-50/50 border-blue-400 shadow-md ring-2 ring-blue-500/20'
                : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase tracking-wider">
                  {f.type}
                </span>
                <span className="text-[11px] font-semibold text-blue-600">{f.badge}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">{f.name}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{f.desc}</p>
            </div>

            <button
              onClick={() => executeDemo(f.id)}
              disabled={loading && activeQuery === f.id}
              className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center space-x-2 ${
                activeQuery === f.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              <span>{loading && activeQuery === f.id ? 'Executing Query...' : 'Run Query Live'}</span>
              <span>⚡</span>
            </button>
          </div>
        ))}
      </div>

      {/* Output Console Display */}
      {queryResult && (
        <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-800 space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                PARADIGM: {queryResult.paradigm}
              </span>
              <h3 className="text-lg font-bold text-white mt-1">Live Execution Output</h3>
            </div>
            <button
              onClick={() => setQueryResult(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Close Console ✕
            </button>
          </div>

          {/* SQL / NoSQL Statement */}
          <div className="space-y-1">
            <p className="text-[11px] text-slate-400 font-mono">Executed Query Statement:</p>
            <pre className="p-3 bg-black/50 rounded-xl text-xs font-mono text-sky-300 overflow-x-auto border border-slate-800">
              {queryResult.query}
            </pre>
          </div>

          {/* Returned JSON / Table Data */}
          <div className="space-y-1">
            <p className="text-[11px] text-slate-400 font-mono">Returned Result Set (JSON Array):</p>
            <pre className="p-4 bg-black/60 rounded-xl text-xs font-mono text-emerald-300 max-h-96 overflow-y-auto border border-slate-800">
              {JSON.stringify(queryResult.data, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Triggers & Transactions Documentation Checklist */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">
          Detailed Advanced Database Features Matrix (All 8 Implemented)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <p className="font-bold text-slate-800 text-sm">Feature 1: ACID Transactions</p>
            <p className="text-slate-600">
              Implemented in <code className="bg-white px-1.5 py-0.5 rounded border text-blue-600">sp_create_team_with_leader</code> and <code className="bg-white px-1.5 py-0.5 rounded border text-blue-600">sp_process_application</code>. Rolls back completely with SQLEXCEPTION handler on integrity violation.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <p className="font-bold text-slate-800 text-sm">Feature 2: Database Views (5 Views)</p>
            <p className="text-slate-600">
              <code className="text-indigo-600">v_student_skill_profiles</code>, <code className="text-indigo-600">v_project_skill_matrix</code>, <code className="text-indigo-600">v_student_project_compatibility</code>, <code className="text-indigo-600">v_team_rosters</code>, and <code className="text-indigo-600">v_application_status_tracker</code>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <p className="font-bold text-slate-800 text-sm">Feature 3: Stored Procedures &amp; Functions</p>
            <p className="text-slate-600">
              4 Stored Procedures + 1 Stored Function (<code className="text-blue-600">fn_team_skill_coverage</code>) enforcing domain mathematics, team thresholds, and weighted match points.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <p className="font-bold text-slate-800 text-sm">Feature 4: Database Triggers (4 Triggers)</p>
            <p className="text-slate-600">
              <code className="text-purple-600">trg_before_application_check</code>, <code className="text-purple-600">trg_check_team_capacity</code>, <code className="text-purple-600">trg_after_team_member_added</code>, and <code className="text-purple-600">trg_prevent_duplicate_leader</code> with SQLSTATE 45000 signals.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <p className="font-bold text-slate-800 text-sm">Feature 5: B-Tree &amp; Composite Indexing</p>
            <p className="text-slate-600">
              Foreign key indexes, uniqueness constraints, and composite indexes on <code className="text-blue-600">applications(user_id, status)</code> and <code className="text-blue-600">user_skills(skill_id)</code>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <p className="font-bold text-slate-800 text-sm">Feature 6: Full-Text Natural Language Search</p>
            <p className="text-slate-600">
              Indexed with <code className="bg-white px-1.5 py-0.5 rounded border text-blue-600">FULLTEXT INDEX ft_projects_search (title, description)</code> for relevance-ranked keyword retrieval.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <p className="font-bold text-slate-800 text-sm">Feature 7: NoSQL Pipeline Aggregation</p>
            <p className="text-slate-600">
              Multi-stage MongoDB aggregation ($group, $sum, $sort) computing real-time activity trends, application funnel analysis, and audit trails.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <p className="font-bold text-slate-800 text-sm">Feature 8: Vector Cosine Similarity Search</p>
            <p className="text-slate-600">
              Unstructured semantic embeddings computed across project scopes and student interests ensembled with relational SQL match calculations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
