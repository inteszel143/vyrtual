const STORAGE_KEY = "vyrtual-personal-work-session-started-at";
const LOGS_STORAGE_KEY = "vyrtual-personal-work-session-logs";
const CHANGE_EVENT = "vyrtual-personal-work-session-change";

export type PersonalWorkLog = {
  id: string;
  startedAt: number;
  endedAt: number;
};

export function subscribeToPersonalWorkSession(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

export function getPersonalWorkSessionSnapshot() {
  const value = Number(window.localStorage.getItem(STORAGE_KEY));
  return Number.isFinite(value) && value > 0 ? value : 0;
}

export function getPersonalWorkSessionServerSnapshot() {
  return 0;
}

export function getPersonalWorkLogsSnapshot() {
  return window.localStorage.getItem(LOGS_STORAGE_KEY) ?? "[]";
}

export function getPersonalWorkLogsServerSnapshot() {
  return "[]";
}

function createDailyLogEntries(startedAt: number, endedAt: number): PersonalWorkLog[] {
  const entries: PersonalWorkLog[] = [];
  let segmentStart = startedAt;

  while (segmentStart < endedAt) {
    const startDate = new Date(segmentStart);
    const nextDay = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate() + 1,
    ).getTime();
    const segmentEnd = Math.min(endedAt, nextDay);
    entries.push({
      id: `${startedAt}-${segmentStart}`,
      startedAt: segmentStart,
      endedAt: segmentEnd,
    });
    segmentStart = segmentEnd;
  }

  return entries;
}

export function timeInToPersonalWorkSession() {
  window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function timeOutOfPersonalWorkSession() {
  const startedAt = getPersonalWorkSessionSnapshot();
  const endedAt = Date.now();
  if (startedAt > 0 && endedAt > startedAt) {
    const storedLogs = window.localStorage.getItem(LOGS_STORAGE_KEY);
    const previousLogs: PersonalWorkLog[] = storedLogs ? JSON.parse(storedLogs) : [];
    const nextLogs = [
      ...previousLogs,
      ...createDailyLogEntries(startedAt, endedAt),
    ];
    window.localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(nextLogs));
  }
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
