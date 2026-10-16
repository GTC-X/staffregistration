import { getStaffQrKey } from "./staff-qr-id";

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

/** Public PNG URL for this employee's QR code image. */
export function getQrImageUrl(staff: { _id: string; qrId?: string | null }, origin?: string) {
  const qrKey = getStaffQrKey(staff);
  return `${appOrigin(origin)}/api/qr/${qrKey}`;
}

/** Opens the phone's add-to-contacts screen when scanned from a QR code. */
export function getVcardUrl(staff: { _id: string; qrId?: string | null }, origin?: string) {
  const qrKey = getStaffQrKey(staff);
  return `${appOrigin(origin)}/api/vcard/${qrKey}`;
}

/** URL encoded in QR codes — scan opens the digital business card page. */
export function getQrPayload(staff: { _id: string; qrId?: string | null }, origin?: string) {
  return getCardUrl(staff, origin);
}

/** @deprecated use getQrPayload */
export function getQrUrl(staff: { _id: string; qrId?: string | null }, origin?: string) {
  return getQrPayload(staff, origin);
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
