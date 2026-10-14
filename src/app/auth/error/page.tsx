import Link from "next/link";
import AuthShell from "@/components/auth-shell";

export default function AuthErrorPage() {
  return (
    <AuthShell>
      <div className="text-center">
        <h1 className="text-4xl tracking-[-0.035em]">Sign-in wasn’t completed</h1>
        <p className="mt-4 text-sm leading-6 text-zinc-400">
          Sign-in may have been canceled or the confirmation link may have expired.
          Please try again. For email confirmation, open the link in the same
          browser where you created your account.
        </p>
        <Link
          href="/login"
          className="mt-8 flex h-12 items-center justify-center rounded-full bg-white px-5 text-sm font-medium text-zinc-950 hover:bg-zinc-200"
        >
          Back to sign in
        </Link>
      </div>
    </AuthShell>
  );
}
