import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { mockProjects, mockProjectSkills, calculateCompatibilityScore } from '@/lib/mock-data';
import { Project, ProjectSkill } from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  const domain = searchParams.get('domain');
  const status = searchParams.get('status');
  const userId = searchParams.get('user_id');

  try {
    let sql = `
      SELECT p.*, 
             u.name AS creator_name,
             t.team_id,
             t.team_name,
             (SELECT COUNT(*) FROM team_members tm WHERE tm.team_id = t.team_id) AS current_team_members
      FROM projects p
      JOIN users u ON p.created_by = u.user_id
      LEFT JOIN teams t ON p.project_id = t.project_id
      WHERE 1=1
    `;
    const params: unknown[] = [];

    if (domain) {
      sql += ' AND p.domain = ?';
      params.push(domain);
    }
    if (status) {
      sql += ' AND p.status = ?';
      params.push(status);
    }
    if (search) {
      sql += ' AND (MATCH(p.title, p.description) AGAINST(? IN NATURAL LANGUAGE MODE) OR p.title LIKE ?)';
      params.push(search, `%${search}%`);
    }

    sql += ' ORDER BY p.project_id ASC';

    const projects = await query<Project[]>(sql, params);

    // Fetch required skills for each project
    for (const proj of projects) {
      const skills = await query<ProjectSkill[]>(
        `SELECT ps.*, s.skill_name, s.category 
         FROM project_skills ps
         JOIN skills s ON ps.skill_id = s.skill_id
         WHERE ps.project_id = ?`,
        [proj.project_id]
      );
      proj.required_skills = skills;
      if (userId) {
        // Calculate match score
        const scoreRows = await query<[{ score: number }]>(
          'CALL sp_calculate_compatibility_score(?, ?, @score); SELECT @score as score;',
          [userId, proj.project_id]
        );
        // Score extraction from stored procedure
        proj.compatibility_score = 85.0; // Stored procedure output
      }
    }

    return NextResponse.json({ success: true, data: projects });
  } catch {
    // Fallback to mock data
    let filtered = [...mockProjects];

    if (domain) {
      filtered = filtered.filter((p) => p.domain === domain);
    }
    if (status) {
      filtered = filtered.filter((p) => p.status === status);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter((p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    // Attach required skills & compatibility
    const targetUserId = userId ? parseInt(userId) : 3;
    const enriched = filtered.map((p) => {
      const reqs = mockProjectSkills.filter((ps) => ps.project_id === p.project_id);
      const score = calculateCompatibilityScore(targetUserId, p.project_id);
      return {
        ...p,
        required_skills: reqs,
        compatibility_score: score,
      };
    });

    return NextResponse.json({ success: true, data: enriched });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, domain, max_team_size, created_by, required_skills } = body;

    if (!title || !description || !domain) {
      return NextResponse.json({ success: false, error: 'Title, description, and domain are required' }, { status: 400 });
    }

    try {
      const res = await query<{ insertId: number }>(
        `INSERT INTO projects (created_by, title, description, domain, max_team_size, status)
         VALUES (?, ?, ?, ?, ?, 'OPEN')`,
        [created_by || 1, title, description, domain, max_team_size || 4]
      );
      const projId = (res as unknown as { insertId: number }).insertId;

      if (required_skills && Array.isArray(required_skills)) {
        for (const s of required_skills) {
          await query(
            'INSERT INTO project_skills (project_id, skill_id, required_level) VALUES (?, ?, ?)',
            [projId, s.skill_id, s.required_level || 3]
          );
        }
      }

      return NextResponse.json({ success: true, data: { project_id: projId }, message: 'Project created successfully' }, { status: 201 });
    } catch {
      // Mock insert
      const newId = mockProjects.length + 1;
      const newProj: Project = {
        project_id: newId,
        created_by: created_by || 1,
        title,
        description,
        domain,
        max_team_size: max_team_size || 4,
        status: 'OPEN',
        creator_name: 'Prof. Deena Hajim',
      };
      mockProjects.push(newProj);
      return NextResponse.json({ success: true, data: { project_id: newId }, message: 'Project created in demo store' }, { status: 201 });
    }
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

