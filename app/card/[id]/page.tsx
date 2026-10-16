import { connectToDatabase } from "@/lib/mongodb";
import { findStaffByQrOrId } from "@/lib/find-staff";
import { getVcardUrl } from "@/lib/card-url";
import PublicCardView from "@/components/PublicCardView";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  await connectToDatabase();
  const staff = await findStaffByQrOrId(params.id);
  if (!staff) return { title: "Not found" };
  return {
    title: staff.name,
    description: [staff.title, staff.company].filter(Boolean).join(" · ") || "Digital business card"
  };
}

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
      contactUrl={getVcardUrl({ _id: String(staff._id), qrId: staff.qrId })}
    />
  );
}
