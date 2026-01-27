import React from "react";
import { CheckCircle2, Lightbulb, Users } from "lucide-react";

const About = () => {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            About <span className="text-primary">NIYZO</span>
          </h2>
          <p className="text-xl text-secondary max-w-2xl mx-auto">
            Turning real skills into trusted proof for students and employers
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">

          {/* Mission */}
          <div className="bg-card border border-border rounded-xl p-8 hover:border-primary transition-colors duration-300">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="w-8 h-8 text-primary" />
              <h3 className="text-2xl font-bold text-foreground">Our Mission</h3>
            </div>
            <p className="text-secondary leading-relaxed">
              Our mission is to help students prove what they truly know. NIYZO enables professors and peers to validate technical skills, transforming academic effort into credible, industry-ready proof.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-card border border-border rounded-xl p-8 hover:border-primary transition-colors duration-300">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="w-8 h-8 text-primary" />
              <h3 className="text-2xl font-bold text-foreground">Our Vision</h3>
            </div>
            <p className="text-secondary leading-relaxed">
              We envision a future where hiring is driven by verified skills, not just resumes. A world where students move from classrooms to careers based on ability, transparency, and trust.
            </p>
          </div>

          {/* Why Niyzo */}
          <div className="bg-card border border-border rounded-xl p-8 hover:border-primary transition-colors duration-300">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-8 h-8 text-primary" />
              <h3 className="text-2xl font-bold text-foreground">Why NIYZO</h3>
            </div>
            <p className="text-secondary leading-relaxed">
              Skills gain value when they are verified by those who have seen them in action. NIYZO builds trust by allowing professors and peers to validate competence through real work and collaboration.
            </p>
          </div>

        </div>

        {/* Founder's Story */}
        <div className="bg-gradient-to-br from-card to-background border border-border rounded-xl p-12">
          <div className="max-w-3xl">
            <h3 className="text-3xl font-bold text-foreground mb-6">
              Founder's <span className="text-primary">Story</span>
            </h3>

            <div className="space-y-4 text-secondary leading-relaxed text-lg">
              <p>
                Jeet Lakum, a final-year Computer Science student, founded NIYZO after experiencing a common frustration firsthand. Despite building strong projects and earning recognition from professors and peers, traditional resumes failed to reflect the true value of his skills and practical work.
              </p>

              <p>
                Through this experience, the founder realized that millions of talented students face the same challenge. Their abilities are proven in classrooms and real projects, yet employers often see only a list of courses and grades. This gap between what students know and what they can actually prove became the catalyst for NIYZO.
              </p>

              <p>
                What if skills could be verified by those who have seen them in action? What if a student's network—professors, peers, and mentors—could transparently endorse their abilities? That vision defines NIYZO: a Proof-of-Skill platform designed to make careers accessible based on merit, not just credentials.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold text-lg">JL</span>
              </div>
              <div>
                <p className="font-semibold text-foreground">Jeet Lakum</p>
                <p className="text-sm text-secondary">
                  Founder & CEO, Building trust between education and industry
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-lg text-secondary mb-6">
            Ready to turn your skills into real opportunities?
          </p>
          <a
            href="#cta"
            className="inline-flex items-center px-8 py-3 rounded-lg bg-primary text-white font-semibold transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:scale-105"
          >
            Join NIYZO
          </a>
        </div>

      </div>
    </section>
  );
};

export default About;
