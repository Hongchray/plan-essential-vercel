import { NextRequest, NextResponse } from "next/server";
import { exportGiftsToExcel } from "@/lib/excel-export-import"; // make sure to implement this

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Generate Excel file (Buffer) for gifts
    const excelBuffer = await exportGiftsToExcel(id);

    // Set headers for file download
    const headers = new Headers();
    headers.set(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    headers.set(
      "Content-Disposition",
      `attachment; filename="gift-list-${
        new Date().toISOString().split("T")[0]
      }.xlsx"`
    );

    // Convert Buffer -> Uint8Array for NextResponse
    return new NextResponse(new Uint8Array(excelBuffer), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Error exporting gift list:", error);
    return NextResponse.json(
      { error: "Failed to export gift list" },
      { status: 500 }
    );
  }
}
