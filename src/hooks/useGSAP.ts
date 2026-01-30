import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Dynamically load GSAP only when needed
let gsapLoaded = false;

const loadGSAP = async () => {
  if (!gsapLoaded) {
    gsap.registerPlugin(ScrollTrigger);
    gsapLoaded = true;
  }
  return { gsap, ScrollTrigger };
};

export const useGSAP = (callback: (gsap: any, ScrollTrigger: any) => void, dependencies: any[] = []) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    let ctx: gsap.Context;
    
    const init = async () => {
      const { gsap, ScrollTrigger } = await loadGSAP();
      ctx = gsap.context(() => {
        callbackRef.current(gsap, ScrollTrigger);
      });
      
      return () => {
        ctx?.revert();
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      };
    };

    const cleanup = init();
    
    return () => {
      cleanup.then(cleanupFn => cleanupFn?.());
    };
  }, dependencies);
};
