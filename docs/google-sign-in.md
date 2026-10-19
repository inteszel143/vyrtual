# Test Google sign-in

## Configure the provider

1. In Google Auth Platform, configure your app's audience and branding, then create an OAuth client with type **Web application**. If the app is in testing, add your Google account as a test user.
2. Add `http://localhost:3000` to the client's authorized JavaScript origins.
3. In Supabase, open **Authentication → Sign In / Providers → Google**. Copy its callback URL (the hosted project's `https://<project-ref>.supabase.co/auth/v1/callback`) into Google's **Authorized redirect URIs**.
4. Save the Google client ID and client secret in the Supabase Google provider settings and enable the provider. The Google client secret belongs in Supabase, not a public environment variable.
5. In Supabase **Authentication → URL Configuration**, use `http://localhost:3000` as the local Site URL and allow both redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/auth/callback?flow=signup`

Use your actual local port if it differs. For deployment, configure the production origin and corresponding callback URLs too, and set the production Site URL.

## Run the flow

1. Run `bun dev` and open `/login`.
2. Click **Continue with Google** and finish Google's consent screen. You should return to `/dashboard`.
3. Confirm your account appears in Supabase **Authentication → Users** and a Supabase auth cookie is present in browser developer tools under Application → Cookies. Workspace routes now verify the user through Supabase Auth before allowing access.
4. In a separate private browser session, open `/signup` and click **Continue with Google**. The terms notice is beneath the button; the email form and its checkbox are not required for Google signup. You should return to `/setup-company`.
5. Open `/auth/callback` without a code to verify the retry page. A canceled authorization or failed code exchange also uses `/auth/error`.

Google OAuth signs in existing users and creates accounts for new users, subject to your Supabase signup settings. The selected form determines the destination; company membership is not checked yet.

Password reset and database-backed company setup are outside this implementation.

Reference: https://supabase.com/docs/guides/auth/social-login/auth-google

## Email account creation

The signup form now calls Supabase email/password signup and saves `full_name` in user metadata. Email signup is enabled and confirmation is required in the project settings checked during implementation.

To test, enter your name, an email you control, a password of at least eight characters, and accept the terms. Click **Create account**. The global loader should clear with an inbox message. Open the confirmation email in the same browser that submitted signup; the existing PKCE callback exchanges the code and sends you to company setup. Keep `http://localhost:3000/auth/callback?flow=signup` in the allowed redirect URLs (adjust the origin to match your app).

This expects the confirmation email template to use Supabase's `{{ .ConfirmationURL }}` link. Custom templates that bypass that verification URL need separate handling. Email delivery was not tested automatically; no test accounts or emails were created. If sending fails, check Supabase SMTP configuration and email rate limits. With email confirmation disabled, a returned session goes directly to company setup.

## Email login

Open `/login`, enter the email and password used during signup, then click **Sign in**. Confirm the email first if required. Successful authentication opens `/dashboard`; invalid credentials, unconfirmed email, throttling, and connection errors display a message and dismiss the loader. Sessions persist in this browser through Supabase cookies. Google-only accounts need a password set before they can use password login.

## Protected pages

Open `/dashboard` in a fresh private browser session: it should redirect to `/login`. Sign in, then open `/dashboard` again: it should load. All current workspace routes and `/setup-company` use this check, including nested team pages. Public authentication and marketing pages remain accessible.

The proxy validates the user with Supabase Auth and redirects if verification fails. Keep its protected route roots updated when adding workspace pages. Future database queries and Server Actions must also enforce authorization and RLS; this page guard does not replace company membership checks.

## Logout

Open the profile menu and select **Logout**. The global loader appears while Supabase signs out the current browser session, then a full navigation returns to `/login`. Other devices stay signed in. If sign-out fails, an error toast appears and you can retry. Opening `/dashboard` after successful logout should redirect to login.
