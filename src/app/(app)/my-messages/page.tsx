import { Suspense } from "react";
import MessageCenter from "@/components/message-center";
import PersonalWorkspaceShell from "@/components/personal-workspace-shell";

export default function MyMessagesPage() {
  return (
    <PersonalWorkspaceShell
      activeHref="/my-messages"
      title="Messages"
      description="Catch up with conversations in your workspace."
    >
      <Suspense fallback={<div className="min-h-[620px] rounded-2xl border border-white/[0.07] bg-[#111116]" />}>
        <MessageCenter />
      </Suspense>
    </PersonalWorkspaceShell>
  );
}
