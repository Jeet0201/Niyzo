import React from 'react';
import { MessageCircle, Users, TrendingUp } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: MessageCircle,
      title: 'Ask a Question',
      description: 'Submit your academic questions and receive personalized guidance from verified professors.'
    },
    {
      icon: Users,
      title: 'Get Guidance',
      description: 'Connect with expert mentors who provide detailed explanations and learning resources.'
    },
    {
      icon: TrendingUp,
      title: 'Grow Smarter',
      description: 'Build knowledge systematically with proven methods and track your academic progress.'
    }
  ];

  return (
    <section id="how-it-works" className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            How NIYZO Works
          </h2>
          <p className="text-xl text-secondary max-w-3xl mx-auto">
            A streamlined approach to verified learning that connects ambitious students 
            with world-class academic mentors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step) => {
            const IconComponent = step.icon;
            return (
              <div key={step.title} className="how-it-works-card card-lift text-center p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-hover rounded-xl flex items-center justify-center mx-auto mb-6">
                  <IconComponent className="w-8 h-8 text-background" />
                </div>

                <h3 className="text-2xl font-semibold text-foreground mb-4">
                  {step.title}
                </h3>

                <p className="text-secondary leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;