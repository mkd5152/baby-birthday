import React from "react";
import { motion } from "framer-motion";

export default function Particle({left, top}) {
  const x = (Math.random()-0.5) * 120;
  const dur = 2 + Math.random()*1.6;
  return (
    <motion.div style={{ position: "absolute", left, top, fontSize: 16, pointerEvents: "none" }}
      animate={{ y: -220 + (Math.random()*40), x, opacity: [1, 0] }}
      transition={{ duration: dur, ease: "easeOut" }}>
      <span style={{ color: "#ff5b86" }}>❤</span>
    </motion.div>
  );
}
