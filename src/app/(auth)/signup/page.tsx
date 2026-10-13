import AuthForm from "@/components/auth-form";
import AuthShell from "@/components/auth-shell";

export default function SignUpPage() {
  return (
    <AuthShell>
      <AuthForm mode="signup" />
    </AuthShell>
  );
}
