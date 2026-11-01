'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Project, Application, UserSkill, SessionUser } from '@/types';

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState<SessionUser>({
    user_id: 3,
    name: 'Abhijna Marathe',
    email: 'pes2ug24cs020@pes.edu',
    role: 'STUDENT',
  });
  const [matchedProjects, setMatchedProjects] = useState<any[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const sessionRes = await fetch('/api/auth/session').then((r) => r.json());
        const user = sessionRes.data || currentUser;
        setCurrentUser(user);

        const [matchRes, appRes, skillRes] = await Promise.all([
          fetch(`/api/matching?user_id=${user.user_id}`).then((r) => r.json()),
          fetch(`/api/applications?user_id=${user.user_id}`).then((r) => r.json()),
          fetch(`/api/user-skills?user_id=${user.user_id}`).then((r) => r.json()),
        ]);

        if (matchRes.success) setMatchedProjects(matchRes.data || []);
        if (appRes.success) setApplications(appRes.data || []);
        if (skillRes.success) setUserSkills(skillRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header Profile Greeting */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              Welcome back, {currentUser.name}!
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
              {currentUser.role}
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            {currentUser.email} • {currentUser.user_id === 3 ? 'Team Member 1 (PES2UG24CS020)' : currentUser.user_id === 4 ? 'Team Member 2 (PES2UG24CS025)' : 'DBMS Experiential Learning'}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/matching"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            Run Match Engine
          </Link>
          <Link
            href="/playground"
            className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-semibold border border-indigo-200 transition-all"
          >
            ⚡ Test Stored Procs
          </Link>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Top Match Score</p>
          <p className="text-3xl font-extrabold text-blue-600 mt-2">
            {matchedProjects.length > 0 ? `${matchedProjects[0].weighted_compatibility_score}%` : '95.0%'}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Ensemble SQL + Vector</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">My Applications</p>
          <p className="text-3xl font-extrabold text-indigo-600 mt-2">{applications.length}</p>
          <p className="text-[11px] text-emerald-600 mt-1 font-medium">
            {applications.filter((a) => a.status === 'ACCEPTED').length} Accepted
          </p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Team</p>
          <p className="text-lg font-bold text-slate-900 mt-2 truncate">SyncSquad</p>
          <p className="text-[11px] text-blue-600 mt-1 font-medium">Team 20_25 • Leader</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Verified Skills</p>
          <p className="text-3xl font-extrabold text-emerald-600 mt-2">{userSkills.length}</p>
          <p className="text-[11px] text-slate-400 mt-1">Catalog Proficiencies</p>
        </div>
      </div>

      {/* Main Grid: Recommended Projects & Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Recommended Projects */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Intelligent Project Recommendations for You
            </h2>
            <Link href="/projects" className="text-xs font-semibold text-blue-600 hover:underline">
              View all projects →
            </Link>
          </div>

          <div className="space-y-4">
            {matchedProjects.slice(0, 3).map((proj) => (
              <div
                key={proj.project_id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                      {proj.domain}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-2">{proj.project_title}</h3>
                  </div>

                  <div className="text-right">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-extrabold text-sm">
                      {proj.weighted_compatibility_score}% Match
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">sp_calculate_compatibility</p>
                  </div>
                </div>

                {/* Skill Match Breakdown */}
                <div className="space-y-2 pt-1 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Skill Coverage: {proj.matched_skills_count}/{proj.total_required_skills} Required Skills</span>
                    <span>Semantic Vector Cosine: {proj.semantic_similarity}%</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {proj.matched_skills?.map((s: string) => (
                      <span
                        key={s}
                        className="text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center space-x-1"
                      >
                        <span>✓</span>
                        <span>{s}</span>
                      </span>
                    ))}
                    {proj.missing_skills?.map((s: string) => (
                      <span
                        key={s}
                        className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                      >
                        {s} (missing)
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-500">
                    Max Team Size: <strong className="text-slate-700">{proj.max_team_size} members</strong>
                  </span>
                  <Link
                    href={`/projects`}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all"
                  >
                    View Project Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Applications & Skill Profiles */}
        <div className="space-y-6">
          {/* My Applications */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">My Applications Status</h3>

            <div className="space-y-3">
              {applications.length === 0 ? (
                <p className="text-xs text-slate-500">No applications submitted yet.</p>
              ) : (
                applications.map((app) => (
                  <div key={app.application_id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 truncate max-w-[180px]">
                        {app.project_title}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          app.status === 'ACCEPTED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.status === 'REJECTED'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1 italic">
                      &quot;{app.message}&quot;
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Score: {app.compatibility_score}%</span>
                      <span>Team: {app.team_name || 'Assigned'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* My Verified Skills */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">My Verified Skills</h3>
              <span className="text-[10px] text-slate-400">Scale 1-5</span>
            </div>

            <div className="space-y-3">
              {userSkills.map((us) => (
                <div key={us.skill_id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{us.skill_name}</span>
                    <span className="text-[11px] font-mono text-slate-500">
                      Level {us.proficiency_level}/5 ({us.proficiency_level === 5 ? 'Expert' : us.proficiency_level === 4 ? 'Advanced' : 'Proficient'})
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        us.proficiency_level >= 5
                          ? 'bg-emerald-500'
                          : us.proficiency_level >= 4
                          ? 'bg-blue-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${(us.proficiency_level / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

