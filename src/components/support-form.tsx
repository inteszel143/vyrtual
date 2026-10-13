"use client";

import { useState, type FormEvent } from "react";

const supportEmail = "intesedzel@gmail.com";
const categories = [
  "General feedback",
  "Feature request",
  "Bug report",
  "Account & billing",
] as const;

const inputClassName =
  "h-11 w-full rounded-xl border border-white/[0.09] bg-[#0d0d12] px-3.5 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 transition-colors focus:border-sky-300/40";

export default function SupportForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>(categories[0]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const body = [
      `From: ${name.trim()}`,
      `Reply-to: ${email.trim()}`,
      `Category: ${category}`,
      "",
      message.trim(),
    ].join("\n");
    const mailto = `mailto:${supportEmail}?${new URLSearchParams({
      subject: `[Vyrtual ${category}] ${subject.trim()}`,
      body,
    }).toString()}`;

    setStatus(
      `Your email app should open with this message addressed to ${supportEmail}. Send the draft there to deliver your feedback.`,
    );
    window.location.href = mailto;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-xs font-medium text-zinc-300">Your name</span>
          <input
            autoComplete="name"
            className={inputClassName}
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={100}
            placeholder="How should we address you?"
            required
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-medium text-zinc-300">Your email</span>
          <input
            autoComplete="email"
            className={inputClassName}
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            maxLength={254}
            placeholder="you@company.com"
            required
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-2 block text-xs font-medium text-zinc-300">What can we help with?</span>
        <select
          className={inputClassName}
          value={category}
          onChange={(event) => {
            const selectedCategory = categories.find(
              (option) => option === event.target.value,
            );
            if (selectedCategory) setCategory(selectedCategory);
          }}
        >
          {categories.map((option) => <option key={option}>{option}</option>)}
        </select>
      </label>

      <label className="block">
        <span className="mb-2 block text-xs font-medium text-zinc-300">Subject</span>
        <input
          className={inputClassName}
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          maxLength={120}
          placeholder="A short summary"
          required
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-xs font-medium text-zinc-300">Message</span>
        <textarea
          className="min-h-36 w-full resize-y rounded-xl border border-white/[0.09] bg-[#0d0d12] px-3.5 py-3 text-sm leading-6 text-zinc-100 outline-none placeholder:text-zinc-600 transition-colors focus:border-sky-300/40"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          maxLength={5000}
          placeholder="Tell us what’s working, what isn’t, or what you’d like to see next..."
          required
        />
        <span className="mt-1 block text-right text-[10px] text-zinc-600">{message.length}/5000</span>
      </label>

      <div className="rounded-xl border border-sky-300/10 bg-sky-300/[0.035] px-4 py-3">
        <p className="text-[11px] leading-5 text-zinc-400">
          This opens your email app with a prefilled draft to{" "}
          <span className="font-medium text-sky-200">{supportEmail}</span>. Your feedback is only sent when you send that email.
        </p>
      </div>

      <button
        type="submit"
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-sky-300 px-4 text-sm font-semibold text-slate-950 transition-colors hover:bg-sky-200 sm:w-auto"
      >
        <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="m22 2-7 20-4-9-9-4 20-7ZM22 2 11 13" />
        </svg>
        Prepare email
      </button>

      <p aria-live="polite" className="min-h-5 text-xs leading-5 text-sky-200">{status}</p>
    </form>
  );
}
