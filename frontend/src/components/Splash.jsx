import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const KEY = "wl_splash_seen";

export default function Splash() {
  const [visible, setVisible] = useState(() => {
    try { return sessionStorage.getItem(KEY) !== "1"; } catch { return true; }
  });

  useEffect(() => {
    if (!visible) return;
    // total ~2200ms
    const t = setTimeout(() => {
      try { sessionStorage.setItem(KEY, "1"); } catch {}
      setVisible(false);
    }, 2200);
    return () => clearTimeout(t);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[100] bg-[#FAF8F5] flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.55, ease: [0.65, 0, 0.35, 1] } }}
          data-testid="splash-screen"
        >
          {/* subtle noise / vignette */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.05] mix-blend-multiply"
               style={{ backgroundImage: "radial-gradient(ellipse at center, transparent 40%, #1C1815 100%)" }}/>

          <div className="relative flex flex-col items-center">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-[10px] uppercase tracking-[0.5em] text-[#B8860B] mb-6"
            >
              Since 2019
            </motion.p>

            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, ease: [0.22, 0.9, 0.3, 1], delay: 0.25 }}
                className="font-serif text-6xl sm:text-7xl lg:text-[110px] leading-none tracking-tight text-[#1C1815] flex items-baseline gap-2 sm:gap-3"
              >
                <span className="italic font-normal text-[#6E685E] text-3xl sm:text-4xl lg:text-5xl">The</span>
                <span className="text-[#B8860B] font-semibold">WL</span>
                <span>Pens</span>
              </motion.h1>
            </div>

            <div className="mt-8 h-[1px] w-56 bg-[#E6E0D6] overflow-hidden">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.0, ease: "easeInOut", delay: 0.7 }}
                style={{ transformOrigin: "left" }}
                className="h-full bg-[#1C1815]"
              />
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="mt-5 text-[10px] uppercase tracking-[0.4em] text-[#6E685E]"
            >
              The quiet art of writing well
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
