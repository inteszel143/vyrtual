const COMPANY_NAME_KEY = "vyrtual-company-name";
const COMPANY_NAME_EVENT = "vyrtual-company-name-change";

export function getCompanyNameSnapshot() {
  return window.localStorage.getItem(COMPANY_NAME_KEY) ?? "";
}

export function getCompanyNameServerSnapshot() {
  return "";
}

export function subscribeToCompanyName(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(COMPANY_NAME_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(COMPANY_NAME_EVENT, callback);
  };
}

export function saveCompanyName(name: string) {
  window.localStorage.setItem(COMPANY_NAME_KEY, name);
  window.dispatchEvent(new Event(COMPANY_NAME_EVENT));
}
