import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Particle from "./Particle";

export default function FinalLetter({onClose}) {
  const fullText = `My Dearest Jaan,

Happy Birthday. Today I send you my whole heart in sounds and soft light.

From our first messages that Christmas — when I realised in three days that life had changed — to the quiet of Haj where your hand steadied me, you have been my miracle.

We walked through a storm and learned to stand beside one another when everything felt uncertain. Your strength and your quiet faith were the shelter I needed. I will always remember how you never stopped holding on.

Your laugh, the way you ask 'are you okay?', your small, perfect gestures—these are the pieces of you I carry. They make my ordinary days sacred.

I promise to build the life you deserve: a home full of warmth, a family with love, and all the little proofs of care you want. When you come back to Dubai, there will be a small golden thing waiting for you — but the real gift is the life I promise to give.

You are my forever, my home, my heart.

Always yours,
Moiz`;

  const [display, setDisplay] = useState("");
  const [particles, setParticles] = useState([]);

  useEffect(()=>{
    let i = 0;
    const interval = setInterval(()=>{
      setDisplay(prev => prev + fullText[i]);
      i++;
      if(i >= fullText.length) clearInterval(interval);
    }, 18); // adjust speed
    const pInt = setInterval(()=> {
      setParticles(prev => [...prev, { id: Math.random(), left: `${10 + Math.random()*80}%`, top: `${70 + Math.random()*10}%` }]);
      if(particles.length > 80) setParticles([]);
    }, 180);
    return ()=> { clearInterval(interval); clearInterval(pInt); };
    // eslint-disable-next-line
  }, []);

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60">
      <motion.div initial={{ scale:0.95 }} animate={{ scale:1 }} className="bg-parchment panel p-6 rounded-2xl max-w-3xl w-full relative">
        <h3 className="text-2xl font-bold text-maroon mb-3">A Letter — just for you</h3>
        <div className="final-letter whitespace-pre-wrap p-4 bg-white/60 rounded-lg shadow-inner" style={{ minHeight: 240 }}>
          {display}
        </div>
        <div className="mt-4 flex justify-end gap-3">
          <button onClick={onClose} className="btn bg-maroon text-white px-4 py-2 rounded-md">Close</button>
        </div>

        {particles.map(p => <Particle key={p.id} left={p.left} top={p.top} />)}
      </motion.div>
    </motion.div>
  );
}
