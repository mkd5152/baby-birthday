import { useEffect, useRef, useState } from 'react';

export default function useAudioOnce(){
  const ref = useRef(null);
  const [allowed, setAllowed] = useState(false);

  useEffect(()=>{
    if(ref.current){
      const p = ref.current.play();
      p?.catch(()=>{ /* autoplay will be blocked until interaction */ });
    }
  },[]);

  const allowAudio = ()=>{
    if(ref.current && !allowed){
      ref.current.play()?.catch(()=>{});
      setAllowed(true);
    }
  };

  return { audioRef: ref, allowAudio };
}