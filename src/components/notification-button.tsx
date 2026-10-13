export default function NotificationButton() {
  return (
    <button
      type="button"
      aria-label="Notifications"
      className="relative flex size-10 items-center justify-center rounded-xl border border-white/[0.08] text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
    >
      <svg
        aria-hidden="true"
        className="size-[18px]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
      </svg>
      <span aria-hidden="true" className="absolute right-2 top-2 size-1.5 rounded-full bg-sky-300" />
    </button>
  );
}
