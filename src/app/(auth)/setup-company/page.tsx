"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/loading-screen";
import { saveCompanyName } from "@/lib/company-workspace";

export default function SetupCompanyPage() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = companyName.trim();

    if (!name) {
      setError("Enter your company name to continue.");
      return;
    }

    try {
      setSubmitting(true);
      saveCompanyName(name);
      await new Promise((resolve) => window.setTimeout(resolve, 1500));
      setSubmitting(false);
      router.push("/dashboard");
    } catch (saveError) {
      setSubmitting(false);
      const message = saveError instanceof Error ? saveError.message : "Browser storage is unavailable.";
      setError(`Could not save your company name: ${message}`);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050507] px-5 py-12 text-white">
      <section className="w-full max-w-lg p-6 sm:p-10">
        <div className="mb-7">
          <div className="mb-5 flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-full bg-sky-300/15 text-[11px] font-semibold text-sky-200">1</span>
            <span className="text-xs text-zinc-500">Workspace setup</span>
          </div>
          <h1 className="text-4xl tracking-[-0.035em] sm:text-[42px]">What’s your company called?</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-500">This name will identify your company in Vyrtual and your virtual office.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label htmlFor="company-name" className="block">
            <span className="mb-2 block text-xs font-medium text-zinc-300">Company name</span>
            <input
              autoFocus
              id="company-name"
              name="companyName"
              type="text"
              autoComplete="organization"
              maxLength={100}
              value={companyName}
              onChange={(event) => {
                setCompanyName(event.target.value);
                setError("");
              }}
              placeholder="e.g. Northstar Studio"
              required
              className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-sky-300/70 focus:bg-white/[0.06] focus:ring-4 focus:ring-sky-300/10"
            />
          </label>
          <p className="rounded-xl border border-amber-300/15 bg-amber-300/[0.05] px-4 py-3 text-xs leading-5 text-amber-100/80">
            Setup preview only. Account creation and company data are not connected to a backend yet.
          </p>
          {error && <p role="alert" className="text-xs leading-5 text-rose-300">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="flex h-12 w-full items-center justify-center rounded-full bg-sky-300 px-5 text-sm font-semibold text-slate-950 transition hover:bg-sky-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/20 disabled:cursor-wait disabled:opacity-70"
          >
            Continue to dashboard
          </button>
        </form>
      </section>
      {submitting && <LoadingScreen />}
    </main>
  );
}
