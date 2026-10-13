import OwnerWorkspaceShell from "@/components/owner-workspace-shell";

const settingsGroups = [
  { title: "Company profile", description: "The details shown to people in your workspace.", fields: [["Company name", "Northstar Studio"], ["Workspace URL", "northstar.vyrtual.example"], ["Industry", "Design & technology"]] },
  { title: "Work preferences", description: "Set the defaults used across schedules and reports.", fields: [["Timezone", "America/Los_Angeles"], ["Work week", "Monday – Friday"], ["Default work hours", "9:00 AM – 5:00 PM"]] },
];

export default function CompanySettingsPage() {
  return (
    <OwnerWorkspaceShell activeHref="/company-settings" title="Company settings" description="Configure your company profile and workspace-wide preferences.">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-5">
          {settingsGroups.map((group) => (
            <section key={group.title} className="rounded-2xl border border-white/[0.07] bg-[#111116] p-5 sm:p-6">
              <h3 className="text-sm font-semibold">{group.title}</h3>
              <p className="mt-1 text-xs text-zinc-500">{group.description}</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {group.fields.map(([label, value]) => (
                  <label key={label} className="block">
                    <span className="mb-2 block text-xs font-medium text-zinc-400">{label}</span>
                    <input defaultValue={value} className="h-10 w-full rounded-xl border border-white/[0.08] bg-[#0d0d12] px-3 text-sm text-zinc-200 outline-none focus:border-sky-300/40" />
                  </label>
                ))}
              </div>
            </section>
          ))}
          <section className="rounded-2xl border border-white/[0.07] bg-[#111116] p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div><h3 className="text-sm font-semibold">Workspace access</h3><p className="mt-1 text-xs text-zinc-500">Choose who can invite new people to the company.</p></div>
              <span className="rounded-full border border-sky-300/15 bg-sky-300/[0.06] px-2.5 py-1 text-[10px] text-sky-200">Owner control</span>
            </div>
            <label className="mt-5 flex items-center justify-between gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <span><span className="block text-xs font-medium text-zinc-200">Allow team members to invite others</span><span className="mt-1 block text-[11px] text-zinc-500">Invitations will still require owner approval.</span></span>
              <input type="checkbox" defaultChecked className="size-4 accent-sky-300" />
            </label>
          </section>
        </div>
        <aside className="h-fit rounded-2xl border border-sky-300/15 bg-sky-300/[0.04] p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-sky-200">Owner access</p>
          <h3 className="mt-3 text-sm font-semibold">Company-wide settings</h3>
          <p className="mt-2 text-xs leading-5 text-zinc-400">These preferences apply across your workspace. Individual members can manage their own profile from Profile settings.</p>
          <p className="mt-5 rounded-xl border border-white/[0.06] bg-black/10 p-3 text-[11px] leading-5 text-zinc-500">This is a UI preview. Settings are not currently connected to a saved company account.</p>
        </aside>
      </div>
    </OwnerWorkspaceShell>
  );
}
