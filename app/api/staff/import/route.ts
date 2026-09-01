import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Staff from "@/models/Staff";

// Expects { rows: [{ name, title, company, department, phone, email, website }, ...] }
// The CSV itself is parsed client-side (see /admin) and sent here as plain rows,
// so this route never has to guess at CSV formatting.
export async function POST(req: NextRequest) {
  await connectToDatabase();
  const body = await req.json();
  const rows = Array.isArray(body.rows) ? body.rows : [];

  const valid = rows.filter((r: any) => r.name && String(r.name).trim());
  if (!valid.length) {
    return NextResponse.json(
      { error: "No valid rows found. Each row needs at least a name." },
      { status: 400 }
    );
  }

  const inserted = await Staff.insertMany(
    valid.map((r: any) => ({
      name: r.name,
      title: r.title,
      company: r.company,
      department: r.department,
      phone: r.phone,
      email: r.email,
      website: r.website,
      theme: r.theme || "navygold"
    }))
  );

  return NextResponse.json({ inserted: inserted.length });
}
