'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Volume2 } from 'lucide-react';

interface NavbarProps {
  onPreOrderClick?: () => void;
}

export default function Navbar({ onPreOrderClick }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Overview', href: '#overview' },
    { label: 'Technology', href: '#technology' },
    { label: 'Noise Cancelling', href: '#noise-cancelling' },
    { label: 'Specs', href: '#specs' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'glass-nav py-2.5 md:py-3'
            : 'bg-transparent py-3 md:py-5 border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">
          {/* Left: Sony Logo + Product Name */}
          <div className="flex items-center space-x-2 md:space-x-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="font-semibold tracking-[0.2em] text-[11px] md:text-xs uppercase text-white/90 group-hover:text-white transition-colors">
              SONY
            </span>
            <span className="h-2.5 md:h-3 w-[1px] bg-white/20" />
            <span className="font-medium text-xs md:text-sm tracking-tight text-white/90 group-hover:text-accent-cyan transition-colors">
              WH-1000XM6
            </span>
          </div>

          {/* Center: Apple-style Minimalist Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs font-normal tracking-wide text-white/60 hover:text-white transition-all duration-200 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-accent-cyan hover:after:w-full after:transition-all after:duration-300"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right: CTA button */}
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-xs text-white/40 tracking-tight font-mono">
              $449.99
            </span>
            <button
              onClick={onPreOrderClick}
              className="relative inline-flex items-center justify-center p-0.5 overflow-hidden rounded-full font-medium text-xs group"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-accent-blue via-accent-cyan to-accent-blue rounded-full group-hover:opacity-100 opacity-70 transition-opacity blur-[2px]" />
              <span className="relative px-4 py-1.5 rounded-full bg-[#08080A] group-hover:bg-[#0D0D10] text-white/95 group-hover:text-white transition-all flex items-center space-x-1.5">
                <span>Experience XM6</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-accent-cyan transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={onPreOrderClick}
              className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-gradient-to-r from-accent-blue to-accent-cyan text-white shadow-sm"
            >
              Pre-order
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-panel border-t border-white/10 px-5 py-4 mt-2 space-y-3 animate-in fade-in slide-in-from-top-4 duration-300">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs text-white/80 hover:text-accent-cyan transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-white/50 font-mono">Sony Flagship Series</span>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onPreOrderClick) onPreOrderClick();
                }}
                className="w-full mt-2 py-2 rounded-full text-xs font-medium bg-gradient-to-r from-accent-blue to-accent-cyan text-white text-center shadow-lg"
              >
                Experience WH-1000XM6
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
