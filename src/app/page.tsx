import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="space-y-12 py-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white p-8 md:p-14 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>DBMS Experiential Learning • Level 3 Project (LAB 04)</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Skill<span className="text-sky-400">Sync</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 font-medium">
            Intelligent Student Project Team Matching System
          </p>

          <p className="text-slate-300 text-base md:text-lg leading-relaxed">
            Eliminating team formation mismatches through advanced database engineering. 
            Combining <span className="text-white font-semibold">MySQL Relational Schemas</span>, 
            <span className="text-white font-semibold"> Stored Procedures</span>, 
            <span className="text-white font-semibold"> ACID Transactions</span>, and 
            <span className="text-white font-semibold"> Vector Similarity Matching</span>.
          </p>

          {/* Team Pill */}
          <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium text-slate-300">
            <div className="bg-white/10 px-3.5 py-1.5 rounded-lg border border-white/10">
              <span className="text-slate-400">Team Member 1:</span> <strong className="text-white">Abhijna Marathe</strong> (SRN: <span className="font-mono text-sky-300">PES2UG24CS020</span>)
            </div>
            <div className="bg-white/10 px-3.5 py-1.5 rounded-lg border border-white/10">
              <span className="text-slate-400">Team Member 2:</span> <strong className="text-white">Abhirup Roy</strong> (SRN: <span className="font-mono text-sky-300">PES2UG24CS025</span>)
            </div>
          </div>

          <div className="pt-4 flex flex-wrap gap-4">
            <Link
              href="/matching"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center space-x-2"
            >
              <span>Explore Match Engine</span>
              <span>→</span>
            </Link>
            <Link
              href="/playground"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all flex items-center space-x-2"
            >
              <span>⚡ Live DBMS Lab 04 Sandbox</span>
            </Link>
            <Link
              href="/docs"
              className="px-6 py-3 rounded-xl bg-transparent hover:bg-white/5 text-slate-300 hover:text-white font-medium text-sm transition-all"
            >
              View Documentation &amp; ERD
            </Link>
          </div>
        </div>

        {/* Decorative Grid Pattern */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </section>

      {/* 3 Core Architectural Pillars */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Multi-Paradigm Database Architecture</h2>
          <p className="text-sm text-slate-600">
            Satisfying Prof. Deena Hajim&apos;s Level 3 DBMS specifications through SQL relational design, ACID transactions, and NoSQL/Vector search.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl">
              🐬
            </div>
            <h3 className="text-lg font-bold text-slate-900">MySQL Relational Core</h3>
            <p className="text-sm text-slate-600">
              8 normalized tables with foreign keys (CASCADE/RESTRICT), domain CHECK constraints, UNIQUE composite keys, and B-Tree indexes.
            </p>
            <div className="pt-2 text-xs text-blue-700 font-mono bg-blue-50/50 p-2.5 rounded-lg border border-blue-100">
              InnoDB • UTF8MB4 • FULLTEXT Index • Foreign Key Cascades
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xl">
              ⚙️
            </div>
            <h3 className="text-lg font-bold text-slate-900">Advanced SQL Programmability</h3>
            <p className="text-sm text-slate-600">
              5 database views, 4 stored procedures, 1 deterministic function, and 4 automated triggers maintaining transactional consistency.
            </p>
            <div className="pt-2 text-xs text-indigo-700 font-mono bg-indigo-50/50 p-2.5 rounded-lg border border-indigo-100">
              sp_calculate_compatibility_score • sp_create_team • Triggers
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl">
              🍃
            </div>
            <h3 className="text-lg font-bold text-slate-900">NoSQL &amp; Vector Similarity</h3>
            <p className="text-sm text-slate-600">
              MongoDB activity logging with aggregation pipelines combined with TF-IDF Vector Cosine Similarity for intelligent team recommendations.
            </p>
            <div className="pt-2 text-xs text-emerald-700 font-mono bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100">
              MongoDB Audit Logs • Cosine Similarity • 70/30 Ensemble Match
            </div>
          </div>
        </div>
      </section>

      {/* Quick Action Matrix */}
      <section className="bg-slate-100/70 rounded-2xl p-6 border border-slate-200 space-y-4">
        <h3 className="text-base font-bold text-slate-800">Direct Navigation Shortcuts</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            href="/dashboard"
            className="p-3.5 bg-white rounded-xl border border-slate-200 text-center hover:border-blue-400 hover:shadow-sm transition-all"
          >
            <p className="text-sm font-semibold text-slate-800">Student Dashboard</p>
            <p className="text-xs text-slate-500 mt-1">Applications &amp; Profile</p>
          </Link>
          <Link
            href="/projects"
            className="p-3.5 bg-white rounded-xl border border-slate-200 text-center hover:border-blue-400 hover:shadow-sm transition-all"
          >
            <p className="text-sm font-semibold text-slate-800">Project Catalog</p>
            <p className="text-xs text-slate-500 mt-1">Full-Text Search &amp; Apply</p>
          </Link>
          <Link
            href="/teams"
            className="p-3.5 bg-white rounded-xl border border-slate-200 text-center hover:border-blue-400 hover:shadow-sm transition-all"
          >
            <p className="text-sm font-semibold text-slate-800">Team Rosters</p>
            <p className="text-xs text-slate-500 mt-1">Leader &amp; Member Slots</p>
          </Link>
          <Link
            href="/playground"
            className="p-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-center shadow-md shadow-blue-500/20 hover:opacity-95 transition-all"
          >
            <p className="text-sm font-bold">⚡ Lab 04 Playground</p>
            <p className="text-xs text-blue-100 mt-1">Run Live Queries &amp; Procs</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
