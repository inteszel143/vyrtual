import type { OfficeParticipant } from "./types";

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
          <h3 id="office-participants-title" className="text-sm font-semibold">In this room</h3>
          <p className="mt-1 text-xs text-zinc-500">{participants.filter((person) => !person.isLocal || joined).length} participants</p>
        </div>
        <span className="rounded-full border border-white/[0.07] bg-white/[0.025] px-2.5 py-1 text-[10px] text-zinc-400">Work studio</span>
      </div>
      <ul className="mt-4 divide-y divide-white/[0.05]">
        {participants.map((person) => {
          if (person.isLocal && !joined) return null;
          return (
            <li key={person.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <span className={`flex size-9 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${person.color}`}>{person.initials}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-medium text-zinc-200">{person.name}{person.isLocal ? " (You)" : ""}</span>
                <span className="mt-1 block truncate text-[10px] text-zinc-500">{person.role}{person.room ? ` · ${person.room}` : ""}</span>
              </span>
              <span className={`inline-flex shrink-0 items-center gap-1.5 text-[10px] ${person.isLocal ? "text-sky-200" : "text-emerald-300"}`}>
                <span className={`size-1.5 rounded-full ${person.isLocal ? "bg-sky-300" : "bg-emerald-300"}`} />
                {person.isLocal ? (joined ? "You" : "Left") : person.state}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
