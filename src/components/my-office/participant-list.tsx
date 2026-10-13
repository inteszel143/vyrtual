import type { OfficeParticipant, OfficePresence } from "./types";

const presenceStyles: Record<OfficePresence, { dot: string; text: string; badge: string }> = {
  Working: {
    dot: "bg-emerald-300",
    text: "text-emerald-200",
    badge: "border-emerald-300/15 bg-emerald-300/[0.06] text-emerald-200",
  },
  Offline: {
    dot: "bg-zinc-500",
    text: "text-zinc-400",
    badge: "border-zinc-400/15 bg-zinc-400/[0.06] text-zinc-400",
  },
  Away: {
    dot: "bg-amber-300",
    text: "text-amber-200",
    badge: "border-amber-300/15 bg-amber-300/[0.06] text-amber-200",
  },
  Break: {
    dot: "bg-sky-300",
    text: "text-sky-200",
    badge: "border-sky-300/15 bg-sky-300/[0.06] text-sky-200",
  },
};

const presenceGroups: { presence: OfficePresence; emoji: string }[] = [
  { presence: "Working", emoji: "💻" },
  { presence: "Break", emoji: "☕" },
  { presence: "Away", emoji: "🌙" },
];

export default function ParticipantList({
  participants,
  joined,
}: {
  participants: OfficeParticipant[];
  joined: boolean;
}) {
  return (
    <section aria-labelledby="office-participants-title" className="rounded-2xl border border-white/[0.07] bg-[#111116] p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 id="office-participants-title" className="text-sm font-semibold">People</h3>
          <p className="mt-1 text-xs text-zinc-500">{participants.filter((person) => person.presence !== "Offline" && (!person.isLocal || joined)).length} participants</p>
        </div>
      </div>
      <div className="mt-4 space-y-4">
        {presenceGroups.map(({ presence, emoji }) => {
          const members = participants.filter((person) => {
            if (person.presence === "Offline") return false;
            if (person.isLocal && !joined) return false;
            return person.presence === presence;
          });
          if (members.length === 0) return null;
          const style = presenceStyles[presence];

          return (
            <section key={presence} aria-label={`${presence} people`}>
              <h4 className={`flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] ${style.text}`}>
                <span className={`size-1.5 rounded-full ${style.dot}`} />
                <span aria-hidden="true" className="text-xs">{emoji}</span>
                {presence}
                <span className="text-zinc-600">{members.length}</span>
              </h4>
              <ul className="mt-2 divide-y divide-white/[0.05]">
                {members.map((person) => (
                  <li key={person.id} className="flex items-center gap-2.5 py-3 first:pt-2 last:pb-0">
                    <span className={`flex size-8 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${person.color}`}>{person.initials}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[11px] font-medium text-zinc-200">{person.name}{person.isLocal ? " (You)" : ""}</span>
                      <span className="mt-1 block truncate text-[9px] text-zinc-500">{person.role}{person.room ? ` · ${person.room}` : ""}</span>
                    </span>
                    <span className={`shrink-0 rounded-full border px-2 py-1 text-[9px] ${style.badge}`}>{presence}</span>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </section>
  );
}
