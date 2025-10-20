import React, { useEffect, useRef } from 'react';

export default function Signature(){
  const ref = useRef(null);
  useEffect(()=>{
    const path = ref.current; if(!path) return;
    const len = path.getTotalLength();
    path.style.strokeDasharray = len; path.style.strokeDashoffset = len;
    requestAnimationFrame(()=>{ path.style.transition = 'stroke-dashoffset 2.8s ease'; path.style.strokeDashoffset = '0'; });
  },[]);

  return (
    <svg viewBox="0 0 300 80" className="w-48 h-12">
      <path ref={ref} d="M10 50 C 40 20, 80 20, 110 50 S 170 80, 200 40 C 230 10, 270 20, 290 50" fill="none" stroke="#8b0f2f" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
}