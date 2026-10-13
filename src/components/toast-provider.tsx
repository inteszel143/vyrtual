"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type ToastKind = "success" | "error" | "info" | "warning";

export type ToastInput = {
  kind: ToastKind;
  title: string;
  message?: string;
  duration?: number;
};

type Toast = ToastInput & { id: number };
type ToastContextValue = { notify: (toast: ToastInput) => void };

const ToastContext = createContext<ToastContextValue | null>(null);

const toastStyles: Record<ToastKind, { border: string; icon: string; label: string }> = {
  success: { border: "border-emerald-300/20", icon: "text-emerald-300", label: "Success" },
  error: { border: "border-rose-300/20", icon: "text-rose-300", label: "Error" },
  info: { border: "border-sky-300/20", icon: "text-sky-300", label: "Information" },
  warning: { border: "border-amber-300/20", icon: "text-amber-300", label: "Warning" },
};

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider.");
  return context;
}

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);
  const timers = useRef(new Map<number, number>());

  const dismiss = useCallback((id: number) => {
    const timer = timers.current.get(id);
    if (timer !== undefined) window.clearTimeout(timer);
    timers.current.delete(id);
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const notify = useCallback((input: ToastInput) => {
    const id = ++nextId.current;
    const duration = input.duration ?? 4500;
    setToasts((current) => [...current, { ...input, id }].slice(-5));
    timers.current.set(id, window.setTimeout(() => dismiss(id), duration));
  }, [dismiss]);

  useEffect(() => () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current.clear();
  }, []);

  const contextValue = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="pointer-events-none fixed bottom-20 left-1/2 z-[100] flex max-h-[calc(100dvh-6rem)] w-[min(24rem,calc(100vw-2rem))] -translate-x-1/2 flex-col gap-2 overflow-y-auto sm:bottom-6" aria-label="Notifications">
        {toasts.map((toast) => {
          const style = toastStyles[toast.kind];
          return (
            <div
              key={toast.id}
              role={toast.kind === "error" ? "alert" : "status"}
              aria-live={toast.kind === "error" ? "assertive" : "polite"}
              className={`toast-slide-in pointer-events-auto flex items-start gap-3 rounded-2xl border ${style.border} bg-[#15151c]/95 p-4 shadow-2xl shadow-black/40 backdrop-blur-xl`}
            >
              <span className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-white/[0.05] text-xs font-bold ${style.icon}`} aria-hidden="true">
                {toast.kind === "success" ? "✓" : toast.kind === "error" ? "!" : toast.kind === "warning" ? "!" : "i"}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-semibold text-zinc-100">{toast.title}</span>
                {toast.message && <span className="mt-1 block text-xs leading-5 text-zinc-400">{toast.message}</span>}
              </span>
              <button
                type="button"
                aria-label={`Dismiss ${style.label.toLowerCase()} notification`}
                onClick={() => dismiss(toast.id)}
                className="flex size-6 shrink-0 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-white/[0.06] hover:text-white"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
