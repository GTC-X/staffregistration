"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type StaffFormValues = {
  name: string;
  title: string;
  company: string;
  department: string;
  phone: string;
  email: string;
  website: string;
  theme: string;
};

const THEMES = [
  { key: "navygold", label: "Navy & gold" },
  { key: "cream", label: "Cream & navy" },
  { key: "charcoal", label: "Charcoal & gold" },
  { key: "white", label: "White & navy" }
];

export default function StaffForm({
  initial,
  staffId
}: {
  initial?: Partial<StaffFormValues>;
  staffId?: string;
}) {
  const router = useRouter();
  const [values, setValues] = useState<StaffFormValues>({
    name: initial?.name || "",
    title: initial?.title || "",
    company: initial?.company || "",
    department: initial?.department || "",
    phone: initial?.phone || "",
    email: initial?.email || "",
    website: initial?.website || "",
    theme: initial?.theme || "navygold"
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function update<K extends keyof StaffFormValues>(key: K, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!values.name.trim()) {
      setError("Name is required.");
      return;
    }
    setSaving(true);
    setError("");

    const url = staffId ? `/api/staff/${staffId}` : "/api/staff";
    const method = staffId ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Couldn't save. Try again.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 480 }}>
      <Field label="Full name" required>
        <input value={values.name} onChange={(e) => update("name", e.target.value)} style={inputStyle} />
      </Field>
      <Field label="Job title">
        <input value={values.title} onChange={(e) => update("title", e.target.value)} style={inputStyle} />
      </Field>
      <Field label="Company">
        <input value={values.company} onChange={(e) => update("company", e.target.value)} style={inputStyle} />
      </Field>
      <Field label="Department">
        <input value={values.department} onChange={(e) => update("department", e.target.value)} style={inputStyle} />
      </Field>
      <Field label="Phone">
        <input value={values.phone} onChange={(e) => update("phone", e.target.value)} style={inputStyle} />
      </Field>
      <Field label="Email">
        <input value={values.email} onChange={(e) => update("email", e.target.value)} style={inputStyle} />
      </Field>
      <Field label="Website">
        <input value={values.website} onChange={(e) => update("website", e.target.value)} style={inputStyle} />
      </Field>
      <Field label="Card style">
        <select value={values.theme} onChange={(e) => update("theme", e.target.value)} style={inputStyle}>
          {THEMES.map((t) => (
            <option key={t.key} value={t.key}>
              {t.label}
            </option>
          ))}
        </select>
      </Field>

      {error && <p style={{ color: "#b23b3b", fontSize: 13, marginBottom: 12 }}>{error}</p>}

      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <button type="submit" disabled={saving} style={primaryBtn}>
          {saving ? "Saving..." : "Save"}
        </button>
        <button type="button" onClick={() => router.push("/admin")} style={secondaryBtn}>
          Cancel
        </button>
      </div>
    </form>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
        {label} {required && <span style={{ color: "#b23b3b" }}>*</span>}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "9px 11px",
  fontSize: 13,
  border: "1px solid #dedad0",
  borderRadius: 6,
  background: "#fff"
};

const primaryBtn: React.CSSProperties = {
  background: "#12194a",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  padding: "10px 20px",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer"
};

const secondaryBtn: React.CSSProperties = {
  background: "#fff",
  color: "#1c1c1c",
  border: "1px solid #dedad0",
  borderRadius: 6,
  padding: "10px 20px",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer"
};
