import { buildPhoneVcard, vcardFilename } from "./vcard";

export type ContactSaveResult =
  | { ok: true; method: "share" | "download" | "intent"; hint: string }
  | { ok: false; reason: "cancelled" | "failed" };

function isAndroid() {
  return typeof navigator !== "undefined" && /Android/i.test(navigator.userAgent);
}

function isIOS() {
  return typeof navigator !== "undefined" && /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function enc(value: string) {
  return encodeURIComponent(value);
}

function vcardDownloadUrl(vcardPath: string) {
  const base = vcardPath.includes("?") ? `${vcardPath}&download=1` : `${vcardPath}?download=1`;
  return base;
}

function downloadVcardBlob(vcard: string, filename: string) {
  const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 5000);
}

function downloadVcardFromServer(vcardPath: string, filename: string) {
  const link = document.createElement("a");
  link.href = vcardDownloadUrl(vcardPath);
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function openAndroidContactForm(name: string, tel: string) {
  const intent =
    `intent:#Intent;action=android.intent.action.INSERT;` +
    `type=vnd.android.cursor.dir/contact;` +
    `S.name=${enc(name)};` +
    `S.phone=${enc(tel)};` +
    `S.phone_number=${enc(tel)};end`;
  window.location.assign(intent);
}

/** Save name + phone like the Phone QR (MECARD) — best-effort per mobile browser. */
export async function openPhoneContactSave(options: {
  name: string;
  phone: string;
  vcardPath?: string;
}): Promise<ContactSaveResult> {
  const { name, phone, vcardPath } = options;
  const tel = phone.replace(/\s/g, "");
  const vcard = buildPhoneVcard({ name, phone });
  const filename = vcardFilename(name);

  if (isAndroid()) {
    openAndroidContactForm(name, tel);
    return {
      ok: true,
      method: "intent",
      hint: "When the contact form opens, check name and phone, then tap Save (✓) in the top corner."
    };
  }

  if (isIOS()) {
    const file = new File([vcard], filename, { type: "text/vcard" });
    if (navigator.share) {
      try {
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], title: name });
          return {
            ok: true,
            method: "share",
            hint: "In the share menu, tap Contacts, then Create New Contact and Save."
          };
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return { ok: false, reason: "cancelled" };
        }
      }
    }

    if (vcardPath) {
      downloadVcardFromServer(vcardPath, filename);
    } else {
      downloadVcardBlob(vcard, filename);
    }
    return {
      ok: true,
      method: "download",
      hint: "Tap the downloaded .vcf file (Downloads or Safari arrow), then Add to Contacts."
    };
  }

  if (vcardPath) {
    downloadVcardFromServer(vcardPath, filename);
  } else {
    downloadVcardBlob(vcard, filename);
  }
  return {
    ok: true,
    method: "download",
    hint: "Open the downloaded .vcf file to add this contact."
  };
}
