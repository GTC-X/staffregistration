import Staff from "@/models/Staff";

const OBJECT_ID_RE = /^[a-f\d]{24}$/i;

/** Look up staff by stable qrId (UUID) or legacy MongoDB _id. */
export async function findStaffByQrOrId(id: string) {
  const byQr = await Staff.findOne({ qrId: id }).lean<any>();
  if (byQr) return byQr;

  if (OBJECT_ID_RE.test(id)) {
    return Staff.findById(id).lean<any>();
  }

  return null;
}
