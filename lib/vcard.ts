export type VcardStaff = {
  name: string;
  phone?: string;
  department?: string;
  website?: string;
};

function escapeVcard(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

function escapeMecard(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/:/g, "\\:")
    .replace(/\r?\n/g, "");
}

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) return { given: parts[0] || "", family: "" };
  return { family: parts[parts.length - 1], given: parts.slice(0, -1).join(" ") };
}

export function buildVcard(staff: VcardStaff) {
  const lines = ["BEGIN:VCARD", "VERSION:3.0"];
  const { given, family } = splitName(staff.name);

  lines.push(`N:${escapeVcard(family)};${escapeVcard(given)};;;`);
  lines.push(`FN:${escapeVcard(staff.name)}`);

  if (staff.phone?.trim()) {
    lines.push(`TEL;TYPE=CELL,VOICE:${escapeVcard(staff.phone.trim())}`);
  }

  if (staff.website?.trim()) {
    const url = staff.website.startsWith("http") ? staff.website : `https://${staff.website}`;
    lines.push(`URL:${escapeVcard(url)}`);
  }

  if (staff.department?.trim()) {
    lines.push(`NOTE:${escapeVcard(staff.department.trim())}`);
  }

  lines.push("END:VCARD");
  return lines.join("\r\n");
}

export function vcardFilename(name: string) {
  const safe = name.replace(/[^\w\-]+/g, "-").replace(/^-+|-+$/g, "").toLowerCase();
  return `${safe || "contact"}.vcf`;
}

/** Embedded in QR codes — opens add-to-contacts directly on most phone cameras (no .vcf download). */
export function buildMecard(staff: VcardStaff) {
  const { given, family } = splitName(staff.name);
  const parts = [`N:${escapeMecard(family)},${escapeMecard(given)}`];

  if (staff.phone?.trim()) {
    parts.push(`TEL:${escapeMecard(staff.phone.trim())}`);
  }

  if (staff.website?.trim()) {
    const url = staff.website.startsWith("http") ? staff.website : `https://${staff.website}`;
    parts.push(`URL:${escapeMecard(url)}`);
  }

  if (staff.department?.trim()) {
    parts.push(`NOTE:${escapeMecard(staff.department.trim())}`);
  }

  return `MECARD:${parts.join(";")};;`;
}
