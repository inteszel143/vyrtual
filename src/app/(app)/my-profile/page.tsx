import PersonalWorkspaceShell from "@/components/personal-workspace-shell";
import MemberWelcome from "@/components/member-welcome";

export default function MyProfilePage() {
  return (
    <PersonalWorkspaceShell activeHref="/my-profile" title="My profile" description="Manage your name and profile photo for your workspace.">
      <div className="max-w-xl"><MemberWelcome edit /></div>
    </PersonalWorkspaceShell>
  );
}
