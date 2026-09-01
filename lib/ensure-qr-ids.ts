import { randomUUID } from "crypto";
import Staff from "@/models/Staff";

/** Backfill qrId for records created before stable QR ids were added. */
export async function ensureStaffQrIds() {
  const missing = await Staff.find({
    $or: [{ qrId: { $exists: false } }, { qrId: null }, { qrId: "" }]
  });

  await Promise.all(
    missing.map((doc) => {
      doc.qrId = randomUUID();
      return doc.save();
    })
  );
}
