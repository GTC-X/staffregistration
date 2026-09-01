"use client";

import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
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

function nameMonogram(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return initials || "•";
}

const ACCENTS: Record<string, { bg: string; text: string; soft: string; ring: string }> = {
  navygold: { bg: "#12194a", text: "#12194a", soft: "#eef0f8", ring: "#c9a24b" },
  cream: { bg: "#2d3a6e", text: "#1e2868", soft: "#f4f2ec", ring: "#12194a" },
  charcoal: { bg: "#374151", text: "#1f2937", soft: "#f3f4f6", ring: "#9ca3af" },
  white: { bg: "#2563eb", text: "#1e40af", soft: "#eff6ff", ring: "#93c5fd" }
};

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function WebIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

export default function DigitalProfile({
  name,
  department,
  phone,
  website,
  theme = "navygold",
  contactUrl
}: DigitalProfileData) {
  const accent = ACCENTS[theme] || ACCENTS.navygold;
  const monogram = nameMonogram(name);

  const contacts = [
    phone && { label: "Phone", value: phone, href: `tel:${phone}`, Icon: PhoneIcon },
    website && {
      label: "Website",
      value: website.replace(/^https?:\/\//, ""),
      href: website.startsWith("http") ? website : `https://${website}`,
      Icon: WebIcon
    }
  ].filter(Boolean) as {
    label: string;
    value: string;
    href: string;
    Icon: () => JSX.Element;
  }[];

  return (
    <div className={`${inter.className} dp-page`}>
      <div className="dp-card">
        <div className="dp-header">
          <div className="dp-avatar" style={{ background: accent.soft, color: accent.text, boxShadow: `0 0 0 3px ${accent.ring}22` }}>
            {monogram}
          </div>
          <h1 className="dp-name">{name}</h1>
          {department && <p className="dp-dept">{department}</p>}
          {contactUrl && (
            <a href={contactUrl} className="dp-save-contact" style={{ background: accent.text }}>
              Save to Contacts
            </a>
          )}
        </div>

        {contacts.length > 0 && (
          <div className="dp-section">
            <p className="dp-section-label">Contact</p>
            <div className="dp-contacts">
              {contacts.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  className="dp-contact"
                  target={c.label === "Website" ? "_blank" : undefined}
                  rel={c.label === "Website" ? "noopener noreferrer" : undefined}
                >
                  <span className="dp-contact-icon" style={{ background: accent.soft, color: accent.text }}>
                    <c.Icon />
                  </span>
                  <span className="dp-contact-body">
                    <span className="dp-contact-label">{c.label}</span>
                    <span className="dp-contact-value">{c.value}</span>
                  </span>
                  <span className="dp-contact-arrow" aria-hidden>
                    ›
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="dp-footer">
          <span className="dp-footer-dot" style={{ background: accent.ring }} />
          <span className="dp-footer-text">Digital business card</span>
        </div>
      </div>

      <style jsx>{`
        .dp-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px 20px;
          background: linear-gradient(160deg, #f8fafc 0%, #f1f5f9 50%, #e8eef5 100%);
        }

        .dp-card {
          width: 100%;
          max-width: 400px;
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid rgba(15, 23, 42, 0.06);
          box-shadow:
            0 1px 2px rgba(15, 23, 42, 0.04),
            0 8px 24px rgba(15, 23, 42, 0.06),
            0 24px 48px rgba(15, 23, 42, 0.04);
          overflow: hidden;
        }

        .dp-header {
          padding: 36px 28px 28px;
          text-align: center;
          border-bottom: 1px solid #f1f5f9;
        }

        .dp-avatar {
          width: 72px;
          height: 72px;
          margin: 0 auto 18px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        .dp-name {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: -0.03em;
          line-height: 1.25;
        }

        .dp-dept {
          margin: 8px 0 0;
          font-size: 14px;
          font-weight: 500;
          color: #64748b;
          line-height: 1.4;
        }

        .dp-save-contact {
          display: inline-block;
          margin-top: 18px;
          padding: 12px 22px;
          border-radius: 12px;
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
        }

        .dp-section {
          padding: 24px 20px 8px;
        }

        .dp-section-label {
          margin: 0 0 12px 4px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #94a3b8;
        }

        .dp-contacts {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .dp-contact {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          border-radius: 14px;
          background: #f8fafc;
          border: 1px solid #eef2f6;
          text-decoration: none;
          color: inherit;
        }

        .dp-contact-icon {
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dp-contact-body {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .dp-contact-label {
          font-size: 11px;
          font-weight: 600;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .dp-contact-value {
          font-size: 14px;
          font-weight: 500;
          color: #1e293b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .dp-contact-arrow {
          flex-shrink: 0;
          font-size: 20px;
          font-weight: 300;
          color: #cbd5e1;
          line-height: 1;
        }

        .dp-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 20px 28px 24px;
        }

        .dp-footer-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .dp-footer-text {
          font-size: 11px;
          font-weight: 500;
          color: #cbd5e1;
          letter-spacing: 0.04em;
        }
      `}</style>
    </div>
  );
}
