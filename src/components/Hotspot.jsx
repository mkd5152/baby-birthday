import React from "react";
import { motion } from "framer-motion";

/**
 * SVG-native hotspot (cx,cy in the SVG viewBox coordinate space).
 * Feels like a little glass pearl rather than a pasted badge.
 */
export default function Hotspot({ cx, cy, index, visited, onClick }) {
  const drift = visited ? 0.6 : 1.8;

  return (
    <motion.g
      role="button"
      aria-label={visited ? `Memory ${index} (visited)` : `Open memory ${index}`}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      animate={{ x: [0, drift, 0, -drift, 0], y: [0, -drift, 0, drift, 0] }}
      transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
      style={{ cursor: "pointer" }}
    >
      {/* soft glow ring */}
      <motion.circle
        cx={cx}
        cy={cy}
        r={14}
        fill="rgba(255,91,134,0.18)"
        animate={{ r: [14, 18, 14], opacity: [0.22, 0.35, 0.22] }}
        transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* pearl base */}
      <circle cx={cx} cy={cy} r={12} fill="#fff" />
      {/* subtle rim to match heart chroma */}
      <circle
        cx={cx}
        cy={cy}
        r={12.5}
        fill="none"
        stroke={visited ? "rgba(255,91,134,0.45)" : "rgba(255,91,134,0.28)"}
        strokeWidth="1.5"
      />
      {/* specular highlight */}
      <ellipse cx={cx - 4} cy={cy - 5} rx="5" ry="3" fill="rgba(255,255,255,0.65)" />
      {/* label */}
      <text
        x={cx}
        y={cy + 4}
        textAnchor="middle"
        fontSize="10"
        fontWeight="800"
        fill="#ff4b7a"
        style={{ userSelect: "none", pointerEvents: "none", fontFamily: "Inter, system-ui, -apple-system" }}
      >
        {index}
      </text>
    </motion.g>
  );
}