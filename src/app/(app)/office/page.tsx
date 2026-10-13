import OfficeRoom from "@/components/my-office/office-room";
import OwnerWorkspaceShell from "@/components/owner-workspace-shell";

export default function OfficePage() {
  return (
    <OwnerWorkspaceShell
      activeHref="/office"
      title="Virtual office"
      description="Monitor your team’s office presence and tracked time."
    >
      <OfficeRoom ownerView />
    </OwnerWorkspaceShell>
  );
}
