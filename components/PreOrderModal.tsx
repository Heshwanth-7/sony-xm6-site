'use client';

import React, { useState } from 'react';
import { X, Check, ShieldCheck, Truck, RotateCcw, Sparkles } from 'lucide-react';

interface PreOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialColor?: string;
}

export default function PreOrderModal({
  isOpen,
  onClose,
  initialColor = 'Matte Obsidian Black',
}: PreOrderModalProps) {
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [engravingText, setEngravingText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: 'United States',
  });

  if (!isOpen) return null;

  const finishes = [
    { name: 'Matte Obsidian Black', hex: '#0D0D10' },
    { name: 'Platinum Silver', hex: '#D1D0CD' },
    { name: 'Midnight Navy', hex: '#0E1726' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-xl transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-xl glass-panel bg-[#0A0A0C]/95 border border-white/15 rounded-2xl md:rounded-3xl p-5 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden">
        {/* Accent glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:top-5 md:right-5 p-1.5 md:p-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4 md:w-5 md:h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            <div className="flex items-center space-x-1.5 md:space-x-2 text-[10px] md:text-xs font-mono text-accent-cyan uppercase tracking-wider md:tracking-widest mb-1.5 md:mb-2">
              <Sparkles className="w-3 h-3 md:w-3.5 md:h-3.5" />
              <span>Sony Priority Reservation</span>
            </div>

            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1.5 md:mb-2 leading-tight">
              Pre-Order WH-1000XM6
            </h3>
            <p className="text-xs sm:text-sm text-white/60 mb-4 md:mb-6 leading-relaxed">
              Lock in your launch window allocation. Expected delivery within 2-3 business weeks with complimentary express shipping.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
              {/* Finish Selection */}
              <div>
                <label className="block text-[10px] md:text-xs font-mono text-white/70 uppercase mb-1.5 md:mb-2">
                  Select Finish
                </label>
                <div className="grid grid-cols-3 gap-2 md:gap-3">
                  {finishes.map((f) => (
                    <button
                      key={f.name}
                      type="button"
                      onClick={() => setSelectedColor(f.name)}
                      className={`p-2 sm:p-3 rounded-xl md:rounded-2xl border text-left transition-all ${
                        selectedColor === f.name
                          ? 'border-accent-cyan bg-white/5 ring-1 ring-accent-cyan'
                          : 'border-white/10 hover:border-white/20 bg-white/[0.02]'
                      }`}
                    >
                      <div
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border border-white/30 mb-1.5 md:mb-2"
                        style={{ backgroundColor: f.hex }}
                      />
                      <div className="text-[10px] sm:text-[11px] font-medium text-white/90 truncate">
                        {f.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Free Custom Engraving */}
              <div>
                <div className="flex items-center justify-between mb-1 md:mb-1.5">
                  <label className="text-[10px] md:text-xs font-mono text-white/70 uppercase">
                    Complimentary Laser Monogram (Optional)
                  </label>
                  <span className="text-[9px] md:text-[10px] text-accent-cyan font-mono">FREE</span>
                </div>
                <input
                  type="text"
                  maxLength={16}
                  value={engravingText}
                  onChange={(e) => setEngravingText(e.target.value.toUpperCase())}
                  placeholder="e.g. SONY AUDIO or INITIALS"
                  className="w-full px-3.5 py-2 md:px-4 md:py-2.5 rounded-lg md:rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-[11px] md:text-xs font-mono focus:outline-none focus:border-accent-cyan transition-colors"
                />
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 md:gap-3">
                <div>
                  <label className="block text-[10px] md:text-xs font-mono text-white/70 uppercase mb-1 md:mb-1.5">
                    Full Name
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Kenichiro Yoshida"
                    className="w-full px-3.5 py-2 md:px-4 md:py-2.5 rounded-lg md:rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-xs focus:outline-none focus:border-accent-cyan transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] md:text-xs font-mono text-white/70 uppercase mb-1 md:mb-1.5">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="audio@sony.com"
                    className="w-full px-3.5 py-2 md:px-4 md:py-2.5 rounded-lg md:rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-xs focus:outline-none focus:border-accent-cyan transition-colors"
                  />
                </div>
              </div>

              {/* Pricing & Guarantee */}
              <div className="pt-3 md:pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[11px] md:text-xs text-white/50 block font-mono">Total Due at Dispatch</span>
                  <span className="text-lg md:text-xl font-bold text-white font-mono">$449.99</span>
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 md:px-6 md:py-3 rounded-full text-[11px] md:text-xs font-semibold bg-gradient-to-r from-accent-blue via-accent-cyan to-accent-blue text-white shadow-lg hover:shadow-[0_0_25px_rgba(0,214,255,0.4)] transition-all"
                >
                  Confirm Reservation
                </button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-1.5 md:gap-2 pt-1 md:pt-2 text-[9px] md:text-[10px] text-white/50 font-mono text-center">
                <div className="flex flex-col items-center">
                  <Truck className="w-3 h-3 md:w-3.5 md:h-3.5 mb-1 text-white/60" />
                  <span>Free Express</span>
                </div>
                <div className="flex flex-col items-center">
                  <RotateCcw className="w-3 h-3 md:w-3.5 md:h-3.5 mb-1 text-white/60" />
                  <span>30-Day Trial</span>
                </div>
                <div className="flex flex-col items-center">
                  <ShieldCheck className="w-3 h-3 md:w-3.5 md:h-3.5 mb-1 text-white/60" />
                  <span>2-Year Warranty</span>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-accent-cyan/20 border border-accent-cyan text-accent-cyan mx-auto flex items-center justify-center">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white">
              Reservation Confirmed
            </h3>
            <p className="text-sm text-white/70 max-w-sm mx-auto leading-relaxed">
              Thank you, <strong className="text-white">{formData.name || 'valued customer'}</strong>. Your allocation for the <strong>WH-1000XM6 ({selectedColor})</strong> has been registered.
            </p>
            <p className="text-xs text-white/50 font-mono">
              Confirmation sent to {formData.email || 'your email'}.
            </p>
            <div className="pt-4">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full text-xs font-medium bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                Return to Product Experience
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
