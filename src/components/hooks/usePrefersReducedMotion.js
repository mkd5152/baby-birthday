import { useEffect, useState } from 'react';
export default function usePrefersReducedMotion(){
  const [prefers, setPrefers] = useState(false);
  useEffect(()=>{
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setPrefers(!!m.matches);
    on(); m.addEventListener?.('change', on); return ()=> m.removeEventListener?.('change', on);
  },[]);
  return prefers;
}