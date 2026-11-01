'use client';

import React, { useState, useEffect } from 'react';
import { mockUsers } from '@/lib/mock-data';

export default function MatchingPage() {
  const [selectedUserId, setSelectedUserId] = useState(3); // Abhijna Marathe
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/matching?user_id=${selectedUserId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setResults(d.data || []);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedUserId]);

  const activeStudent = mockUsers.find((u) => u.user_id === selectedUserId);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
            <span>DBMS Advanced Feature 8: Vector Similarity &amp; SQL Ensemble</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-2">
            Intelligent Match Engine
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Combines MySQL Relational Skill Levels with Vector Semantic Cosine Embeddings.
          </p>
        </div>

        {/* Student Selector */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
          <label className="text-xs font-bold text-slate-700">Target Student:</label>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(parseInt(e.target.value))}
            className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-500/30"
          >
            {mockUsers.filter((u) => u.role === 'STUDENT').map((u) => (
              <option key={u.user_id} value={u.user_id}>
                {u.name} ({u.user_id === 3 ? 'CS020' : u.user_id === 4 ? 'CS025' : u.email.split('@')[0]})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Algorithm Explainer Box */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-6 md:p-8 shadow-xl space-y-4">
        <h2 className="text-lg font-bold text-blue-200">Matching Paradigm &amp; Formulation</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
          <div className="bg-white/10 p-4 rounded-xl border border-white/10 space-y-2">
            <p className="font-bold text-white text-sm">1. SQL Proficiency Ratio (70%)</p>
            <p className="leading-relaxed">
              Implemented in stored procedure <code className="text-sky-300">sp_calculate_compatibility_score</code>:
            </p>
            <p className="font-mono bg-black/30 p-2 rounded text-[11px] text-sky-200">
              Score = (∑ min(1.0, user_level / req_level) / N_req) × 100
            </p>
            <p className="text-slate-400">Enforces relational constraints &amp; verifies certified skills.</p>
          </div>

          <div className="bg-white/10 p-4 rounded-xl border border-white/10 space-y-2">
            <p className="font-bold text-white text-sm">2. Vector Cosine Similarity (30%)</p>
            <p className="leading-relaxed">
              Vector embeddings generated across student interest taxonomy and project domain descriptions:
            </p>
            <p className="font-mono bg-black/30 p-2 rounded text-[11px] text-sky-200">
              cos(θ) = (A • B) / (||A|| × ||B||)
            </p>
            <p className="text-slate-400">Captures semantic affinity and complementary domain background.</p>
          </div>

          <div className="bg-white/10 p-4 rounded-xl border border-white/10 space-y-2">
            <p className="font-bold text-white text-sm">3. Hybrid Ensemble Result</p>
            <p className="leading-relaxed">
              Synthesizes relational certainty with unstructured textual alignment:
            </p>
            <p className="font-mono bg-black/30 p-2 rounded text-[11px] text-emerald-300">
              Final_Score = 0.70 × SQL_Score + 0.30 × Vector_Cosine
            </p>
            <p className="text-slate-400">Guarantees optimal team synergy and academic requirements fit.</p>
          </div>
        </div>
      </div>

      {/* Results Ranking */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            Project Compatibility Rankings for {activeStudent?.name}
          </h2>
          <span className="text-xs text-slate-500 font-mono">Ranked by Final Ensemble Score</span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400">Computing compatibility scores...</div>
        ) : (
          <div className="space-y-4">
            {results.map((item, idx) => (
              <div
                key={item.project_id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <span className="w-8 h-8 rounded-full bg-slate-900 text-white font-extrabold text-sm flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <div>
                      <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {item.domain}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-1">{item.project_title}</h3>
                    </div>
                  </div>

                  {/* Big Score Badge */}
                  <div className="text-right flex items-center space-x-4 self-end sm:self-auto">
                    <div>
                      <div className="text-2xl font-black text-blue-600">
                        {item.weighted_compatibility_score}%
                      </div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                        Final Ensemble
                      </p>
                    </div>
                  </div>
                </div>

                {/* Score Components Comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 text-xs">
                  {/* SQL Component */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-700">SQL Skill Proficiency (70% weight):</span>
                      <strong className="text-slate-900 font-mono">{item.skill_coverage_percent}%</strong>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${item.skill_coverage_percent}%` }}
                      ></div>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Matched {item.matched_skills_count} of {item.total_required_skills} required skills
                    </p>
                  </div>

                  {/* Vector Semantic Component */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-700">Vector Cosine Similarity (30% weight):</span>
                      <strong className="text-slate-900 font-mono">{item.semantic_similarity}%</strong>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full"
                        style={{ width: `${item.semantic_similarity}%` }}
                      ></div>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Evaluated on student interest taxonomy vs project domain
                    </p>
                  </div>
                </div>

                {/* Skill List */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <span className="font-semibold text-slate-500 text-[11px]">Matched:</span>
                  {item.matched_skills?.map((s: string) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium"
                    >
                      ✓ {s}
                    </span>
                  ))}
                  {item.missing_skills?.length > 0 && (
                    <>
                      <span className="font-semibold text-slate-400 text-[11px] ml-2">Missing:</span>
                      {item.missing_skills.map((s: string) => (
                        <span key={s} className="px-2 py-0.5 rounded bg-slate-100 text-slate-500">
                          {s}
                        </span>
                      ))}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
