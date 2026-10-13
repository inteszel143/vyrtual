import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/scroll-reveal";

const navigationLinks = [
  { label: "Features", href: "#features" },
  { label: "Virtual office", href: "#virtual-office" },
  { label: "Pricing", href: "#pricing" },
];

function NavigationLinks({ mobile = false }: { mobile?: boolean }) {
  return (
    <>
      {navigationLinks.map(({ label, href }) => (
        <Link
          key={href}
          href={href}
          className={
            mobile
              ? "block rounded-lg px-4 py-3 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
              : "whitespace-nowrap px-2 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-400 transition-colors hover:text-white lg:px-4 lg:text-xs lg:tracking-[0.2em]"
          }
        >
          {label}
        </Link>
      ))}
    </>
  );
}

function ActionLink({
  children,
  href,
  secondary = false,
}: {
  children: React.ReactNode;
  href: string;
  secondary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        secondary
          ? "inline-flex h-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.02] px-6 text-sm font-medium text-zinc-300 transition-colors hover:border-white/30 hover:bg-white/[0.06] hover:text-white"
          : "inline-flex h-11 items-center justify-center rounded-full border border-white/20 bg-white/[0.04] px-6 font-mono text-xs font-medium uppercase tracking-[0.16em] text-white transition-colors hover:border-white/40 hover:bg-white/10"
      }
    >
      {children}
    </Link>
  );
}

const teamMembers = [
  {
    name: "Avery Chen",
    role: "Product designer",
    background: "from-violet-300 via-fuchsia-200 to-orange-100",
    skin: "#e9b99b",
    hair: "#30232e",
    shirt: "#5448a8",
    status: "Working",
  },
  {
    name: "Jordan Lee",
    role: "Frontend developer",
    background: "from-sky-200 via-blue-100 to-amber-100",
    skin: "#b97854",
    hair: "#201a1a",
    shirt: "#287c83",
    status: "Online",
  },
  {
    name: "Sam Rivera",
    role: "Freelance writer",
    background: "from-rose-200 via-orange-100 to-yellow-100",
    skin: "#d99c75",
    hair: "#211c23",
    shirt: "#bb5e79",
    status: "Working",
  },
  {
    name: "Taylor Brooks",
    role: "Engineering",
    background: "from-amber-100 via-stone-200 to-slate-300",
    skin: "#9a6048",
    hair: "#201918",
    shirt: "#4c657f",
    status: "Online",
  },
  {
    name: "Morgan Kim",
    role: "Project manager",
    background: "from-emerald-100 via-teal-100 to-cyan-200",
    skin: "#e0ae8d",
    hair: "#493028",
    shirt: "#267b72",
    status: "Working",
  },
  {
    name: "Casey Patel",
    role: "Freelance analyst",
    background: "from-indigo-200 via-purple-100 to-pink-100",
    skin: "#c58a67",
    hair: "#291e25",
    shirt: "#7851a9",
    status: "Online",
  },
];

function TeamPortrait({
  skin,
  hair,
  shirt,
}: {
  skin: string;
  hair: string;
  shirt: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 160 120"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 size-full"
    >
      <path
        d="M14 120c4-27 25-40 66-40s62 13 66 40H14Z"
        fill={shirt}
      />
      <path d="M67 70h26v22H67z" fill={skin} />
      <ellipse cx="80" cy="51" rx="26" ry="32" fill={skin} />
      <path
        d="M54 49c-4-23 8-39 28-39 19 0 30 14 26 37-7-3-13-11-16-19-10 11-22 16-38 17v4Z"
        fill={hair}
      />
      <path
        d="M68 54h1m22 0h1"
        stroke="#382a28"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M74 67c4 3 8 3 12 0"
        stroke="#915f50"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050507] font-sans text-white">
      <header className="fixed inset-x-0 top-0 z-50 mx-auto max-w-5xl px-4 pt-4 sm:px-6">
        <nav
          aria-label="Main navigation"
          className="relative flex min-h-[60px] items-center justify-between gap-2 rounded-full border border-white/15 bg-[#111115]/75 px-4 shadow-[0_12px_40px_-18px_rgba(99,102,241,0.45)] backdrop-blur-2xl backdrop-saturate-150 sm:px-5 lg:gap-4 lg:px-7"
        >
          <Link
            href="/"
            aria-label="Vyrtual home"
            className="flex shrink-0 items-center gap-3"
          >
            <Image
              src="/vyrtual-icon.svg"
              alt=""
              width={32}
              height={32}
              priority
            />
            <span className="text-xl font-semibold tracking-tight text-white">
              Vyrtual
            </span>
          </Link>

          <div className="hidden items-center gap-0 md:flex lg:gap-3">
            <NavigationLinks />
          </div>

          <div className="hidden shrink-0 items-center gap-4 md:flex lg:gap-7">
            <Link
              href="/login"
              className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-zinc-400 transition-colors hover:text-white"
            >
              Sign in
            </Link>
            <ActionLink href="/signup">Get started</ActionLink>
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <details className="group relative">
              <summary className="flex h-10 cursor-pointer list-none items-center rounded-full border border-white/15 px-4 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-200 [&::-webkit-details-marker]:hidden">
                Menu
              </summary>
              <div className="absolute right-0 top-12 z-10 w-56 rounded-2xl border border-white/10 bg-[#111115] p-2 shadow-xl">
                <NavigationLinks mobile />
                <div className="my-2 border-t border-white/10" />
                <Link
                  href="/login"
                  className="block rounded-lg px-4 py-3 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
                >
                  Sign in
                </Link>
              </div>
            </details>
            <Link
              href="/signup"
              className="inline-flex h-10 items-center justify-center rounded-full border border-white/20 bg-white/[0.04] px-4 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-white transition-colors hover:bg-white/10"
            >
              Start
            </Link>
          </div>
        </nav>
      </header>

      <section className="relative isolate mx-auto flex max-w-6xl scroll-mt-28 flex-col items-center px-6 pb-24 pt-28 text-center sm:pt-36">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-24 -z-10 mx-auto h-[440px] max-w-4xl rounded-full bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.18),rgba(99,102,241,0.12)_35%,transparent_72%)] blur-3xl"
        />
        <p className="font-mono text-xs font-medium uppercase tracking-[0.22em] text-sky-300">
          A better way to work remotely
        </p>
        <h1 className="mt-6 max-w-4xl text-5xl font-medium leading-[1.08] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
          Your office, wherever work happens.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">
          Bring your remote team together. Manage employees and freelancers,
          track working hours, and see work progress—all in one virtual office.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <ActionLink href="/signup">Create your workspace</ActionLink>
          <ActionLink href="#features" secondary>
            Explore features
          </ActionLink>
        </div>
      </section>

      <section
        id="features"
        className="scroll-mt-28 border-t border-white/[0.07] px-6 py-24 sm:py-32"
      >
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.22em] text-sky-300">
              Everything in one place
            </p>
            <h2 className="mt-5 text-3xl font-medium tracking-[-0.045em] sm:text-5xl">
              Less chasing. More clarity.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-zinc-400">
              Give your remote team a shared space to stay connected, track
              time, and make progress visible—without adding another office.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <ScrollReveal>
              <article className="h-full rounded-3xl border border-white/10 bg-white/[0.035] p-7">
                <span className="font-mono text-xs text-sky-300">01 / TEAM</span>
                <h3 className="mt-6 text-xl font-medium">One team, one view</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  Keep employee and freelancer details together, so everyone
                  knows who’s working on what and who to reach.
                </p>
              </article>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <article className="h-full rounded-3xl border border-white/10 bg-white/[0.035] p-7">
                <span className="font-mono text-xs text-sky-300">02 / TIME</span>
                <h3 className="mt-6 text-xl font-medium">Hours with context</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  Track working hours across your remote team and get a clearer
                  picture of how time is spent.
                </p>
              </article>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <article className="h-full rounded-3xl border border-white/10 bg-white/[0.035] p-7">
                <span className="font-mono text-xs text-sky-300">
                  03 / INSIGHT
                </span>
                <h3 className="mt-6 text-xl font-medium">
                  Progress you can see
                </h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  Review work activity and team reports to stay informed
                  without relying on presence in a physical office.
                </p>
              </article>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section
        id="virtual-office"
        className="scroll-mt-28 border-t border-white/[0.07] px-6 py-24 sm:py-32"
      >
        <ScrollReveal className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.22em] text-sky-300">
              Your virtual office
            </p>
            <h2 className="mt-5 text-3xl font-medium leading-tight tracking-[-0.045em] sm:text-5xl">
              A connected workplace, minus the walls.
            </h2>
            <p className="mt-5 text-base leading-7 text-zinc-400">
              Bring your distributed team into one shared workspace. See who’s
              on your team, follow working hours, and get a better sense of
              activity—all from wherever you work.
            </p>
            <ul className="mt-8 space-y-4 text-sm text-zinc-300">
              <li className="flex items-center gap-3">
                <span className="size-1.5 rounded-full bg-sky-300" />
                Built for employees and independent freelancers
              </li>
              <li className="flex items-center gap-3">
                <span className="size-1.5 rounded-full bg-sky-300" />
                Working hours and activity in one place
              </li>
              <li className="flex items-center gap-3">
                <span className="size-1.5 rounded-full bg-sky-300" />
                Visibility that works across time zones
              </li>
            </ul>
            <div className="mt-9">
              <ActionLink href="/signup">Build your virtual office</ActionLink>
            </div>
          </div>

          <div
            role="img"
            aria-label="Illustration of a virtual office showing a distributed team and their work status"
            className="rounded-[28px] border border-white/10 bg-[#0d0d12] p-4 shadow-[0_30px_100px_-45px_rgba(59,130,246,0.28)] sm:p-6"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-sm font-medium">Your virtual office</p>
                <p className="mt-1 text-xs text-zinc-500">
                  A team that works from anywhere
                </p>
              </div>
              <span className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-emerald-300">
                <span className="size-1.5 rounded-full bg-emerald-300" />
                Team active
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {teamMembers.map((member) => (
                <div
                  key={member.name}
                  className={`relative aspect-[1.15] overflow-hidden rounded-xl bg-gradient-to-br ${member.background}`}
                >
                  <TeamPortrait
                    skin={member.skin}
                    hair={member.hair}
                    shirt={member.shirt}
                  />
                  <span className="absolute right-2 top-2 flex items-center gap-1.5 rounded-full bg-black/55 px-2 py-1 text-[9px] font-medium text-white backdrop-blur">
                    <span className="size-1.5 rounded-full bg-emerald-300" />
                    {member.status}
                  </span>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-2.5 pb-2.5 pt-8">
                    <p className="truncate text-[11px] font-medium text-white">
                      {member.name}
                    </p>
                    <p className="truncate text-[9px] text-white/65">
                      {member.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3">
              <div>
                <p className="text-xs font-medium text-zinc-200">
                  Remote team overview
                </p>
                <p className="mt-1 text-[10px] text-zinc-500">
                  Hours and work activity, in one place
                </p>
              </div>
              <Link
                href="/features"
                className="font-mono text-[10px] uppercase tracking-wider text-sky-300 transition-colors hover:text-white"
              >
                Explore features →
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section
        id="pricing"
        className="scroll-mt-28 border-t border-white/[0.07] px-6 py-24 sm:py-32"
      >
        <ScrollReveal className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.22em] text-sky-300">
              Clear, simple pricing
            </p>
            <h2 className="mt-5 text-3xl font-medium tracking-[-0.045em] sm:text-5xl">
              Find the right space to grow.
            </h2>
            <p className="mt-5 text-base leading-7 text-zinc-400">
              Start free and choose a plan that fits how your team works.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-5xl gap-4 md:grid-cols-3">
            {[
              {
                name: "Free",
                price: "$0",
                detail: "free forever",
                description: "The essentials to get your team started.",
                features: [
                  "Team and freelancer directory",
                  "Working-hours tracking",
                  "14 days of activity history",
                ],
              },
              {
                name: "Team",
                price: "$19",
                detail: "per member / month",
                description: "Tools to keep a growing team in sync.",
                featured: true,
                features: [
                  "Everything in Free",
                  "Work activity verification",
                  "Time and team reports",
                ],
              },
              {
                name: "Business",
                price: "$29",
                detail: "per member / month",
                description: "More insight as your company scales.",
                features: [
                  "Everything in Team",
                  "Advanced team insights",
                  "Expanded reporting and priority support",
                ],
              },
            ].map((plan) => (
              <article
                key={plan.name}
                className={`rounded-3xl border p-6 ${
                  plan.featured
                    ? "border-sky-300/40 bg-sky-300/[0.07]"
                    : "border-white/10 bg-white/[0.03]"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-medium">{plan.name}</h3>
                  {plan.featured && (
                    <span className="font-mono text-[10px] uppercase tracking-wider text-sky-200">
                      Popular
                    </span>
                  )}
                </div>
                <p className="mt-2 min-h-10 text-sm text-zinc-400">
                  {plan.description}
                </p>
                <p className="mt-6 text-4xl font-medium tracking-tight">
                  {plan.price}
                </p>
                <p className="mt-1 text-xs text-zinc-500">{plan.detail}</p>
                <Link
                  href="/signup"
                  className={`mt-6 inline-flex h-11 w-full items-center justify-center rounded-full font-mono text-[11px] font-medium uppercase tracking-[0.12em] transition-colors ${
                    plan.featured
                      ? "bg-white text-zinc-950 hover:bg-sky-100"
                      : "border border-white/15 bg-white/[0.03] text-white hover:bg-white/10"
                  }`}
                >
                  Get started
                </Link>
                <div className="mt-6 border-t border-white/10 pt-5">
                  <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-500">
                    What&apos;s included
                  </p>
                  <ul className="mt-4 space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5 text-sm leading-5 text-zinc-300"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-2 size-1.5 shrink-0 rounded-full bg-sky-300"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-7 text-center text-sm text-zinc-500">
            Need a tailored plan?{" "}
            <Link
              href="/contact"
              className="text-zinc-200 underline decoration-white/30 underline-offset-4 transition-colors hover:text-white"
            >
              Talk to our team
            </Link>
            .
          </p>
          <div className="mt-10 text-center">
            <Link
              href="/pricing"
              className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-zinc-300 transition-colors hover:text-white"
            >
              Compare all plans <span aria-hidden="true">→</span>
            </Link>
          </div>
        </ScrollReveal>
      </section>

      <footer className="border-t border-white/[0.07] px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            aria-label="Vyrtual home"
            className="flex items-center gap-3"
          >
            <Image src="/vyrtual-icon.svg" alt="" width={30} height={30} />
            <span className="text-lg font-semibold tracking-tight">Vyrtual</span>
          </Link>
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-3">
            <Link href="#features" className="text-sm text-zinc-400 transition-colors hover:text-white">Features</Link>
            <Link href="#virtual-office" className="text-sm text-zinc-400 transition-colors hover:text-white">Virtual office</Link>
            <Link href="#pricing" className="text-sm text-zinc-400 transition-colors hover:text-white">Pricing</Link>
            <Link href="/contact" className="text-sm text-zinc-400 transition-colors hover:text-white">Contact</Link>
          </nav>
          <p className="text-xs text-zinc-600">
            © Vyrtual. Work from anywhere.
          </p>
        </div>
      </footer>
    </main>
  );
}
