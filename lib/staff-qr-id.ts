import { randomUUID } from "crypto";

/** Stable id encoded in every QR — never changes when name/title/contact is edited. */
export function getStaffQrKey(staff: { _id: string; qrId?: string | null }) {
  return staff.qrId || staff._id;
}

export function newStaffQrId() {
  return randomUUID();
}
