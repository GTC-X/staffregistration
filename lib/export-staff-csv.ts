import Papa from "papaparse";
import { getCardUrl } from "./card-url";
import type { StaffExportRow } from "./export-staff";

/** Plain CSV export (no QR images — use Excel export for embedded QR pictures). */
export async function buildStaffCsv(staff: StaffExportRow[], origin?: string) {
  const rows = staff.map((person) => ({
    Name: person.name,
    Title: person.title || "",
    Company: person.company || "",
    Department: person.department || "",
    Phone: person.phone || "",
    Email: person.email || "",
    Website: person.website || "",
    "Profile link": getCardUrl(person, origin)
  }));

  return Papa.unparse(rows);
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

export type { StaffExportRow };
