import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function HeartbeatScenePink({
  onClose,
  epilogue = "Every soft beat still finds you.",
  whatsappHref,
  musicSrc = "/finalsong.mp3",
}) {
  const [phase, setPhase] = useState("idle"); // idle → arming → burst → epilogue → cta
  const audioRef = useRef(null);

  // —— Tunables ——
  const EPILOGUE_MS_PER_CHAR = 70;   // typing speed
  const EPILOGUE_HOLD_END = 2200;    // linger after typing completes (ms)
  const EPILOGUE_LINGER_ON_CTA = 1200; // epilogue fades out this long into CTA phase (ms)

  // Soft bokeh field
  const bokeh = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        x: 8 + Math.random() * 84,
        y: 60 + Math.random() * 30,
        s: 16 + Math.random() * 28,
        d: 6 + Math.random() * 6,
        o: 0.18 + Math.random() * 0.25,
      })),
    []
  );

  // Petals
  const [petals, setPetals] = useState([]);
  function spawnPetals(n = 140) {
    const out = [];
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 28 + Math.random() * 72;
      out.push({
        id: Math.random(),
        tx: Math.cos(a) * r,
        ty: Math.sin(a) * r - 12 - Math.random() * 26,
        rot: (Math.random() - 0.5) * 120,
        life: 0.9 + Math.random() * 0.9,
        scale: 0.7 + Math.random() * 0.8,
        tint:
          Math.random() < 0.5
            ? "rgba(255,182,193,0.95)"
            : "rgba(255,154,170,0.95)",
      });
    }
    setPetals(out);
  }

  const vibrate = (p) => {
    try { if (navigator.vibrate) navigator.vibrate(p); } catch {}
  };

  function triggerBurst() {
    if (audioRef.current) {
      audioRef.current.muted = false;
      audioRef.current.play().catch(() => {});
    }
    vibrate([40, 30, 80]);
    setPhase("arming");
    setTimeout(() => {
      spawnPetals();
      setPhase("burst");
      setTimeout(() => setPhase("epilogue"), 900);
    }, 160);
  }

  const heartPath =
    "M100 28 C 78 2, 20 10, 28 60 C 36 110, 95 150, 100 160 C 105 150, 164 110, 172 60 C 180 10, 122 2, 100 28 Z";

  // Only show the big clickable heart in idle/arming — never during epilogue/cta
  const showBigHeart = phase === "idle" || phase === "arming" || phase === "burst";

  return (
    <motion.div className="fixed inset-0 z-[70]" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* soft blush background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #fff2f5 0%, #ffe6ee 38%, #ffe3ec 60%, #ffe9f0 100%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(800px 480px at 50% 10%, rgba(255,255,255,0.9), rgba(255,255,255,0) 70%), radial-gradient(1200px 520px at 50% 85%, rgba(255,91,134,0.12), transparent 70%)",
        }}
      />

      {/* bokeh */}
      <div className="absolute inset-0 pointer-events-none">
        {bokeh.map((b) => (
          <motion.div
            key={b.id}
            className="absolute rounded-full"
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              width: b.s,
              height: b.s,
              background:
                "radial-gradient(circle, rgba(255,255,255,0.9), rgba(255,255,255,0) 65%)",
              filter: "blur(1px)",
              opacity: b.o,
            }}
            animate={{ y: [0, -18, 0] }}
            transition={{ duration: b.d, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      {musicSrc && <audio ref={audioRef} src={musicSrc} loop muted preload="auto" />}

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 w-9 h-9 rounded-full bg-white/90 text-maroon font-bold shadow hover:bg-white active:scale-[0.98]"
        aria-label="Close"
      >
        ×
      </button>

      {/* Stage */}
      <div className="w-full h-full grid place-items-center px-6">
        <div className="relative w-[78vw] max-w-[430px] aspect-square">
          {/* Big heart (only idle/arming/burst) */}
          <AnimatePresence>
            {showBigHeart && (
              <motion.svg
                key="heart"
                viewBox="0 0 200 200"
                className="absolute inset-0 w-full h-full"
                initial={{ scale: 0.98, opacity: 1 }}
                animate={
                  phase === "arming"
                    ? { scale: [1, 1.06, 1.02] }
                    : phase === "burst"
                    ? { scale: 1.5, opacity: 0 }
                    : { scale: [0.99, 1.01, 0.99], rotate: [0, -0.5, 0] }
                }
                transition={
                  phase === "arming"
                    ? { duration: 0.22 }
                    : phase === "burst"
                    ? { duration: 0.9, ease: "easeOut" }
                    : { duration: 3, repeat: Infinity }
                }
                onClick={phase === "idle" ? triggerBurst : undefined}
                style={{ cursor: phase === "idle" ? "pointer" : "default" }}
              >
                <defs>
                  <linearGradient id="hb" x1="0" x2="1">
                    <stop offset="0%" stopColor="#ffb7c6" />
                    <stop offset="50%" stopColor="#ff7da1" />
                    <stop offset="100%" stopColor="#ff547f" />
                  </linearGradient>
                </defs>
                <path
                  d={heartPath}
                  fill="url(#hb)"
                  stroke="#d94a76"
                  strokeWidth="0.6"
                  filter="drop-shadow(0 12px 24px rgba(255,91,134,0.28))"
                />
                <ellipse cx="82" cy="70" rx="36" ry="16" fill="rgba(255,255,255,.4)" />
              </motion.svg>
            )}
          </AnimatePresence>

          {/* Ghost outline (innovative “breathing” trace during epilogue/cta) */}
          {(phase === "epilogue" || phase === "cta") && (
            <motion.svg
              viewBox="0 0 200 200"
              className="absolute inset-0 w-full h-full pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.path
                d={heartPath}
                fill="none"
                stroke="rgba(255,99,132,0.45)"
                strokeWidth="1.8"
                strokeLinecap="round"
                style={{ filter: "drop-shadow(0 0 8px rgba(255,153,170,0.6))" }}
                animate={{ pathLength: [0.96, 1, 0.96] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.svg>
          )}

          {/* Gold ring at burst */}
          <AnimatePresence>
            {phase === "burst" && (
              <motion.div key="ring" className="absolute inset-0 grid place-items-center pointer-events-none">
                <motion.div
                  initial={{ scale: 0.85, opacity: 1 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  transition={{ duration: 1.1, ease: "easeOut" }}
                  style={{
                    width: "70%",
                    height: "70%",
                    borderRadius: 9999,
                    border: "2px solid rgba(255,213,120,0.9)",
                    boxShadow: "0 0 16px rgba(255,213,120,.7), inset 0 0 10px rgba(255,213,120,.5)",
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Petals */}
          <div className="absolute inset-0 pointer-events-none">
            {petals.map((p) => (
              <motion.div
                key={p.id}
                className="absolute"
                initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.6 }}
                animate={{ x: p.tx, y: p.ty, opacity: 0, rotate: p.rot, scale: p.scale }}
                transition={{ duration: p.life, ease: "easeOut" }}
                style={{ left: "50%", top: "50%", translateX: "-50%", translateY: "-50%" }}
              >
                <Petal tint={p.tint} />
              </motion.div>
            ))}
          </div>

          {/* Epilogue typing */}
          {phase === "epilogue" && (
            <TypeLine
              text={epilogue}
              msPerChar={EPILOGUE_MS_PER_CHAR}
              holdEnd={EPILOGUE_HOLD_END}
              onDone={() => setPhase("cta")}
            />
          )}

          {/* Keep epilogue visible briefly into CTA for a smooth handoff */}
          {phase === "cta" && (
            <>
              <FadeOutEpilogue text={epilogue} duration={EPILOGUE_LINGER_ON_CTA} />
              <div className="absolute -bottom-10 left-0 right-0 grid place-items-center gap-2">
                {whatsappHref && (
                  <a
                    href={whatsappHref}
                    className="px-5 py-2 rounded-full bg-white text-maroon font-semibold shadow hover:scale-[1.02] active:scale-[0.98] transition"
                  >
                    Continue the story
                  </a>
                )}
                <button
                  onClick={() => { setPetals([]); setPhase("idle"); }}
                  className="text-xs text-maroon/70 underline underline-offset-4"
                >
                  Replay finale
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* hint */}
      {phase === "idle" && (
        <div className="absolute bottom-10 left-0 right-0 text-center">
          <span className="inline-block px-4 py-2 rounded-full bg-white/95 text-maroon font-semibold shadow border border-maroon/10">
            Touch the heart
          </span>
        </div>
      )}
    </motion.div>
  );
}

/* tiny petal glyph */
function Petal({ tint }) {
  return (
    <div
      style={{
        width: 12,
        height: 16,
        background: `radial-gradient(80% 60% at 50% 40%, ${tint}, rgba(255,255,255,0.0))`,
        borderRadius: "70% 70% 60% 60% / 80% 80% 40% 40%",
        boxShadow: "0 0 8px rgba(255,182,193,.5)",
      }}
    />
  );
}

/* Typed line with natural pauses and completion callback */
function TypeLine({ text, msPerChar = 70, holdEnd = 1500, onDone }) {
  const [out, setOut] = useState("");
  const doneRef = useRef(onDone);
  useEffect(() => { doneRef.current = onDone; }, [onDone]);

  useEffect(() => {
    let i = 0;
    let cancelled = false;
    let tId = null;

    const step = () => {
      if (cancelled) return;
      setOut(text.slice(0, i + 1));

      let delay = msPerChar;
      const ch = text[i];
      if (ch === "," || ch === "—" || ch === "–") delay += 250;
      if (ch === "." || ch === "!" || ch === "?") delay += 500;
      if (ch === "\n") delay += 700;

      i++;
      if (i < text.length) {
        tId = setTimeout(step, delay);
      } else {
        tId = setTimeout(() => doneRef.current && doneRef.current(), holdEnd);
      }
    };

    tId = setTimeout(step, msPerChar);
    return () => { cancelled = true; if (tId) clearTimeout(tId); };
  }, [text, msPerChar, holdEnd]);

  return (
    <motion.div
      className="absolute inset-0 grid place-items-center text-center px-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="text-maroon text-base leading-relaxed [text-shadow:_0_1px_0_rgba(255,255,255,.9)]">
        {out}
        <span className="animate-pulse">▌</span>
      </div>
    </motion.div>
  );
}

/* Shows full epilogue then gently fades it out while CTA appears */
function FadeOutEpilogue({ text, duration = 1200 }) {
  return (
    <motion.div
      className="absolute inset-0 grid place-items-center text-center px-5 pointer-events-none"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: duration / 1000 }}
    >
      <div className="text-maroon text-base leading-relaxed [text-shadow:_0_1px_0_rgba(255,255,255,.9)]">
        {text}
      </div>
    </motion.div>
  );
}