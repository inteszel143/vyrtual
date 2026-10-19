# Team invitations

The `/team` page now uses Supabase-backed invitation records. Owners can send or resend an invitation, and recipients follow a Supabase email sign-in link to `/invite/[token]`, then explicitly accept. Acceptance checks the verified account email, expires after seven days, and is idempotent. The owner directory shows accepted invitations as Joined.

## Required Supabase setup

1. Apply `supabase/migrations/202610160001_team_invitations.sql` in the project's Supabase SQL editor (or your normal migration deployment workflow). The first invitation creates one owned workspace for the current account using the company name from setup. Existing company setup is still browser-local; other workspace screens remain previews.
2. In Authentication → URL Configuration, allow `http://localhost:3000/invite/*` for local development and `https://YOUR_DOMAIN/invite/*` for production. Set Site URL to the deployed app origin. Use the same origin when accessing the app and sending invitations.
3. Enable email sign-in and new user signups. Configure custom SMTP for delivery to real teammates; Supabase's default email service is restricted. If CAPTCHA is required for passwordless signup/sign-in, integrate a CAPTCHA token before enabling this send flow.
4. Keep `{{ .ConfirmationURL }}` as the link target in both **Confirm signup** and **Magic Link** email templates. Suggested subject: “Your Vyrtual workspace invitation”. Suggested body: “You've been invited to a Vyrtual workspace. Follow this secure link to sign in, then accept your invitation.” New accounts use the confirmation template; existing accounts use the magic-link template. Do not replace the target with SiteURL or an OAuth callback.
5. The existing `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are sufficient. No service-role key is exposed or required.

Email sign-in is intentionally initiated with an isolated implicit-flow client, so recipients can open links on their own device without the owner's PKCE verifier. The invitation page stores the resulting session using the existing SSR browser client, removes credentials from the URL, and requires explicit acceptance before granting membership. Supabase's sign-in link expiry can be shorter than the seven-day workspace invitation; resend if needed.

Email delivery and database writes are separate: a failed email leaves a pending invitation with a visible error and resend action. Supabase acceptance of the email request does not guarantee inbox delivery. Resends are limited to once a minute per invitation and up to twenty distinct recipients per workspace per hour. Supabase also applies its own email rate limits.

## Verification

Run `node --test tests/team-invitations.test.cjs`, `npx tsc --noEmit`, and ESLint on the changed files. API tests mock Supabase and do not send emails. Database authorization checks can be reproduced against a fresh, disposable PostgreSQL database (never an existing project): run `tests/sql/team-invitations-bootstrap.sql`, the migration, then `tests/sql/team-invitations-check.sql`, using `psql -v ON_ERROR_STOP=1`. The bootstrap supplies minimal test-only Supabase auth functions and roles.

After configuration, verify using two separate browser profiles:

- Send an invite as an owner; refresh `/team` and confirm it persists.
- Open the email in the recipient's browser and accept. Refresh the owner's directory and confirm Joined.
- Repeat with an existing account. Reopening an accepted invite should not duplicate membership.
- Try another signed-in email, an expired invite, and a malformed token; none should grant membership.
- Invite an existing member and resend within one minute; both should show an actionable error.
- Simulate email delivery failure; the invite should remain pending and support retry.

References: [Supabase passwordless email](https://supabase.com/docs/guides/auth/auth-email-passwordless), [redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls), [implicit flow](https://supabase.com/docs/guides/auth/sessions/implicit-flow).

## Member welcome and profiles

After the invitation migration, apply `supabase/migrations/202610170001_member_welcome.sql` in the same project's SQL editor. It adds the caller-scoped membership reader and the `profile-photos` bucket with uploads restricted to each user's own folder. Profile photos are publicly readable by URL; use only images intended as visible avatars.

After acceptance, open `/my-workspace`. Employees and freelancers receive a welcome modal populated with their verified email, invited company, role, and name. They can save a name and optional photo. Completion is remembered per account and workspace using Supabase user metadata; choosing Later defers it until the next visit. `/my-profile` supports later edits. Email and company are read-only here: email is the verified account address, and company identity comes from membership. Multiple memberships have a company selector. Names and photos are account-wide; the original invitation name in the owner's directory is unchanged.

Verify with a recipient account: save the welcome form, reload, check the modal stays closed and the name/photo appear in the sidebar, greeting, and profile menu; visit My profile to edit again. Check an Employee and a Freelancer, plus a second account on the same browser, to ensure browser-local preview images/company names never override the signed-in member's details. Work summary metrics remain previews.

Local database tests: after the existing invitation bootstrap, migration and checks, run `tests/sql/member-welcome-bootstrap.sql`, the member welcome migration, then `tests/sql/member-welcome-check.sql` on the disposable database only. The storage stand-in tests policy isolation; it does not test the hosted Storage HTTP service.

Profile updates follow [Supabase user metadata updates](https://supabase.com/docs/reference/javascript/auth-updateuser); uploads use [Storage access policies](https://supabase.com/docs/guides/storage/security/access-control).

## Password setup for invited members

The welcome form asks new invitees to create and confirm a password (minimum eight characters; Supabase may enforce additional requirements). Existing users can choose “I already have a password” to keep theirs. Members who completed the earlier welcome without password setup see the updated welcome on their next visit. Later still defers setup; a password is not an authorization requirement.

Passwords go directly to Supabase Auth via `updateUser({ password })`, never to profile metadata or browser storage. The `password_login_ready` metadata flag is only an onboarding preference, not proof that an account has a password or permission to access anything. Members can also set/change their password in My profile. Supabase may require a fresh sign-in for a password change.

Email/password sign-in and normal OAuth callbacks now look up workspace ownership and membership: owners go to `/dashboard`, employees/freelancers go to `/my-workspace`. No new database migration is needed beyond the existing invitation and member welcome migrations.

Run `node --test tests/member-password.test.cjs`. Live verification: use an invited test account to set a password, log out, and sign in through `/login` with the same email/password; confirm the personal workspace opens. Also verify an existing-password invitee and an owner login. Reference: [Supabase password updates](https://supabase.com/docs/reference/javascript/auth-updateuser).

## Team directory photos

Apply `supabase/migrations/202610170003_team_member_photos.sql` after the invitation migration. This adds an owner-readable photo URL to membership records, backfills existing account photos, and synchronizes future auth metadata photo changes and newly accepted memberships. No additional Auth fields are exposed. `/team` uses the saved URL with an initials fallback and its existing 15-second refresh. Pending invitations have initials until a member accepts. Users do not need to upload existing photos again.

For disposable database tests after the invitation lifecycle checks: run `tests/sql/team-member-photos-bootstrap.sql`, the photo migration, then `tests/sql/team-member-photos-check.sql`. The bootstrap adds a stand-in Auth metadata column; never run it in the hosted project.
