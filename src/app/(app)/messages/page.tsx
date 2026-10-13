import { Suspense } from "react";
import MessageCenter from "@/components/message-center";
import OwnerWorkspaceShell from "@/components/owner-workspace-shell";

export default function MessagesPage() {
  return (
    <OwnerWorkspaceShell
      activeHref="/messages"
      title="Messages"
      description="Keep up with conversations across your workspace."
    >
      <Suspense fallback={<div className="min-h-[620px] rounded-2xl border border-white/[0.07] bg-[#111116]" />}>
        <MessageCenter allowCreation />
      </Suspense>
    </OwnerWorkspaceShell>
  );
}
