// =============================================================================
// DBMS LAB 04 - LEVEL 3 PROJECT
// PROJECT TITLE: SkillSync: Intelligent Student Project Team Matching System
// TEAM MEMBER 1: ABHIJNA MARATHE  SRN1: PES2UG24CS020
// TEAM MEMBER 2: ABHIRUP ROY      SRN2: PES2UG24CS025
// =============================================================================

export interface User {
  user_id: number;
  name: string;
  email: string;
  password_hash?: string;
  role: 'STUDENT' | 'ADMIN';
  bio: string | null;
  interests: string | null;
  created_at?: string;
}

export interface Skill {
  skill_id: number;
  skill_name: string;
  category: string;
}

export interface UserSkill {
  user_id: number;
  skill_id: number;
  proficiency_level: number; // 1-5
  skill_name?: string;
  category?: string;
}

export interface Project {
  project_id: number;
  created_by: number;
  title: string;
  description: string;
  domain: string;
  max_team_size: number;
  status: 'OPEN' | 'FULL' | 'CLOSED';
  created_at?: string;
  // Joined fields
  creator_name?: string;
  required_skills?: ProjectSkill[];
  team_id?: number;
  team_name?: string;
  current_team_members?: number;
  compatibility_score?: number;
}

export interface ProjectSkill {
  project_id: number;
  skill_id: number;
  required_level: number; // 1-5
  skill_name?: string;
  category?: string;
}

export interface Team {
  team_id: number;
  project_id: number;
  team_name: string;
  max_members: number;
  created_at?: string;
  // Joined
  project_title?: string;
  domain?: string;
  members?: TeamMember[];
  current_members?: number;
  leader_name?: string;
  leader_id?: number;
}

export interface TeamMember {
  team_id: number;
  user_id: number;
  member_role: 'LEADER' | 'MEMBER';
  joined_at?: string;
  // Joined
  name?: string;
  email?: string;
}

export interface Application {
  application_id: number;
  user_id: number;
  project_id: number;
  message: string | null;
  compatibility_score: number | null;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  applied_at?: string;
  // Joined
  applicant_name?: string;
  applicant_email?: string;
  project_title?: string;
  team_name?: string;
}

export interface SessionUser {
  user_id: number;
  name: string;
  email: string;
  role: 'STUDENT' | 'ADMIN';
}

export interface ActivityLog {
  _id?: string;
  user_id: number;
  user_name?: string;
  action: string;
  entity_type: 'USER' | 'PROJECT' | 'TEAM' | 'APPLICATION' | 'SKILL';
  entity_id: number;
  details?: Record<string, unknown>;
  timestamp: string;
}

export interface VectorMatchResult {
  project_id: number;
  project_title: string;
  domain: string;
  semantic_similarity: number;
  skill_coverage: number;
  final_match_score: number;
  matched_skills: string[];
  missing_skills: string[];
}
