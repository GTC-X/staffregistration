import { connectToDatabase } from "@/lib/mongodb";
import Staff from "@/models/Staff";
import StaffForm from "../StaffForm";
import { notFound } from "next/navigation";

export default async function EditStaffPage({ params }: { params: { id: string } }) {
  await connectToDatabase();
  const staff = await Staff.findById(params.id).lean<any>();

  if (!staff) notFound();

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 24px 80px", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: 20, marginBottom: 20 }}>Edit staff member</h1>
      <StaffForm
        staffId={params.id}
        initial={{
          name: staff.name,
          title: staff.title,
          company: staff.company,
          department: staff.department,
          phone: staff.phone,
          email: staff.email,
          website: staff.website,
          externalProfileUrl: staff.externalProfileUrl,
          theme: staff.theme
        }}
      />
    </div>
  );
}
