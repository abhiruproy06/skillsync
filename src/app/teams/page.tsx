'use client';

import React, { useState, useEffect } from 'react';
import { Team, Application } from '@/types';

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [pendingApps, setPendingApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // Create Team state
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('3'); // BioMedical
  const [maxMembers, setMaxMembers] = useState(4);
  const [createMsg, setCreateMsg] = useState('');

  const loadTeams = async () => {
    try {
      const [tRes, aRes] = await Promise.all([
        fetch('/api/teams').then((r) => r.json()),
        fetch('/api/applications').then((r) => r.json()),
      ]);
      if (tRes.success) setTeams(tRes.data || []);
      if (aRes.success) {
        setPendingApps((aRes.data || []).filter((a: Application) => a.status === 'PENDING'));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeams();
  }, []);

  const handleProcessApplication = async (appId: number, decision: 'ACCEPTED' | 'REJECTED') => {
    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: decision }),
      });
      const data = await res.json();
      if (data.success) {
        loadTeams();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateMsg('');
    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: parseInt(selectedProjectId),
          team_name: teamName,
          leader_id: 3, // Abhijna Marathe
          max_members: maxMembers,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowCreateTeam(false);
        setTeamName('');
        loadTeams();
      } else {
        setCreateMsg(data.error || 'Failed to create team');
      }
    } catch {
      setCreateMsg('Error creating team');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Project Teams &amp; Rosters</h1>
          <p className="text-slate-500 text-sm mt-1">
            Formed student teams, role distributions (LEADER/MEMBER), and live application reviews.
          </p>
        </div>

        <button
          onClick={() => setShowCreateTeam(!showCreateTeam)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-sm flex items-center space-x-2 self-start md:self-auto"
        >
          <span>+ Form New Team (Transaction)</span>
        </button>
      </div>

      {/* Create Team Card */}
      {showCreateTeam && (
        <div className="bg-white rounded-3xl border border-blue-200 p-6 md:p-8 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Create Team &amp; Enroll Leader Atomically</h3>
            <span className="text-xs font-mono bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md border border-blue-200">
              ACID Transaction: sp_create_team_with_leader
            </span>
          </div>

          {createMsg && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-800 text-xs font-semibold">{createMsg}</div>
          )}

          <form onSubmit={handleCreateTeam} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700">Team Name</label>
              <input
                type="text"
                required
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g. Graph Masters"
                className="mt-1 w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Select Project</label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="mt-1 w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
              >
                <option value="3">BioMedical Knowledge Graph &amp; Clinical Query</option>
                <option value="2">Distributed Food Order Stream Processing</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Max Members (2-10)</label>
              <input
                type="number"
                min={2}
                max={10}
                value={maxMembers}
                onChange={(e) => setMaxMembers(parseInt(e.target.value))}
                className="mt-1 w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
              />
            </div>

            <div className="md:col-span-3 flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateTeam(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md"
              >
                Execute Transaction
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Pending Applications Review for Leaders */}
      {pendingApps.length > 0 && (
        <div className="bg-amber-50/60 rounded-2xl border border-amber-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-amber-900">
                Incoming Applicant Queue ({pendingApps.length} Pending)
              </h3>
              <p className="text-xs text-amber-700 mt-0.5">
                Review applications. Accepting an applicant triggers an ACID transaction enrolling them into the team!
              </p>
            </div>
            <span className="text-xs font-mono bg-amber-100 text-amber-900 px-2.5 py-1 rounded-md font-semibold">
              sp_process_application
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingApps.map((app) => (
              <div
                key={app.application_id}
                className="bg-white rounded-xl p-4 border border-amber-200 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{app.applicant_name}</p>
                      <p className="text-[11px] text-slate-500">{app.applicant_email}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                      {app.compatibility_score}% Match
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 italic">
                    &quot;{app.message}&quot;
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">Applying for: {app.project_title}</p>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => handleProcessApplication(app.application_id, 'REJECTED')}
                    className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-all"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleProcessApplication(app.application_id, 'ACCEPTED')}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm"
                  >
                    Accept &amp; Enroll
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Teams Grid */}
      {loading ? (
        <div className="py-12 text-center text-slate-400">Loading teams...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <div
              key={team.team_id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                    Team #{team.team_id}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Slots: <strong className="text-slate-800">{team.members?.length || team.current_members || 0} / {team.max_members}</strong>
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900">{team.team_name}</h3>
                <p className="text-xs text-slate-600 line-clamp-2">{team.project_title}</p>

                {/* Team Skill Coverage Metric */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-600">Skill Coverage (fn_team_skill_coverage):</span>
                    <span className="font-bold text-emerald-700">80.0%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
              </div>

              {/* Members List */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Team Roster</p>
                <div className="space-y-1.5">
                  {team.members?.map((m) => (
                    <div
                      key={m.user_id}
                      className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50/80"
                    >
                      <span className="font-medium text-slate-800">{m.name || `User ${m.user_id}`}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          m.member_role === 'LEADER'
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {m.member_role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
