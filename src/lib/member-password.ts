// This flag controls onboarding copy only; Supabase Auth verifies credentials.
export function validateMemberPassword(password: string, confirmation: string, required: boolean) {
  if (!password && !confirmation && !required) return "";
  if (password.length < 8) return "Choose a password with at least 8 characters.";
  if (password !== confirmation) return "The passwords do not match.";
  return "";
}
