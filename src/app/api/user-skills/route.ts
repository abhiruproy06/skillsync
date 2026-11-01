import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { mockUserSkills, mockSkills } from '@/lib/mock-data';
import { UserSkill } from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_id') || '3'; // Default to Abhijna Marathe

  try {
    const skills = await query<UserSkill[]>(
      `SELECT us.*, s.skill_name, s.category
       FROM user_skills us
       JOIN skills s ON us.skill_id = s.skill_id
       WHERE us.user_id = ?
       ORDER BY us.proficiency_level DESC`,
      [userId]
    );
    return NextResponse.json({ success: true, data: skills });
  } catch {
    const list = mockUserSkills.filter((us) => us.user_id === parseInt(userId));
    return NextResponse.json({ success: true, data: list });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, skill_id, proficiency_level } = body;

    if (!user_id || !skill_id || !proficiency_level) {
      return NextResponse.json({ success: false, error: 'User ID, skill ID, and proficiency level required' }, { status: 400 });
    }

    try {
      await query(
        `INSERT INTO user_skills (user_id, skill_id, proficiency_level)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE proficiency_level = VALUES(proficiency_level)`,
        [user_id, skill_id, proficiency_level]
      );
      return NextResponse.json({ success: true, message: 'Skill updated successfully' });
    } catch {
      // Mock update
      const existing = mockUserSkills.find((us) => us.user_id === user_id && us.skill_id === skill_id);
      if (existing) {
        existing.proficiency_level = proficiency_level;
      } else {
        const sk = mockSkills.find((s) => s.skill_id === skill_id);
        mockUserSkills.push({
          user_id,
          skill_id,
          proficiency_level,
          skill_name: sk?.skill_name,
          category: sk?.category,
        });
      }
      return NextResponse.json({ success: true, message: 'Skill updated in demo store' });
    }
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
