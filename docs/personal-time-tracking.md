# Personal time tracking

Apply `supabase/migrations/202610170002_personal_time_sessions.sql` in the connected Supabase project's SQL editor, then refresh `/my-time`. No new environment variables are needed.

Time in creates a session using the database clock. Time out closes that specific session using the database clock. A partial unique index and serialized clock functions prevent multiple active sessions for one account. Retrying a stop does not change its original end time or close a newer session.

Records are account-scoped, shared across that account's workspaces. They are not yet assigned to a company, project, or payroll period. RLS allows only the user to read their own sessions. Clients cannot insert, edit, or delete timestamps directly. Owners cannot read employees' logs through this table yet.

The navbar and office join/leave actions use the same database-backed clock. Active sessions continue across refreshes and devices, including after closing the browser. Users must explicitly time out to end a session. The page displays the last seven local calendar days, splitting overnight sessions at local midnight for display. Full sessions remain in the database. Other devices/tabs refresh on focus and every 30 seconds; this is not a Realtime subscription.

Previously saved localStorage preview logs are not imported: they have no verified account association. The old preview message check-in side effect is no longer emitted by time tracking. Other office and message features remain previews.

## Verification

On a disposable local PostgreSQL database, run the existing `tests/sql/team-invitations-bootstrap.sql`, then the time migration and `tests/sql/personal-time-check.sql` with `psql -v ON_ERROR_STOP=1`. Never use the test bootstrap in a real Supabase project.

After applying the migration in Supabase:

1. Sign in as a member and time in. Refresh `/my-time`; the active session should remain.
2. Open another tab/device with that account. It should show the same session after refresh.
3. Time out and verify the completed duration remains after signing out and back in.
4. Sign in as another account; no other user's logs should appear.
5. Disconnect the network and attempt a clock action. No success message should appear unless the RPC succeeds; refresh once connectivity returns to reconcile the state.
6. Verify sessions spanning midnight are apportioned to the correct local dates.
