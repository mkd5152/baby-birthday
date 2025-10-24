import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function IntroScene({ onFinish }) {
  const [line, setLine] = useState(0);

  const lines = [
    "You followed every clue...",
    "You listened to every heartbeat...",
    "Now, you’re inside",
    "The Heart of Us 💗",
  ];

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      i++;
      if (i < lines.length) setLine(i);
      else {
        clearInterval(timer);
        setTimeout(onFinish, 1000); // fade out to main scene
      }
    }, 1800);

    return () => clearInterval(timer);
  }, [onFinish, lines.length]);

  return (
    <AnimatePresence>
      <motion.div
        key="intro"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-gradient-to-b from-[#fff2f5] to-[#ffe3ec] text-maroon text-center"
        style={{ fontFamily: "Marcellus, serif" }}
      >
        <motion.div
          key={line}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.6 }}
          className="text-xl sm:text-3xl leading-relaxed"
        >
          {lines[line]}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}