# Shared personal office

Apply `supabase/migrations/202610170005_shared_office.sql` after the invitation, personal time session and team member photo migrations. Refresh `/my-office`.

The selected company's accepted members, account display names, photos, and saved statuses replace the preview roster. Members can save Working, Away, Break, Meal Break, Meeting, Snoozed or Do not disturb status independently for each company. The roster refreshes every 10 seconds, on focus, and after local clock changes. Time out makes a person Offline. Pending invitations are excluded.

Presence means an active time session, not an open browser or verified network connection. Time tracking remains account-wide, so a timed-in member is visible as active in each company they belong to. Closing the browser or signing out does not automatically time out. Other members can see statuses but not private time-log history. Only company members and its owner can read that company's roster; a member can update only their own status.

Camera and microphone remain device previews, not transmitted calls. Leaving, timing out, changing companies, and unmounting stop media tracks, including late permission responses. The owner `/office` screen remains its separately labeled preview. Messaging links still lead to existing message previews; this change does not implement live messaging or conferencing.

Validation: TypeScript and ESLint, plus `tests/sql/shared-office-check.sql` in the disposable local database after prerequisites. Test live with two member accounts in separate browser profiles: time in on one, wait ten seconds on the other, change status, time out, and confirm the other view updates. Check photo display, company switching, and that camera tracks stop when leaving.
