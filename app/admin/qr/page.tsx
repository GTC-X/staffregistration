"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import QrCodeImage from "@/components/QrCodeImage";
import { getCardUrl } from "@/lib/card-url";
import { downloadQrPng } from "@/lib/qr";

type Staff = {
  _id: string;
  qrId?: string;
  name: string;
  title?: string;
  company?: string;
};

export default function QrCodesPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/staff")
      .then((r) => r.json())
      .then((data) => {
        setStaff(data.staff || []);
        setLoading(false);
      });
  }, []);

  async function copyLink(person: Staff) {
    const url = getCardUrl(person);
    await navigator.clipboard.writeText(url);
    setCopiedId(person._id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  async function handleDownload(person: Staff) {
    const url = getCardUrl(person);
    const safeName = person.name.replace(/[^\w\-]+/g, "-").toLowerCase();
    await downloadQrPng(url, `${safeName}-qr.png`);
  }

  return (
    <div className="qr-page">
      <div className="qr-header">
        <div>
          <h1 className="qr-title">QR codes</h1>
          <p className="qr-subtitle">
            Each employee gets a unique QR code. Scanning it opens their digital business profile.
            Editing name or contact details does not change the QR code.
          </p>
        </div>
        <Link href="/admin" className="qr-back-link">
          Back to directory
        </Link>
      </div>

      {loading ? (
        <p className="qr-empty">Loading...</p>
      ) : staff.length === 0 ? (
        <p className="qr-empty">No staff yet — add employees first.</p>
      ) : (
        <div className="qr-grid">
          {staff.map((s) => {
            const cardUrl = getCardUrl(s);
            const subtitle = [s.title, s.company].filter(Boolean).join(" · ");

            return (
              <article key={s._id} className="qr-card">
                <div className="qr-card-shine" aria-hidden />

                <div className="qr-card-body">
                  <div className="qr-frame">
                    <QrCodeImage url={cardUrl} size={160} alt={`QR code for ${s.name}`} />
                  </div>

                  <div className="qr-info">
                    <h2 className="qr-name">{s.name}</h2>
                    {subtitle && <p className="qr-role">{subtitle}</p>}
                  </div>

                  <div className="qr-link-row">
                    <span className="qr-link-label">Profile link</span>
                    <a href={cardUrl} target="_blank" rel="noopener noreferrer" className="qr-link-url" title={cardUrl}>
                      {cardUrl.replace(/^https?:\/\//, "")}
                    </a>
                  </div>

                  <div className="qr-actions">
                    <a href={cardUrl} target="_blank" rel="noopener noreferrer" className="qr-btn qr-btn-primary">
                      Preview
                    </a>
                    <button type="button" onClick={() => copyLink(s)} className="qr-btn qr-btn-secondary">
                      {copiedId === s._id ? "Copied!" : "Copy link"}
                    </button>
                    <button type="button" onClick={() => handleDownload(s)} className="qr-btn qr-btn-secondary">
                      Download
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <style jsx global>{`
        .qr-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px 24px 80px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
        }

        .qr-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 28px;
        }

        .qr-title {
          margin: 0;
          font-size: 22px;
          color: #12194a;
        }

        .qr-subtitle {
          margin: 4px 0 0;
          color: #666;
          font-size: 14px;
          max-width: 520px;
          line-height: 1.5;
        }

        .qr-back-link {
          flex-shrink: 0;
          text-decoration: none;
          background: #fff;
          color: #1c1c1c;
          border: 1px solid #dedad0;
          border-radius: 8px;
          padding: 9px 16px;
          font-size: 13px;
          font-weight: 600;
        }

        .qr-empty {
          color: #888;
          font-size: 14px;
        }

        .qr-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }

        .qr-card {
          position: relative;
          border-radius: 16px;
          padding: 2px;
          background: linear-gradient(135deg, #f5e6b8, #c9a24b, #12194a, #c9a24b, #f5e6b8);
          box-shadow: 0 8px 28px rgba(18, 25, 74, 0.1);
        }

        .qr-card-shine {
          position: absolute;
          inset: 2px;
          border-radius: 14px;
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.5), transparent 50%);
          pointer-events: none;
          z-index: 1;
        }

        .qr-card-body {
          position: relative;
          z-index: 0;
          background: #fff;
          border-radius: 14px;
          padding: 22px 20px 18px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .qr-frame {
          padding: 10px;
          border-radius: 12px;
          background: linear-gradient(180deg, #faf8f4 0%, #f0ebe0 100%);
          border: 1px solid #e8e4da;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
        }

        .qr-info {
          width: 100%;
          margin-top: 16px;
        }

        .qr-name {
          margin: 0;
          font-size: 17px;
          font-weight: 700;
          color: #12194a;
          line-height: 1.25;
        }

        .qr-role {
          margin: 5px 0 0;
          font-size: 12px;
          color: #666;
          line-height: 1.4;
        }

        .qr-link-row {
          width: 100%;
          margin-top: 14px;
          padding: 10px 12px;
          border-radius: 10px;
          background: #f7f5f0;
          border: 1px solid #ece8de;
        }

        .qr-link-label {
          display: block;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #9a9488;
          margin-bottom: 4px;
        }

        .qr-link-url {
          display: block;
          font-size: 11px;
          color: #3a4590;
          text-decoration: none;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .qr-link-url:hover {
          text-decoration: underline;
        }

        .qr-actions {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 8px;
          width: 100%;
          margin-top: 16px;
        }

        .qr-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 9px 8px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          font-family: inherit;
          white-space: nowrap;
        }

        .qr-btn-primary {
          background: #12194a;
          color: #fff;
          border: none;
        }

        .qr-btn-secondary {
          background: #fff;
          color: #12194a;
          border: 1px solid #dedad0;
        }

        .qr-btn-secondary:hover,
        .qr-btn-primary:hover {
          opacity: 0.92;
        }

        @media (max-width: 640px) {
          .qr-header {
            flex-direction: column;
          }

          .qr-actions {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
