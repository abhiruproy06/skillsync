import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { mockTeams } from '@/lib/mock-data';
import { Team } from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('project_id');

  try {
    let sql = `
      SELECT t.*, 
             p.title AS project_title,
             p.domain,
             (SELECT COUNT(*) FROM team_members tm WHERE tm.team_id = t.team_id) AS current_members,
             u.name AS leader_name,
             u.user_id AS leader_id
      FROM teams t
      JOIN projects p ON t.project_id = p.project_id
      LEFT JOIN team_members tm_lead ON t.team_id = tm_lead.team_id AND tm_lead.member_role = 'LEADER'
      LEFT JOIN users u ON tm_lead.user_id = u.user_id
      WHERE 1=1
    `;
    const params: unknown[] = [];
    if (projectId) {
      sql += ' AND t.project_id = ?';
      params.push(projectId);
    }
    sql += ' ORDER BY t.team_id ASC';

    const teams = await query<Team[]>(sql, params);

    for (const team of teams) {
      team.members = await query(
        `SELECT tm.*, u.name, u.email 
         FROM team_members tm
         JOIN users u ON tm.user_id = u.user_id
         WHERE tm.team_id = ?`,
        [team.team_id]
      );
    }

    return NextResponse.json({ success: true, data: teams });
  } catch {
    let filtered = [...mockTeams];
    if (projectId) {
      filtered = filtered.filter((t) => t.project_id === parseInt(projectId));
    }
    return NextResponse.json({ success: true, data: filtered });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { project_id, team_name, leader_id, max_members } = body;

    if (!project_id || !team_name || !leader_id) {
      return NextResponse.json({ success: false, error: 'Project ID, team name, and leader ID required' }, { status: 400 });
    }

    try {
      // Execute stored procedure sp_create_team_with_leader
      await query(
        'CALL sp_create_team_with_leader(?, ?, ?, ?, @team_id, @msg); SELECT @team_id as team_id, @msg as message;',
        [project_id, team_name, leader_id, max_members || 4]
      );
      return NextResponse.json({ success: true, message: 'Team created with leader via stored procedure transaction' }, { status: 201 });
    } catch {
      // Mock create
      const newTeamId = mockTeams.length + 1;
      mockTeams.push({
        team_id: newTeamId,
        project_id,
        team_name,
        max_members: max_members || 4,
        leader_name: 'Abhijna Marathe',
        leader_id,
        current_members: 1,
        members: [{ team_id: newTeamId, user_id: leader_id, member_role: 'LEADER', name: 'Abhijna Marathe' }],
      });
      return NextResponse.json({ success: true, message: 'Team created in demo store', data: { team_id: newTeamId } }, { status: 201 });
    }
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
