"use client";

import { Playfair_Display, DM_Sans } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-display"
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body"
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
};

function companyMonogram(company?: string) {
  if (!company) return "•";
  const trimmed = company.trim();
  if (trimmed.length <= 4 && !trimmed.includes(" ")) return trimmed.slice(0, 3).toUpperCase();
  return trimmed
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

export default function DigitalProfile({
  name,
  title,
  company,
  department,
  phone,
  email,
  website,
  theme = "navygold"
}: DigitalProfileData) {
  const palette = THEMES[theme] || THEMES.navygold;
  const monogram = companyMonogram(company);

  const contacts = [
    phone && { label: "Phone", value: phone, href: `tel:${phone}`, icon: "phone" },
    email && { label: "Email", value: email, href: `mailto:${email}`, icon: "email" },
    website && {
      label: "Website",
      value: website,
      href: website.startsWith("http") ? website : `https://${website}`,
      icon: "web"
    }
  ].filter(Boolean) as { label: string; value: string; href: string; icon: string }[];

  return (
    <div className={`${playfair.variable} ${dmSans.variable} dp-page`}>
      <div className="dp-glow dp-glow-a" aria-hidden />
      <div className="dp-glow dp-glow-b" aria-hidden />

      <div className="dp-shell">
        <div className="dp-shine-ring" aria-hidden />

        <div className="dp-card">
          <div className="dp-hero" style={{ background: palette.heroBg }}>
            <div className="dp-hero-pattern" aria-hidden />
            <div className="dp-hero-shine" aria-hidden />
            <div className="dp-hero-topline" style={{ background: palette.accentGradient }} />

            <div className="dp-hero-inner">
              <div className="dp-monogram" style={{ borderColor: palette.accent, color: palette.heroText }}>
                {monogram}
              </div>
              {company && (
                <p className="dp-company" style={{ color: palette.heroText }}>
                  {company}
                </p>
              )}
              {department && (
                <p className="dp-department" style={{ color: palette.heroMuted }}>
                  {department}
                </p>
              )}
            </div>

            <svg className="dp-wave" viewBox="0 0 400 32" preserveAspectRatio="none" aria-hidden>
              <path d="M0,20 C90,6 130,28 210,16 C290,4 330,26 400,12 L400,32 L0,32 Z" fill={palette.bodyBgSolid} />
            </svg>
          </div>

          <div className="dp-body" style={{ background: palette.bodyBg }}>
            <div className="dp-body-mesh" aria-hidden />
            <div className="dp-accent-bar" style={{ background: palette.accentGradient }} />

            <div className="dp-profile">
              <p className="dp-name">{name}</p>
              {title && (
                <p className="dp-title" style={{ color: palette.titleColor }}>
                  {title}
                </p>
              )}
              <div className="dp-divider">
                <span style={{ background: palette.accentGradient }} />
                <span style={{ background: palette.accent }} />
              </div>
            </div>

            {contacts.length > 0 && (
              <div className="dp-contacts">
                {contacts.map((c) => (
                  <a key={c.label} href={c.href} className="dp-contact" target={c.icon === "web" ? "_blank" : undefined} rel={c.icon === "web" ? "noopener noreferrer" : undefined}>
                    <span className="dp-contact-icon" style={{ color: palette.accent }}>
                      {c.icon === "phone" && "☎"}
                      {c.icon === "email" && "✉"}
                      {c.icon === "web" && "🔗"}
                    </span>
                    <span className="dp-contact-text">
                      <span className="dp-contact-label" style={{ color: palette.muted }}>
                        {c.label}
                      </span>
                      <span className="dp-contact-value" style={{ color: palette.contactColor }}>
                        {c.value}
                      </span>
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .dp-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 16px 40px;
          font-family: var(--font-body), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          background:
            radial-gradient(ellipse 70% 45% at 20% 0%, rgba(201, 162, 75, 0.18), transparent),
            radial-gradient(ellipse 60% 40% at 85% 10%, rgba(18, 25, 74, 0.1), transparent),
            linear-gradient(180deg, #faf8f4 0%, #eef1f8 100%);
          position: relative;
          overflow: hidden;
        }

        .dp-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          pointer-events: none;
        }

        .dp-glow-a {
          width: 280px;
          height: 280px;
          top: -80px;
          left: -60px;
          background: rgba(201, 162, 75, 0.22);
        }

        .dp-glow-b {
          width: 320px;
          height: 320px;
          bottom: -120px;
          right: -80px;
          background: rgba(18, 25, 74, 0.12);
        }

        .dp-shell {
          position: relative;
          width: 100%;
          max-width: 420px;
          z-index: 1;
        }

        .dp-shine-ring {
          position: absolute;
          inset: -3px;
          border-radius: 26px;
          background: conic-gradient(from 0deg, #fff6dc, #e8c872, #c9a24b, #8a6d2e, #f5e6b8, #c9a24b, #fff6dc);
          animation: dp-spin 8s linear infinite;
          z-index: 0;
        }

        .dp-card {
          position: relative;
          z-index: 1;
          border-radius: 23px;
          overflow: hidden;
          box-shadow: 0 24px 60px rgba(18, 25, 74, 0.28);
        }

        .dp-hero {
          position: relative;
          padding: 28px 24px 36px;
          overflow: hidden;
        }

        .dp-hero-pattern {
          position: absolute;
          inset: 0;
          opacity: 0.35;
          background-image: radial-gradient(circle at 1px 1px, rgba(18, 25, 74, 0.06) 1px, transparent 0);
          background-size: 16px 16px;
        }

        .dp-hero-shine {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.15) 100%);
        }

        .dp-hero-topline {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
        }

        .dp-hero-inner {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 8px;
        }

        .dp-monogram {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          border: 2.5px solid;
          display: grid;
          place-items: center;
          font-size: 16px;
          font-weight: 800;
          letter-spacing: 0.06em;
          background: rgba(255, 255, 255, 0.8);
          box-shadow: 0 8px 24px rgba(18, 25, 74, 0.12);
        }

        .dp-company {
          margin: 4px 0 0;
          font-size: 15px;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .dp-department {
          margin: 0;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.04em;
        }

        .dp-wave {
          position: absolute;
          left: 0;
          right: 0;
          bottom: -1px;
          width: 100%;
          height: 32px;
        }

        .dp-body {
          position: relative;
          padding: 24px 22px 28px;
        }

        .dp-body-mesh {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 90% 10%, rgba(255, 255, 255, 0.08), transparent 45%),
            radial-gradient(circle at 10% 90%, rgba(201, 162, 75, 0.1), transparent 40%);
        }

        .dp-accent-bar {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 5px;
        }

        .dp-profile {
          position: relative;
          text-align: center;
          padding: 0 8px 20px;
        }

        .dp-name {
          margin: 0 0 6px;
          font-family: var(--font-display), Georgia, serif;
          font-size: 28px;
          font-weight: 700;
          line-height: 1.15;
          color: #fff;
          text-shadow: 0 2px 16px rgba(0, 0, 0, 0.25);
        }

        .dp-title {
          margin: 0;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          line-height: 1.4;
        }

        .dp-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 16px;
        }

        .dp-divider span:first-child {
          width: 40px;
          height: 2px;
          border-radius: 2px;
        }

        .dp-divider span:last-child {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          box-shadow: 0 0 8px rgba(201, 162, 75, 0.8);
        }

        .dp-contacts {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .dp-contact {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          border-radius: 14px;
          text-decoration: none;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(8px);
          transition: background 0.2s ease, transform 0.2s ease;
        }

        .dp-contact:active {
          transform: scale(0.98);
          background: rgba(255, 255, 255, 0.12);
        }

        .dp-contact-icon {
          font-size: 18px;
          width: 24px;
          text-align: center;
          flex-shrink: 0;
        }

        .dp-contact-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .dp-contact-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .dp-contact-value {
          font-size: 13px;
          font-weight: 500;
          word-break: break-all;
        }

        @keyframes dp-spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

const THEMES: Record<
  string,
  {
    heroBg: string;
    heroText: string;
    heroMuted: string;
    bodyBg: string;
    bodyBgSolid: string;
    accent: string;
    accentGradient: string;
    titleColor: string;
    contactColor: string;
    muted: string;
  }
> = {
  navygold: {
    heroBg: "linear-gradient(165deg, #fffcf7 0%, #f5efe3 45%, #e8edf5 100%)",
    heroText: "#12194a",
    heroMuted: "#5a6288",
    bodyBg: "linear-gradient(165deg, #1e2868 0%, #12194a 55%, #0d1238 100%)",
    bodyBgSolid: "#151d52",
    accent: "#c9a24b",
    accentGradient: "linear-gradient(180deg, #f0d078 0%, #c9a24b 50%, #9a7830 100%)",
    titleColor: "#e8cc7a",
    contactColor: "#f0f2fa",
    muted: "#a8b0cc"
  },
  cream: {
    heroBg: "linear-gradient(165deg, #ffffff 0%, #f8f4eb 100%)",
    heroText: "#12194a",
    heroMuted: "#6b7288",
    bodyBg: "linear-gradient(165deg, #24306e 0%, #12194a 100%)",
    bodyBgSolid: "#151d52",
    accent: "#12194a",
    accentGradient: "linear-gradient(180deg, #3a4590 0%, #12194a 100%)",
    titleColor: "#c9d4ff",
    contactColor: "#eef1fa",
    muted: "#a8b4d8"
  },
  charcoal: {
    heroBg: "linear-gradient(165deg, #fafafa 0%, #ececec 100%)",
    heroText: "#1c1c1c",
    heroMuted: "#666",
    bodyBg: "linear-gradient(165deg, #2a2a2a 0%, #141414 100%)",
    bodyBgSolid: "#1a1a1a",
    accent: "#c9a24b",
    accentGradient: "linear-gradient(180deg, #f0d078, #c9a24b)",
    titleColor: "#d4b05a",
    contactColor: "#f0f0f0",
    muted: "#999"
  },
  white: {
    heroBg: "linear-gradient(165deg, #ffffff 0%, #eef2fa 100%)",
    heroText: "#12194a",
    heroMuted: "#5a6288",
    bodyBg: "linear-gradient(165deg, #24306e 0%, #12194a 100%)",
    bodyBgSolid: "#151d52",
    accent: "#c9a24b",
    accentGradient: "linear-gradient(180deg, #f0d078, #c9a24b)",
    titleColor: "#dbe2ff",
    contactColor: "#eef1fa",
    muted: "#a8b0cc"
  }
};
