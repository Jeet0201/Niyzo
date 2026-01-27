import React from 'react';

const Footer = () => {
  const footerLinks = [
    { label: 'About', href: '#' },
    { label: 'Contact', href: 'mailto:niyzo.official@gmail.com' },
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' }
  ];

  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo */}
          <div className="mb-6 md:mb-0">
            <h3 className="text-xl font-bold text-foreground">
              NIYZ<span className="text-primary">O</span>
            </h3>
          </div>

          {/* Links */}
          <nav className="flex space-x-8 mb-6 md:mb-0">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-secondary hover:text-primary transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Copyright */}
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-secondary text-sm">
            © 2024 NIYZO. All rights reserved. Empowering the next generation of learners.
          </p>
          <p className="text-secondary text-sm mt-4">
            Email: <a href="mailto:niyzo.official@gmail.com" className="text-primary hover:underline">niyzo.official@gmail.com</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;