import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

const collaborators = [
  {
    initials: "AC",
    name: "Avery Chen",
    role: "Product designer",
    status: "Working",
    card: "from-violet-400/20 via-fuchsia-400/10 to-white/[0.02]",
    avatar: "bg-violet-300/15 text-violet-200 ring-violet-300/20",
  },
  {
    initials: "JL",
    name: "Jordan Lee",
    role: "Frontend developer",
    status: "Online",
    card: "from-sky-400/20 via-cyan-400/10 to-white/[0.02]",
    avatar: "bg-sky-300/15 text-sky-200 ring-sky-300/20",
  },
  {
    initials: "SR",
    name: "Sam Rivera",
    role: "Freelance writer",
    status: "Working",
    card: "from-rose-400/20 via-orange-300/10 to-white/[0.02]",
    avatar: "bg-rose-300/15 text-rose-200 ring-rose-300/20",
  },
  {
    initials: "TB",
    name: "Taylor Brooks",
    role: "Engineering",
    status: "Online",
    card: "from-amber-300/20 via-orange-300/10 to-white/[0.02]",
    avatar: "bg-amber-300/15 text-amber-200 ring-amber-300/20",
  },
  {
    initials: "MK",
    name: "Morgan Kim",
    role: "Project manager",
    status: "Working",
    card: "from-emerald-300/20 via-teal-300/10 to-white/[0.02]",
    avatar: "bg-emerald-300/15 text-emerald-200 ring-emerald-300/20",
  },
  {
    initials: "CP",
    name: "Casey Patel",
    role: "Freelance analyst",
    status: "Online",
    card: "from-indigo-300/20 via-purple-300/10 to-white/[0.02]",
    avatar: "bg-indigo-300/15 text-indigo-200 ring-indigo-300/20",
  },
];

export default function AuthShell({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#050507] p-3 text-white sm:p-4 lg:grid lg:grid-cols-[0.95fr_1.05fr] lg:gap-4">
      <aside className="relative hidden min-h-[560px] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#0b0b0e] p-5 text-white shadow-[0_30px_100px_-50px_rgba(59,130,246,0.24)] sm:min-h-[640px] sm:p-8 lg:flex lg:min-h-[calc(100vh-2rem)] lg:p-7 xl:p-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_45%_35%,rgba(99,54,180,0.15),transparent_60%)]"
        />
        <div className="relative z-10 flex items-start justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Image src="/vyrtual-icon.svg" alt="" width={24} height={24} />
              <h1 className="text-base font-medium">Your virtual office</h1>
            </div>
            <p className="mt-1.5 text-xs text-zinc-500 sm:text-sm">
              A team that works from anywhere
            </p>
          </div>
          <span className="mt-1 flex shrink-0 items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-2.5 py-1.5 font-mono text-[9px] font-medium uppercase tracking-[0.12em] text-emerald-300 sm:px-3 sm:text-[10px]">
            <span className="size-1.5 rounded-full bg-emerald-300" />
            Team active
          </span>
        </div>

        <div className="relative z-10 mt-5">
          <p className="max-w-lg text-xl font-medium leading-snug tracking-[-0.025em] text-white sm:text-2xl">
            Manage your remote team, track their time, and see work in
            progress—all in one place.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {["People", "Working hours", "Work activity"].map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/[0.035] px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-zinc-400"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div
          role="img"
          aria-label="Virtual office preview showing remote team members and their work status"
          className="relative z-10 mt-5 grid flex-1 grid-cols-2 content-center gap-2.5 sm:grid-cols-3 sm:gap-3"
        >
          {collaborators.map((person) => (
            <article
              key={person.initials}
              className={`relative flex min-h-[138px] flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br p-3 sm:min-h-[158px] sm:p-3.5 ${person.card}`}
            >
              <div className="flex items-start justify-between gap-2">
                <span
                  className={`flex size-10 items-center justify-center rounded-full text-xs font-semibold ring-1 sm:size-12 sm:text-sm ${person.avatar}`}
                >
                  {person.initials}
                </span>
                <span className="flex items-center gap-1 rounded-full border border-white/10 bg-black/25 px-2 py-1 text-[8px] text-zinc-200 sm:text-[9px]">
                  <span className="size-1.5 rounded-full bg-emerald-300" />
                  {person.status}
                </span>
              </div>
              <div className="mt-5">
                <h2 className="truncate text-[11px] font-medium text-white sm:text-xs">
                  {person.name}
                </h2>
                <p className="mt-0.5 truncate text-[9px] text-zinc-300/75 sm:text-[10px]">
                  {person.role}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="relative z-10 mt-4 flex items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.035] px-4 py-3">
          <div>
            <p className="text-xs font-medium text-zinc-200">
              Your distributed team, together
            </p>
            <p className="mt-1 text-[10px] text-zinc-500 sm:text-xs">
              Manage people · Track hours · See progress
            </p>
          </div>
          <span className="shrink-0 font-mono text-[9px] uppercase tracking-wider text-sky-300 sm:text-[10px]">
            6 teammates
          </span>
        </div>
      </aside>

      <section className="relative flex min-h-[calc(100svh-1.5rem)] items-center justify-center rounded-[28px] border border-white/[0.07] bg-[#0b0b0f] px-5 py-12 sm:px-10 lg:min-h-[calc(100vh-2rem)] lg:px-12">
        <Link
          href="/"
          aria-label="Close and return to Vyrtual home"
          className="absolute right-2 top-2 flex size-10 items-center justify-center rounded-full border border-white/10 text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-white sm:right-4 sm:top-4"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="none"
            className="size-4"
          >
            <path
              d="m5 5 10 10M15 5 5 15"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </Link>

        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-9 flex items-center justify-center gap-2.5"
          >
            <Image src="/vyrtual-icon.svg" alt="" width={30} height={30} />
            <span className="text-xl font-semibold tracking-tight">Vyrtual</span>
          </Link>
          {children}
        </div>
      </section>
    </main>
  );
}
