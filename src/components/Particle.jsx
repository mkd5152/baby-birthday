import React from 'react';
import { motion } from 'framer-motion';

export default function Particle({ left, top, type='heart' }){
  const driftX = (Math.random()-0.5) * 120;
  const dur = 2 + Math.random() * 1.6;
  const content = type === 'confetti' ? '✦' : '❤';
  return (
    <motion.div style={{ position: 'absolute', left, top, fontSize: 14, pointerEvents: 'none' }}
      animate={{ y: -220 + (Math.random()*40), x: driftX, opacity: [1, 0] }}
      transition={{ duration: dur, ease: 'easeOut' }}>
      <span>{content}</span>
    </motion.div>
  );
}