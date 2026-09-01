"use client";

import DigitalProfile from "@/components/DigitalProfile";

type PublicCardViewProps = {
  name: string;
  title?: string;
  company?: string;
  department?: string;
  phone?: string;
  email?: string;
  website?: string;
  theme?: string;
  contactUrl?: string;
};

export default function PublicCardView(props: PublicCardViewProps) {
  return <DigitalProfile {...props} />;
}
