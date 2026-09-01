import mongoose, { Schema, models, model } from "mongoose";
import { newStaffQrId } from "@/lib/staff-qr-id";

export interface StaffDoc {
  _id: string;
  qrId: string;
  name: string;
  title?: string;
  company?: string;
  department?: string;
  phone?: string;
  email?: string;
  website?: string;
  theme?: string;
  createdAt: Date;
  updatedAt: Date;
}

const StaffSchema = new Schema<StaffDoc>(
  {
    qrId: { type: String, unique: true, sparse: true, default: newStaffQrId, immutable: true },
    name: { type: String, required: true, trim: true },
    title: { type: String, trim: true },
    company: { type: String, trim: true },
    department: { type: String, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true },
    website: { type: String, trim: true },
    theme: { type: String, default: "navygold" }
  },
  { timestamps: true }
);

const collectionName = process.env.MONGODB_COLLECTION || "staffs";

// Prevents "OverwriteModelError" during Next.js hot reload in dev.
export default models.Staff || model<StaffDoc>("Staff", StaffSchema, collectionName);
