import { NextRequest, NextResponse } from 'next/server';
import { exportGuestsToExcel } from '@/lib/excel-export-import';

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(req.url);
    // Generate Excel file
    const excelBuffer = await exportGuestsToExcel(id);

    // Set headers for file download
    const headers = new Headers();
    headers.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    headers.set('Content-Disposition', `attachment; filename="guest-list-${new Date().toISOString().split('T')[0]}.xlsx"`);

    return new NextResponse(excelBuffer, {
      status: 200,
      headers,
    });

  } catch (error) {
    console.error('Error exporting guest list:', error);
    return NextResponse.json(
      { error: 'Failed to export guest list' },
      { status: 500 }
    );
  }
}