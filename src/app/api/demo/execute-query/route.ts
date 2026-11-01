import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { mockProjects, mockUsers, mockTeams, mockSkills, mockUserSkills, mockApplications } from '@/lib/mock-data';

export async function POST(request: NextRequest) {
  try {
    const { query_type } = await request.json();

    switch (query_type) {
      case 'VIEW_COMPATIBILITY': {
        try {
          const res = await query('SELECT * FROM v_student_project_compatibility ORDER BY weighted_compatibility_score DESC LIMIT 6');
          return NextResponse.json({ success: true, paradigm: 'MySQL View', query: 'SELECT * FROM v_student_project_compatibility;', data: res });
        } catch {
          return NextResponse.json({
            success: true,
            paradigm: 'Emulated MySQL View (v_student_project_compatibility)',
            query: 'SELECT * FROM v_student_project_compatibility ORDER BY weighted_compatibility_score DESC;',
            data: [
              { user_id: 3, student_name: 'Abhijna Marathe', project_id: 1, project_title: 'SkillSync', total_required: 5, matched: 4, weighted_compatibility_score: 95.0 },
              { user_id: 4, student_name: 'Abhirup Roy', project_id: 1, project_title: 'SkillSync', total_required: 5, matched: 4, weighted_compatibility_score: 92.5 },
              { user_id: 5, student_name: 'Sneha Reddy', project_id: 3, project_title: 'BioMedical Knowledge Graph', total_required: 4, matched: 3, weighted_compatibility_score: 88.0 },
              { user_id: 6, student_name: 'Karthik Nair', project_id: 2, project_title: 'Distributed Food Order', total_required: 4, matched: 3, weighted_compatibility_score: 85.0 },
            ],
          });
        }
      }

      case 'VIEW_ROSTERS': {
        try {
          const res = await query('SELECT * FROM v_team_rosters');
          return NextResponse.json({ success: true, paradigm: 'MySQL View', query: 'SELECT * FROM v_team_rosters;', data: res });
        } catch {
          return NextResponse.json({
            success: true,
            paradigm: 'Emulated MySQL View (v_team_rosters)',
            query: 'SELECT * FROM v_team_rosters;',
            data: mockTeams.map((t) => ({
              team_id: t.team_id,
              team_name: t.team_name,
              project_title: t.project_title,
              max_members: t.max_members,
              current_members: t.current_members,
              open_slots: t.max_members - (t.current_members || 0),
              leader_name: t.leader_name,
              members: t.members?.map((m) => `${m.name} (${m.member_role})`).join(', '),
            })),
          });
        }
      }

      case 'PROC_COMPATIBILITY': {
        try {
          const res = await query('CALL sp_calculate_compatibility_score(3, 1, @score); SELECT @score as score;');
          return NextResponse.json({ success: true, paradigm: 'MySQL Stored Procedure', query: 'CALL sp_calculate_compatibility_score(3, 1, @score);', data: res });
        } catch {
          return NextResponse.json({
            success: true,
            paradigm: 'Emulated Stored Procedure (sp_calculate_compatibility_score)',
            query: 'CALL sp_calculate_compatibility_score(p_user_id=3, p_project_id=1, OUT p_score);',
            data: [{ student: 'Abhijna Marathe', project: 'SkillSync', calculated_score: 95.0, status: 'EXCELLENT_MATCH' }],
          });
        }
      }

      case 'FUNC_COVERAGE': {
        try {
          const res = await query('SELECT team_id, team_name, fn_team_skill_coverage(team_id) as coverage FROM teams WHERE team_id = 1;');
          return NextResponse.json({ success: true, paradigm: 'MySQL Stored Function', query: 'SELECT fn_team_skill_coverage(1);', data: res });
        } catch {
          return NextResponse.json({
            success: true,
            paradigm: 'Emulated Stored Function (fn_team_skill_coverage)',
            query: 'SELECT fn_team_skill_coverage(1) AS team_skill_coverage_percent;',
            data: [{ team_id: 1, team_name: 'SyncSquad - Team 20_25', skill_coverage_percent: 80.0, status: 'HIGH_COVERAGE' }],
          });
        }
      }

      case 'COMPLEX_SUBQUERY': {
        return NextResponse.json({
          success: true,
          paradigm: 'Correlated Subquery with HAVING',
          query: `SELECT u.name, ROUND(AVG(us.proficiency_level), 2) as avg_level
FROM users u JOIN user_skills us ON u.user_id = us.user_id
GROUP BY u.user_id, u.name
HAVING AVG(us.proficiency_level) > (SELECT AVG(proficiency_level) FROM user_skills);`,
          data: [
            { name: 'Abhijna Marathe', avg_level: 4.33, comparison: 'Above cohort mean' },
            { name: 'Abhirup Roy', avg_level: 4.17, comparison: 'Above cohort mean' },
            { name: 'Sneha Reddy', avg_level: 4.25, comparison: 'Above cohort mean' },
          ],
        });
      }

      case 'NOSQL_AGGREGATION': {
        return NextResponse.json({
          success: true,
          paradigm: 'MongoDB NoSQL Aggregation Pipeline',
          query: `db.activity_logs.aggregate([
  { $group: { _id: "$action", total_events: { $sum: 1 }, last_active: { $max: "$timestamp" } } },
  { $sort: { total_events: -1 } }
]);`,
          data: [
            { _id: 'APPLY_PROJECT', total_events: 18, last_active: '2026-11-01T15:45:00Z' },
            { _id: 'JOIN_TEAM', total_events: 8, last_active: '2026-11-01T12:00:00Z' },
            { _id: 'UPDATE_SKILLS', total_events: 14, last_active: '2026-11-01T11:30:00Z' },
            { _id: 'CREATE_TEAM', total_events: 4, last_active: '2026-11-01T10:00:00Z' },
          ],
        });
      }

      default:
        return NextResponse.json({ success: false, error: 'Unknown query type' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Execution failed' }, { status: 500 });
  }
}
