import { getStaffQrKey } from "./staff-qr-id";
import { buildPhoneMecard } from "./vcard";

export type QrVariant = "profile" | "phone";

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

/** Public PNG URL for a QR variant (`profile` = digital card link, `phone` = contact QR). */
export function getQrImageUrl(
  staff: { _id: string; qrId?: string | null },
  origin?: string,
  variant: QrVariant = "profile"
) {
  const qrKey = getStaffQrKey(staff);
  const base = `${appOrigin(origin)}/api/qr/${qrKey}`;
  return variant === "phone" ? `${base}?type=phone` : base;
}

/** Phone-only contact file (name + mobile) for Save to Contacts on the profile page. */
export function getVcardUrl(staff: { _id: string; qrId?: string | null }, origin?: string) {
  const qrKey = getStaffQrKey(staff);
  return `${appOrigin(origin)}/api/vcard/${qrKey}?type=phone`;
}

type QrStaffRef = { _id: string; qrId?: string | null; name?: string; phone?: string };

export function getQrPayloadForVariant(staff: QrStaffRef, variant: QrVariant, origin?: string) {
  if (variant === "profile") {
    return getCardUrl(staff, origin);
  }
  return buildPhoneMecard({ name: staff.name || "", phone: staff.phone });
}

/** Profile (full detail) QR payload — digital business card URL. */
export function getProfileQrPayload(staff: { _id: string; qrId?: string | null }, origin?: string) {
  return getQrPayloadForVariant(staff, "profile", origin);
}

/** Phone-only QR payload — MECARD with name and phone. */
export function getPhoneQrPayload(staff: { name: string; phone?: string }) {
  return buildPhoneMecard(staff);
}

/** @deprecated use getProfileQrPayload or getPhoneQrPayload */
export function getQrPayload(staff: { _id: string; qrId?: string | null }, origin?: string) {
  return getProfileQrPayload(staff, origin);
}

/** @deprecated use getProfileQrPayload */
export function getQrUrl(staff: { _id: string; qrId?: string | null }, origin?: string) {
  return getProfileQrPayload(staff, origin);
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
