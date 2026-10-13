import MessageCenter from "@/components/message-center";
import PersonalWorkspaceShell from "@/components/personal-workspace-shell";

export default function MyMessagesPage() {
  return (
    <PersonalWorkspaceShell
      activeHref="/my-messages"
      title="Messages"
      description="Catch up with conversations in your workspace."
    >
      <MessageCenter />
    </PersonalWorkspaceShell>
  );
}
