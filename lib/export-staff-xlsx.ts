import ExcelJS from "exceljs";
import { getPhoneQrPayload, getProfileLink, getProfileQrPayload, getQrImageUrl } from "./card-url";
import { generateQrDataUrl } from "./qr";
import type { StaffExportRow } from "./export-staff";

const PROFILE_QR_COLUMN = 11;
const PHONE_QR_COLUMN = 12;
const QR_SIZE = 120;
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
    { header: "Profile QR image link", key: "profileQrImageUrl", width: 36 },
    { header: "Phone QR image link", key: "phoneQrImageUrl", width: 36 },
    { header: "Profile QR", key: "profileQr", width: 20 },
    { header: "Phone QR", key: "phoneQr", width: 20 }
  ];

  sheet.getRow(1).font = { bold: true, color: { argb: "FF12194A" } };
  sheet.getRow(1).alignment = { vertical: "middle", horizontal: "center", wrapText: true };
  sheet.getRow(1).height = 28;

  for (let i = 0; i < staff.length; i++) {
    const person = staff[i];
    const cardUrl = getProfileLink(person, origin);
    const profileQrImageUrl = getQrImageUrl(person, origin, "profile");
    const phoneQrImageUrl = getQrImageUrl(person, origin, "phone");
    const profilePayload = getProfileQrPayload(person, origin);
    const phonePayload = getPhoneQrPayload(person);
    const rowNumber = i + 2;

    const row = sheet.addRow({
      name: person.name,
      title: person.title || "",
      company: person.company || "",
      department: person.department || "",
      phone: person.phone || "",
      email: person.email || "",
      website: person.website || "",
      cardUrl,
      profileQrImageUrl,
      phoneQrImageUrl
    });

    row.height = ROW_HEIGHT;
    row.alignment = { vertical: "middle", wrapText: true };
    row.getCell("cardUrl").value = { text: cardUrl, hyperlink: cardUrl };
    row.getCell("profileQrImageUrl").value = { text: profileQrImageUrl, hyperlink: profileQrImageUrl };
    row.getCell("phoneQrImageUrl").value = { text: phoneQrImageUrl, hyperlink: phoneQrImageUrl };

    const [profileDataUrl, phoneDataUrl] = await Promise.all([
      generateQrDataUrl(profilePayload),
      generateQrDataUrl(phonePayload)
    ]);

    const profileImageId = workbook.addImage({
      base64: profileDataUrl.split(",")[1],
      extension: "png"
    });
    const phoneImageId = workbook.addImage({
      base64: phoneDataUrl.split(",")[1],
      extension: "png"
    });

    sheet.addImage(profileImageId, {
      tl: { col: PROFILE_QR_COLUMN - 1 + 0.12, row: rowNumber - 1 + 0.1 },
      ext: { width: QR_SIZE, height: QR_SIZE }
    });
    sheet.addImage(phoneImageId, {
      tl: { col: PHONE_QR_COLUMN - 1 + 0.12, row: rowNumber - 1 + 0.1 },
      ext: { width: QR_SIZE, height: QR_SIZE }
    });
  }

  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    row.getCell(PROFILE_QR_COLUMN).alignment = { vertical: "middle", horizontal: "center" };
    row.getCell(PHONE_QR_COLUMN).alignment = { vertical: "middle", horizontal: "center" };
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
