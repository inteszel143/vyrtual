export type ScheduleEntry = { id: string; title: string; kind: 'Scheduled work' | 'Meeting' | 'Time off'; starts_at: string; ends_at: string; notes: string };
export function weekStart(date: Date) {
  const start = new Date(date); start.setHours(0,0,0,0);
  start.setDate(start.getDate() - (start.getDay() + 6) % 7); return start;
}
export function moveDays(date: Date, days: number) { const result = new Date(date); result.setDate(result.getDate() + days); return result; }
export function localInput(date: Date) {
  const pad = (n: number) => String(n).padStart(2,'0');
  return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
export function validateSchedule(title: string, start: string, end: string) {
  if (!title.trim() || title.trim().length > 120) return 'Enter a title of up to 120 characters.';
  const a = new Date(start).getTime(), b = new Date(end).getTime();
  if (!Number.isFinite(a) || !Number.isFinite(b)) return 'Choose a valid start and end date.';
  if (b <= a) return 'End time must be after start time.';
  return '';
}
export function scheduledHours(entries: ScheduleEntry[], start: Date, end: Date) {
  return entries.filter(e => e.kind === 'Scheduled work').reduce((total,e) => total + Math.max(0, Math.min(Date.parse(e.ends_at),end.getTime()) - Math.max(Date.parse(e.starts_at),start.getTime())),0) / 3_600_000;
}
