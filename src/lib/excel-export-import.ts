import * as XLSX from "xlsx";
import { prisma } from "@/lib/prisma"; // Adjust import path as needed

// Types
interface GuestImportData {
  name: string;
  email?: string;
  phone?: string;
  note?: string;
  address?: string;
  status?: "pending" | "confirmed" | "rejected";
  wishing_note?: string;
  number_of_guests?: number;
  is_invited?: boolean;
}

// Excel column mapping
const EXCEL_COLUMNS = {
  "Full Name": "name",
  "Phone Number": "phone",
  Notes: "note",
} as const;

export async function exportGiftsToExcel(eventId: string): Promise<Buffer> {
  try {
    // Fetch gifts from database
    const gifts = await prisma.gift.findMany({
      where: { eventId },
      orderBy: { createdAt: "desc" },
      include: {
        guest: true, // include guest info
        event: true, // optional: include event info
      },
    });

    // Transform data for Excel
    const excelData = gifts.map((gift, index) => ({
      "No.": index + 1,
      "Gift ID": gift.id,
      "Guest Name": gift.guest?.name || "-",
      "Guest Phone": gift.guest?.phone || "-",
      "Event ID": gift.eventId,
      "Payment Type": gift.payment_type,
      "Currency Type": gift.currency_type,
      "Amount (USD)": gift.amount_usd ?? 0,
      "Amount (KHR)": gift.amount_khr ?? 0,
      Note: gift.note || "",
      "Created Date": gift.createdAt.toLocaleDateString(),
      "Updated Date": gift.updatedAt.toLocaleDateString(),
    }));

    // Create workbook
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Auto-size columns
    const colWidths = [
      { wch: 5 }, // No.
      { wch: 30 }, // Gift ID
      { wch: 25 }, // Guest Name
      { wch: 15 }, // Guest Phone
      { wch: 25 }, // Event ID
      { wch: 15 }, // Payment Type
      { wch: 15 }, // Currency Type
      { wch: 15 }, // Amount (USD)
      { wch: 15 }, // Amount (KHR)
      { wch: 30 }, // Note
      { wch: 15 }, // Created Date
      { wch: 15 }, // Updated Date
    ];
    worksheet["!cols"] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Gift List");

    // Generate buffer
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    return excelBuffer;
  } catch (error) {
    console.error("Error exporting gifts to Excel:", error);
    throw new Error("Failed to export gift list to Excel");
  }
}

export async function exportGuestsToExcel(eventId: string): Promise<Buffer> {
  try {
    // Fetch guests from database
    const guests = await prisma.guest.findMany({
      where: { eventId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        note: true,
        status: true,
        wishing_note: true,
        number_of_guests: true,
        is_invited: true,
        guestTag: {
          select: {
            tag: true,
          },
        },
        guestGroup: {
          select: {
            group: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    // Transform data for Excel
    const excelData = guests.map((guest, index) => ({
      "No.": index + 1,
      "Full Name": guest.name,
      "Email Address": guest.email || "",
      "Phone Number": guest.phone || "",
      Address: guest.address || "",
      Notes: guest.note || "",
      Status: guest.status || "pending",
      "Wishing Note": guest.wishing_note || "",
      "Number of Guests": guest.number_of_guests || 1,
      "Is Invited": guest.is_invited ? "Yes" : "No",
      Tags: guest.guestTag.map((gt) => gt.tag.name_kh).join(", "),
      Groups: guest.guestGroup.map((gg) => gg.group.name_kh).join(", "),
      "Created Date": guest.createdAt.toLocaleDateString(),
      "Updated Date": guest.updatedAt.toLocaleDateString(),
    }));

    // Create workbook
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Auto-size columns
    const colWidths = [
      { wch: 5 }, // No.
      { wch: 25 }, // Full Name
      { wch: 30 }, // Email
      { wch: 15 }, // Phone
      { wch: 30 }, // Address
      { wch: 25 }, // Notes
      { wch: 12 }, // Status
      { wch: 25 }, // Wishing Note
      { wch: 15 }, // Number of Guests
      { wch: 12 }, // Is Invited
      { wch: 20 }, // Tags
      { wch: 20 }, // Groups
      { wch: 15 }, // Created Date
      { wch: 15 }, // Updated Date
    ];
    worksheet["!cols"] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Guest List");

    // Generate buffer
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    return excelBuffer;
  } catch (error) {
    console.error("Error exporting guests to Excel:", error);
    throw new Error("Failed to export guest list to Excel");
  }
}

// Import Functions

export function parseExcelFile(fileBuffer: Buffer): GuestImportData[] {
  try {
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const rawData: any[] = XLSX.utils.sheet_to_json(worksheet);

    if (rawData.length === 0) {
      throw new Error("Excel file is empty");
    }

    // Transform and validate data
    const guestData: GuestImportData[] = rawData.map((row, index) => {
      const guest: GuestImportData = {
        name: "",
        phone: undefined,
        note: undefined,
      };

      // Map Excel columns to guest properties
      Object.entries(EXCEL_COLUMNS).forEach(([excelCol, guestProp]) => {
        const cellValue = row[excelCol];
        if (cellValue !== undefined && cellValue !== null && cellValue !== "") {
          switch (guestProp) {
            case "name":
              guest[guestProp] = String(cellValue).trim();
              break;
            case "phone":
              guest[guestProp] = String(cellValue).trim();
              break;
            case "note":
              guest[guestProp] = String(cellValue).trim();
              break;
          }
        }
      });

      if (!guest.name) {
        throw new Error(`Row ${index + 2}: Guest name is required`);
      }
      if (!guest.phone) {
        throw new Error(`Row ${index + 2}: Guest phone is required`);
      }

      return guest;
    });

    return guestData;
  } catch (error) {
    console.error("Error parsing Excel file:", error);
    throw error;
  }
}

export async function importGuestsFromExcel(
  eventId: string,
  fileBuffer: Buffer
): Promise<{
  imported: number;
  skipped: number;
  errors: string[];
}> {
  try {
    const guestData = parseExcelFile(fileBuffer);
    const errors: string[] = [];
    let imported = 0;
    let skipped = 0;

    // Process guests in transaction
    await prisma.$transaction(async (tx) => {
      for (let i = 0; i < guestData.length; i++) {
        const guest = guestData[i];

        try {
          // Check if guest already exists (by name and email/phone)
          const existingGuest = await tx.guest.findFirst({
            where: {
              eventId,
              name: guest.name,
              OR: guest.email
                ? [{ email: guest.email }, { phone: guest.phone }]
                : [{ phone: guest.phone }].filter(Boolean),
            },
          });

          if (existingGuest) {
            skipped++;
            errors.push(`Row ${i + 2}: Guest "${guest.name}" already exists`);
            continue;
          }

          // Create new guest
          await tx.guest.create({
            data: {
              eventId,
              name: guest.name,
              email: guest.email,
              phone: guest.phone,
              address: guest.address,
              note: guest.note,
              status: guest.status || "pending",
              wishing_note: guest.wishing_note,
              number_of_guests: guest.number_of_guests || 0,
              is_invited: guest.is_invited || false,
            },
          });

          imported++;
        } catch (error) {
          skipped++;
          errors.push(
            `Row ${i + 2}: ${
              error instanceof Error ? error.message : "Unknown error occurred"
            }`
          );
        }
      }
    });

    return { imported, skipped, errors };
  } catch (error) {
    console.error("Error importing guests from Excel:", error);
    throw new Error("Failed to import guests from Excel");
  }
}

// Generate Excel template for import
export function generateGuestImportTemplate(): Buffer {
  const templateData = [
    {
      "Full Name": "John Doe",
      "Phone Number": "+1234567890",
      Notes: "VIP guest",
    },
  ];

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(templateData);

  // Set column widths
  worksheet["!cols"] = [
    { wch: 25 }, // Full Name
    { wch: 15 }, // Phone
    { wch: 25 }, // Notes
  ];

  XLSX.utils.book_append_sheet(workbook, worksheet, "Guest Import Template");

  return XLSX.write(workbook, {
    bookType: "xlsx",
    type: "buffer",
  });
}
