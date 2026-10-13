export default function LoadingScreen() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading page"
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#050507]/45 backdrop-blur-md"
    >
      <span
        aria-hidden="true"
        className="global-loader size-10 rounded-full border-[3px] border-white/20 border-t-white"
      />
    </div>
  );
}
