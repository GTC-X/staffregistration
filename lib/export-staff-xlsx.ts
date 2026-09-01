import ExcelJS from "exceljs";
import { getCardUrl, getQrPayload } from "./card-url";
import { generateQrDataUrl } from "./qr";
import type { StaffExportRow } from "./export-staff";

const QR_COLUMN = 9; // 1-based column I
const QR_SIZE = 130;
const ROW_HEIGHT = 105;

export async function buildStaffExcelWithQr(staff: StaffExportRow[], origin?: string) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Staff portal";
  const sheet = workbook.addWorksheet("Staff QR codes");

  sheet.columns = [
    { header: "Name", key: "name", width: 24 },
    { header: "Title", key: "title", width: 28 },
    { header: "Company", key: "company", width: 18 },
    { header: "Department", key: "department", width: 18 },
    { header: "Phone", key: "phone", width: 18 },
    { header: "Email", key: "email", width: 28 },
    { header: "Website", key: "website", width: 24 },
    { header: "Profile link", key: "cardUrl", width: 36 },
    { header: "QR code", key: "qr", width: 22 }
  ];

  sheet.getRow(1).font = { bold: true, color: { argb: "FF12194A" } };
  sheet.getRow(1).alignment = { vertical: "middle", horizontal: "center" };
  sheet.getRow(1).height = 22;

  for (let i = 0; i < staff.length; i++) {
    const person = staff[i];
    const cardUrl = getCardUrl(person, origin);
    const qrPayload = getQrPayload(person);
    const rowNumber = i + 2;

    const row = sheet.addRow({
      name: person.name,
      title: person.title || "",
      company: person.company || "",
      department: person.department || "",
      phone: person.phone || "",
      email: person.email || "",
      website: person.website || "",
      cardUrl
    });

    row.height = ROW_HEIGHT;
    row.alignment = { vertical: "middle", wrapText: true };
    row.getCell("cardUrl").value = { text: cardUrl, hyperlink: cardUrl };

    const dataUrl = await generateQrDataUrl(qrPayload);
    const base64 = dataUrl.split(",")[1];
    const imageId = workbook.addImage({ base64, extension: "png" });

    sheet.addImage(imageId, {
      tl: { col: QR_COLUMN - 1 + 0.15, row: rowNumber - 1 + 0.08 },
      ext: { width: QR_SIZE, height: QR_SIZE }
    });
  }

  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    row.getCell(QR_COLUMN).alignment = { vertical: "middle", horizontal: "center" };
  });

  return workbook.xlsx.writeBuffer();
}

export function downloadExcel(filename: string, buffer: ArrayBuffer) {
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}
