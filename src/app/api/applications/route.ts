import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { mockApplications, mockUsers, mockProjects, calculateCompatibilityScore } from '@/lib/mock-data';
import { Application } from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_id');
  const projectId = searchParams.get('project_id');

  try {
    let sql = `
      SELECT a.*, 
             u.name AS applicant_name,
             u.email AS applicant_email,
             p.title AS project_title,
             t.team_name
      FROM applications a
      JOIN users u ON a.user_id = u.user_id
      JOIN projects p ON a.project_id = p.project_id
      LEFT JOIN teams t ON p.project_id = t.project_id
      WHERE 1=1
    `;
    const params: unknown[] = [];
    if (userId) {
      sql += ' AND a.user_id = ?';
      params.push(userId);
    }
    if (projectId) {
      sql += ' AND a.project_id = ?';
      params.push(projectId);
    }
    sql += ' ORDER BY a.application_id DESC';

    const apps = await query<Application[]>(sql, params);
    return NextResponse.json({ success: true, data: apps });
  } catch {
    let filtered = [...mockApplications];
    if (userId) {
      filtered = filtered.filter((a) => a.user_id === parseInt(userId));
    }
    if (projectId) {
      filtered = filtered.filter((a) => a.project_id === parseInt(projectId));
    }
    return NextResponse.json({ success: true, data: filtered });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, project_id, message } = body;

    if (!user_id || !project_id) {
      return NextResponse.json({ success: false, error: 'User ID and Project ID are required' }, { status: 400 });
    }

    try {
      // Use procedure sp_apply_with_auto_match
      await query(
        'CALL sp_apply_with_auto_match(?, ?, ?, @app_id, @score, @result);',
        [user_id, project_id, message || '']
      );
      return NextResponse.json({ success: true, message: 'Application submitted with live database match score' }, { status: 201 });
    } catch {
      // Mock application
      const existing = mockApplications.find((a) => a.user_id === user_id && a.project_id === project_id);
      if (existing) {
        return NextResponse.json({ success: false, error: 'Already applied for this project' }, { status: 400 });
      }

      const score = calculateCompatibilityScore(user_id, project_id);
      const student = mockUsers.find((u) => u.user_id === user_id);
      const proj = mockProjects.find((p) => p.project_id === project_id);

      const newApp: Application = {
        application_id: mockApplications.length + 1,
        user_id,
        project_id,
        message: message || '',
        compatibility_score: score,
        status: 'PENDING',
        applicant_name: student?.name,
        applicant_email: student?.email,
        project_title: proj?.title,
        applied_at: new Date().toISOString(),
      };
      mockApplications.unshift(newApp);

      return NextResponse.json({ success: true, data: newApp, message: 'Application submitted successfully' }, { status: 201 });
    }
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

