"use client";

import { useState } from "react";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"]
});

const sans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"]
});

export type DigitalProfileData = {
  name: string;
  title?: string;
  company?: string;
  department?: string;
  phone?: string;
  email?: string;
  website?: string;
  theme?: string;
  contactUrl?: string;
};

function formatWebsiteDisplay(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function websiteHref(url: string) {
  return url.startsWith("http") ? url : `https://${url}`;
}

function contactFileName(name: string) {
  const safe = name.replace(/[^\w\-]+/g, "-").replace(/^-+|-+$/g, "").toLowerCase();
  return `${safe || "contact"}.vcf`;
}

/** Use current site origin so old SSR links to localhost still work on production. */
function resolveContactSaveUrl(contactUrl: string) {
  if (contactUrl.startsWith("/")) return contactUrl;

  if (typeof window === "undefined") return contactUrl;

  try {
    const parsed = new URL(contactUrl);
    if (parsed.hostname === "localhost" && window.location.hostname !== "localhost") {
      return `${parsed.pathname}${parsed.search}`;
    }
  } catch {
    /* use as-is */
  }

  return contactUrl;
}

async function saveContactFile(contactUrl: string, displayName: string) {
  const saveUrl = resolveContactSaveUrl(contactUrl);
  const res = await fetch(saveUrl, { credentials: "same-origin" });
  if (!res.ok) throw new Error("fetch failed");

  const vcardText = await res.text();
  const filename = contactFileName(displayName);
  const file = new File([vcardText], filename, { type: "text/vcard" });

  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: displayName });
        return;
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
    }
  }

  const blob = new Blob([vcardText], { type: "text/vcard;charset=utf-8" });
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
}

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function WebIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

export default function DigitalProfile({
  name,
  title,
  company,
  department,
  phone,
  email,
  website,
  contactUrl
}: DigitalProfileData) {
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const roleLine = title || department;
  const brand = company?.trim() || "GTC Prime";

  async function handleSaveContact() {
    if (!contactUrl || saving) return;
    setSaving(true);
    setSaveError(false);
    try {
      await saveContactFile(contactUrl, name);
    } catch {
      setSaveError(true);
      window.location.assign(resolveContactSaveUrl(contactUrl));
    } finally {
      setSaving(false);
    }
  }

  const contacts = [
    phone && { label: "Phone", value: phone, href: `tel:${phone.replace(/\s/g, "")}`, Icon: PhoneIcon },
    email && { label: "Email", value: email, href: `mailto:${email}`, Icon: MailIcon },
    website && {
      label: "Website",
      value: formatWebsiteDisplay(website),
      href: websiteHref(website),
      Icon: WebIcon,
      external: true
    }
  ].filter(Boolean) as {
    label: string;
    value: string;
    href: string;
    Icon: () => JSX.Element;
    external?: boolean;
  }[];

  return (
    <div className={`${sans.className} gtc-page`}>
      <div className="gtc-glow" aria-hidden />
      <article className="gtc-card">
        <header className="gtc-hero">
          <div className="gtc-gold-bar" aria-hidden />
          <p className="gtc-brand">{brand}</p>
          <h1 className={`${display.className} gtc-name`}>{name}</h1>
          {roleLine && <p className="gtc-title">{roleLine}</p>}
        </header>

        {contacts.length > 0 && (
          <div className="gtc-body">
            <ul className="gtc-list">
              {contacts.map((c) => (
                <li key={c.label}>
                  <a
                    href={c.href}
                    className="gtc-row"
                    target={c.external ? "_blank" : undefined}
                    rel={c.external ? "noopener noreferrer" : undefined}
                  >
                    <span className="gtc-row-icon">
                      <c.Icon />
                    </span>
                    <span className="gtc-row-text">{c.value}</span>
                  </a>
                </li>
              ))}
            </ul>

            {contactUrl && (
              <>
                <button type="button" className="gtc-save" onClick={handleSaveContact} disabled={saving}>
                  {saving ? "Preparing contact…" : "Save to Contacts"}
                </button>
                {saveError && (
                  <p className="gtc-save-hint">If nothing opened, use your browser menu to open the downloaded contact file.</p>
                )}
              </>
            )}
          </div>
        )}

        <footer className="gtc-foot">
          <span className="gtc-foot-line" />
        </footer>
      </article>

      <style jsx>{`
        .gtc-page {
          min-height: 100dvh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 28px 18px;
          position: relative;
          overflow: hidden;
          background: radial-gradient(ellipse 120% 80% at 50% -20%, #2a3578 0%, #12194a 45%, #0a0e28 100%);
        }

        .gtc-glow {
          position: absolute;
          width: 320px;
          height: 320px;
          top: 15%;
          left: 50%;
          transform: translateX(-50%);
          background: radial-gradient(circle, rgba(201, 162, 75, 0.18) 0%, transparent 70%);
          pointer-events: none;
        }

        .gtc-card {
          position: relative;
          width: 100%;
          max-width: 420px;
          background: #ffffff;
          border-radius: 24px;
          overflow: hidden;
          box-shadow:
            0 0 0 1px rgba(255, 255, 255, 0.08),
            0 24px 64px rgba(0, 0, 0, 0.45),
            0 8px 24px rgba(18, 25, 74, 0.2);
        }

        .gtc-hero {
          padding: 28px 32px 32px;
          text-align: center;
          background: linear-gradient(180deg, #12194a 0%, #1a2460 100%);
          color: #fff;
        }

        .gtc-gold-bar {
          width: 48px;
          height: 3px;
          margin: 0 auto 20px;
          border-radius: 2px;
          background: linear-gradient(90deg, #a8863a, #e8c878, #c9a24b);
        }

        .gtc-brand {
          margin: 0 0 16px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(201, 162, 75, 0.95);
        }

        .gtc-name {
          margin: 0;
          font-size: clamp(28px, 7vw, 34px);
          font-weight: 600;
          line-height: 1.15;
          letter-spacing: 0.01em;
          color: #ffffff;
        }

        .gtc-title {
          margin: 14px auto 0;
          max-width: 320px;
          font-size: 15px;
          font-weight: 500;
          line-height: 1.45;
          color: rgba(255, 255, 255, 0.78);
        }

        .gtc-body {
          padding: 8px 16px 24px;
        }

        .gtc-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .gtc-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 18px;
          border-radius: 14px;
          text-decoration: none;
          color: #0f172a;
          background: #f8f9fc;
          border: 1px solid #eef1f7;
          transition: background 0.15s ease, border-color 0.15s ease;
        }

        .gtc-row:active {
          background: #eef1f8;
        }

        .gtc-row-icon {
          flex-shrink: 0;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          color: #12194a;
          background: linear-gradient(145deg, #ffffff, #eef0f8);
          border: 1px solid #e2e8f4;
        }

        .gtc-row-text {
          flex: 1;
          min-width: 0;
          font-size: 15px;
          font-weight: 500;
          line-height: 1.35;
          word-break: break-word;
        }

        .gtc-save {
          display: block;
          width: 100%;
          margin-top: 18px;
          padding: 15px 20px;
          border-radius: 14px;
          text-align: center;
          font-size: 15px;
          font-weight: 600;
          color: #fff;
          background: linear-gradient(135deg, #12194a 0%, #1e2868 100%);
          box-shadow: 0 4px 14px rgba(18, 25, 74, 0.35);
          border: none;
          cursor: pointer;
          font-family: inherit;
        }

        .gtc-save:disabled {
          opacity: 0.75;
          cursor: wait;
        }

        .gtc-save-hint {
          margin: 10px 4px 0;
          font-size: 12px;
          line-height: 1.4;
          color: #64748b;
          text-align: center;
        }

        .gtc-foot {
          padding: 0 32px 20px;
          display: flex;
          justify-content: center;
        }

        .gtc-foot-line {
          width: 40px;
          height: 4px;
          border-radius: 2px;
          background: #e8ecf4;
        }
      `}</style>
    </div>
  );
}
