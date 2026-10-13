import PersonalWorkspaceShell from "@/components/personal-workspace-shell";

export default function MyProfilePage() {
  return (
    <PersonalWorkspaceShell activeHref="/my-profile" title="My profile" description="Manage your personal details and preferences for this workspace.">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-5">
          <section className="rounded-2xl border border-white/[0.07] bg-[#111116] p-5 sm:p-6">
            <div className="flex items-center gap-4 border-b border-white/[0.06] pb-5">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-300 to-orange-300 text-sm font-semibold text-slate-950">AM</span>
              <div><h3 className="text-sm font-semibold">Personal information</h3><p className="mt-1 text-xs text-zinc-500">Your profile is visible to your workspace team.</p></div>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[["Full name", "Alex Morgan"], ["Email address", "alex@northstar.example"], ["Role", "Freelance product designer"], ["Workspace", "Northstar Studio"]].map(([label, value]) => <label key={label} className="block"><span className="mb-2 block text-xs font-medium text-zinc-400">{label}</span><input defaultValue={value} readOnly={label === "Workspace"} className="h-10 w-full rounded-xl border border-white/[0.08] bg-[#0d0d12] px-3 text-sm text-zinc-200 outline-none focus:border-sky-300/40 read-only:text-zinc-500" /></label>)}
            </div>
          </section>
          <section className="rounded-2xl border border-white/[0.07] bg-[#111116] p-5 sm:p-6">
            <h3 className="text-sm font-semibold">Personal preferences</h3><p className="mt-1 text-xs text-zinc-500">Customize how your workspace works for you.</p>
            <div className="mt-4 divide-y divide-white/[0.05]">
              {[["Email me about schedule updates", "Get notified when your work schedule changes."], ["Weekly personal summary", "Receive a summary of your tracked hours each week."], ["Show my work status", "Let teammates see when you are working or away."]].map(([label, detail], index) => <label key={label} className="flex items-center justify-between gap-4 py-4"><span><span className="block text-xs font-medium text-zinc-200">{label}</span><span className="mt-1 block text-[10px] text-zinc-500">{detail}</span></span><input type="checkbox" defaultChecked={index !== 1} className="size-4 shrink-0 accent-sky-300" /></label>)}
            </div>
          </section>
        </div>
        <aside className="h-fit rounded-2xl border border-white/[0.07] bg-[#111116] p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-sky-200">Your account</p>
          <h3 className="mt-3 text-sm font-semibold">Freelancer access</h3>
          <p className="mt-2 text-xs leading-5 text-zinc-400">Your profile and reports are personal. Company details and team-wide settings are managed by the workspace owner.</p>
          <div className="mt-5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3"><p className="text-[10px] text-zinc-500">Member since</p><p className="mt-1 text-xs font-medium text-zinc-200">January 2026</p></div>
          <p className="mt-4 text-[10px] leading-5 text-zinc-600">Profile preview only · Updates are not saved.</p>
        </aside>
      </div>
    </PersonalWorkspaceShell>
  );
}
