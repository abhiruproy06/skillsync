import { NextResponse } from 'next/server';
import { testConnection } from '@/lib/db';

export async function GET() {
  const dbOnline = await testConnection();
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      web: 'online',
      database: dbOnline ? 'connected' : 'demo_fallback_active',
      paradigm: 'Multi-Paradigm (MySQL + MongoDB + Vector Cosine)',
    },
    team: {
      member1: 'Abhijna Marathe (PES2UG24CS020)',
      member2: 'Abhirup Roy (PES2UG24CS025)',
      faculty: 'Prof. Deena Hajim',
    },
  });
}
