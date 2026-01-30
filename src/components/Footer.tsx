import React, { useState } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const [showContact, setShowContact] = useState(false);

  const footerLinks = [
    { label: "About", to: "/about" },
    { label: "Contact", action: "contact" },
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" }
  ];

  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          
          {/* Logo */}
          <div className="mb-6 md:mb-0">
            <Link to="/" className="flex items-center hover:opacity-80 transition-opacity duration-200">
              <img
                src="/niyzo-logo.svg"
                alt="NIYZO"
                className="h-10 w-auto"
                width="40"
                height="40"
                loading="lazy"
              />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex space-x-8 mb-6 md:mb-0">
            {footerLinks.map((link) => {
              if (link.action === "contact") {
                return (
                  <button
                    key={link.label}
                    onClick={() => setShowContact((prev) => !prev)}
                    className="text-secondary hover:text-primary transition-colors duration-200 font-medium cursor-pointer"
                    type="button"
                  >
                    {link.label}
                  </button>
                );
              } else if (link.to) {
                return (
                  <Link
                    key={link.label}
                    to={link.to}
                    className="text-secondary hover:text-primary transition-colors duration-200 font-medium"
                  >
                    {link.label}
                  </Link>
                );
              } else {
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-secondary hover:text-primary transition-colors duration-200 font-medium"
                  >
                    {link.label}
                  </a>
                );
              }
            })}
          </nav>
        </div>

        {/* Contact Email - Toggle Display */}
        {showContact && (
          <div className="mt-6 text-center text-secondary text-sm animate-fade-in">
            Contact us at{" "}
            <a
              href="mailto:niyzo.official@gmail.com"
              className="text-primary hover:underline font-semibold"
            >
              niyzo.official@gmail.com
            </a>
          </div>
        )}

        {/* Copyright */}
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-secondary text-sm">
            © 2026 NIYZO. All rights reserved. Empowering the next generation of learners.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
