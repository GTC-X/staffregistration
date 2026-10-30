import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { findStaffByQrOrId } from "@/lib/find-staff";
import { getQrPayloadForVariant, type QrVariant } from "@/lib/card-url";
import { generateQrPngBuffer } from "@/lib/qr";
import { vcardFilename } from "@/lib/vcard";

function qrVariantFromUrl(url: URL): QrVariant {
  return url.searchParams.get("type") === "phone" ? "phone" : "profile";
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const staff = await findStaffByQrOrId(params.id);

  if (!staff) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const requestUrl = new URL(req.url);
  const variant = qrVariantFromUrl(requestUrl);
  const origin = requestUrl.origin;
  const payload = getQrPayloadForVariant(
    {
      _id: String(staff._id),
      qrId: staff.qrId,
      name: staff.name,
      phone: staff.phone,
      externalProfileUrl: staff.externalProfileUrl
    },
    variant,
    origin
  );

  const png = await generateQrPngBuffer(payload);
  const baseName = vcardFilename(staff.name).replace(".vcf", "");
  const filename = variant === "phone" ? `${baseName}-phone-qr.png` : `${baseName}-profile-qr.png`;

  return new NextResponse(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "public, max-age=3600"
    }
  });
}
