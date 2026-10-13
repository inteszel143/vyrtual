import type { ConnectionState } from "./types";

export default function OfficeHeader({
  roomName,
  onlineCount,
  connection,
}: {
  roomName: string;
  onlineCount: number;
  connection: ConnectionState;
}) {
  return (
    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-sky-200">Northstar Studio</p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight">{roomName}</h2>
        <p className="mt-1 text-xs text-zinc-400">{onlineCount} {onlineCount === 1 ? "person" : "people"} online</p>
      </div>
      <span className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs ${
        connection === "connected"
          ? "border-emerald-300/15 bg-emerald-300/[0.06] text-emerald-200"
          : connection === "reconnecting"
            ? "border-amber-300/15 bg-amber-300/[0.06] text-amber-200"
            : "border-white/[0.08] bg-white/[0.03] text-zinc-400"
      }`}>
        <span className={`size-1.5 rounded-full ${
          connection === "connected" ? "bg-emerald-300" : connection === "reconnecting" ? "bg-amber-300" : "bg-zinc-500"
        }`} />
        {connection === "connected" ? "Office open" : connection === "reconnecting" ? "Reconnecting" : "You left the office"}
      </span>
    </header>
  );
}
