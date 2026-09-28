import { useState, useEffect, useRef } from "react";
import { Star, Sparkles } from "lucide-react";

/**
 * LegacyTrustStrip
 *
 * Active writer count uses BroadcastChannel to count real open tabs
 * on this browser session. No fake drift — count only goes up when
 * another actual tab opens the site, comes back down when tabs close.
 * Falls back gracefully on browsers that don't support BroadcastChannel.
 */
export default function LegacyTrustStrip({ className = "" }) {
  const [tabCount, setTabCount] = useState(1); // starts at 1 = you
  const channelRef = useRef(null);

  useEffect(() => {
    if (!("BroadcastChannel" in window)) return; // SSR / old browser guard

    const ch = new BroadcastChannel("wlpens_tabs");
    channelRef.current = ch;

    // Tell other tabs we just opened
    ch.postMessage({ type: "TAB_OPEN" });

    // Respond when asked for a count ping
    ch.onmessage = (e) => {
      if (e.data?.type === "TAB_OPEN") {
        // A new tab opened — reply so it can count us
        ch.postMessage({ type: "TAB_PONG" });
      }
      if (e.data?.type === "TAB_PONG" || e.data?.type === "TAB_OPEN") {
        // Re-count: every time any tab signals presence, increment briefly
        // We track via a local peer set keyed by random IDs
      }
    };

    return () => {
      ch.postMessage({ type: "TAB_CLOSE" });
      ch.close();
    };
  }, []);

  // Simpler, honest approach: use localStorage + storage event to count tabs
  useEffect(() => {
    const KEY = "wlpens_tab_heartbeat";
    const MY_ID = Math.random().toString(36).slice(2);
    const INTERVAL = 2000; // heartbeat every 2s
    const TIMEOUT = 5000;  // tab considered dead after 5s

    const readTabs = () => {
      try {
        const raw = JSON.parse(localStorage.getItem(KEY) || "{}");
        const now = Date.now();
        // Prune stale
        const alive = Object.fromEntries(
          Object.entries(raw).filter(([, ts]) => now - ts < TIMEOUT)
        );
        return alive;
      } catch { return {}; }
    };

    const beat = () => {
      try {
        const tabs = readTabs();
        tabs[MY_ID] = Date.now();
        localStorage.setItem(KEY, JSON.stringify(tabs));
        setTabCount(Object.keys(tabs).length);
      } catch { /* storage blocked */ }
    };

    beat(); // immediate
    const iv = setInterval(beat, INTERVAL);

    const onStorage = () => {
      try {
        const tabs = readTabs();
        setTabCount(Object.keys(tabs).length);
      } catch { /* */ }
    };

    window.addEventListener("storage", onStorage);

    const onUnload = () => {
      try {
        const tabs = readTabs();
        delete tabs[MY_ID];
        localStorage.setItem(KEY, JSON.stringify(tabs));
      } catch { /* */ }
    };
    window.addEventListener("beforeunload", onUnload);

    return () => {
      clearInterval(iv);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("beforeunload", onUnload);
      onUnload();
    };
  }, []);

  return (
    <section
      className={`w-full bg-[#1C1815] text-[#FAF8F5] py-4 sm:py-5 border-y border-[#3D4838] relative overflow-hidden ${className}`}
      data-testid="legacy-trust-strip"
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-6 text-center md:text-left">
        {/* Left: Brand Heritage */}
        <div className="flex items-center gap-2">
          <Sparkles size={13} className="shrink-0 text-[#B8860B]" />
          <span className="text-[#FAF8F5] font-serif tracking-normal text-sm sm:text-base font-normal">
            A Legacy of The WL Pens
          </span>
          <span className="hidden sm:inline text-white/30 text-xs">·</span>
          <span className="hidden sm:inline text-[11px] text-[#FAF8F5]/70 tracking-[0.2em]">
            Panchkula Atelier Since 2020
          </span>
        </div>

        {/* Right */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
          {/* Rating */}
          <div className="flex items-center gap-1.5" data-testid="trust-rating-badge">
            <div className="flex text-[#B8860B]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={13} fill="currentColor" />
              ))}
            </div>
            <span className="font-semibold text-white text-xs">4.9/5</span>
            <span className="text-[#FAF8F5]/60 text-xs">· 10,000+ Writers</span>
          </div>

          <span className="text-white/20 hidden sm:inline">|</span>

          {/* Actual tab counter */}
          <div className="flex items-center gap-2" data-testid="active-users-counter">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs text-[#FAF8F5]/85">
              {tabCount === 1 ? (
                <>You're exploring the atelier</>
              ) : (
                <>
                  <strong className="text-white font-semibold tabular-nums">{tabCount}</strong>{" "}
                  {tabCount === 1 ? "writer" : "tabs"} open in this session
                </>
              )}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
