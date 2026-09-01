import { connectToDatabase } from "@/lib/mongodb";
import { findStaffByQrOrId } from "@/lib/find-staff";
import PublicCardView from "@/components/PublicCardView";
import { notFound } from "next/navigation";

export default async function PublicCardPage({ params }: { params: { id: string } }) {
  await connectToDatabase();
  const staff = await findStaffByQrOrId(params.id);

  if (!staff) notFound();

  return (
    <PublicCardView
      name={staff.name}
      title={staff.title}
      company={staff.company}
      department={staff.department}
      phone={staff.phone}
      email={staff.email}
      website={staff.website}
      theme={staff.theme}
    />
  );
}
