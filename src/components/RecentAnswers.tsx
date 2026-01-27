import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ResolvedItem {
  id: string;
  subject: string;
  question: string;
  answerText: string;
  answeredAt: string;
  mentorName: string | null;
  mentorSubject: string | null;
}

const RecentAnswers: React.FC = () => {
  const [items, setItems] = useState<ResolvedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await api.getPublicResolved();
        setItems(data as ResolvedItem[]);
      } catch (e: any) {
        setError(e.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    // Animate section heading
    gsap.from('.recent-answers-title', {
      scrollTrigger: {
        trigger: '#recent-answers',
        start: 'top 80%',
        once: true
      },
      duration: 1,
      opacity: 0,
      y: 40,
      ease: 'power3.out'
    });

    // Animate answer cards with stagger
    gsap.from('.answer-card', {
      scrollTrigger: {
        trigger: '#recent-answers',
        start: 'top 60%',
        once: true
      },
      duration: 0.8,
      opacity: 0,
      y: 60,
      stagger: 0.1,
      ease: 'power3.out'
    });

    // Add hover tilt effect to cards
    const cards = document.querySelectorAll('.answer-card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        gsap.to(this, {
          duration: 0.3,
          y: -10,
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          ease: 'power2.out'
        });
      });
      
      card.addEventListener('mouseleave', function() {
        gsap.to(this, {
          duration: 0.3,
          y: 0,
          boxShadow: '0 0px 0px rgba(0,0,0,0)',
          ease: 'power2.out'
        });
      });
    });

    // Add pointer tilt for richer interaction (desktop/touch safe)
    const answerCards = Array.from(document.querySelectorAll('.answer-card')) as HTMLElement[];
    const handlers: Array<() => void> = [];
    answerCards.forEach(card => {
      const handleMove = (ev: PointerEvent) => {
        const rect = card.getBoundingClientRect();
        const px = (ev.clientX - rect.left) / rect.width;
        const py = (ev.clientY - rect.top) / rect.height;
        const rotateY = (px - 0.5) * 8;
        const rotateX = (0.5 - py) * 6;
        gsap.to(card, { rotationY: rotateY, rotationX: rotateX, transformPerspective: 800, duration: 0.25, ease: 'power3.out' });
        gsap.to(card, { boxShadow: '0 30px 60px rgba(0,0,0,0.08)', duration: 0.25, ease: 'power3.out' });
      };

      const handleLeave = () => {
        gsap.to(card, { rotationY: 0, rotationX: 0, duration: 0.5, ease: 'elastic.out(1, 0.6)' });
        gsap.to(card, { boxShadow: '0 8px 20px rgba(0,0,0,0.04)', duration: 0.35, ease: 'power3.out' });
      };

      card.addEventListener('pointermove', handleMove);
      card.addEventListener('pointerleave', handleLeave);

      handlers.push(() => card.removeEventListener('pointermove', handleMove));
      handlers.push(() => card.removeEventListener('pointerleave', handleLeave));
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [items]);

  return (
    <section id="recent-answers" className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="recent-answers-title text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Recent Mentor Answers
          </h2>
        </div>
        
        {loading && <div className="text-sm text-muted-foreground">Loading…</div>}
        {error && <div className="text-sm text-destructive">{error}</div>}
        {!loading && !error && items.length === 0 && (
          <div className="text-sm text-muted-foreground">No answers yet. Ask a question to get started!</div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((it) => (
            <div key={it.id} className="answer-card border border-border rounded-lg p-6 bg-card hover:border-primary transition-colors cursor-pointer">
              <div className="text-xs text-muted-foreground mb-2 font-medium">
                {new Date(it.answeredAt || '').toLocaleString()}
              </div>
              <div className="font-semibold text-lg mb-2 text-foreground">
                <span className="answer-mentor">{it.mentorName ? `${it.mentorName}` : 'Mentor'}</span>
                {it.mentorSubject && <span className="text-primary ml-2">• {it.mentorSubject}</span>}
              </div>
              <div className="text-sm font-medium text-secondary mb-3">Subject: {it.subject}</div>
              <div className="text-sm mt-3 line-clamp-2 text-foreground font-medium" title={it.question}>
                <span className="text-primary">Q:</span> {it.question}
              </div>
              <div className="text-sm mt-3 line-clamp-3 text-secondary" title={it.answerText}>
                <span className="text-primary font-medium">A:</span> {it.answerText}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentAnswers;
