import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { findStaffByQrOrId } from "@/lib/find-staff";
import { getQrPayload } from "@/lib/card-url";
import { generateQrPngBuffer } from "@/lib/qr";
import { vcardFilename } from "@/lib/vcard";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const staff = await findStaffByQrOrId(params.id);

  if (!staff) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const origin = new URL(req.url).origin;
  const payload = getQrPayload({ _id: String(staff._id), qrId: staff.qrId }, origin);

  const png = await generateQrPngBuffer(payload);
  const filename = vcardFilename(staff.name).replace(".vcf", "-qr.png");

  return new NextResponse(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "public, max-age=3600"
    }
  });
}
