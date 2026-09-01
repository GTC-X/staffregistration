"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Papa from "papaparse";

type Staff = {
  _id: string;
  qrId?: string;
  name: string;
  title?: string;
  company?: string;
  department?: string;
  phone?: string;
  email?: string;
  website?: string;
  theme?: string;
};

export default function AdminPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [importStatus, setImportStatus] = useState<{ text: string; err: boolean } | null>(null);
  const [exporting, setExporting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allSelected = staff.length > 0 && selectedIds.size === staff.length;
  const someSelected = selectedIds.size > 0;

  async function loadStaff() {
    setLoading(true);
    const res = await fetch("/api/staff");
    const data = await res.json();
    setStaff(data.staff || []);
    setSelectedIds(new Set());
    setLoading(false);
  }

  useEffect(() => {
    loadStaff();
  }, []);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Remove ${name} from the directory?`)) return;
    await fetch(`/api/staff/${id}`, { method: "DELETE" });
    setStaff((prev) => prev.filter((s) => s._id !== id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(staff.map((s) => s._id)));
    }
  }

  async function handleBulkDelete() {
    const ids = Array.from(selectedIds);
    if (!ids.length) return;

    const label = ids.length === 1 ? "1 employee" : `${ids.length} employees`;
    if (!confirm(`Remove ${label} from the directory? This cannot be undone.`)) return;

    setDeleting(true);
    setImportStatus(null);

    const res = await fetch("/api/staff", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids })
    });
    const data = await res.json();
    setDeleting(false);

    if (!res.ok) {
      setImportStatus({ text: data.error || "Bulk delete failed.", err: true });
      return;
    }

    setStaff((prev) => prev.filter((s) => !selectedIds.has(s._id)));
    setSelectedIds(new Set());
    setImportStatus({
      text: `Removed ${data.deleted} employee${data.deleted === 1 ? "" : "s"}.`,
      err: false
    });
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = (results.data as any[]).map((r) => ({
          name: pick(r, ["name", "full name", "fullname"]),
          title: pick(r, ["title", "job title", "position", "role"]),
          company: pick(r, ["company", "organization", "organisation"]),
          department: pick(r, ["department", "team", "division"]),
          phone: pick(r, ["phone", "mobile", "tel", "telephone"]),
          email: pick(r, ["email", "e-mail"]),
          website: pick(r, ["website", "site", "url"])
        }));

        const res = await fetch("/api/staff/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rows })
        });
        const data = await res.json();

        if (!res.ok) {
          setImportStatus({ text: data.error || "Import failed.", err: true });
        } else {
          setImportStatus({ text: `Imported ${data.inserted} staff record${data.inserted === 1 ? "" : "s"}.`, err: false });
          loadStaff();
        }
      },
      error: (err) => setImportStatus({ text: `Couldn't read that file: ${err.message}`, err: true })
    });

    e.target.value = "";
  }

  async function handleExportExcel() {
    if (!staff.length) return;
    setExporting(true);
    setImportStatus(null);
    try {
      const { buildStaffExcelWithQr, downloadExcel } = await import("@/lib/export-staff-xlsx");
      const buffer = await buildStaffExcelWithQr(staff);
      const date = new Date().toISOString().slice(0, 10);
      downloadExcel(`staff-qr-export-${date}.xlsx`, buffer);
      setImportStatus({
        text: `Exported ${staff.length} employee${staff.length === 1 ? "" : "s"} with QR images in Excel.`,
        err: false
      });
    } catch {
      setImportStatus({ text: "Export failed. Try again.", err: true });
    } finally {
      setExporting(false);
    }
  }

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px 80px", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, margin: 0 }}>Staff directory</h1>
          <p style={{ color: "#666", fontSize: 14, margin: "4px 0 0" }}>
            {loading
              ? "Loading..."
              : `${staff.length} employee${staff.length === 1 ? "" : "s"} — each gets a QR code that opens their digital profile`}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {someSelected && (
            <button
              onClick={handleBulkDelete}
              style={dangerBtn}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : `Delete selected (${selectedIds.size})`}
            </button>
          )}
          <button onClick={handleExportExcel} style={secondaryBtn} disabled={!staff.length || exporting}>
            {exporting ? "Exporting..." : "Export Excel + QR"}
          </button>
          <button onClick={handleImportClick} style={secondaryBtn}>Import CSV</button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <Link href="/admin/staff/new" style={{ textDecoration: "none" }}>
            <button style={primaryBtn}>Add staff</button>
          </Link>
          <Link href="/admin/qr" style={{ textDecoration: "none" }}>
            <button style={secondaryBtn}>View QR codes</button>
          </Link>
        </div>
      </div>

      {importStatus && (
        <p style={{ fontSize: 13, color: importStatus.err ? "#b23b3b" : "#2b7a4b", marginBottom: 16 }}>
          {importStatus.text}
        </p>
      )}

      <div style={{ background: "#fff", border: "1px solid #dedad0", borderRadius: 10, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#faf9f5", textAlign: "left" }}>
              <th style={{ padding: "10px 14px", fontWeight: 600, borderBottom: "1px solid #dedad0", width: 40 }}>
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected && !allSelected;
                  }}
                  onChange={toggleSelectAll}
                  disabled={!staff.length}
                  aria-label="Select all staff"
                />
              </th>
              {["Name", "Title", "Company", "Email", "Phone", ""].map((h) => (
                <th key={h} style={{ padding: "10px 14px", fontWeight: 600, borderBottom: "1px solid #dedad0" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {staff.map((s) => (
              <tr key={s._id} style={{ borderBottom: "1px solid #f0eee6", background: selectedIds.has(s._id) ? "#f7f6ff" : undefined }}>
                <td style={cellStyle}>
                  <input
                    type="checkbox"
                    checked={selectedIds.has(s._id)}
                    onChange={() => toggleSelect(s._id)}
                    aria-label={`Select ${s.name}`}
                  />
                </td>
                <td style={cellStyle}>{s.name}</td>
                <td style={cellStyle}>{s.title || "—"}</td>
                <td style={cellStyle}>{s.company || "—"}</td>
                <td style={cellStyle}>{s.email || "—"}</td>
                <td style={cellStyle}>{s.phone || "—"}</td>
                <td style={{ ...cellStyle, textAlign: "right", whiteSpace: "nowrap" }}>
                  <Link href={`/admin/staff/${s._id}`} style={{ marginRight: 12, color: "#12194a", fontWeight: 600 }}>
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(s._id, s.name)}
                    style={{ background: "none", border: "none", color: "#b23b3b", cursor: "pointer", fontWeight: 600, fontSize: 13, padding: 0 }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!loading && staff.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: "24px 14px", textAlign: "center", color: "#888" }}>
                  No staff yet. Add one, or import a CSV to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function pick(row: Record<string, string>, candidates: string[]) {
  const keys = Object.keys(row);
  for (const c of candidates) {
    const match = keys.find((k) => k.trim().toLowerCase() === c);
    if (match && row[match]) return row[match].trim();
  }
  return "";
}

const cellStyle: React.CSSProperties = { padding: "10px 14px" };

const primaryBtn: React.CSSProperties = {
  background: "#12194a",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  padding: "9px 16px",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer"
};

const secondaryBtn: React.CSSProperties = {
  background: "#fff",
  color: "#1c1c1c",
  border: "1px solid #dedad0",
  borderRadius: 6,
  padding: "9px 16px",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer"
};

const dangerBtn: React.CSSProperties = {
  background: "#b23b3b",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  padding: "9px 16px",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer"
};
