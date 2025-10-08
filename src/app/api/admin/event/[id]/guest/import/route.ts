import { NextRequest, NextResponse } from "next/server";
import { importGuestsFromExcel } from "@/lib/excel-export-import";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions"; // Adjust import path as needed
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const eventId = formData.get("eventId") as string;

    if (!file) {
      return NextResponse.json(
        { error: "Excel file is required" },
        { status: 400 }
      );
    }

    if (!eventId) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }

    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      return NextResponse.json(
        { error: "Only Excel files (.xlsx, .xls) are allowed" },
        { status: 400 }
      );
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const result = await importGuestsFromExcel(
      eventId,
      fileBuffer,
      session.user.id
    );

    if (result.limitReached && result.imported === 0) {
      return NextResponse.json(
        {
          error: "You have reached your guest limit",
          imported: result.imported,
          skipped: result.skipped,
          errors: result.errors,
          limitReached: true,
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      message: "Import completed",
      imported: result.imported,
      skipped: result.skipped,
      errors: result.errors,
      limitReached: result.limitReached,
      success: true,
    });
  } catch (error) {
    console.error("Error importing guest list:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to import guest list",
      },
      { status: 500 }
    );
  }
}
