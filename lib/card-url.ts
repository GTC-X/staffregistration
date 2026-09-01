import { getStaffQrKey } from "./staff-qr-id";

export function getCardUrl(staff: { _id: string; qrId?: string | null }, origin?: string) {
  const qrKey = getStaffQrKey(staff);
  const base =
    origin ||
    (typeof window !== "undefined" ? window.location.origin : "") ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";
  return `${base.replace(/\/$/, "")}/card/${qrKey}`;
}

/** @deprecated pass the staff object so the stable qrId is used */
export function getCardUrlById(staffId: string, origin?: string) {
  const base =
    origin ||
    (typeof window !== "undefined" ? window.location.origin : "") ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";
  return `${base.replace(/\/$/, "")}/card/${staffId}`;
}
