import { NextRequest, NextResponse } from 'next/server';
import { importGuestsFromExcel } from '@/lib/excel-export-import';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const eventId = formData.get('eventId') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'Excel file is required' },
        { status: 400 }
      );
    }

    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      return NextResponse.json(
        { error: 'Only Excel files (.xlsx, .xls) are allowed' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Import guests
    const result = await importGuestsFromExcel(eventId, fileBuffer);

    return NextResponse.json({
      message: 'Import completed',
      imported: result.imported,
      skipped: result.skipped,
      errors: result.errors,
      success: true
    });

  } catch (error) {
    console.error('Error importing guest list:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to import guest list' },
      { status: 500 }
    );
  }
}