# Personal schedule

Apply `supabase/migrations/202610170004_personal_schedule.sql` in Supabase SQL Editor after the invitation migration, then refresh `/my-schedule`.

Members can add, edit and delete personal work blocks, meetings and time off. Each entry belongs to the signed-in account and selected company membership. The database enforces account isolation and valid durations. Switching accounts or companies remounts the planner so the previous selection and entries are cleared.

Dates are entered and displayed in the user's local browser timezone, stored as UTC timestamps. Weeks run Monday to Sunday. Entries crossing week boundaries appear in both weeks; work-hour totals include only the intersecting duration. Overlapping work blocks are permitted and summed individually. Time off is a personal plan, not an approved leave request. This page does not yet integrate with the owner's `/schedules` preview or automatically start time tracking.

Verification: `node --test tests/personal-schedule.test.cjs`. For database testing, run the existing invitation bootstrap/migration/lifecycle checks in a disposable database, then the schedule migration and `tests/sql/personal-schedule-check.sql` using `psql -v ON_ERROR_STOP=1`. Never run bootstrap files in the hosted project.

Live checklist: add an entry, refresh to verify persistence, edit its times, move between weeks, delete with confirmation, then switch to another account and verify the entry is not visible. Verify another company selection also has a separate schedule.
