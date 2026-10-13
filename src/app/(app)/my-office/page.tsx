import OfficeRoom from "@/components/my-office/office-room";
import PersonalWorkspaceShell from "@/components/personal-workspace-shell";

export default function MyOfficePage() {
  return (
    <PersonalWorkspaceShell
      activeHref="/my-office"
      title="My office"
      description="Join the same Work studio shown in your company’s virtual office."
    >
      <OfficeRoom />
    </PersonalWorkspaceShell>
  );
}
