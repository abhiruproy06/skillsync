'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { mockUsers } from '@/lib/mock-data';
import { SessionUser } from '@/types';

export default function Navbar() {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<SessionUser>({
    user_id: 3,
    name: 'Abhijna Marathe',
    email: 'pes2ug24cs020@pes.edu',
    role: 'STUDENT',
  });
  const [showSwitch, setShowSwitch] = useState(false);

  useEffect(() => {
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setCurrentUser(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const handleSwitchUser = async (u: typeof mockUsers[0]) => {
    try {
      await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: u.email, password: 'password123' }),
      });
      setCurrentUser({
        user_id: u.user_id,
        name: u.name,
        email: u.email,
        role: u.role,
      });
      setShowSwitch(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/projects', label: 'Projects' },
    { href: '/teams', label: 'Teams' },
    { href: '/matching', label: 'Match Engine' },
    { href: '/playground', label: 'DBMS Lab 04 Playground' },
    { href: '/docs', label: 'Documentation' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & PES University Branding */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-sky-400 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-blue-500/20">
                S
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  Skill<span className="text-blue-600">Sync</span>
                </span>
                <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  PES University
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const isPlayground = link.href === '/playground';
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : isPlayground
                      ? 'text-indigo-600 hover:bg-indigo-50 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {isPlayground && <span className="mr-1.5">⚡</span>}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* User Switcher Persona */}
          <div className="relative">
            <button
              onClick={() => setShowSwitch(!showSwitch)}
              className="flex items-center space-x-2 p-1.5 pr-3 rounded-full border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 transition-all text-left"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-semibold flex items-center justify-center text-xs">
                {currentUser.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .substring(0, 2)}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-slate-800 leading-tight">{currentUser.name}</p>
                <p className="text-[10px] text-slate-500 font-medium">
                  {currentUser.role === 'ADMIN' ? 'Faculty Admin' : 'Student (SRN)'}
                </p>
              </div>
              <span className="text-slate-400 text-xs ml-1">▼</span>
            </button>

            {/* Persona Switcher Dropdown */}
            {showSwitch && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50">
                <div className="px-3 py-1.5 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Switch Evaluation Persona
                  </p>
                </div>

                {/* Team Members */}
                <div className="px-3 py-1">
                  <p className="text-[11px] font-bold text-blue-600 uppercase mt-1">Project Team Members</p>
                </div>
                {mockUsers.slice(2, 4).map((u) => (
                  <button
                    key={u.user_id}
                    onClick={() => handleSwitchUser(u)}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-blue-50 transition-colors ${
                      currentUser.user_id === u.user_id ? 'bg-blue-50/70 font-semibold' : ''
                    }`}
                  >
                    <div>
                      <p className="text-xs font-medium text-slate-800">{u.name}</p>
                      <p className="text-[10px] text-slate-500">{u.email}</p>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-mono">
                      {u.user_id === 3 ? 'CS020' : 'CS025'}
                    </span>
                  </button>
                ))}

                {/* Faculty / Instructor */}
                <div className="px-3 py-1 border-t border-slate-100 mt-1">
                  <p className="text-[11px] font-bold text-purple-600 uppercase mt-1">Course Faculty / Admin</p>
                </div>
                {mockUsers.slice(0, 1).map((u) => (
                  <button
                    key={u.user_id}
                    onClick={() => handleSwitchUser(u)}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-purple-50 transition-colors ${
                      currentUser.user_id === u.user_id ? 'bg-purple-50/70 font-semibold' : ''
                    }`}
                  >
                    <div>
                      <p className="text-xs font-medium text-slate-800">{u.name}</p>
                      <p className="text-[10px] text-slate-500">{u.email}</p>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 font-bold">
                      INSTRUCTOR
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
