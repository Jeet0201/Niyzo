import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [typingDone, setTypingDone] = useState(false);
  const fullText = 'Proof, Not Promises.';

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setShowCursor(false);
        setTypingDone(true);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, []);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 750);

    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    if (!typingDone) return;

    // GSAP refined timeline that runs after typing completes
    const timeline = gsap.timeline();

    // Animate title with subtle scale and lift
    timeline.from('.hero-title', {
      duration: 0.9,
      opacity: 0,
      y: 30,
      scale: 0.98,
      ease: 'power3.out'
    }, 0);

    // Animate subtitle with slight stagger
    timeline.from('.hero-subtitle', {
      duration: 0.85,
      opacity: 0,
      y: 22,
      ease: 'power3.out'
    }, 0.18);

    // Animate button with a pop
    timeline.from('.hero-button', {
      duration: 0.7,
      opacity: 0,
      scale: 0.9,
      ease: 'back.out(1.6)'
    }, 0.42);

    // Floating animation for scroll indicator
    gsap.to('.scroll-indicator', {
      duration: 1.5,
      y: 10,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    // Parallax effect on scroll (subtle)
    gsap.to('.hero-title', {
      scrollTrigger: {
        trigger: '#home',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6,
        markers: false
      },
      y: 90,
      opacity: 0.35,
      ease: 'none'
    });

    gsap.to('.hero-subtitle', {
      scrollTrigger: {
        trigger: '#home',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6,
        markers: false
      },
      y: 45,
      opacity: 0.55,
      ease: 'none'
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [typingDone]);

  // Cursor follower and hero blob parallax
  useEffect(() => {
    const follower = cursorRef.current;
    const heroEl = heroRef.current;
    if (!follower || !heroEl) return;

    // Disable on touch devices
    if (('ontouchstart' in window) || window.matchMedia('(hover: none)').matches) return;

    let active = true;

    const setPos = (x: number, y: number, ease = 0.35) => {
      gsap.to(follower, { x: x - 24, y: y - 24, duration: ease, ease: 'power3.out' });
    };

    const onMove = (ev: PointerEvent) => {
      setPos(ev.clientX, ev.clientY, 0.35);

      // parallax blobs
      const blobs = heroEl.querySelectorAll('.hero-blob');
      blobs.forEach((b, i) => {
        const depth = (i + 1) * 6; // different movement per blob
        const bx = (ev.clientX / window.innerWidth - 0.5) * depth;
        const by = (ev.clientY / window.innerHeight - 0.5) * depth;
        gsap.to(b, { x: bx, y: by, duration: 0.6, ease: 'power3.out' });
      });
    };

    const onEnterInteractive = () => {
      gsap.to(follower, { scale: 1.8, background: 'radial-gradient(circle at 30% 30%, rgba(67,56,202,0.18), rgba(67,56,202,0.06))', duration: 0.25, ease: 'power2.out' });
    };

    const onLeaveInteractive = () => {
      gsap.to(follower, { scale: 1, background: 'radial-gradient(circle at 30% 30%, rgba(67,56,202,0.1), rgba(0,0,0,0))', duration: 0.35, ease: 'power2.out' });
    };

    window.addEventListener('pointermove', onMove);

    // Enlarge follower when hovering interactive elements
    const interactiveSelectors = 'button, a, .btn-hero, .mentor-card, .answer-card, input, .kb-item button';
    const interactiveEls = Array.from(document.querySelectorAll(interactiveSelectors));
    interactiveEls.forEach(el => {
      el.addEventListener('pointerenter', onEnterInteractive);
      el.addEventListener('pointerleave', onLeaveInteractive);
    });

    return () => {
      active = false;
      window.removeEventListener('pointermove', onMove);
      interactiveEls.forEach(el => {
        el.removeEventListener('pointerenter', onEnterInteractive);
        el.removeEventListener('pointerleave', onLeaveInteractive);
      });
      gsap.killTweensOf(follower);
    };
  }, [typingDone]);

  const scrollToNext = () => {
    const nextSection = document.getElementById('how-it-works');
    nextSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToQuestionForm = () => {
    const questionSection = document.getElementById('ask-question');
    questionSection?.scrollIntoView({ behavior: 'smooth' });
  };

  // Cursor follower ref
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);

  return (
    <section id="home" ref={heroRef as any} className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Decorative layered blobs for parallax */}
      <div className="hero-blob hero-blob-1" aria-hidden />
      <div className="hero-blob hero-blob-2" aria-hidden />
      <div className="hero-blob hero-blob-3" aria-hidden />

      {/* Cursor follower */}
      <div id="cursor-follower" ref={cursorRef} className="cursor-follower" aria-hidden />

      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="hero-title text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6">
            {displayText}
            {showCursor && <span className="text-primary">|</span>}
          </h1>
          
          <p className="hero-subtitle text-xl sm:text-2xl text-secondary mb-8">
            Verified learning powered by real professors.
          </p>
          
          <div className="hero-button inline-block">
            <button 
              onClick={scrollToQuestionForm}
              className="btn-hero"
            >
              Join Pilot
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 scroll-indicator">
        <button 
          onClick={scrollToNext}
          className="text-secondary hover:text-primary transition-colors duration-300"
        >
          <ChevronDown size={32} />
        </button>
      </div>
    </section>
  );
};

export default Hero;