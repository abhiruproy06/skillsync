// =============================================================================
// SkillSync - In-Memory Demo / Fallback Store
// Reflects exactly the seed data from seed.sql and procedures.sql
// =============================================================================

import { User, Skill, UserSkill, Project, ProjectSkill, Team, TeamMember, Application, ActivityLog } from '@/types';

export const mockUsers: User[] = [
  {
    user_id: 1,
    name: 'Dr. Nagasundari S',
    email: 'nagasundari@pes.edu',
    role: 'ADMIN',
    bio: 'Associate Professor, Department of Computer Science & Engineering. Course Instructor for Database Management Systems.',
    interests: 'Database Systems, Data Mining, Distributed Databases',
  },
  {
    user_id: 2,
    name: 'Admin Coordinator',
    email: 'admin@skillsync.pes.edu',
    role: 'ADMIN',
    bio: 'SkillSync System Administrator for CSE Experiential Learning Projects.',
    interests: 'System Architecture, Platform Reliability, Cloud Infrastructure',
  },
  {
    user_id: 3,
    name: 'Abhijna Marathe',
    email: 'pes2ug24cs020@pes.edu',
    role: 'STUDENT',
    bio: 'CSE Student (SRN: PES2UG24CS020). Passionate about Database Systems, Backend Architecture, and Distributed Systems.',
    interests: 'Relational Databases, Next.js, Applied Cryptography, Distributed Systems',
  },
  {
    user_id: 4,
    name: 'Abhirup Roy',
    email: 'pes2ug24cs025@pes.edu',
    role: 'STUDENT',
    bio: 'CSE Student (SRN: PES2UG24CS025). Full-stack developer with focus on intelligent matching algorithms and NoSQL databases.',
    interests: 'NoSQL, Graph Databases, Machine Learning, UI/UX Design',
  },
  {
    user_id: 5,
    name: 'Sneha Reddy',
    email: 'pes2ug24cs045@pes.edu',
    role: 'STUDENT',
    bio: 'Passionate about Deep Learning and Natural Language Processing. Experience with PyTorch and Transformers.',
    interests: 'NLP, LLMs, Vector Databases, Data Engineering',
  },
  {
    user_id: 6,
    name: 'Karthik Nair',
    email: 'pes2ug24cs088@pes.edu',
    role: 'STUDENT',
    bio: 'Cloud native and DevOps enthusiast. Docker, Kubernetes, and CI/CD pipelines builder.',
    interests: 'DevOps, Microservices, Cloud Security, Linux Kernel',
  },
  {
    user_id: 7,
    name: 'Ananya Iyer',
    email: 'pes2ug24cs112@pes.edu',
    role: 'STUDENT',
    bio: 'Frontend engineer focused on accessible, high-performance web applications using React and Tailwind CSS.',
    interests: 'Frontend, Figma, Design Systems, Mobile App Dev',
  },
  {
    user_id: 8,
    name: 'Vikram Malhotra',
    email: 'pes2ug24cs140@pes.edu',
    role: 'STUDENT',
    bio: 'Cybersecurity researcher and backend engineer working with Node.js and Redis caching layers.',
    interests: 'Network Security, Redis, Cryptography, API Security',
  },
];

export const mockSkills: Skill[] = [
  { skill_id: 1, skill_name: 'MySQL', category: 'Database' },
  { skill_id: 2, skill_name: 'PostgreSQL', category: 'Database' },
  { skill_id: 3, skill_name: 'MongoDB', category: 'NoSQL Database' },
  { skill_id: 4, skill_name: 'Neo4j', category: 'Graph Database' },
  { skill_id: 5, skill_name: 'Next.js', category: 'Web Framework' },
  { skill_id: 6, skill_name: 'React', category: 'Web Framework' },
  { skill_id: 7, skill_name: 'TypeScript', category: 'Programming Language' },
  { skill_id: 8, skill_name: 'Python', category: 'Programming Language' },
  { skill_id: 9, skill_name: 'Docker', category: 'DevOps & Cloud' },
  { skill_id: 10, skill_name: 'PyTorch', category: 'Machine Learning' },
  { skill_id: 11, skill_name: 'Vector Embeddings', category: 'AI & Search' },
  { skill_id: 12, skill_name: 'Tailwind CSS', category: 'Frontend & UI' },
  { skill_id: 13, skill_name: 'FastAPI', category: 'Backend Framework' },
  { skill_id: 14, skill_name: 'Redis', category: 'Caching & Memory' },
  { skill_id: 15, skill_name: 'Git & GitHub', category: 'Software Engineering' },
];

export const mockUserSkills: UserSkill[] = [
  // Abhijna Marathe (User 3)
  { user_id: 3, skill_id: 1, proficiency_level: 5, skill_name: 'MySQL', category: 'Database' },
  { user_id: 3, skill_id: 7, proficiency_level: 4, skill_name: 'TypeScript', category: 'Programming Language' },
  { user_id: 3, skill_id: 5, proficiency_level: 4, skill_name: 'Next.js', category: 'Web Framework' },
  { user_id: 3, skill_id: 9, proficiency_level: 4, skill_name: 'Docker', category: 'DevOps & Cloud' },
  { user_id: 3, skill_id: 8, proficiency_level: 4, skill_name: 'Python', category: 'Programming Language' },
  { user_id: 3, skill_id: 15, proficiency_level: 5, skill_name: 'Git & GitHub', category: 'Software Engineering' },

  // Abhirup Roy (User 4)
  { user_id: 4, skill_id: 3, proficiency_level: 5, skill_name: 'MongoDB', category: 'NoSQL Database' },
  { user_id: 4, skill_id: 5, proficiency_level: 4, skill_name: 'Next.js', category: 'Web Framework' },
  { user_id: 4, skill_id: 8, proficiency_level: 4, skill_name: 'Python', category: 'Programming Language' },
  { user_id: 4, skill_id: 11, proficiency_level: 4, skill_name: 'Vector Embeddings', category: 'AI & Search' },
  { user_id: 4, skill_id: 6, proficiency_level: 4, skill_name: 'React', category: 'Web Framework' },
  { user_id: 4, skill_id: 12, proficiency_level: 4, skill_name: 'Tailwind CSS', category: 'Frontend & UI' },

  // Sneha Reddy (User 5)
  { user_id: 5, skill_id: 8, proficiency_level: 5, skill_name: 'Python', category: 'Programming Language' },
  { user_id: 5, skill_id: 10, proficiency_level: 5, skill_name: 'PyTorch', category: 'Machine Learning' },
  { user_id: 5, skill_id: 11, proficiency_level: 4, skill_name: 'Vector Embeddings', category: 'AI & Search' },
  { user_id: 5, skill_id: 3, proficiency_level: 3, skill_name: 'MongoDB', category: 'NoSQL Database' },

  // Karthik Nair (User 6)
  { user_id: 6, skill_id: 9, proficiency_level: 5, skill_name: 'Docker', category: 'DevOps & Cloud' },
  { user_id: 6, skill_id: 8, proficiency_level: 3, skill_name: 'Python', category: 'Programming Language' },
  { user_id: 6, skill_id: 14, proficiency_level: 4, skill_name: 'Redis', category: 'Caching & Memory' },
  { user_id: 6, skill_id: 1, proficiency_level: 3, skill_name: 'MySQL', category: 'Database' },

  // Ananya Iyer (User 7)
  { user_id: 7, skill_id: 6, proficiency_level: 5, skill_name: 'React', category: 'Web Framework' },
  { user_id: 7, skill_id: 12, proficiency_level: 5, skill_name: 'Tailwind CSS', category: 'Frontend & UI' },
  { user_id: 7, skill_id: 7, proficiency_level: 4, skill_name: 'TypeScript', category: 'Programming Language' },
  { user_id: 7, skill_id: 5, proficiency_level: 3, skill_name: 'Next.js', category: 'Web Framework' },

  // Vikram Malhotra (User 8)
  { user_id: 8, skill_id: 8, proficiency_level: 4, skill_name: 'Python', category: 'Programming Language' },
  { user_id: 8, skill_id: 14, proficiency_level: 4, skill_name: 'Redis', category: 'Caching & Memory' },
  { user_id: 8, skill_id: 1, proficiency_level: 3, skill_name: 'MySQL', category: 'Database' },
  { user_id: 8, skill_id: 13, proficiency_level: 4, skill_name: 'FastAPI', category: 'Backend Framework' },
];

export const mockProjectSkills: ProjectSkill[] = [
  // Project 1 (SkillSync)
  { project_id: 1, skill_id: 1, required_level: 4, skill_name: 'MySQL', category: 'Database' },
  { project_id: 1, skill_id: 3, required_level: 3, skill_name: 'MongoDB', category: 'NoSQL Database' },
  { project_id: 1, skill_id: 5, required_level: 4, skill_name: 'Next.js', category: 'Web Framework' },
  { project_id: 1, skill_id: 7, required_level: 3, skill_name: 'TypeScript', category: 'Programming Language' },
  { project_id: 1, skill_id: 11, required_level: 3, skill_name: 'Vector Embeddings', category: 'AI & Search' },

  // Project 2 (Distributed Food Order)
  { project_id: 2, skill_id: 8, required_level: 4, skill_name: 'Python', category: 'Programming Language' },
  { project_id: 2, skill_id: 9, required_level: 4, skill_name: 'Docker', category: 'DevOps & Cloud' },
  { project_id: 2, skill_id: 14, required_level: 3, skill_name: 'Redis', category: 'Caching & Memory' },
  { project_id: 2, skill_id: 1, required_level: 3, skill_name: 'MySQL', category: 'Database' },

  // Project 3 (BioMedical Knowledge Graph)
  { project_id: 3, skill_id: 4, required_level: 4, skill_name: 'Neo4j', category: 'Graph Database' },
  { project_id: 3, skill_id: 2, required_level: 4, skill_name: 'PostgreSQL', category: 'Database' },
  { project_id: 3, skill_id: 8, required_level: 4, skill_name: 'Python', category: 'Programming Language' },
  { project_id: 3, skill_id: 11, required_level: 4, skill_name: 'Vector Embeddings', category: 'AI & Search' },

  // Project 4 (Edge IoT Telemetry)
  { project_id: 4, skill_id: 9, required_level: 4, skill_name: 'Docker', category: 'DevOps & Cloud' },
  { project_id: 4, skill_id: 8, required_level: 3, skill_name: 'Python', category: 'Programming Language' },
  { project_id: 4, skill_id: 14, required_level: 3, skill_name: 'Redis', category: 'Caching & Memory' },
];

export const mockProjects: Project[] = [
  {
    project_id: 1,
    created_by: 1,
    title: 'SkillSync: Intelligent Student Project Team Matching System',
    description: 'An intelligent platform utilizing MySQL relational schema, MongoDB activity logs, and vector cosine similarity to match students with projects and optimal teammates based on skill proficiency and requirements.',
    domain: 'Intelligent Systems & Databases',
    max_team_size: 4,
    status: 'OPEN',
    creator_name: 'Dr. Nagasundari S',
    team_id: 1,
    team_name: 'SyncSquad - Team 20_25',
    current_team_members: 2,
  },
  {
    project_id: 2,
    created_by: 1,
    title: 'Distributed High-Throughput Food Order Stream Processing',
    description: 'Fault-tolerant distributed ordering pipeline with idempotency guarantees, dead-letter queues, real-time aggregation, and persistent analytical database storage.',
    domain: 'Distributed Systems',
    max_team_size: 3,
    status: 'OPEN',
    creator_name: 'Dr. Nagasundari S',
    team_id: 2,
    team_name: 'StreamOps Order Forge',
    current_team_members: 1,
  },
  {
    project_id: 3,
    created_by: 1,
    title: 'BioMedical Knowledge Graph & Clinical Query Engine',
    description: 'Graph-powered database system linking clinical trials, drug interactions, and medical ontology using Neo4j and PostgreSQL hybrid architecture.',
    domain: 'Healthcare & Bioinformatics',
    max_team_size: 4,
    status: 'OPEN',
    creator_name: 'Dr. Nagasundari S',
    current_team_members: 0,
  },
  {
    project_id: 4,
    created_by: 1,
    title: 'Autonomous Edge IoT Telemetry Aggregator',
    description: 'High-frequency sensor telemetry collector utilizing time-series modeling, edge Docker containers, and live WebSocket dashboards.',
    domain: 'IoT & Edge Computing',
    max_team_size: 3,
    status: 'FULL',
    creator_name: 'Dr. Nagasundari S',
    team_id: 3,
    team_name: 'IoT Pulse Vanguard',
    current_team_members: 3,
  },
];

export const mockTeams: Team[] = [
  {
    team_id: 1,
    project_id: 1,
    team_name: 'SyncSquad - Team 20_25',
    max_members: 4,
    project_title: 'SkillSync: Intelligent Student Project Team Matching System',
    domain: 'Intelligent Systems & Databases',
    leader_name: 'Abhijna Marathe',
    leader_id: 3,
    current_members: 2,
    members: [
      { team_id: 1, user_id: 3, member_role: 'LEADER', name: 'Abhijna Marathe', email: 'pes2ug24cs020@pes.edu' },
      { team_id: 1, user_id: 4, member_role: 'MEMBER', name: 'Abhirup Roy', email: 'pes2ug24cs025@pes.edu' },
    ],
  },
  {
    team_id: 2,
    project_id: 2,
    team_name: 'StreamOps Order Forge',
    max_members: 3,
    project_title: 'Distributed High-Throughput Food Order Stream Processing',
    domain: 'Distributed Systems',
    leader_name: 'Vikram Malhotra',
    leader_id: 8,
    current_members: 1,
    members: [
      { team_id: 2, user_id: 8, member_role: 'LEADER', name: 'Vikram Malhotra', email: 'pes2ug24cs140@pes.edu' },
    ],
  },
  {
    team_id: 3,
    project_id: 4,
    team_name: 'IoT Pulse Vanguard',
    max_members: 3,
    project_title: 'Autonomous Edge IoT Telemetry Aggregator',
    domain: 'IoT & Edge Computing',
    leader_name: 'Karthik Nair',
    leader_id: 6,
    current_members: 2,
    members: [
      { team_id: 3, user_id: 6, member_role: 'LEADER', name: 'Karthik Nair', email: 'pes2ug24cs088@pes.edu' },
      { team_id: 3, user_id: 7, member_role: 'MEMBER', name: 'Ananya Iyer', email: 'pes2ug24cs112@pes.edu' },
    ],
  },
];

export const mockApplications: Application[] = [
  {
    application_id: 1,
    user_id: 3,
    project_id: 1,
    message: 'Proficient in MySQL stored procedures, complex views, and Next.js backend integration.',
    compatibility_score: 95.0,
    status: 'ACCEPTED',
    applicant_name: 'Abhijna Marathe',
    applicant_email: 'pes2ug24cs020@pes.edu',
    project_title: 'SkillSync: Intelligent Student Project Team Matching System',
    team_name: 'SyncSquad - Team 20_25',
    applied_at: '2026-11-01 10:00:00',
  },
  {
    application_id: 2,
    user_id: 4,
    project_id: 1,
    message: 'Specialized in MongoDB aggregations, vector similarity scoring, and responsive Tailwind UI.',
    compatibility_score: 92.5,
    status: 'ACCEPTED',
    applicant_name: 'Abhirup Roy',
    applicant_email: 'pes2ug24cs025@pes.edu',
    project_title: 'SkillSync: Intelligent Student Project Team Matching System',
    team_name: 'SyncSquad - Team 20_25',
    applied_at: '2026-11-01 10:15:00',
  },
  {
    application_id: 3,
    user_id: 7,
    project_id: 1,
    message: 'Excited to contribute to frontend UI components and student dashboard ergonomics in Next.js.',
    compatibility_score: 78.0,
    status: 'PENDING',
    applicant_name: 'Ananya Iyer',
    applicant_email: 'pes2ug24cs112@pes.edu',
    project_title: 'SkillSync: Intelligent Student Project Team Matching System',
    team_name: 'SyncSquad - Team 20_25',
    applied_at: '2026-11-01 11:30:00',
  },
  {
    application_id: 4,
    user_id: 5,
    project_id: 1,
    message: 'Have background in PyTorch and vector embeddings for semantic team recommendation engine.',
    compatibility_score: 82.5,
    status: 'PENDING',
    applicant_name: 'Sneha Reddy',
    applicant_email: 'pes2ug24cs045@pes.edu',
    project_title: 'SkillSync: Intelligent Student Project Team Matching System',
    team_name: 'SyncSquad - Team 20_25',
    applied_at: '2026-11-01 12:00:00',
  },
  {
    application_id: 5,
    user_id: 6,
    project_id: 2,
    message: 'Interested in microservice containerization and Redis caching layer optimization.',
    compatibility_score: 85.0,
    status: 'PENDING',
    applicant_name: 'Karthik Nair',
    applicant_email: 'pes2ug24cs088@pes.edu',
    project_title: 'Distributed High-Throughput Food Order Stream Processing',
    team_name: 'StreamOps Order Forge',
    applied_at: '2026-11-01 14:20:00',
  },
  {
    application_id: 6,
    user_id: 5,
    project_id: 3,
    message: 'Extensive experience in healthcare NLP embeddings and scientific taxonomy graphs.',
    compatibility_score: 88.0,
    status: 'PENDING',
    applicant_name: 'Sneha Reddy',
    applicant_email: 'pes2ug24cs045@pes.edu',
    project_title: 'BioMedical Knowledge Graph & Clinical Query Engine',
    applied_at: '2026-11-01 15:45:00',
  },
];

export const mockActivityLogs: ActivityLog[] = [
  {
    user_id: 3,
    user_name: 'Abhijna Marathe',
    action: 'CREATE_TEAM',
    entity_type: 'TEAM',
    entity_id: 1,
    details: { team_name: 'SyncSquad - Team 20_25', project_id: 1 },
    timestamp: '2026-11-01T10:00:00Z',
  },
  {
    user_id: 4,
    user_name: 'Abhirup Roy',
    action: 'JOIN_TEAM',
    entity_type: 'TEAM',
    entity_id: 1,
    details: { member_role: 'MEMBER' },
    timestamp: '2026-11-01T10:15:00Z',
  },
  {
    user_id: 7,
    user_name: 'Ananya Iyer',
    action: 'APPLY_PROJECT',
    entity_type: 'APPLICATION',
    entity_id: 3,
    details: { project_id: 1, calculated_score: 78.0 },
    timestamp: '2026-11-01T11:30:00Z',
  },
  {
    user_id: 1,
    user_name: 'Dr. Nagasundari S',
    action: 'PUBLISH_PROJECT',
    entity_type: 'PROJECT',
    entity_id: 1,
    details: { title: 'SkillSync: Intelligent Student Project Team Matching System' },
    timestamp: '2026-11-01T09:00:00Z',
  },
];

// Helper algorithm matching MySQL sp_calculate_compatibility_score
export function calculateCompatibilityScore(userId: number, projectId: number): number {
  const reqSkills = mockProjectSkills.filter((ps) => ps.project_id === projectId);
  if (reqSkills.length === 0) return 100.0;

  const studentSkills = mockUserSkills.filter((us) => us.user_id === userId);
  let totalScore = 0;

  for (const req of reqSkills) {
    const found = studentSkills.find((us) => us.skill_id === req.skill_id);
    if (!found) continue;
    if (found.proficiency_level >= req.required_level) {
      totalScore += 1.0;
    } else {
      totalScore += found.proficiency_level / req.required_level;
    }
  }

  return Math.round((totalScore / reqSkills.length) * 10000) / 100;
}
