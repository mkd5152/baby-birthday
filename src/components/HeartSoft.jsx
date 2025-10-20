import React, { useMemo, useRef, useState, useLayoutEffect } from "react";
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
  const { audioRef, allowAudio } = useAudioOnce();
  const prefersReduced = usePrefersReducedMotion();

  // Initial anchors (viewBox space 0..200)
  const baseAnchors = useMemo(
    () => [
      { id: 1, cx: 92,  cy: 60 },
      { id: 2, cx: 134, cy: 84 },
      { id: 3, cx: 102, cy: 102 },
      { id: 4, cx: 74,  cy: 114 },
      { id: 5, cx: 102, cy: 140 },
    ],
    []
  );

  const [anchors, setAnchors] = useState(baseAnchors);
  const pathRef = useRef(null);

  useLayoutEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const margin = 16;
    const len = path.getTotalLength();
    const step = Math.max(0.5, len / 700);

    function nearestOnPath(x, y) {
      let best = { d2: Infinity, p: null };
      for (let d = 0; d <= len; d += step) {
        const p = path.getPointAtLength(d);
        const dx = x - p.x, dy = y - p.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < best.d2) best = { d2, p };
      }
      return best;
    }

    function adjustPoint(a) {
      const { p } = nearestOnPath(a.cx, a.cy);
      const vx = a.cx - p.x;
      const vy = a.cy - p.y;
      const dist = Math.hypot(vx, vy);
      if (dist < margin || dist === 0) {
        let nx = vx, ny = vy;
        if (dist === 0) { nx = a.cx - 100; ny = a.cy - 100; }
        const nlen = Math.hypot(nx, ny) || 1;
        const ux = nx / nlen, uy = ny / nlen;
        const needed = margin - dist + 0.5;
        return { ...a, cx: a.cx + ux * needed, cy: a.cy + uy * needed };
      }
      return a;
    }

    let pts = baseAnchors.map(adjustPoint);

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
      pts = pts.map(adjustPoint);
    }

    // ✅ Shift all dots slightly upward (adjust this offset to taste)
    const yOffset = -10; // move up by 10 units
    pts = pts.map(p => ({ ...p, cy: p.cy + yOffset }));

    setAnchors(pts);
  }, [baseAnchors]);

  function openNote(id) {
    allowAudio();
    const note = notes.find(n => n.id === id);
    setSelected(note);
    setVisited(prev => (prev.includes(id) ? prev : [...prev, id]));
    const nextCount = visited.includes(id) ? visited.length : visited.length + 1;
    if (nextCount === notes.length) setTimeout(() => setShowFinal(true), 600);
  }

  function handleHeartClick() {
    const next = notes.find(n => !visited.includes(n.id));
    if (next) openNote(next.id);
    else setShowFinal(true);
  }

  return (
    <div className="w-full max-w-6xl mx-auto grid md:grid-cols-[1.1fr_.9fr] gap-8 items-start">
      <audio ref={audioRef} src="/music.mp3" loop />
      <div className="relative panel p-6">
        <div className="w-full aspect-square grid place-items-center">
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
                <stop offset="60%" stopColor="#ffffff" stopOpacity="0.0" />
              </radialGradient>
              <filter id="innerShadow" x="-50%" y="-50%" width="200%" height="200%">
                <feOffset dx="0" dy="2" />
                <feGaussianBlur stdDeviation="3" result="offset-blur" />
                <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
                <feFlood floodColor="#b0123f" floodOpacity="0.25" result="color" />
                <feComposite operator="in" in="color" in2="inverse" result="shadow" />
                <feComposite operator="over" in="shadow" in2="SourceGraphic" />
              </filter>
              <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="16" stdDeviation="16" floodColor="#ff2b63" floodOpacity="0.18" />
              </filter>
              <filter id="noise" x="-20%" y="-20%" width="140%" height="140%">
                <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch" />
                <feColorMatrix type="saturate" values="0" />
                <feComponentTransfer>
                  <feFuncA type="table" tableValues="0 0 0.04 0" />
                </feComponentTransfer>
              </filter>

              <clipPath id="heartClip">
                <path
                  ref={pathRef}
                  d="M100 28 C 78 2, 20 10, 28 60 C 36 110, 95 150, 100 160 C 105 150, 164 110, 172 60 C 180 10, 122 2, 100 28 Z"
                />
              </clipPath>
            </defs>

            <g filter="url(#shadow)">
              <motion.path
                d="M100 28 C 78 2, 20 10, 28 60 C 36 110, 95 150, 100 160 C 105 150, 164 110, 172 60 C 180 10, 122 2, 100 28 Z"
                fill="url(#hg)"
                stroke="#d61d55"
                strokeWidth="0.6"
                filter="url(#innerShadow)"
                animate={prefersReduced ? {} : { translateY: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 3.6, ease: "easeInOut" }}
              />
              <ellipse cx="80" cy="66" rx="34" ry="16" fill="url(#spec)" />
              <ellipse cx="126" cy="74" rx="14" ry="8" fill="rgba(255,255,255,.35)" />
              <g filter="url(#noise)">
                <path d="M0 0h200v200H0z" fill="#fff" opacity="0.08" />
              </g>
            </g>

            <g clipPath="url(#heartClip)">
              {anchors.map((a, i) => (
                <Hotspot
                  key={a.id}
                  cx={a.cx}
                  cy={a.cy}
                  index={i + 1}
                  visited={visited.includes(a.id)}
                  onClick={() => openNote(a.id)}
                />
              ))}
            </g>
          </motion.svg>
        </div>

        <div className="mt-3 text-center text-sm text-gray-600">
          Click a dot — or tap the heart to open the next memory.
        </div>
      </div>

      <div className="w-full panel p-6">
        {selected ? (
          <NoteCard note={selected} onClose={() => setSelected(null)} />
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-maroon">The Heart of Us</h2>
            <p className="mt-2 text-gray-700">
              Each pearl holds a memory. Visit them all to unlock the final letter.
            </p>
            <div className="mt-5 grid gap-2">
              {notes.map((n) => (
                <button
                  key={n.id}
                  onClick={() => openNote(n.id)}
                  className="panel p-3 rounded-md text-left hover:scale-[1.015] transition focus-ring"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-maroon">{n.title}</div>
                      <div className="text-xs text-gray-500">{n.subtitle}</div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {visited.includes(n.id) ? "Seen" : "Open"}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {showFinal && <FinalLetter onClose={() => setShowFinal(false)} />}
    </div>
  );
}