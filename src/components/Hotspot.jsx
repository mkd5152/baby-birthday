import React from "react";
import { motion } from "framer-motion";

/** Pearl with high-contrast numerals.
 *  - Unvisited: rose core, white number with dark outline
 *  - Visited:   white core, rose number with white outline
 *  - Pulse:     stronger halo to “hint” the next step
 */
export default function Hotspot({ cx, cy, index, visited, onClick, pulse = false }) {
  const drift = visited ? 0.6 : 1.4;

  const coreFill  = visited ? "#ffffff" : "#ff5b86";
  const labelFill = visited ? "#ff2b63" : "#ffffff";
  const strokeCol = visited ? "#ffffff" : "#7a0e2a";
  const rimStroke = visited ? "rgba(255,91,134,0.45)" : "none";
  const haloColor = pulse ? "rgba(255,91,134,0.55)" : (visited ? "rgba(255,91,134,0.16)" : "rgba(255,91,134,0.35)");

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
        animate={ pulse
          ? { r: [14, 22, 14], opacity: [0.35, 0.55, 0.35] }
          : { r: [14, 18, 14], opacity: [0.25, 0.4, 0.25] } }
        transition={{ duration: pulse ? 1.2 : 1.8, repeat: Infinity, ease: "easeInOut" }}
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

      {/* numeral */}
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
          paintOrder: "stroke fill",
          stroke: strokeCol,
          strokeWidth: 1.2,
          filter: `url(#${fid})`,
          letterSpacing: "0.2px",
        }}
      >
        {index}
      </text>
    </motion.g>
  );
}