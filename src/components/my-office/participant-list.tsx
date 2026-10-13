import type { OfficeParticipant, OfficePresence } from "./types";
import Link from "next/link";

const presenceStyles: Record<OfficePresence, { dot: string; text: string; badge: string; emoji: string }> = {
  Working: {
    dot: "bg-emerald-300",
    text: "text-emerald-200",
    badge: "border-emerald-300/15 bg-emerald-300/[0.06] text-emerald-200",
    emoji: "💻",
  },
  Offline: {
    dot: "bg-zinc-500",
    text: "text-zinc-400",
    badge: "border-zinc-400/15 bg-zinc-400/[0.06] text-zinc-400",
    emoji: "⚫",
  },
  Away: {
    dot: "bg-amber-300",
    text: "text-amber-200",
    badge: "border-amber-300/15 bg-amber-300/[0.06] text-amber-200",
    emoji: "🌙",
  },
  Break: {
    dot: "bg-sky-300",
    text: "text-sky-200",
    badge: "border-sky-300/15 bg-sky-300/[0.06] text-sky-200",
    emoji: "☕",
  },
  "Meal Break": {
    dot: "bg-orange-300",
    text: "text-orange-200",
    badge: "border-orange-300/15 bg-orange-300/[0.06] text-orange-200",
    emoji: "🍽️",
  },
  Meeting: {
    dot: "bg-violet-300",
    text: "text-violet-200",
    badge: "border-violet-300/15 bg-violet-300/[0.06] text-violet-200",
    emoji: "👥",
  },
  Snoozed: {
    dot: "bg-indigo-300",
    text: "text-indigo-200",
    badge: "border-indigo-300/15 bg-indigo-300/[0.06] text-indigo-200",
    emoji: "😴",
  },
  "Do not disturb": {
    dot: "bg-rose-300",
    text: "text-rose-200",
    badge: "border-rose-300/15 bg-rose-300/[0.06] text-rose-200",
    emoji: "🔕",
  },
};

const presenceGroups: OfficePresence[] = [
  "Working",
  "Meeting",
  "Break",
  "Meal Break",
  "Snoozed",
  "Do not disturb",
  "Away",
];

export default function ParticipantList({
  participants,
  joined,
  showTrackedTime = false,
}: {
  participants: OfficeParticipant[];
  joined: boolean;
  showTrackedTime?: boolean;
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
        {presenceGroups.map((presence) => {
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
                <span aria-hidden="true" className="text-xs">{style.emoji}</span>
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
                      {showTrackedTime && person.trackedToday && (
                        <span className="mt-1 block text-[9px] text-zinc-400">Tracked today: {person.trackedToday}</span>
                      )}
                    </span>
                    <span className={`shrink-0 rounded-full border px-2 py-1 text-[9px] ${style.badge}`}>{presence}</span>
                    {!person.isLocal && (
                      <Link
                        href={`/my-messages?to=${encodeURIComponent(person.id)}`}
                        aria-label={`Message ${person.name}`}
                        title={`Message ${person.name}`}
                        className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] text-zinc-400 transition-colors hover:bg-sky-300/10 hover:text-sky-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
                      >
                        <svg aria-hidden="true" className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 3.9a8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" />
                        </svg>
                      </Link>
                    )}
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
