"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSingularity } from "@/lib/singularity";
import { currentYear } from "@/lib/year";
import AGIQuotes from "./AGIQuotes";

export default function Navbar() {
  const [visible, setVisible] = useState(false);
  const { multiplier, setMultiplier, isActive } = useSingularity();
  const [showQuotes, setShowQuotes] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 60);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
          visible
            ? "translate-y-0 opacity-100 bg-white/95 backdrop-blur-sm border-b border-[var(--border)] shadow-sm"
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold tracking-tight">
            Is your degree worth it in {currentYear()}?
          </Link>

          <div className="flex items-center gap-4">
            {/* AGI toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMultiplier(isActive ? 1.0 : 2.0)}
                className={`relative w-9 h-5 rounded-full transition-colors ${
                  isActive ? "bg-[var(--critical)]" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${
                    isActive ? "left-[18px]" : "left-0.5"
                  }`}
                />
              </button>
              <button
                onClick={() => setShowQuotes(!showQuotes)}
                className={`text-[10px] uppercase tracking-widest font-medium transition-colors ${
                  isActive ? "text-[var(--critical)]" : "text-[var(--muted)]"
                }`}
              >
                {isActive ? `AGI ${multiplier}x` : "Baseline"}
              </button>
              {isActive && (
                <input
                  type="range"
                  min={1.5}
                  max={5.0}
                  step={0.5}
                  value={multiplier}
                  onChange={(e) => setMultiplier(Number(e.target.value))}
                  className="w-16 hidden md:block"
                />
              )}
            </div>

            {/* Desktop links */}
            <span className="w-px h-4 bg-[var(--border)] hidden md:block" />
            <Link
              href="/"
              className="text-[10px] uppercase tracking-widest text-[var(--muted)] hover:text-[var(--foreground)] transition-colors hidden md:block"
            >
              Majors
            </Link>
            <Link
              href="/schools"
              className="text-[10px] uppercase tracking-widest text-[var(--muted)] hover:text-[var(--foreground)] transition-colors hidden md:block"
            >
              Schools
            </Link>
            <Link
              href="/methodology"
              className="text-[10px] uppercase tracking-widest text-[var(--muted)] hover:text-[var(--foreground)] transition-colors hidden md:block"
            >
              Sources
            </Link>
            <a
              href="https://github.com/RomanSlack/f_x_university"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] uppercase tracking-widest text-[var(--muted)] hover:text-[var(--foreground)] transition-colors hidden md:block"
            >
              GitHub
            </a>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex flex-col gap-[4px] p-1"
            >
              <span className={`block w-4 h-[1.5px] bg-[var(--foreground)] transition-all ${menuOpen ? "rotate-45 translate-y-[5.5px]" : ""}`} />
              <span className={`block w-4 h-[1.5px] bg-[var(--foreground)] transition-all ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-4 h-[1.5px] bg-[var(--foreground)] transition-all ${menuOpen ? "-rotate-45 -translate-y-[5.5px]" : ""}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-[var(--border)] bg-white/95 backdrop-blur-sm px-6 py-4 space-y-3">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="block text-xs uppercase tracking-widest text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              Major Rankings
            </Link>
            <Link
              href="/schools"
              onClick={() => setMenuOpen(false)}
              className="block text-xs uppercase tracking-widest text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              School Rankings
            </Link>
            <Link
              href="/methodology"
              onClick={() => setMenuOpen(false)}
              className="block text-xs uppercase tracking-widest text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              Methodology & Sources
            </Link>
            <a
              href="https://github.com/RomanSlack/f_x_university"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="block text-xs uppercase tracking-widest text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              GitHub
            </a>
            {isActive && (
              <div className="pt-2 border-t border-[var(--border)]">
                <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-2">
                  AGI Multiplier
                </div>
                <input
                  type="range"
                  min={1.5}
                  max={5.0}
                  step={0.5}
                  value={multiplier}
                  onChange={(e) => setMultiplier(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-[10px] text-[var(--muted)] font-mono text-center mt-1">
                  {multiplier}x
                </div>
              </div>
            )}
          </div>
        )}
      </nav>

      {showQuotes && (
        <AGIQuotes onClose={() => setShowQuotes(false)} />
      )}
    </>
  );
}
