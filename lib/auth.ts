const SECRET = process.env.SESSION_SECRET || "dev-secret-change-me";
export const SESSION_COOKIE = "staff_portal_session";

// The cookie value is "ok.<hmac>" — a fixed token signed with SESSION_SECRET,
// so we can verify it wasn't forged without needing a database-backed session.
// Uses Web Crypto (not Node crypto) so this works in Edge middleware.
async function sign(value: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createSessionValue() {
  const value = "ok";
  return `${value}.${await sign(value)}`;
}

function timingSafeEqualHex(a: string, b: string) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export async function isValidSession(cookieValue: string | undefined | null) {
  if (!cookieValue) return false;
  const [value, signature] = cookieValue.split(".");
  if (!value || !signature) return false;
  const expected = await sign(value);
  return timingSafeEqualHex(signature, expected);
}
