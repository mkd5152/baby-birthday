import React from "react";
import { motion } from "framer-motion";

export default function NoteCard({note, onClose}) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity:1, y:0 }} className="note-card">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-lg font-bold text-maroon">{note.title}</div>
          <div className="text-xs text-gray-500 mt-1">{note.subtitle}</div>
        </div>
        <button onClick={onClose} className="btn ml-3 bg-white text-maroon border border-maroon/10">
          Close
        </button>
      </div>
      <p className="mt-4 text-base">{note.text}</p>

      <div className="mt-4 flex gap-2">
        <button className="btn bg-white text-maroon border border-maroon/10 px-3 py-2">Save</button>
        <button className="btn bg-maroon text-white px-3 py-2">Keep reading</button>
      </div>
    </motion.div>
  );
}
