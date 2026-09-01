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

export type BusinessCardData = {
  name: string;
  title?: string;
  company?: string;
  phone?: string;
  email?: string;
  website?: string;
  theme?: string;
};

type BusinessCardProps = BusinessCardData & {
  className?: string;
  variant?: "print" | "digital";
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

export default function BusinessCard({
  name,
  title,
  company,
  phone,
  email,
  website,
  theme = "navygold",
  className = "",
  variant = "print"
}: BusinessCardProps) {
  const palette = THEMES[theme] || THEMES.navygold;
  const monogram = companyMonogram(company);
  const variantClass = variant === "digital" ? "bc-digital" : "";

  return (
    <div className={`${playfair.variable} ${dmSans.variable} bc-shine-wrap ${variantClass} ${className}`.trim()}>
      <div className="bc-orbit" aria-hidden />
      <div className="bc-frame" aria-hidden />

      <div className="bc-card">
        <div className="bc-light" style={{ background: palette.lightBg }}>
          <div className="bc-pattern" aria-hidden />
          <div className="bc-light-glow" aria-hidden />
          <div className="bc-light-topline" style={{ background: palette.accentGradient }} />

          <div className="bc-light-inner">
            <div className="bc-monogram" style={{ borderColor: palette.accent, color: palette.companyTop }}>
              <span>{monogram}</span>
            </div>
            {company && (
              <p className="bc-company-top" style={{ background: palette.companyGradient, color: palette.companyTop }}>
                {company}
              </p>
            )}
          </div>

          <svg className="bc-wave" viewBox="0 0 400 28" preserveAspectRatio="none" aria-hidden>
            <path d="M0,18 C80,4 120,26 200,14 C280,2 320,24 400,10 L400,28 L0,28 Z" fill={palette.waveFill} />
            <path
              d="M0,22 C90,10 140,24 210,16 C290,8 330,22 400,14"
              fill="none"
              stroke={palette.accent}
              strokeWidth="1.2"
              opacity="0.45"
            />
          </svg>
        </div>

        <div className="bc-blue" style={{ background: palette.blueBg }}>
          <div className="bc-accent" style={{ background: palette.accentGradient }} />
          <div className="bc-accent-glow" style={{ background: palette.accentGlow }} aria-hidden />
          <div className="bc-blue-mesh" aria-hidden />
          <div className="bc-corner bc-corner-tr" style={{ borderColor: palette.accent }} aria-hidden />
          <div className="bc-corner bc-corner-bl" style={{ borderColor: palette.accent }} aria-hidden />

          <div className="bc-content">
            <p className="bc-name">{name}</p>
            {title && <p className="bc-title" style={{ color: palette.title }}>{title}</p>}

            <div className="bc-divider-wrap">
              <span className="bc-divider" style={{ background: palette.accentGradient }} />
              <span className="bc-divider-dot" style={{ background: palette.accent }} />
            </div>

            <div className="bc-contact">
              {phone && (
                <div className="bc-contact-row" style={{ color: palette.contact }}>
                  <PhoneIcon />
                  <span>{phone}</span>
                </div>
              )}
              {email && (
                <div className="bc-contact-row" style={{ color: palette.contact }}>
                  <EmailIcon />
                  <span>{email}</span>
                </div>
              )}
              {website && (
                <div className="bc-contact-row" style={{ color: palette.contact }}>
                  <WebIcon />
                  <span>{website}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .bc-shine-wrap {
          --bc-accent: ${palette.accent};
          position: relative;
          width: 3.5in;
          height: 2in;
          border-radius: 16px;
          padding: 3px;
          font-family: var(--font-body), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          background: conic-gradient(
            from var(--bc-angle, 0deg),
            #fff6dc,
            #f0d078,
            #c9a24b,
            #8a6d2e,
            #f5e6b8,
            #c9a24b,
            #fff6dc
          );
          animation: bc-spin 8s linear infinite;
          box-shadow:
            0 0 0 1px rgba(201, 162, 75, 0.5),
            0 0 32px rgba(201, 162, 75, 0.35),
            0 16px 40px rgba(18, 25, 74, 0.28);
          transition: transform 0.35s ease, box-shadow 0.35s ease;
        }

        .bc-shine-wrap:hover {
          transform: translateY(-4px) scale(1.015);
          box-shadow:
            0 0 0 1px rgba(201, 162, 75, 0.65),
            0 0 42px rgba(201, 162, 75, 0.5),
            0 22px 48px rgba(18, 25, 74, 0.32);
        }

        .bc-shine-wrap.bc-digital {
          width: 100%;
          max-width: 420px;
          height: 240px;
        }

        .bc-shine-wrap.bc-digital .bc-name {
          font-size: 18px;
        }

        .bc-shine-wrap.bc-digital .bc-title {
          font-size: 10.5px;
        }

        .bc-shine-wrap.bc-digital .bc-contact-row {
          font-size: 9px;
        }

        .bc-shine-wrap.bc-digital:hover {
          transform: translateY(-2px) scale(1.01);
        }

        .bc-orbit {
          position: absolute;
          inset: -6px;
          border-radius: 20px;
          background: radial-gradient(circle at 30% 20%, rgba(255, 230, 160, 0.35), transparent 55%);
          pointer-events: none;
          z-index: 0;
          filter: blur(8px);
        }

        .bc-frame {
          position: absolute;
          inset: 2px;
          border-radius: 13px;
          pointer-events: none;
          z-index: 3;
          background: linear-gradient(
            145deg,
            rgba(255, 255, 255, 0.65) 0%,
            rgba(255, 255, 255, 0.08) 35%,
            rgba(201, 162, 75, 0.15) 100%
          );
          mix-blend-mode: soft-light;
        }

        .bc-card {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 13px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          z-index: 1;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.25);
        }

        .bc-light {
          position: relative;
          height: 36%;
          min-height: 0.62in;
          overflow: hidden;
        }

        .bc-pattern {
          position: absolute;
          inset: 0;
          opacity: 0.35;
          background-image: radial-gradient(circle at 1px 1px, rgba(18, 25, 74, 0.07) 1px, transparent 0);
          background-size: 14px 14px;
        }

        .bc-light-glow {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.2) 55%, transparent 100%);
        }

        .bc-light-topline {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
        }

        .bc-light-inner {
          position: relative;
          z-index: 1;
          height: 100%;
          display: flex;
          align-items: center;
          gap: 0.14in;
          padding: 0.16in 0.28in 0.22in 0.32in;
        }

        .bc-monogram {
          flex-shrink: 0;
          width: 0.42in;
          height: 0.42in;
          border-radius: 50%;
          border: 2px solid;
          display: grid;
          place-items: center;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.04em;
          background: rgba(255, 255, 255, 0.75);
          box-shadow: 0 4px 14px rgba(18, 25, 74, 0.12);
        }

        .bc-company-top {
          margin: 0;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          line-height: 1.2;
        }

        .bc-wave {
          position: absolute;
          left: 0;
          right: 0;
          bottom: -1px;
          width: 100%;
          height: 0.18in;
          z-index: 2;
        }

        .bc-blue {
          position: relative;
          flex: 1;
          display: flex;
          align-items: center;
          padding: 0.1in 0.24in 0.14in 0.32in;
          overflow: hidden;
        }

        .bc-accent {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 0.11in;
        }

        .bc-accent-glow {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 0.28in;
          filter: blur(10px);
          opacity: 0.55;
        }

        .bc-blue-mesh {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 85% 15%, rgba(255, 255, 255, 0.09), transparent 42%),
            radial-gradient(circle at 10% 90%, rgba(201, 162, 75, 0.12), transparent 38%);
        }

        .bc-corner {
          position: absolute;
          width: 14px;
          height: 14px;
          opacity: 0.55;
        }

        .bc-corner-tr {
          top: 8px;
          right: 10px;
          border-top: 1.5px solid;
          border-right: 1.5px solid;
        }

        .bc-corner-bl {
          bottom: 8px;
          right: 14px;
          border-bottom: 1.5px solid;
          border-left: 1.5px solid;
        }

        .bc-content {
          position: relative;
          width: 100%;
          z-index: 1;
        }

        .bc-name {
          margin: 0 0 2px;
          font-family: var(--font-display), Georgia, serif;
          font-size: 16px;
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: 0.01em;
          color: #ffffff;
          text-shadow: 0 2px 12px rgba(0, 0, 0, 0.25);
        }

        .bc-title {
          margin: 0 0 7px;
          font-size: 9.5px;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          line-height: 1.35;
        }

        .bc-divider-wrap {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-bottom: 7px;
        }

        .bc-divider {
          width: 32px;
          height: 2px;
          border-radius: 2px;
        }

        .bc-divider-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          box-shadow: 0 0 6px rgba(201, 162, 75, 0.8);
        }

        .bc-contact {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .bc-contact-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 8px;
          line-height: 1.4;
          letter-spacing: 0.02em;
        }

        .bc-contact-row :global(svg) {
          flex-shrink: 0;
          opacity: 0.85;
        }

        @property --bc-angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }

        @keyframes bc-spin {
          to {
            --bc-angle: 360deg;
          }
        }

        @media print {
          .bc-shine-wrap {
            animation: none;
            transform: none;
            box-shadow: none;
          }
          .bc-shine-wrap:hover {
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}

function PhoneIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function WebIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

const THEMES: Record<
  string,
  {
    lightBg: string;
    blueBg: string;
    waveFill: string;
    accent: string;
    accentGradient: string;
    accentGlow: string;
    title: string;
    companyTop: string;
    companyGradient: string;
    contact: string;
  }
> = {
  navygold: {
    lightBg: "linear-gradient(165deg, #fffcf7 0%, #f5efe3 45%, #e8edf5 100%)",
    blueBg: "linear-gradient(165deg, #1e2868 0%, #12194a 55%, #0d1238 100%)",
    waveFill: "#151d52",
    accent: "#c9a24b",
    accentGradient: "linear-gradient(180deg, #f0d078 0%, #c9a24b 50%, #9a7830 100%)",
    accentGlow: "linear-gradient(90deg, rgba(201,162,75,0.5), transparent)",
    title: "#e8cc7a",
    companyTop: "#12194a",
    companyGradient: "linear-gradient(135deg, #12194a 0%, #3a4590 50%, #12194a 100%)",
    contact: "#dce1ef"
  },
  cream: {
    lightBg: "linear-gradient(165deg, #ffffff 0%, #f8f4eb 100%)",
    blueBg: "linear-gradient(165deg, #24306e 0%, #12194a 100%)",
    waveFill: "#151d52",
    accent: "#12194a",
    accentGradient: "linear-gradient(180deg, #3a4590 0%, #12194a 100%)",
    accentGlow: "linear-gradient(90deg, rgba(58,69,144,0.4), transparent)",
    title: "#c9d4ff",
    companyTop: "#12194a",
    companyGradient: "linear-gradient(135deg, #12194a, #3a4590)",
    contact: "#e8ebf5"
  },
  charcoal: {
    lightBg: "linear-gradient(165deg, #fafafa 0%, #ececec 100%)",
    blueBg: "linear-gradient(165deg, #2a2a2a 0%, #141414 100%)",
    waveFill: "#1a1a1a",
    accent: "#c9a24b",
    accentGradient: "linear-gradient(180deg, #f0d078, #c9a24b)",
    accentGlow: "linear-gradient(90deg, rgba(201,162,75,0.45), transparent)",
    title: "#d4b05a",
    companyTop: "#1c1c1c",
    companyGradient: "linear-gradient(135deg, #1c1c1c, #555)",
    contact: "#d0d0d0"
  },
  white: {
    lightBg: "linear-gradient(165deg, #ffffff 0%, #eef2fa 100%)",
    blueBg: "linear-gradient(165deg, #24306e 0%, #12194a 100%)",
    waveFill: "#151d52",
    accent: "#c9a24b",
    accentGradient: "linear-gradient(180deg, #f0d078, #c9a24b)",
    accentGlow: "linear-gradient(90deg, rgba(201,162,75,0.45), transparent)",
    title: "#dbe2ff",
    companyTop: "#12194a",
    companyGradient: "linear-gradient(135deg, #12194a, #3a4590)",
    contact: "#d8dce8"
  }
};
