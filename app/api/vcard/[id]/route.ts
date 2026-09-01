import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { findStaffByQrOrId } from "@/lib/find-staff";
import { buildVcard, vcardFilename } from "@/lib/vcard";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const staff = await findStaffByQrOrId(params.id);

  if (!staff) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const vcard = buildVcard({
    name: staff.name,
    phone: staff.phone,
    department: staff.department,
    website: staff.website
  });

  return new NextResponse(vcard, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `inline; filename="${vcardFilename(staff.name)}"`,
      "Cache-Control": "no-store"
    }
  });
}
