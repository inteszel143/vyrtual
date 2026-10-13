"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

type AuthFormMode = "login" | "signup" | "forgot-password";

const copy: Record<
  AuthFormMode,
  { title: string; description: string; button: string }
> = {
  login: {
    title: "Welcome back",
    description: "Sign in to your workspace and pick up where you left off.",
    button: "Sign in",
  },
  signup: {
    title: "Create your workspace",
    description: "Bring your remote team together in one virtual office.",
    button: "Create account",
  },
  "forgot-password": {
    title: "Reset your password",
    description:
      "Enter the email address for your account and we’ll help you get back in.",
    button: "Send reset link",
  },
};

function GoogleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" className="size-[18px]">
      <path
        fill="#FFC107"
        d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5h6.6c3.9-3.6 6.1-8.8 6.1-14.9Z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.5 0 10.1-1.8 13.5-4.8l-6.6-5c-1.8 1.2-4.1 2-6.9 2-5.3 0-9.8-3.6-11.4-8.4H5.8v5.1A20 20 0 0 0 24 44Z"
      />
      <path
        fill="#1976D2"
        d="M12.6 27.8a12 12 0 0 1 0-7.6v-5.1H5.8a20 20 0 0 0 0 17.8l6.8-5.1Z"
      />
      <path
        fill="#EA4335"
        d="M24 11.8c3 0 5.7 1 7.8 3.1l5.8-5.8A19.4 19.4 0 0 0 24 4 20 20 0 0 0 5.8 15.1l6.8 5.1c1.6-4.8 6.1-8.4 11.4-8.4Z"
      />
    </svg>
  );
}

export default function AuthForm({ mode }: { mode: AuthFormMode }) {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [message, setMessage] = useState("");
  const formCopy = copy[mode];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (mode === "signup") {
      router.push("/setup-company");
      return;
    }
    setMessage(
      "Authentication isn’t connected yet. Connect an auth provider to enable this action.",
    );
  }

  return (
    <div>
      <div className="text-center">
        <h1 className="font-serif text-4xl tracking-[-0.035em] sm:text-[42px]">
          {formCopy.title}
        </h1>
        <p className="mt-2 text-sm leading-6 text-zinc-500">
          {formCopy.description}
        </p>
      </div>

      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        {mode === "signup" && (
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-xs font-medium text-zinc-300"
            >
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Your name"
              required
              className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-violet-400/70 focus:bg-white/[0.06] focus:ring-4 focus:ring-violet-400/10"
            />
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-xs font-medium text-zinc-300"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            required
            className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-violet-400/70 focus:bg-white/[0.06] focus:ring-4 focus:ring-violet-400/10"
          />
        </div>

        {mode !== "forgot-password" && (
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-xs font-medium text-zinc-300"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={passwordVisible ? "text" : "password"}
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
                placeholder="Enter your password"
                minLength={8}
                required
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 pr-12 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-violet-400/70 focus:bg-white/[0.06] focus:ring-4 focus:ring-violet-400/10"
              />
              <button
                type="button"
                aria-label={passwordVisible ? "Hide password" : "Show password"}
                aria-pressed={passwordVisible}
                onClick={() => setPasswordVisible((visible) => !visible)}
                className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-zinc-500 transition-colors hover:text-zinc-200"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="size-[18px]"
                >
                  <path
                    d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="2.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {mode === "login" && (
          <div className="flex items-center justify-between gap-4 pt-1 text-xs">
            <label className="flex items-center gap-2 text-zinc-400">
              <input
                type="checkbox"
                name="remember"
                className="size-4 rounded border-white/20 accent-violet-400"
              />
              Remember me
            </label>
            <Link
              href="/forgot-password"
              className="font-medium text-zinc-200 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        )}

        {mode === "signup" && (
          <label className="flex items-start gap-2 pt-1 text-xs leading-5 text-zinc-400">
            <input
              type="checkbox"
              name="terms"
              required
              className="mt-0.5 size-4 shrink-0 rounded border-white/20 accent-violet-400"
            />
            I agree to the terms of service and privacy policy.
          </label>
        )}

        <button
          type="submit"
          className="flex h-12 w-full items-center justify-center rounded-full bg-white px-5 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/20"
        >
          {formCopy.button}
        </button>
      </form>

      {mode === "login" && (
        <>
          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">
              Or continue with
            </span>
            <span className="h-px flex-1 bg-white/10" />
          </div>
          <button
            type="button"
            onClick={() =>
              setMessage(
                "Google sign-in isn’t connected yet. Connect an auth provider to enable this action.",
              )
            }
            className="flex h-12 w-full items-center justify-center gap-3 rounded-full border border-white/10 bg-white/[0.04] text-sm font-medium text-zinc-200 transition hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/10"
          >
            <GoogleMark />
            Continue with Google
          </button>
        </>
      )}

      {message && (
        <p
          role="status"
          className="mt-4 rounded-xl border border-amber-300/20 bg-amber-300/[0.08] px-4 py-3 text-xs leading-5 text-amber-200"
        >
          {message}
        </p>
      )}

      <p className="mt-8 text-center text-xs text-zinc-500">
        {mode === "login" ? (
          <>
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-zinc-200 hover:text-white hover:underline"
            >
              Sign up
            </Link>
          </>
        ) : mode === "signup" ? (
          <>
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-zinc-200 hover:text-white hover:underline"
            >
              Sign in
            </Link>
          </>
        ) : (
          <Link
            href="/login"
            className="font-semibold text-zinc-200 hover:text-white hover:underline"
          >
            Back to sign in
          </Link>
        )}
      </p>
    </div>
  );
}
