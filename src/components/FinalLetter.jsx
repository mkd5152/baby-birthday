import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Particle from "./Particle";

export default function FinalLetter({ onClose }) {
  const fullText = `My Dearest Jaan,

Happy Birthday. Today I send you my whole heart in sounds and soft light.

From our first messages that Christmas — when I realised in three days that life had changed — to the quiet of Haj where your hand steadied me, you have been my miracle.

The storm hasn’t passed, but we keep walking — hand in hand, hearts steady in the rain. Your quiet faith shelters us more than you know, and I will never stop holding on with you.

Your laugh, the way you ask 'are you okay?', your small, perfect gestures—these are the pieces of you I carry. They make my ordinary days sacred.

I promise to build the life you deserve: a home full of warmth, a family with love, and all the little proofs of care you want. When you come back to Dubai, there will be a small golden thing waiting for you — but the real gift is the life I promise to give.

You are my forever, my home, my heart.

Always yours,
Moiz`;

  const [display, setDisplay] = useState("");
  const [particles, setParticles] = useState([]);
  const scrollerRef = useRef(null);

  // typewriter + particles
  useEffect(() => {
    // Guard so this runs only once even under React.StrictMode
    const startedRef = { current: false };
    if (startedRef.current) return;
    startedRef.current = true;

    let i = 0;
    const speed = 18;                  // ms per step
    const total = fullText.length;

    const interval = setInterval(() => {
      // slice is safe: never adds "undefined"
      setDisplay(fullText.slice(0, i + 1));

      // keep caret in view
      if (scrollerRef.current) {
        scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
      }

      i++;
      if (i >= total) {
        clearInterval(interval);
      }
    }, speed);

    // particles (unchanged, but keep it inside this effect)
    const pInt = setInterval(() => {
      setParticles(prev => {
        const next = [
          ...prev,
          { id: Math.random(), left: `${10 + Math.random() * 80}%`, top: `${70 + Math.random() * 10}%` },
        ];
        return next.length > 80 ? next.slice(-80) : next;
      });
    }, 180);

    return () => {
      clearInterval(interval);
      clearInterval(pInt);
    };
  }, []); // <-- keep deps empty

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-black/60 p-4 sm:p-6"
      style={{
        // respect iPhone safe areas
        paddingTop: "max(1rem, env(safe-area-inset-top))",
        paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
      }}
    >
      <motion.div
        initial={{ scale: 0.98 }}
        animate={{ scale: 1 }}
        className="mx-auto relative w-full max-w-3xl panel rounded-2xl flex flex-col"
        style={{
          // keep the whole panel inside the viewport on mobile
          maxHeight: "calc(100dvh - 2rem)",
          overflow: "hidden",
        }}
      >
        {/* Sticky header with always-visible Close */}
        <div className="sticky top-0 z-10 bg-parchment/95 backdrop-blur-sm border-b border-black/5 px-6 py-4 rounded-t-2xl flex items-center">
          <h3 className="text-lg sm:text-2xl font-bold text-maroon">
            A Letter — just for you
          </h3>
          <button
            onClick={onClose}
            className="ml-auto inline-flex items-center justify-center w-9 h-9 rounded-full bg-maroon text-white"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Scrollable content */}
        <div
          ref={scrollerRef}
          className="flex-1 overflow-auto px-6 pb-6"
          style={{
            // ensure last lines aren't hidden behind iOS home bar
            paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))",
          }}
        >
          <div
            className="final-letter whitespace-pre-wrap p-4 bg-white/70 rounded-lg shadow-inner"
            style={{ minHeight: 240 }}
          >
            {display}
          </div>
        </div>

        {/* Non-blocking particles */}
        <div className="pointer-events-none absolute inset-0">
          {particles.map((p) => (
            <Particle key={p.id} left={p.left} top={p.top} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}