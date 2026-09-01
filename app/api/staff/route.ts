import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Staff from "@/models/Staff";
import { ensureStaffQrIds } from "@/lib/ensure-qr-ids";

export async function GET() {
  await connectToDatabase();
  await ensureStaffQrIds();
  const staff = await Staff.find().sort({ name: 1 }).lean();
  return NextResponse.json({ staff });
}

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const body = await req.json();

  if (!body.name || !body.name.trim()) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }

  const staff = await Staff.create({
    name: body.name,
    title: body.title,
    company: body.company,
    department: body.department,
    phone: body.phone,
    email: body.email,
    website: body.website,
    theme: body.theme || "navygold"
  });

  return NextResponse.json({ staff }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  await connectToDatabase();
  const body = await req.json();
  const ids = Array.isArray(body.ids) ? body.ids.filter((id: unknown) => typeof id === "string" && id.trim()) : [];

  if (!ids.length) {
    return NextResponse.json({ error: "No staff selected." }, { status: 400 });
  }

  const result = await Staff.deleteMany({ _id: { $in: ids } });
  return NextResponse.json({ deleted: result.deletedCount });
}
