const STORAGE_KEY = "vyrtual-personal-work-session-started-at";
const CHANGE_EVENT = "vyrtual-personal-work-session-change";

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

export function timeInToPersonalWorkSession() {
  window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function timeOutOfPersonalWorkSession() {
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
