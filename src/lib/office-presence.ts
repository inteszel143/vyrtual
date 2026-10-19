import type { OfficePresence } from "@/components/my-office/types";

const STORAGE_KEY = "vyrtual-personal-office-presence";
const CHANGE_EVENT = "vyrtual-personal-office-presence-change";

export const personalOfficeStatuses: OfficePresence[] = [
  "Working",
  "Break",
  "Meal Break",
  "Meeting",
  "Snoozed",
  "Do not disturb",
  "Away",
];

export function isPersonalOfficeStatus(value: string | null): value is OfficePresence {
  return personalOfficeStatuses.some((status) => status === value);
}

export function subscribeToPersonalOfficePresence(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

export function getPersonalOfficePresenceSnapshot(): OfficePresence {
  const status = window.localStorage.getItem(STORAGE_KEY);
  return isPersonalOfficeStatus(status) ? status : "Working";
}

export function getPersonalOfficePresenceServerSnapshot(): OfficePresence {
  return "Working";
}

export function setPersonalOfficePresence(status: OfficePresence) {
  if (!personalOfficeStatuses.includes(status)) {
    throw new Error("Choose a valid office status.");
  }

  window.localStorage.setItem(STORAGE_KEY, status);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
