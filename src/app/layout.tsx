import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'SkillSync | Intelligent Student Project Team Matching System',
  description: 'DBMS Level 3 Experiential Learning Project by Abhijna Marathe (PES2UG24CS020) and Abhirup Roy (PES2UG24CS025)',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased font-sans">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-sm text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-slate-800">
                SkillSync — Intelligent Student Project Team Matching System
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                DBMS Experiential Learning Level 3 Project • DBMS LAB 04 • Department of CSE, PES University
              </p>
            </div>
            <div className="text-right text-xs">
              <p className="font-medium text-slate-700">Team 20_25</p>
              <p className="text-slate-500">
                Abhijna Marathe (<span className="font-mono text-blue-600">PES2UG24CS020</span>) &amp; Abhirup Roy (<span className="font-mono text-blue-600">PES2UG24CS025</span>)
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
