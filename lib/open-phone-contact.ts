import { buildPhoneVcard } from "./vcard";

function isAndroid() {
  return typeof navigator !== "undefined" && /Android/i.test(navigator.userAgent);
}

function isIOS() {
  return typeof navigator !== "undefined" && /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function withInlineVcardQuery(path: string) {
  return path.includes("?") ? `${path}&inline=1` : `${path}?inline=1`;
}

/** Opens the system "new contact" screen with name + phone (same data as the phone QR). */
export function openPhoneContactSave(options: { name: string; phone: string; vcardPath?: string }) {
  const { name, phone, vcardPath } = options;
  const tel = phone.replace(/\s/g, "");

  if (isAndroid()) {
    const intent =
      `intent:#Intent;action=android.intent.action.INSERT;` +
      `type=vnd.android.cursor.dir/contact;` +
      `S.name=${encodeURIComponent(name)};` +
      `S.phone=${encodeURIComponent(tel)};end`;
    window.location.assign(intent);
    return;
  }

  if (vcardPath) {
    window.location.assign(withInlineVcardQuery(vcardPath));
    return;
  }

  const vcard = buildPhoneVcard({ name, phone });
  const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
  const objectUrl = URL.createObjectURL(blob);
  window.location.assign(objectUrl);

  if (isIOS()) {
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
  } else {
    URL.revokeObjectURL(objectUrl);
  }
}
