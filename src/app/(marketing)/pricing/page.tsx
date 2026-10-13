import Image from "next/image";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    description: "Try Vyrtual with your team for 14 days.",
    price: "$0",
    priceDescription: "for 14 days",
    features: [
      "Team and freelancer directory",
      "Working-hours tracking",
      "Full access for 14 days",
    ],
    cta: "Get started",
    href: "/signup",
  },
  {
    name: "Team",
    description: "Everything you need to keep a growing team in sync.",
    price: "$19",
    priceDescription: "per member / month",
    features: [
      "Everything in Free",
      "Work activity verification",
      "Time and team reports",
      "Flexible employee and freelancer management",
      "Invite up to 50 employees and freelancers",
    ],
    cta: "Choose Team",
    href: "/signup",
    featured: true,
  },
  {
    name: "Business",
    description: "More visibility and control as your company scales.",
    price: "$29",
    priceDescription: "per member / month",
    features: [
      "Everything in Team",
      "Advanced team insights",
      "Expanded reporting",
      "Priority support",
      "Unlimited employees and freelancers",
    ],
    cta: "Choose Business",
    href: "/signup",
  },
];

const faqs = [
  {
    question: "Who is Vyrtual for?",
    answer:
      "Vyrtual is designed for companies working with remote employees, freelancers, or a mix of both.",
  },
  {
    question: "What does work activity verification mean?",
    answer:
      "It gives teams visibility into work activity alongside tracked hours, helping managers understand progress without requiring a physical office.",
  },
  {
    question: "Can I use Vyrtual with both employees and freelancers?",
    answer:
      "Yes. Vyrtual is built to help companies manage remote employees and freelance collaborators in one virtual office.",
  },
  {
    question: "Do you offer custom plans?",
    answer:
      "Business includes unlimited employees and freelancers. Contact us if your organization needs a tailored setup.",
  },
];

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className="mt-0.5 size-5 shrink-0 text-sky-300"
    >
      <path
        d="m5 10.2 3.2 3.2L15.5 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function PricingPage() {
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
            <span className="text-xl font-semibold tracking-tight">Vyrtual</span>
          </Link>
          <div className="hidden items-center gap-0 md:flex lg:gap-3">
            <Link
              href="/features"
              className="whitespace-nowrap px-2 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-400 transition-colors hover:text-white lg:px-4 lg:text-xs lg:tracking-[0.2em]"
            >
              Features
            </Link>
            <Link
              href="/office"
              className="whitespace-nowrap px-2 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-400 transition-colors hover:text-white lg:px-4 lg:text-xs lg:tracking-[0.2em]"
            >
              Virtual office
            </Link>
            <Link
              href="/pricing"
              aria-current="page"
              className="whitespace-nowrap px-2 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-white lg:px-4 lg:text-xs lg:tracking-[0.2em]"
            >
              Pricing
            </Link>
          </div>
          <div className="hidden shrink-0 items-center gap-4 md:flex lg:gap-7">
            <Link
              href="/login"
              className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-zinc-400 transition-colors hover:text-white"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="inline-flex h-11 items-center justify-center rounded-full border border-white/20 bg-white/[0.04] px-6 font-mono text-xs font-medium uppercase tracking-[0.16em] text-white transition-colors hover:border-white/40 hover:bg-white/10"
            >
              Get started
            </Link>
          </div>
          <div className="flex items-center gap-3 md:hidden">
            <details className="group relative">
              <summary className="flex h-10 cursor-pointer list-none items-center rounded-full border border-white/15 px-4 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-200 [&::-webkit-details-marker]:hidden">
                Menu
              </summary>
              <div className="absolute right-0 top-12 z-10 w-56 rounded-2xl border border-white/10 bg-[#111115] p-2 shadow-xl">
                <Link
                  href="/features"
                  className="block rounded-lg px-4 py-3 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
                >
                  Features
                </Link>
                <Link
                  href="/office"
                  className="block rounded-lg px-4 py-3 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
                >
                  Virtual office
                </Link>
                <Link
                  href="/pricing"
                  aria-current="page"
                  className="block rounded-lg px-4 py-3 text-sm font-medium text-white"
                >
                  Pricing
                </Link>
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

      <section className="relative isolate mx-auto max-w-6xl px-6 pb-20 pt-20 sm:pt-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-10 -z-10 mx-auto h-[440px] max-w-4xl rounded-full bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.16),rgba(99,102,241,0.12)_35%,transparent_72%)] blur-3xl"
        />
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.22em] text-sky-300">
            Straightforward plans
          </p>
          <h1 className="mt-5 text-4xl font-medium leading-tight tracking-[-0.05em] sm:text-6xl">
            A better way to work, at every size.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">
            Start with the essentials, then choose the level of insight your
            remote team needs. No office required.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`relative flex flex-col rounded-3xl border p-6 sm:p-7 ${
                plan.featured
                  ? "border-sky-300/50 bg-[linear-gradient(155deg,rgba(56,189,248,0.13),rgba(255,255,255,0.055)_42%,rgba(255,255,255,0.025))] shadow-[0_20px_70px_-35px_rgba(56,189,248,0.4)]"
                  : "border-white/10 bg-white/[0.035]"
              }`}
            >
              {plan.featured && (
                <span className="absolute right-6 top-6 rounded-full border border-sky-300/25 bg-sky-300/10 px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-sky-200">
                  Most popular
                </span>
              )}
              <div>
                <h2 className="text-xl font-medium">{plan.name}</h2>
                <p className="mt-2 min-h-12 max-w-xs text-sm leading-6 text-zinc-400">
                  {plan.description}
                </p>
              </div>
              <div className="mt-8 flex min-h-[72px] items-end gap-2">
                <span className="text-5xl font-medium tracking-[-0.06em]">
                  {plan.price}
                </span>
                <span className="pb-2 text-sm text-zinc-400">
                  {plan.priceDescription}
                </span>
              </div>
              <Link
                href={plan.href}
                className={`mt-6 inline-flex h-12 items-center justify-center rounded-full px-5 font-mono text-xs font-medium uppercase tracking-[0.13em] transition-colors ${
                  plan.featured
                    ? "bg-white text-zinc-950 hover:bg-sky-100"
                    : "border border-white/20 bg-white/[0.04] text-white hover:border-white/40 hover:bg-white/10"
                }`}
              >
                {plan.cta}
              </Link>
              <div className="my-7 border-t border-white/10" />
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500">
                What&apos;s included
              </p>
              <ul className="mt-4 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm leading-6 text-zinc-300"
                  >
                    <CheckIcon />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-5 flex max-w-5xl flex-col justify-between gap-6 rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:flex-row sm:items-center sm:px-8">
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
              Need a tailored setup?
            </p>
            <h2 className="mt-2 text-xl font-medium">
              Enterprise plans built around your team.
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Let&apos;s talk about your company&apos;s needs and workflows.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-full border border-white/20 px-6 font-mono text-xs font-medium uppercase tracking-[0.14em] text-white transition-colors hover:border-white/40 hover:bg-white/10"
          >
            Talk to us
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-24 pt-4">
        <div className="text-center">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.22em] text-sky-300">
            FAQs
          </p>
          <h2 className="mt-4 text-3xl font-medium tracking-[-0.04em] sm:text-4xl">
            A few things you might be wondering.
          </h2>
        </div>
        <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
          {faqs.map((faq) => (
            <details key={faq.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-medium text-zinc-200 [&::-webkit-details-marker]:hidden">
                {faq.question}
                <span
                  aria-hidden="true"
                  className="font-mono text-xl font-normal text-zinc-500 transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="max-w-2xl pt-3 pr-8 text-sm leading-6 text-zinc-400">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
