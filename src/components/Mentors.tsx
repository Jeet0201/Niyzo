import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Professor {
  id: string;
  name: string;
  subject: string;
  initials: string;
  status: string;
  university: string;
}

const Mentors = () => {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMentors = async () => {
      try {
        const mentors = await api.getPublicMentors();
        setProfessors((mentors as any[]).map((m) => ({
          id: m._id || m.id,
          name: m.name,
          subject: m.subject,
          initials: m.initials || m.name.split(' ').map((w: string) => w[0]).join('').toUpperCase(),
          status: m.status || 'Available',
          university: m.university || 'University'
        })));
      } catch (error) {
        console.error('Failed to load mentors:', error);
      } finally {
        setLoading(false);
      }
    };
    loadMentors();
  }, []);

  useEffect(() => {
    // Animate mentors heading
    gsap.from('.mentors-heading', {
      scrollTrigger: {
        trigger: '#mentors',
        start: 'top 80%',
        once: true
      },
      duration: 1,
      opacity: 0,
      y: 40,
      ease: 'power3.out'
    });

    // Animate mentor cards
    gsap.from('.mentor-card', {
      scrollTrigger: {
        trigger: '#mentors',
        start: 'top 60%',
        once: true
      },
      duration: 0.8,
      opacity: 0,
      y: 50,
      stagger: 0.15,
      ease: 'power3.out'
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [professors]);

  useEffect(() => {
    if (!professors || professors.length === 0) return;

    const cards = Array.from(document.querySelectorAll('.mentor-card')) as HTMLElement[];
    const listeners: Array<() => void> = [];

    cards.forEach(card => {
      const inner = card.querySelector('.mentor-card-inner') as HTMLElement | null;
      if (!inner) return;

      const handlePointerMove = (ev: PointerEvent) => {
        const rect = card.getBoundingClientRect();
        const px = (ev.clientX - rect.left) / rect.width; // 0..1
        const py = (ev.clientY - rect.top) / rect.height; // 0..1
        const rotateY = (px - 0.5) * 14; // -7 .. 7
        const rotateX = (0.5 - py) * 10; // -5 .. 5
        const translateZ = 12;

        gsap.to(inner, { rotationY: rotateY, rotationX: rotateX, z: translateZ, duration: 0.35, ease: 'power3.out' });
        gsap.to(card, { boxShadow: '0 40px 80px rgba(15,23,42,0.12)', duration: 0.35, ease: 'power3.out' });
      };

      const handlePointerLeave = () => {
        gsap.to(inner, { rotationY: 0, rotationX: 0, z: 0, duration: 0.6, ease: 'elastic.out(1, 0.6)' });
        gsap.to(card, { boxShadow: '0 16px 32px rgba(15,23,42,0.06)', duration: 0.45, ease: 'power3.out' });
      };

      const handlePointerEnter = () => {
        gsap.to(inner, { scale: 1.01, duration: 0.3, ease: 'power2.out' });
      };

      card.addEventListener('pointermove', handlePointerMove);
      card.addEventListener('pointerleave', handlePointerLeave);
      card.addEventListener('pointerenter', handlePointerEnter);

      listeners.push(() => card.removeEventListener('pointermove', handlePointerMove));
      listeners.push(() => card.removeEventListener('pointerleave', handlePointerLeave));
      listeners.push(() => card.removeEventListener('pointerenter', handlePointerEnter));
    });

    return () => {
      listeners.forEach(fn => fn());
    };
  }, [professors]);


  return (
    <section id="mentors" className="py-20 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="mentors-heading text-4xl sm:text-5xl font-bold text-foreground mb-4">
            World-Class Mentors
          </h2>
          <p className="text-xl text-secondary max-w-3xl mx-auto">
            Learn from verified professors and industry experts from top universities 
            who are passionate about student success.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-secondary">Loading mentors...</p>
          </div>
        ) : professors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-secondary">No mentors available at the moment.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {professors.map((professor) => (
            <div 
              key={professor.name}
              className="mentor-card"
              tabIndex={0}
            >
              <div className="mentor-card-inner card-professor card-tilt smooth-transform perspective-3d no-select bg-white border border-gray-300 rounded-xl p-6">
                {/* Avatar */}
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-hover rounded-full flex items-center justify-center text-background font-bold text-lg mr-4">
                    {professor.initials}
                  </div>
                  <div className="flex-1">
                    <h3 className="mentor-name text-lg font-semibold text-black">
                      {professor.name}
                    </h3>
                    <p className="text-gray-800 text-sm">
                      {professor.university}
                    </p>
                  </div>
                </div>

                {/* Subject */}
                <div className="mb-4">
                  <p className="mentor-subject text-gray-900 font-medium">
                    {professor.subject}
                  </p>
                </div>

                {/* Status Badge */}
                <div className="flex justify-between items-center mb-4">
                  <span 
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      professor.status === 'Available' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-muted text-muted-foreground border border-border'
                    }`}
                  >
                    <div 
                      className={`w-2 h-2 rounded-full mr-2 ${
                        professor.status === 'Available' ? 'bg-green-400' : 'bg-muted-foreground'
                      }`}
                    />
                    {professor.status}
                  </span>
                </div>

                {/* Scroll to Question Form */}
                <Button 
                  className="w-full btn-glow bg-card text-foreground border border-border hover:bg-card/80"
                  onClick={() => {
                    const questionSection = document.getElementById('ask-question');
                    if (questionSection) {
                      questionSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  Ask Question
                </Button>
              </div>
            </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Mentors;