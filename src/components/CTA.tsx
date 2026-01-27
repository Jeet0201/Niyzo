import React from 'react';

const CTA = () => {
  return (
    <section id="cta" className="py-20 bg-gradient-to-br from-card to-background">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <div className="fade-in-up">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to learn smarter?
          </h2>
          
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join our exclusive pilot program and experience verified learning 
            with world-class academic mentors.
          </p>
          
          <div className="fade-in-up-delay-1">
            <button className="bg-card text-foreground px-10 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ease-out">
              Join Pilot Today
            </button>
          </div>
          
          <p className="text-white/70 text-sm mt-6 fade-in-up-delay-2">
            Limited spots available • No credit card required
          </p>
          
          <div className="mt-8 fade-in-up-delay-3">
            <p className="text-white/80 text-sm">
              Questions? Email us at{' '}<a href="mailto:niyzo.official@gmail.com" className="text-white font-semibold hover:underline">niyzo.official@gmail.com</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;