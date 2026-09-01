"use client";

import { useEffect, useState } from "react";
import { generateQrDataUrl } from "@/lib/qr";

export default function QrCodeImage({
  url,
  size = 120,
  alt = "QR code"
}: {
  url: string;
  size?: number;
  alt?: string;
}) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    generateQrDataUrl(url).then((dataUrl) => {
      if (active) setSrc(dataUrl);
    });
    return () => {
      active = false;
    };
  }, [url]);

  if (!src) {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: 8,
          background: "#f3f3f3",
          border: "1px solid #e8e4da"
        }}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      style={{ display: "block", borderRadius: 8, border: "1px solid #e8e4da", background: "#fff" }}
    />
  );
}
