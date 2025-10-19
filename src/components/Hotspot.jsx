import React from "react";
import { motion } from "framer-motion";

export default function Hotspot({x, y, index, visited, onClick}) {
  // x,y are percentage strings like "50%" relative to svg container
  return (
    <motion.div
      className="hotspot"
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
        pointerEvents: "auto",
        zIndex: 30
      }}
      whileHover={{ scale: 1.18 }}
      whileTap={{ scale: 0.98 }}
      onClick={(e)=> { e.stopPropagation(); onClick(); }}
    >
      <div className={`w-9 h-9 rounded-full flex items-center justify-center ${visited ? "bg-white text-rose ring-2 ring-rose/30" : "bg-rose text-white shadow-lg"}`}>
        <span className="text-sm font-semibold">{index}</span>
      </div>
    </motion.div>
  );
}
