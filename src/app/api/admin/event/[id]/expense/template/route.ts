import { NextResponse } from "next/server";
import { generateExpenseImportTemplate } from "@/lib/excel-export-import";

export async function GET() {
  try {
    // Generate template file
    const templateBuffer = generateExpenseImportTemplate();

    // Set headers for file download
    const headers = new Headers();
    headers.set(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    headers.set(
      "Content-Disposition",
      'attachment; filename="guest-import-template.xlsx"'
    );

    return new NextResponse(new Uint8Array(templateBuffer), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Error generating template:", error);
    return NextResponse.json(
      { error: "Failed to generate template" },
      { status: 500 }
    );
  }
}
