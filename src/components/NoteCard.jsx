import React from 'react';
import { motion } from 'framer-motion';

export default function NoteCard({ note, onClose }){
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="note-card p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-lg font-bold text-maroon">{note.title}</div>
          <div className="text-xs text-gray-500 mt-1">{note.subtitle}</div>
        </div>
        <button onClick={onClose} className="btn btn-light focus-ring">Close</button>
      </div>
      <p className="mt-4 text-base font-cursive text-ink">{note.text}</p>
    </motion.div>
  );
}