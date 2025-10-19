import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Hotspot from "./Hotspot";
import NoteCard from "./NoteCard";
import FinalLetter from "./FinalLetter";
import { notes } from "../data/notes";

export default function HeartSoft(){
  const [selected, setSelected] = useState(null);
  const [visited, setVisited] = useState([]);
  const [showFinal, setShowFinal] = useState(false);
  const audioRef = useRef(null);
  const [audioAllowed, setAudioAllowed] = useState(false);

  // attempt to autoplay once; will usually be blocked until interaction
  useEffect(()=> {
    if(audioRef.current){
      const p = audioRef.current.play();
      if(p && typeof p.then === "function") p.catch(()=>{/*blocked*/});
    }
  }, []);

  const hotspots = [
    // coordinates are relative to container; tuned to the SVG path visually
    { id: 1, x: "48%", y: "22%" },
    { id: 2, x: "64%", y: "36%" },
    { id: 3, x: "52%", y: "48%" },
    { id: 4, x: "38%", y: "52%" },
    { id: 5, x: "60%", y: "68%" }
  ];

  function openNote(id){
    // play audio on first user click
    if(audioRef.current && !audioAllowed){
      audioRef.current.play().catch(()=>{});
      setAudioAllowed(true);
    }
    const note = notes.find(n => n.id === id);
    setSelected(note);
    setVisited(prev => prev.includes(id) ? prev : [...prev, id]);
    if(visited.length + 1 === notes.length){
      // reveal final after small delay
      setTimeout(()=> setShowFinal(true), 700);
    }
  }

  function handleHeartClick(){
    // open next unseen
    const next = notes.find(n => !visited.includes(n.id));
    if(next) openNote(next.id);
    else setShowFinal(true);
  }

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-8 items-start">
      <audio ref={audioRef} src="/music.mp3" loop />

      <div className="heart-wrap panel p-6">
        {/* realistic heart svg (soft gradients + subtle shadow) */}
        <motion.svg
          viewBox="0 0 200 200"
          style={{ width: "min(520px, 70vw)", height: "min(520px, 70vw)", cursor: "pointer" }}
          onClick={handleHeartClick}
          initial={{ scale: 0.99 }}
          animate={{ scale: [1, 1.02, 1], rotate: [0, -1.5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <defs>
            <linearGradient id="hg" x1="0" x2="1">
              <stop offset="0%" stopColor="#ff9db4"/>
              <stop offset="50%" stopColor="#ff5b86"/>
              <stop offset="100%" stopColor="#ff2b63"/>
            </linearGradient>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="18" stdDeviation="20" floodColor="#ff2b63" floodOpacity="0.12"/>
            </filter>
          </defs>

          <motion.path
            d="M100 28 C 78 2, 20 10, 28 60 C 36 110, 95 150, 100 160 C 105 150, 164 110, 172 60 C 180 10, 122 2, 100 28 Z"
            fill="url(#hg)"
            stroke="#d61d55"
            strokeWidth="0.6"
            filter="url(#shadow)"
            initial={{ pathLength: 1 }}
            animate={{ translateY: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 3.6, ease: "easeInOut" }}
          />
          {/* soft light overlay */}
          <motion.ellipse cx="85" cy="65" rx="36" ry="18" fill="rgba(255,255,255,0.08)" />
          <motion.ellipse cx="124" cy="72" rx="18" ry="9" fill="rgba(255,255,255,0.06)" />
        </motion.svg>

        {/* Hotspots placed absolutely over the svg container */}
        <div className="absolute inset-0 pointer-events-none">
          {hotspots.map((hs, idx)=> (
            <Hotspot
              key={hs.id}
              x={hs.x}
              y={hs.y}
              index={idx+1}
              visited={visited.includes(hs.id)}
              onClick={() => openNote(hs.id)}
            />
          ))}
        </div>

        <div className="mt-3 text-center text-sm text-gray-600">Click any glowing dot — or tap the heart to open next.</div>
      </div>

      {/* right-side panel with notes list or selected note */}
      <div className="w-full md:w-1/2 panel p-6">
        {selected ? (
          <NoteCard note={selected} onClose={()=> setSelected(null)} />
        ) : (
          <div className="fade-in">
            <h2 className="text-2xl font-bold text-maroon">The Heart of Us</h2>
            <p className="mt-3 text-gray-700">Explore the dots — each is a memory, a small secret, a little piece of my heart. Visit them all and I’ll unfold everything for you.</p>

            <div className="mt-6 grid grid-cols-1 gap-3">
              {notes.map(n => (
                <button key={n.id} onClick={()=> openNote(n.id)} className="text-left panel p-3 rounded-md hover:scale-[1.02] transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-maroon">{n.title}</div>
                      <div className="text-xs text-gray-500">{n.subtitle}</div>
                    </div>
                    <div className="text-sm text-gray-400">{visited.includes(n.id) ? "Seen" : "Open"}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={handleHeartClick} className="btn bg-maroon text-white px-4 py-2 rounded-md">Open next realm</button>
              <button onClick={()=>{
                setVisited(notes.map(n=>n.id));
                setTimeout(()=> setShowFinal(true), 600);
              }} className="btn bg-white text-maroon border border-maroon/10 px-4 py-2 rounded-md">Reveal everything</button>
            </div>
          </div>
        )}
      </div>

      {showFinal && <FinalLetter onClose={() => setShowFinal(false)} />}
    </div>
  );
}
