import MessageCenter from "@/components/message-center";
import OwnerWorkspaceShell from "@/components/owner-workspace-shell";

export default function MessagesPage() {
  return (
    <OwnerWorkspaceShell
      activeHref="/messages"
      title="Messages"
      description="Keep up with conversations across your workspace."
    >
      <MessageCenter />
    </OwnerWorkspaceShell>
  );
}
