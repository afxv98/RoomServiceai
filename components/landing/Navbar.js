'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isScrolled = scrollY > 100;

  const scrollToContact = (e) => {
    e.preventDefault();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsOpen(false);
  };

  const closeMobileMenu = () => {
    setIsOpen(false);
  };

  const navLinks = [
    { label: 'About', href: '/about' },
    { label: 'Capabilities', href: '/capabilities' },
    { label: 'Partners', href: '/integration-partners' },
    { label: 'Revenue', href: '/revenue-protection' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Demo', href: '/demo' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          isScrolled ? 'nav-blur py-4' : 'bg-transparent py-6'
        }`}
      >
        <div className="w-full px-6 lg:px-12 flex items-center justify-between">
          {/* Logo with Image */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Image
              src="/RSlogo.png"
              alt="RoomService AI Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <span className="font-sora text-xl font-bold text-offwhite tracking-tight">
              RoomService<span className="text-copper"> AI</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-offwhite-muted hover:text-offwhite text-sm font-medium transition-colors duration-300 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-copper transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <a
            href="https://calendly.com/theresa-roomserviceai/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:block px-6 py-2.5 rounded-full border border-copper text-copper text-sm font-semibold
                       hover:bg-copper hover:text-white transition-all duration-300"
          >
            Book a Demo
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-offwhite hover:text-copper transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="mobile-menu-overlay lg:hidden">
          <button
            onClick={closeMobileMenu}
            className="absolute top-6 right-6 p-2 text-offwhite hover:text-copper transition-colors"
            aria-label="Close menu"
          >
            <X size={28} />
          </button>

          <div className="flex flex-col items-center gap-8">
            {navLinks.map((link, index) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={closeMobileMenu}
                className="text-offwhite text-2xl font-sora font-semibold hover:text-copper transition-colors duration-300"
                style={{
                  animation: `fade-in-up 0.4s ease ${index * 0.1}s both`,
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <a
            href="https://calendly.com/theresa-roomserviceai/30min"
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMobileMenu}
            className="mt-8 px-8 py-3 rounded-full bg-copper text-white font-semibold
                       hover:bg-copper-dark transition-colors duration-300"
            style={{
              animation: 'fade-in-up 0.4s ease 0.6s both',
            }}
          >
            Book a Demo
          </a>
        </div>
      )}
    </>
  );
}
