import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { mockProjects, mockUsers, mockTeams, mockSkills, mockApplications, mockActivityLogs } from '@/lib/mock-data';

export async function GET() {
  try {
    const totalUsers = await query<[{ c: number }]>('SELECT COUNT(*) as c FROM users');
    const totalProjects = await query<[{ c: number }]>('SELECT COUNT(*) as c FROM projects');
    const totalTeams = await query<[{ c: number }]>('SELECT COUNT(*) as c FROM teams');
    const totalSkills = await query<[{ c: number }]>('SELECT COUNT(*) as c FROM skills');
    const totalApps = await query<[{ c: number }]>('SELECT COUNT(*) as c FROM applications');

    return NextResponse.json({
      success: true,
      data: {
        users: totalUsers[0].c,
        projects: totalProjects[0].c,
        teams: totalTeams[0].c,
        skills: totalSkills[0].c,
        applications: totalApps[0].c,
        recent_activity: mockActivityLogs,
      },
    });
  } catch {
    return NextResponse.json({
      success: true,
      data: {
        users: mockUsers.length,
        projects: mockProjects.length,
        teams: mockTeams.length,
        skills: mockSkills.length,
        applications: mockApplications.length,
        recent_activity: mockActivityLogs,
      },
    });
  }
}
