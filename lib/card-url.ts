import { getStaffQrKey } from "./staff-qr-id";
import { buildMecard, type VcardStaff } from "./vcard";

function appOrigin(origin?: string) {
  return (
    origin ||
    (typeof window !== "undefined" ? window.location.origin : "") ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

export function getCardUrl(staff: { _id: string; qrId?: string | null }, origin?: string) {
  const qrKey = getStaffQrKey(staff);
  return `${appOrigin(origin)}/card/${qrKey}`;
}

/** Opens the phone's add-to-contacts screen when scanned from a QR code. */
export function getVcardUrl(staff: { _id: string; qrId?: string | null }, origin?: string) {
  const qrKey = getStaffQrKey(staff);
  return `${appOrigin(origin)}/api/vcard/${qrKey}`;
}

/** MECARD text encoded in QR codes — scan opens add-to-contacts on most phones. */
export function getQrPayload(staff: VcardStaff) {
  return buildMecard(staff);
}

/** @deprecated use getQrPayload — kept for callers expecting this name */
export function getQrUrl(staff: VcardStaff) {
  return getQrPayload(staff);
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
