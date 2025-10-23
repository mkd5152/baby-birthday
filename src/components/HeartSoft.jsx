import React, {
  useMemo,
  useRef,
  useState,
  useLayoutEffect,
  useEffect,
} from "react";
import { motion } from "framer-motion";
import Hotspot from "./Hotspot";
import NoteCard from "./NoteCard";
import FinalLetter from "./FinalLetter";
import { notes } from "../data/notes";
import useAudioOnce from "./hooks/useAudioOnce";
import usePrefersReducedMotion from "./hooks/usePrefersReducedMotion";

export default function HeartSoft() {
  const [selected, setSelected] = useState(null);
  const [visited, setVisited] = useState([]);
  const [showFinal, setShowFinal] = useState(false);
  const [pulseId, setPulseId] = useState(null);

  // finale unlock
  const [unlocked, setUnlocked] = useState(false);
  const [unlockStartedAt, setUnlockStartedAt] = useState(null);
  const unlockTimerRef = useRef(null);
  const progressTickRef = useRef(null);
  const [, forceTick] = useState(0);

  const { audioRef, allowAudio } = useAudioOnce();
  const prefersReduced = usePrefersReducedMotion();

  const UNLOCK_DELAY_MS = 6000;

  // anchors (0..200 viewBox)
  const baseAnchors = useMemo(
    () => [
      { id: 1, cx: 92, cy: 60 },
      { id: 2, cx: 134, cy: 84 },
      { id: 3, cx: 102, cy: 102 },
      { id: 4, cx: 74, cy: 114 },
      { id: 5, cx: 102, cy: 140 },
    ],
    []
  );

  const [anchors, setAnchors] = useState(baseAnchors);
  const pathRef = useRef(null);

  useLayoutEffect(() => {
    const path = pathRef.current; if (!path) return;

    const margin = 16;
    const len = path.getTotalLength();
    const step = Math.max(0.5, len / 700);

    const nearestOnPath = (x, y) => {
      let best = { d2: Infinity, p: null };
      for (let d = 0; d <= len; d += step) {
        const p = path.getPointAtLength(d);
        const dx = x - p.x, dy = y - p.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < best.d2) best = { d2, p };
      }
      return best;
    };

    const inset = (a) => {
      const { p } = nearestOnPath(a.cx, a.cy);
      const vx = a.cx - p.x, vy = a.cy - p.y;
      const dist = Math.hypot(vx, vy);
      if (dist < margin || dist === 0) {
        let nx = vx, ny = vy;
        if (dist === 0) { nx = a.cx - 100; ny = a.cy - 100; }
        const nlen = Math.hypot(nx, ny) || 1;
        const ux = nx / nlen, uy = ny / nlen;
        const push = margin - dist + 0.5;
        return { ...a, cx: a.cx + ux * push, cy: a.cy + uy * push };
      }
      return a;
    };

    // slight lift so top doesn’t feel empty
    let pts = baseAnchors.map(p => ({ ...p, cy: p.cy - 10 }));

    // separation
    const minSep = 26;
    for (let k = 0; k < 3; k++) {
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i], b = pts[j];
          const dx = b.cx - a.cx, dy = b.cy - a.cy;
          const d = Math.hypot(dx, dy) || 0.0001;
          if (d < minSep) {
            const push = (minSep - d) / 2;
            const ux = dx / d, uy = dy / d;
            a.cx -= ux * push; a.cy -= uy * push;
            b.cx += ux * push; b.cy += uy * push;
          }
        }
      }
      pts = pts.map(inset);
    }

    setAnchors(pts);
  }, [baseAnchors]);

  // smooth progress ring
  useEffect(() => {
    if (!unlocked || showFinal) return;
    progressTickRef.current = setInterval(() => {
      forceTick(t => t + 1);
    }, 100);
    return () => {
      if (progressTickRef.current) clearInterval(progressTickRef.current);
      progressTickRef.current = null;
    };
  }, [unlocked, showFinal]);

  useEffect(() => {
    return () => {
      if (unlockTimerRef.current) clearTimeout(unlockTimerRef.current);
      if (progressTickRef.current) clearInterval(progressTickRef.current);
    };
  }, []);

  // interactions
  function openNote(id) {
    allowAudio();

    setVisited(prev => {
      const v = prev.includes(id) ? prev : [...prev, id];

      if (!unlocked && v.length === notes.length) {
        setUnlocked(true);
        setUnlockStartedAt(Date.now());
        if (!unlockTimerRef.current) {
          unlockTimerRef.current = setTimeout(() => {
            setShowFinal(true);
            unlockTimerRef.current = null;
          }, UNLOCK_DELAY_MS);
        }
      }
      return v;
    });

    const note = notes.find(n => n.id === id);
    setSelected(note);
  }

  function openFinalNow() {
    if (unlockTimerRef.current) {
      clearTimeout(unlockTimerRef.current);
      unlockTimerRef.current = null;
    }
    setShowFinal(true);
  }

  function handleHeartClick() {
    if (unlocked && !selected) { openFinalNow(); return; }
    const next = notes.find(n => !visited.includes(n.id));
    if (next) openNote(next.id);
  }

  function handleCloseNote() { setSelected(null); }

  const nextUnseen = notes.find(n => !visited.includes(n.id));
  const visitedSorted = [...visited].sort((a, b) => a - b);
  const idToPoint = (id) => anchors.find(a => a.id === id);

  const pathD = visitedSorted.map((id, i) => {
    const p = idToPoint(id);
    return p ? `${i === 0 ? "M" : "L"} ${p.cx} ${p.cy}` : "";
  }).join(" ");

  function whisperHint() {
    const target = nextUnseen ?? notes[0];
    if (!target) return;
    const el = document.getElementById("heart-root");
    if (el?.scrollIntoView) el.scrollIntoView({ behavior: "smooth", block: "center" });
    setPulseId(target.id);
    setTimeout(() => setPulseId(null), 3200);
  }

  const pulsePoint = pulseId ? idToPoint(pulseId) : null;

  // progress math
  const circumference = 2 * Math.PI * 10; // r=10
  const progress =
    unlocked && unlockStartedAt
      ? Math.min(1, (Date.now() - unlockStartedAt) / UNLOCK_DELAY_MS)
      : 0;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <audio ref={audioRef} src={`${process.env.PUBLIC_URL}/music.mp3`} loop />

      {/* PANEL */}
      <div className="panel p-4 sm:p-6" id="heart-root">
        {/* Title */}
        <div className="mb-3 sm:mb-4">
          <div className="flex items-center justify-center gap-3">
            <span className="hidden sm:block h-px w-10 bg-gradient-to-r from-transparent via-rose/40 to-transparent" />
            <motion.h2
              className="text-center font-serif text-lg sm:text-2xl text-maroon"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{ textShadow: "0 1px 0 rgba(255,255,255,0.7), 0 6px 16px rgba(255,91,134,0.18)" }}
            >
              The Heart of Us
            </motion.h2>
            <span className="hidden sm:block h-px w-10 bg-gradient-to-l from-transparent via-rose/40 to-transparent" />
          </div>
          <div className="mt-1 flex justify-center">
            <motion.div
              className="h-[2px] w-20 rounded-full bg-gradient-to-r from-transparent via-maroon to-transparent"
              initial={{ opacity: 0.2 }}
              animate={{ opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Heart + HUD */}
        <div className="w-full aspect-square grid place-items-center relative overflow-hidden">
          {/* Progress HUD (tap to reopen after unlock) */}
          <button
            type="button"
            onClick={() => unlocked && openFinalNow()}
            className="absolute top-3 right-3 z-30 flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 backdrop-blur text-maroon text-sm font-semibold shadow hover:bg-white/95 active:scale-[0.98]"
            aria-label={unlocked ? "Open final letter" : "Progress"}
          >
            {visited.length}/{notes.length} memories
            <div className="relative w-6 h-6">
              <svg viewBox="0 0 24 24" className="absolute inset-0">
                <circle cx="12" cy="12" r="10" stroke="rgba(139,15,47,.25)" strokeWidth="2" fill="none" />
                {unlocked && (
                  <motion.circle
                    cx="12" cy="12" r="10"
                    stroke="rgb(139,15,47)"
                    strokeWidth="2.5"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - progress)}
                    strokeLinecap="round"
                    fill="none"
                  />
                )}
              </svg>
            </div>
          </button>

          {/* HEART */}
          <motion.svg
            viewBox="0 0 200 200"
            className="w-full h-full"
            onClick={handleHeartClick}
            initial={{ scale: 1 }}
            animate={prefersReduced ? {} : { scale: [1, 1.02, 1], rotate: [0, -1.2, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            role="img"
            aria-label="Glass heart with memories"
            style={{ cursor: "pointer" }}
          >
            <defs>
              <linearGradient id="hg" x1="0" x2="1">
                <stop offset="0%" stopColor="#ff9db4" />
                <stop offset="50%" stopColor="#ff5b86" />
                <stop offset="100%" stopColor="#ff2b63" />
              </linearGradient>
              <radialGradient id="spec" cx="0.3" cy="0.25" r="0.5">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
                <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
              </radialGradient>
              <clipPath id="heartClip">
                <path
                  ref={pathRef}
                  d="M100 28 C 78 2, 20 10, 28 60 C 36 110, 95 150, 100 160 C 105 150, 164 110, 172 60 C 180 10, 122 2, 100 28 Z"
                />
              </clipPath>
            </defs>

            {/* Heart shape */}
            <motion.path
              d="M100 28 C 78 2, 20 10, 28 60 C 36 110, 95 150, 100 160 C 105 150, 164 110, 172 60 C 180 10, 122 2, 100 28 Z"
              fill="url(#hg)"
              stroke="#d61d55"
              strokeWidth="0.6"
              filter="drop-shadow(0 16px 24px rgba(255,91,134,0.2))"
              animate={prefersReduced ? {} : { translateY: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 3.6, ease: "easeInOut" }}
            />
            <ellipse cx="80" cy="66" rx="34" ry="16" fill="url(#spec)" />
            <ellipse cx="126" cy="74" rx="14" ry="8" fill="rgba(255,255,255,.35)" />

            {/* Constellation + pearls */}
            <g clipPath="url(#heartClip)">
              {visitedSorted.length > 0 && (
                <motion.path
                  d={pathD}
                  fill="none"
                  stroke="rgba(255,255,255,0.95)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.9, ease: "easeInOut" }}
                  style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.6))" }}
                />
              )}

              {/* Ripple ping for hint */}
              {pulsePoint && (
                <>
                  {[0, 0.25, 0.5].map((delay, k) => (
                    <motion.circle
                      key={k}
                      cx={pulsePoint.cx}
                      cy={pulsePoint.cy}
                      r={14}
                      fill="none"
                      stroke="rgba(255,91,134,0.9)"
                      strokeWidth="2"
                      initial={{ scale: 1, opacity: 0.9 }}
                      animate={{ scale: 2.2, opacity: 0 }}
                      transition={{ duration: 1.0, ease: "easeOut", delay }}
                    />
                  ))}
                </>
              )}

              {anchors.map((a, i) => (
                <Hotspot
                  key={a.id}
                  cx={a.cx}
                  cy={a.cy}
                  index={i + 1}
                  visited={visited.includes(a.id)}
                  pulse={pulseId === a.id && !visited.includes(a.id)}
                  onClick={() => openNote(a.id)}
                />
              ))}
            </g>
          </motion.svg>
        </div>

        {/* *** MOBILE-FRIENDLY ACTION BAR (under the heart) *** */}
        {!selected && (
          <div className="mt-3 sm:mt-4">
            {!unlocked ? (
              <button
                className="w-full px-4 py-2 rounded-full bg-maroon text-white text-sm font-semibold shadow active:scale-[0.98]"
                onClick={whisperHint}
              >
                Follow the glow
              </button>
            ) : (
              <button
                className="w-full px-4 py-2 rounded-full bg-maroon text-white text-sm font-semibold shadow active:scale-[0.98]"
                onClick={openFinalNow}
              >
                Read the letter again
              </button>
            )}
          </div>
        )}

        {/* Docked note */}
        <div className="mt-5">
          {selected ? (
            <div className="panel p-4 rounded-xl bg-white/85 backdrop-blur">
              <NoteCard note={selected} onClose={handleCloseNote} />
              {!unlocked && (
                <div className="mt-3 flex justify-end">
                  <button
                    className="btn bg-maroon text-white"
                    onClick={whisperHint}
                    title="Make the next pearl glow"
                  >
                    Follow the glow
                  </button>
                </div>
              )}
              {unlocked && (
                <div className="mt-3 flex justify-end">
                  <button
                    className="btn bg-maroon text-white"
                    onClick={openFinalNow}
                    title="Open the final letter"
                  >
                    Read the letter again
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-sm text-gray-600">
              Tap a pearl — or tap the heart to open the next memory.
            </div>
          )}
        </div>
      </div>

      {showFinal && <FinalLetter onClose={() => setShowFinal(false)} />}
    </div>
  );
}