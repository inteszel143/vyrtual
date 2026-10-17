"use client";

import { useState } from "react";

// Reset image loading state whenever the URL changes, including a new upload.
export default function AvatarImage({ src, initials, onError }: { src: string; initials: string; onError?: () => void }) {
  return <AvatarSource key={src} src={src} initials={initials} onError={onError} />;
}

function AvatarSource({ src, initials, onError }: { src: string; initials: string; onError?: () => void }) {
  const [status, setStatus] = useState<"loading" | "loaded" | "failed">("loading");
  return <>
    {(!src || status !== "loaded") && <span aria-hidden="true">{initials || "?"}</span>}
    {src && status !== "failed" && (
      // Provider URLs and local image previews do not use the Next image optimizer.
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt="" referrerPolicy="no-referrer"
        className={`absolute inset-0 size-full object-cover ${status === "loaded" ? "" : "opacity-0"}`}
        onLoad={() => setStatus("loaded")}
        onError={() => { setStatus("failed"); onError?.(); }}
      />
    )}
  </>;
}
