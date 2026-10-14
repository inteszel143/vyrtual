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
    <main className="min-h-svh bg-[#09090d] text-white lg:grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
      <aside className="relative hidden min-h-svh flex-col justify-between overflow-hidden bg-[#101018] px-10 py-10 text-white lg:flex xl:px-16 xl:py-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_45%_35%,rgba(99,54,180,0.15),transparent_60%)]"
        />
        <div className="relative z-10 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Image src="/vyrtual-icon.svg" alt="" width={24} height={24} />
              <span className="text-xl font-semibold tracking-tight">Vyrtual</span>
            </div>
          </div>
          <span className="mt-1 flex shrink-0 items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-2.5 py-1.5 font-mono text-[9px] font-medium uppercase tracking-[0.12em] text-emerald-300 sm:px-3 sm:text-[10px]">
            <span className="size-1.5 rounded-full bg-emerald-300" />
            Office preview
          </span>
        </div>

        <div className="relative z-10 mt-16">
          <h2 className="max-w-lg text-4xl font-medium leading-[1.15] tracking-[-0.04em] xl:text-5xl">
            Your team. Your space.
            <span className="block text-violet-300">Together, anywhere.</span>
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-7 text-zinc-400">
            A calmer place to connect with your team, organize the day, and
            keep work moving.
          </p>

        </div>

        <div
          role="img"
          aria-label="Virtual office preview showing remote team members and their work status"
          className="relative z-10 my-10 grid grid-cols-3 gap-3"
        >
          {collaborators.map((person, index) => (
            <article
              key={person.initials}
              style={{ animationDelay: `${index * -0.9}s` }}
              className={`auth-preview-card relative flex min-h-[138px] flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br p-3 sm:min-h-[158px] sm:p-3.5 ${person.card}`}
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

        <div className="relative z-10 flex items-center justify-between gap-3 pt-4">
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

      <section className="relative flex min-h-svh items-center justify-center px-6 py-20 sm:px-12 lg:px-16">
        <Link
          href="/"
          aria-label="Close and return to Vyrtual home"
          className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full border border-white/10 text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-white sm:right-8 sm:top-8"
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

        <div className="w-full max-w-[400px]">
          <Link
            href="/"
            className="mb-10 flex items-center justify-center gap-2.5 lg:hidden"
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
