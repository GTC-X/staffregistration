import QRCode from "qrcode";

const QR_OPTIONS = {
  width: 280,
  margin: 1,
  color: { dark: "#12194a", light: "#ffffff" }
} as const;

export async function generateQrDataUrl(text: string) {
  return QRCode.toDataURL(text, QR_OPTIONS);
}

export async function generateQrPngBuffer(text: string) {
  return QRCode.toBuffer(text, { ...QR_OPTIONS, type: "png" });
}

export async function downloadQrPng(url: string, filename: string) {
  const dataUrl = await generateQrDataUrl(url);
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.click();
}
