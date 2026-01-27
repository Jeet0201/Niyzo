import React, { useEffect, useState } from 'react';
import { Search, ChevronDown, ChevronRight } from 'lucide-react';
import { api } from '@/lib/api';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ResolvedAnswer {
  id: string;
  subject: string;
  question: string;
  answerText: string;
  answeredAt: string;
  mentorName: string | null;
  mentorSubject: string | null;
}

const KnowledgeBase = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [resolvedAnswers, setResolvedAnswers] = useState<ResolvedAnswer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResolvedAnswers = async () => {
      try {
        const answers = await api.getPublicResolved();
        setResolvedAnswers(answers as ResolvedAnswer[]);
      } catch (error) {
        console.error('Failed to load resolved answers:', error);
      } finally {
        setLoading(false);
      }
    };
    loadResolvedAnswers();
  }, []);

  useEffect(() => {
    // Animate section heading
    gsap.from('.kb-heading', {
      scrollTrigger: {
        trigger: '#knowledge-base',
        start: 'top 80%',
        once: true
      },
      duration: 1,
      opacity: 0,
      y: 40,
      ease: 'power3.out'
    });

    // Animate search bar
    gsap.from('.kb-search', {
      scrollTrigger: {
        trigger: '#knowledge-base',
        start: 'top 75%',
        once: true
      },
      duration: 0.8,
      opacity: 0,
      y: 20,
      scale: 0.95,
      delay: 0.2,
      ease: 'back.out(1.7)'
    });

    // Animate accordion items
    gsap.from('.kb-item', {
      scrollTrigger: {
        trigger: '#knowledge-base',
        start: 'top 60%',
        once: true
      },
      duration: 0.6,
      opacity: 0,
      x: -30,
      stagger: 0.1,
      ease: 'power3.out'
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [resolvedAnswers]);

  // Animate accordion expand/collapse when expandedItems changes
  useEffect(() => {
    // For each kb-item, animate its .kb-content height and opacity
    const items = Array.from(document.querySelectorAll('.kb-item')) as HTMLElement[];
    items.forEach((el, idx) => {
      const content = el.querySelector('.kb-content') as HTMLElement | null;
      const inner = el.querySelector('.kb-content-inner') as HTMLElement | null;
      if (!content || !inner) return;

      const isExpanded = expandedItems.includes(idx);
      if (isExpanded) {
        // measure height
        gsap.set(content, { height: 'auto', opacity: 1 });
        const fullHeight = inner.getBoundingClientRect().height;
        gsap.fromTo(content, { height: 0, opacity: 0 }, { height: fullHeight + 16, opacity: 1, duration: 0.45, ease: 'power3.out' });
      } else {
        gsap.to(content, { height: 0, opacity: 0, duration: 0.35, ease: 'power3.in' });
      }
    });
  }, [expandedItems]);

  const filteredAnswers = resolvedAnswers.filter(item =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answerText.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.mentorName && item.mentorName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleExpanded = (index: number) => {
    setExpandedItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <section id="knowledge-base" className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="kb-heading text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Knowledge Base
          </h2>
          <p className="text-xl text-secondary">
            Browse real questions and answers from our mentor community
          </p>
        </div>

        {/* Search Bar */}
        <div className="kb-search relative mb-12">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input
            type="text"
            placeholder="Search knowledge base..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
          />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-secondary">Loading knowledge base...</p>
          </div>
        ) : (
          <>
            {/* Q&A Accordion */}
            <div className="space-y-4">
              {filteredAnswers.map((item, index) => {
                const isExpanded = expandedItems.includes(index);
                return (
                  <div key={item.id} className="kb-item card-lift">
                    <button
                      onClick={() => toggleExpanded(index)}
                      className="w-full flex items-center justify-between text-left"
                    >
                      <div className="flex-1 pr-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            {item.subject}
                          </span>
                          {item.mentorName && (
                            <span className="text-xs text-muted-foreground">
                              by {item.mentorName}
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">
                          {item.question}
                        </h3>
                      </div>
                      <div className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>
                        <ChevronRight className="w-5 h-5 text-secondary" />
                      </div>
                    </button>
                    
                        <div className="kb-content overflow-hidden mt-0 opacity-0 max-h-0">
                          <div className="kb-content-inner">
                            <p className="text-secondary leading-relaxed mb-2">
                              {item.answerText}
                            </p>
                            <div className="text-xs text-muted-foreground">
                              Answered on {new Date(item.answeredAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {!loading && filteredAnswers.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <p className="text-secondary">
              No results found for "{searchTerm}". Try different keywords.
            </p>
          </div>
        )}
        
        {!loading && resolvedAnswers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-secondary">
              No answered questions yet. Be the first to ask a question!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default KnowledgeBase;