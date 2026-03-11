"use client";

import { useState } from "react";

export default function ShareButtons({ text, url }: { text: string; url?: string }) {
  const [copied, setCopied] = useState(false);

  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(shareUrl);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }

  async function handleNativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title: text, url: shareUrl });
      } catch {
        // user cancelled
      }
    }
  }

  const btnClass =
    "inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-widest font-medium text-[var(--muted)] hover:text-[var(--foreground)] border border-[var(--border)] hover:border-[var(--foreground)] rounded-full transition-all";

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* X / Twitter */}
      <a
        href={`https://x.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={btnClass}
      >
        <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
        Share
      </a>

      {/* LinkedIn */}
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={btnClass}
      >
        <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
        LinkedIn
      </a>

      {/* Copy link */}
      <button onClick={handleCopy} className={btnClass}>
        {copied ? (
          <>
            <svg viewBox="0 0 20 20" className="w-3 h-3 fill-current"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
            Copied
          </>
        ) : (
          <>
            <svg viewBox="0 0 20 20" className="w-3 h-3 fill-current"><path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" /><path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" /></svg>
            Copy Link
          </>
        )}
      </button>

      {/* Native share (mobile) */}
      {typeof navigator !== "undefined" && "share" in navigator && (
        <button onClick={handleNativeShare} className={`${btnClass} md:hidden`}>
          <svg viewBox="0 0 20 20" className="w-3 h-3 fill-current"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" /></svg>
          Share
        </button>
      )}
    </div>
  );
}
