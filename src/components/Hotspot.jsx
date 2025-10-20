import React from "react";
import { motion } from "framer-motion";

/**
 * High-contrast hotspot:
 * - Unvisited: rose core, WHITE number with DARK-ROSE outline + soft glow
 * - Visited: white core, ROSE number with WHITE outline + soft glow
 */
export default function Hotspot({ cx, cy, index, visited, onClick }) {
  const drift = visited ? 0.6 : 1.8;

  const coreFill   = visited ? "#ffffff" : "#ff5b86";
  const labelFill  = visited ? "#ff2b63" : "#ffffff";
  const strokeCol  = visited ? "#ffffff" : "#7a0e2a"; // outline around the numeral
  const rimStroke  = visited ? "rgba(255,91,134,0.45)" : "none";
  const haloColor  = visited ? "rgba(255,91,134,0.16)" : "rgba(255,91,134,0.35)";

  // unique filter id per hotspot (prevents collisions)
  const fid = `labelGlow-${index}`;

  return (
    <motion.g
      role="button"
      aria-label={visited ? `Memory ${index} (visited)` : `Open memory ${index}`}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      animate={{ x: [0, drift, 0, -drift, 0], y: [0, -drift, 0, drift, 0] }}
      transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
      style={{ cursor: "pointer" }}
    >
      <defs>
        {/* very soft outer glow for numerals */}
        <filter id={fid} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="0.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* halo */}
      <motion.circle
        cx={cx}
        cy={cy}
        r={14}
        fill={haloColor}
        animate={{ r: [14, 18, 14], opacity: [0.25, 0.4, 0.25] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* core */}
      <motion.circle
        cx={cx}
        cy={cy}
        r={12}
        fill={coreFill}
        stroke={rimStroke}
        strokeWidth={visited ? 2 : 0}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.96 }}
      />

      {/* specular */}
      <ellipse cx={cx - 4} cy={cy - 5} rx="5" ry="3" fill="rgba(255,255,255,0.6)" pointerEvents="none" />

      {/* numeral with outline + glow */}
      <text
        x={cx}
        y={cy + 4}
        textAnchor="middle"
        fontSize="12"
        fontWeight="900"
        fill={labelFill}
        style={{
          userSelect: "none",
          pointerEvents: "none",
          fontFamily: "Inter, system-ui, -apple-system",
          paintOrder: "stroke fill",           // draw stroke first, then fill
          stroke: strokeCol,                    // outline color
          strokeWidth: 1.2,                     // thin but visible outline
          filter: `url(#${fid})`,               // soft glow
          letterSpacing: "0.2px",
        }}
      >
        {index}
      </text>
    </motion.g>
  );
}