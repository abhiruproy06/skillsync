import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { mockSkills } from '@/lib/mock-data';
import { Skill } from '@/types';

export async function GET() {
  try {
    const skills = await query<Skill[]>('SELECT * FROM skills ORDER BY category, skill_name');
    return NextResponse.json({ success: true, data: skills });
  } catch {
    return NextResponse.json({ success: true, data: mockSkills });
  }
}
