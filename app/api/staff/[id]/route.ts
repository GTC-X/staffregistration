import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Staff from "@/models/Staff";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const staff = await Staff.findById(params.id).lean();
  if (!staff) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ staff });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const body = await req.json();

  if (!body.name || !body.name.trim()) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }

  const staff = await Staff.findByIdAndUpdate(
    params.id,
    {
      name: body.name,
      title: body.title,
      company: body.company,
      department: body.department,
      phone: body.phone,
      email: body.email,
      website: body.website,
      theme: body.theme || "navygold"
      // qrId is intentionally omitted — QR codes never change when details are edited
    },
    { new: true }
  );

  if (!staff) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ staff });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const staff = await Staff.findByIdAndDelete(params.id);
  if (!staff) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
