import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { mockApplications, mockTeams } from '@/lib/mock-data';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await request.json();

    if (!['ACCEPTED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ success: false, error: 'Status must be ACCEPTED or REJECTED' }, { status: 400 });
    }

    try {
      // Call stored procedure sp_process_application
      await query(
        'CALL sp_process_application(?, ?, @result); SELECT @result as msg;',
        [id, status]
      );
      return NextResponse.json({ success: true, message: `Application ${status.toLowerCase()} via transaction` });
    } catch {
      // Mock update
      const app = mockApplications.find((a) => a.application_id === parseInt(id));
      if (!app) {
        return NextResponse.json({ success: false, error: 'Application not found' }, { status: 404 });
      }
      app.status = status;

      if (status === 'ACCEPTED') {
        const team = mockTeams.find((t) => t.project_id === app.project_id);
        if (team && !team.members?.some((m) => m.user_id === app.user_id)) {
          team.members = team.members || [];
          team.members.push({
            team_id: team.team_id,
            user_id: app.user_id,
            member_role: 'MEMBER',
            name: app.applicant_name,
            email: app.applicant_email,
          });
          team.current_members = team.members.length;
        }
      }

      return NextResponse.json({ success: true, message: `Application ${status.toLowerCase()} in demo store` });
    }
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
