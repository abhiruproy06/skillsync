'use client';

import React, { useState, useEffect } from 'react';
import { Project, Skill } from '@/types';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [skillsCatalog, setSkillsCatalog] = useState<Skill[]>([]);
  const [search, setSearch] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(true);

  // Apply Modal state
  const [applyModalProject, setApplyModalProject] = useState<Project | null>(null);
  const [applyMessage, setApplyMessage] = useState('');
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyAlert, setApplyAlert] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Create Project Modal state (Admin)
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDomain, setNewDomain] = useState('Intelligent Systems & Databases');
  const [newMaxMembers, setNewMaxMembers] = useState(4);
  const [createLoading, setCreateLoading] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (selectedDomain) params.set('domain', selectedDomain);
      if (selectedStatus) params.set('status', selectedStatus);

      const res = await fetch(`/api/projects?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setProjects(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetch('/api/skills')
      .then((r) => r.json())
      .then((d) => d.success && setSkillsCatalog(d.data || []));
  }, [selectedDomain, selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProjects();
  };

  const handleApply = async () => {
    if (!applyModalProject) return;
    setApplyLoading(true);
    setApplyAlert(null);
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 3, // Abhijna Marathe
          project_id: applyModalProject.project_id,
          message: applyMessage,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setApplyAlert({ type: 'success', msg: data.message || 'Application submitted successfully!' });
        setTimeout(() => {
          setApplyModalProject(null);
          setApplyMessage('');
          setApplyAlert(null);
        }, 1500);
      } else {
        setApplyAlert({ type: 'error', msg: data.error || 'Failed to submit application' });
      }
    } catch {
      setApplyAlert({ type: 'error', msg: 'Network error submitting application' });
    } finally {
      setApplyLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          domain: newDomain,
          max_team_size: newMaxMembers,
          created_by: 1, // Faculty
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowCreateModal(false);
        setNewTitle('');
        setNewDescription('');
        fetchProjects();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Project Catalog</h1>
          <p className="text-slate-500 text-sm mt-1">
            Browse experiential learning capstone projects, explore skill requirements, and submit applications.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-sm flex items-center space-x-2 self-start md:self-auto"
        >
          <span>+ Create New Project (Admin)</span>
        </button>
      </div>

      {/* Filter and Full-Text Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-6 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects by title, description or keywords (uses MySQL FULLTEXT index ft_projects_search)..."
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl transition-all"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          <span className="font-semibold text-slate-500">Filters:</span>

          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            <option value="">All Domains</option>
            <option value="Intelligent Systems & Databases">Intelligent Systems &amp; Databases</option>
            <option value="Distributed Systems">Distributed Systems</option>
            <option value="Healthcare & Bioinformatics">Healthcare &amp; Bioinformatics</option>
            <option value="IoT & Edge Computing">IoT &amp; Edge Computing</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            <option value="">All Statuses</option>
            <option value="OPEN">OPEN</option>
            <option value="FULL">FULL</option>
          </select>

          {(selectedDomain || selectedStatus || search) && (
            <button
              onClick={() => {
                setSelectedDomain('');
                setSelectedStatus('');
                setSearch('');
                fetchProjects();
              }}
              className="text-blue-600 hover:underline font-semibold ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="py-12 text-center text-slate-400">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
          No projects matched the search criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((proj) => (
            <div
              key={proj.project_id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                    {proj.domain}
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      proj.status === 'OPEN'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {proj.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 leading-snug">{proj.title}</h3>
                <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">{proj.description}</p>
              </div>

              {/* Required Skills Matrix */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Required Skills &amp; Target Levels:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {proj.required_skills?.map((s) => (
                    <span
                      key={s.skill_id}
                      className="text-xs font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200"
                    >
                      {s.skill_name} <strong className="text-blue-600">Lvl {s.required_level}</strong>
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Strip & Action */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">
                    Team: <strong className="text-slate-800">{proj.team_name || 'Open for Team'}</strong>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Capacity: {proj.current_team_members || 0} / {proj.max_team_size} members
                  </p>
                </div>

                {proj.status === 'OPEN' ? (
                  <button
                    onClick={() => {
                      setApplyModalProject(proj);
                      setApplyAlert(null);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    Apply with Match Score
                  </button>
                ) : (
                  <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200">
                    Team Full
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Submit Application */}
      {applyModalProject && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 space-y-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Apply to Project</h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">{applyModalProject.title}</p>
              </div>
              <button
                onClick={() => setApplyModalProject(null)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            {applyAlert && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold ${
                  applyAlert.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {applyAlert.msg}
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 space-y-2">
              <p className="text-xs font-bold text-blue-900">Database Stored Procedure Triggered:</p>
              <p className="text-[11px] text-blue-700 font-mono">
                CALL sp_apply_with_auto_match(user_id=3, project_id={applyModalProject.project_id}, message, @app_id, @score, @result);
              </p>
              <p className="text-[11px] text-blue-600">
                • Triggers <code className="bg-blue-100 px-1 py-0.5 rounded">trg_before_application_check</code> to verify project is OPEN and student is not already enrolled.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Motivation / Statement of Contribution:</label>
              <textarea
                rows={4}
                value={applyMessage}
                onChange={(e) => setApplyMessage(e.target.value)}
                placeholder="Describe your expertise in the required skills and how you will contribute to this project..."
                className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setApplyModalProject(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={applyLoading || !applyMessage.trim()}
                onClick={handleApply}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-all"
              >
                {applyLoading ? 'Executing Procedure...' : 'Submit Application'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create Project (Admin) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 space-y-6 shadow-2xl border border-slate-100">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Create New Project</h3>
                <p className="text-xs text-slate-500 mt-1">Faculty / Admin Project Registration</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Project Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Distributed Consensus Engine"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/30"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Domain</label>
                <select
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                >
                  <option value="Intelligent Systems & Databases">Intelligent Systems &amp; Databases</option>
                  <option value="Distributed Systems">Distributed Systems</option>
                  <option value="Healthcare & Bioinformatics">Healthcare &amp; Bioinformatics</option>
                  <option value="IoT & Edge Computing">IoT &amp; Edge Computing</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Max Team Size (2-10)</label>
                <input
                  type="number"
                  min={2}
                  max={10}
                  value={newMaxMembers}
                  onChange={(e) => setNewMaxMembers(parseInt(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Detailed Description</label>
                <textarea
                  rows={3}
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Describe the scope, deliverables, and architecture..."
                  className="w-full p-3 text-xs rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  {createLoading ? 'Inserting...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

