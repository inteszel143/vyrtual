import Image from "next/image";
import Link from "next/link";
import SupportForm from "@/components/support-form";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#09090d] px-5 py-8 text-white sm:px-8 sm:py-10">
      <div className="mx-auto max-w-[1100px]">
        <header className="flex items-center justify-between border-b border-white/[0.07] pb-5">
          <Link href="/" aria-label="Vyrtual home" className="flex items-center gap-3">
            <Image src="/vyrtual-icon.svg" alt="" width={34} height={34} priority />
            <span className="text-lg font-semibold tracking-tight">Vyrtual</span>
          </Link>
          <Link href="/dashboard" className="text-xs font-medium text-zinc-400 transition-colors hover:text-white">
            Back to workspace
          </Link>
        </header>

        <div className="grid gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(360px,.85fr)] lg:gap-12 lg:py-16">
          <section className="lg:sticky lg:top-12 lg:self-start">
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-sky-300">
              Help us make Vyrtual better
            </p>
            <h1 className="mt-3 max-w-xl text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              We&apos;re listening.
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-7 text-zinc-400">
              Questions, ideas, something that didn&apos;t work? Send our team a
              note. Your feedback helps shape a better workspace for everyone.
            </p>

            <div className="mt-8 space-y-3">
              <article className="flex gap-3 rounded-2xl border border-white/[0.07] bg-[#111116] p-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-sky-300/10 text-sky-200">
                  <svg aria-hidden="true" className="size-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 3.9a8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" />
                  </svg>
                </span>
                <div>
                  <h2 className="text-xs font-semibold text-zinc-100">Tell us what you think</h2>
                  <p className="mt-1 text-[11px] leading-5 text-zinc-500">Feature ideas, feedback, or a quick question are all welcome.</p>
                </div>
              </article>
              <article className="flex gap-3 rounded-2xl border border-white/[0.07] bg-[#111116] p-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-violet-300/10 text-violet-200">
                  <svg aria-hidden="true" className="size-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16v16H4z" /><path d="m4 7 8 6 8-6" />
                  </svg>
                </span>
                <div>
                  <h2 className="text-xs font-semibold text-zinc-100">Email us directly</h2>
                  <a href="mailto:intesedzel@gmail.com" className="mt-1 inline-block text-[11px] text-sky-200 transition-colors hover:text-white">
                    intesedzel@gmail.com
                  </a>
                </div>
              </article>
            </div>
            <p className="mt-5 max-w-md text-[10px] leading-5 text-zinc-600">
              We&apos;re building our support experience. The form prepares an
              email in your email app; it isn&apos;t sent or stored until you send
              the draft.
            </p>
          </section>

          <section className="rounded-2xl border border-white/[0.08] bg-[#111116] p-5 sm:p-7">
            <div className="mb-6">
              <h2 className="text-base font-semibold text-white">Contact support</h2>
              <p className="mt-1 text-xs leading-5 text-zinc-500">Share as much context as you can. We&apos;ll be glad to hear from you.</p>
            </div>
            <SupportForm />
          </section>
        </div>

        <footer className="flex flex-col gap-3 border-t border-white/[0.07] pt-5 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
          <span>Vyrtual · Support &amp; feedback</span>
          <Link href="/pricing" className="transition-colors hover:text-zinc-300">Explore Vyrtual</Link>
        </footer>
      </div>
    </main>
  );
}
