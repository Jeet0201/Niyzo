import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Mentors', href: '#mentors' },
    { label: 'Knowledge Base', href: '#knowledge-base' },
    { label: 'Admin', href: '/admin' },
    { label: 'Join', href: '#cta' }
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'header-blur' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <a href="/" className="flex items-center">
              <img src="/niyzo-logo.svg" alt="NIYZO" className="h-8 w-auto" width="32" height="32" loading="lazy" />
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              item.href.startsWith('#') ? (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-secondary font-medium hover:text-primary transition-colors duration-200"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  to={item.href}
                  className="text-secondary font-medium hover:text-primary transition-colors duration-200"
                >
                  {item.label}
                </Link>
              )
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-secondary hover:text-primary transition-colors duration-200"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-card border-t border-border fixed inset-x-0 bottom-0 top-16 max-h-[calc(100vh-4rem)]">
            <div className="px-2 pt-2 pb-3 space-y-1 h-full overflow-y-auto">
              {navItems.map((item) => (
                item.href.startsWith('#') ? (
                  <a
                    key={item.label}
                    href={item.href}
                    className="block px-3 py-2 text-secondary font-medium hover:text-primary transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="block px-3 py-2 text-secondary font-medium hover:text-primary transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )
              ))}
              
              {/* Mobile Contact Button */}
              <a
                href="mailto:niyzo.official@gmail.com"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg bg-white text-gray-900 font-semibold text-center transition-all duration-300 ease-out hover:bg-gray-100 active:scale-95 mt-2 mb-4 shadow-lg"
              >
                Contact
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;