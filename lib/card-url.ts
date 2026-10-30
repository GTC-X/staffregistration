import { getStaffQrKey } from "./staff-qr-id";
import { buildPhoneMecard } from "./vcard";

export type QrVariant = "profile" | "phone";

function defaultServerOrigin() {
  const publicUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (publicUrl && !publicUrl.includes("localhost")) return publicUrl;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return publicUrl || "http://localhost:3000";
}

function appOrigin(origin?: string) {
  return (
    origin ||
    (typeof window !== "undefined" ? window.location.origin : "") ||
    defaultServerOrigin()
  ).replace(/\/$/, "");
}

/** Same-site path for Save to Contacts — avoids baking localhost into SSR HTML. */
export function getContactSavePath(staff: { _id: string; qrId?: string | null }) {
  const qrKey = getStaffQrKey(staff);
  return `/api/vcard/${qrKey}?type=phone`;
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

/** Absolute URL for phone-only contact file (exports, emails). Prefer getContactSavePath on the card page. */
export function getVcardUrl(staff: { _id: string; qrId?: string | null }, origin?: string) {
  return `${appOrigin(origin)}${getContactSavePath(staff)}`;
}

type QrStaffRef = {
  _id: string;
  qrId?: string | null;
  name?: string;
  phone?: string;
  externalProfileUrl?: string | null;
};

export function normalizeExternalProfileUrl(url?: string | null) {
  const trimmed = url?.trim();
  if (!trimmed) return null;
  if (!/^https?:\/\//i.test(trimmed)) return null;
  return trimmed;
}

/** Profile link shown in admin / new QR codes (Covve URL when configured). */
export function getProfileLink(staff: { _id: string; qrId?: string | null; externalProfileUrl?: string | null }, origin?: string) {
  return normalizeExternalProfileUrl(staff.externalProfileUrl) || getCardUrl(staff, origin);
}

export function getQrPayloadForVariant(staff: QrStaffRef, variant: QrVariant, origin?: string) {
  if (variant === "profile") {
    return getProfileLink(staff, origin);
  }
  return buildPhoneMecard({ name: staff.name || "", phone: staff.phone });
}

/** Profile (full detail) QR payload — Covve or /card URL. */
export function getProfileQrPayload(
  staff: { _id: string; qrId?: string | null; externalProfileUrl?: string | null },
  origin?: string
) {
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
