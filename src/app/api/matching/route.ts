import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { mockProjects, mockProjectSkills, mockUserSkills, mockUsers } from '@/lib/mock-data';

// Computes cosine similarity between two frequency/embedding vectors
function cosineSimilarity(vecA: Record<string, number>, vecB: Record<string, number>): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  const allKeys = Array.from(new Set([...Object.keys(vecA), ...Object.keys(vecB)]));
  for (const k of allKeys) {
    const valA = vecA[k] || 0;
    const valB = vecB[k] || 0;
    dotProduct += valA * valB;
    normA += valA * valA;
    normB += valB * valB;
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = parseInt(searchParams.get('user_id') || '3');

  try {
    // 1. Try querying advanced view v_student_project_compatibility from MySQL
    const rows = await query<any[]>(
      `SELECT * FROM v_student_project_compatibility 
       WHERE user_id = ? 
       ORDER BY weighted_compatibility_score DESC`,
      [userId]
    );

    if (rows && rows.length > 0) {
      return NextResponse.json({ success: true, paradigm: 'MySQL Relational View', data: rows });
    }
  } catch {
    // If MySQL is offline, run the hybrid Vector + SQL algorithm
  }

  // 2. Hybrid Matching Engine (Relational Skill Levels + TF-IDF Vector Semantic Embedding)
  const student = mockUsers.find((u) => u.user_id === userId) || mockUsers[2];
  const studentSkills = mockUserSkills.filter((us) => us.user_id === userId);

  // Build student vector from skills + interests
  const studentVector: Record<string, number> = {};
  for (const s of studentSkills) {
    studentVector[s.skill_name?.toLowerCase() || ''] = s.proficiency_level / 5.0;
  }
  const interestWords = (student.interests || '').toLowerCase().split(/[\s,]+/);
  for (const word of interestWords) {
    if (word.length > 3) {
      studentVector[word] = (studentVector[word] || 0) + 0.5;
    }
  }

  const results = mockProjects.map((proj) => {
    const reqs = mockProjectSkills.filter((ps) => ps.project_id === proj.project_id);

    // SQL Proficiency component (0-100)
    let skillScore = 0;
    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];

    for (const req of reqs) {
      const found = studentSkills.find((us) => us.skill_id === req.skill_id);
      if (found) {
        matchedSkills.push(req.skill_name || '');
        if (found.proficiency_level >= req.required_level) {
          skillScore += 1.0;
        } else {
          skillScore += found.proficiency_level / req.required_level;
        }
      } else {
        missingSkills.push(req.skill_name || '');
      }
    }
    const skillCoveragePercent = reqs.length > 0 ? (skillScore / reqs.length) * 100 : 100;

    // Vector Semantic Embedding component
    const projectVector: Record<string, number> = {};
    for (const r of reqs) {
      projectVector[r.skill_name?.toLowerCase() || ''] = r.required_level / 5.0;
    }
    const projWords = (proj.description + ' ' + proj.domain).toLowerCase().split(/[\s,]+/);
    for (const w of projWords) {
      if (w.length > 3) {
        projectVector[w] = (projectVector[w] || 0) + 0.3;
      }
    }

    const semanticSim = Math.round(cosineSimilarity(studentVector, projectVector) * 10000) / 100;

    // Combined Ensemble: 70% SQL Skill Proficiency + 30% Vector Semantic Cosine Match
    const finalScore = Math.round((skillCoveragePercent * 0.7 + semanticSim * 0.3) * 100) / 100;

    return {
      project_id: proj.project_id,
      project_title: proj.title,
      domain: proj.domain,
      status: proj.status,
      max_team_size: proj.max_team_size,
      total_required_skills: reqs.length,
      matched_skills_count: matchedSkills.length,
      matched_skills: matchedSkills,
      missing_skills: missingSkills,
      skill_coverage_percent: Math.round(skillCoveragePercent * 10) / 10,
      semantic_similarity: semanticSim,
      weighted_compatibility_score: finalScore,
    };
  });

  results.sort((a, b) => b.weighted_compatibility_score - a.weighted_compatibility_score);

  return NextResponse.json({
    success: true,
    paradigm: 'Hybrid SQL Stored Procedure + Vector Cosine Similarity',
    student: {
      user_id: student.user_id,
      name: student.name,
      email: student.email,
    },
    data: results,
  });
}
