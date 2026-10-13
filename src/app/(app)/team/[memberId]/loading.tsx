import OwnerWorkspaceShell from "@/components/owner-workspace-shell";

export default function LoadingTeamMember() {
  return (
    <OwnerWorkspaceShell activeHref="/team" title="Team member" description="Loading team member details…">
      <div className="animate-pulse space-y-5">
        <div className="h-36 rounded-2xl border border-white/[0.07] bg-[#111116]" />
        <div className="grid gap-3 sm:grid-cols-3">
          {[0, 1, 2].map((item) => <div key={item} className="h-24 rounded-2xl border border-white/[0.07] bg-[#111116]" />)}
        </div>
      </div>
    </OwnerWorkspaceShell>
  );
}
