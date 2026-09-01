import StaffForm from "../StaffForm";

export default function NewStaffPage() {
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 24px 80px", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: 20, marginBottom: 20 }}>Add staff member</h1>
      <StaffForm />
    </div>
  );
}
