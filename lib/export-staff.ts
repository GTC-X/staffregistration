import { getStaffQrKey } from "./staff-qr-id";

export type StaffExportRow = {
  _id: string;
  qrId?: string | null;
  name: string;
  title?: string;
  company?: string;
  department?: string;
  phone?: string;
  email?: string;
  website?: string;
  externalProfileUrl?: string | null;
};

export { getStaffQrKey };
