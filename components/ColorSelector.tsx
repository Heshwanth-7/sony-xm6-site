'use client';

import React, { useState } from 'react';
import { Palette, Check, Sparkles } from 'lucide-react';

interface ColorSelectorProps {
  onPreOrderClick?: (colorName: string) => void;
}

export default function ColorSelector({ onPreOrderClick }: ColorSelectorProps) {
  const [selectedColor, setSelectedColor] = useState<number>(0);

  const colors = [
    {
      id: 'black',
      name: 'Matte Obsidian Black',
      subtitle: 'The iconic stealth finish',
      hex: '#0D0D10',
      borderHex: '#2A2A30',
      badge: 'FLAGSHIP HERO',
      description:
        'Features a microscopic tactile matte texture that resists fingerprint smudges, paired with bead-blasted dark anodized aluminum gimbals and subtle dark gold Sony logomarks.',
      texture: 'Fingerprint-resistant micro-ceramic coat',
      accent: '#00D6FF',
    },
    {
      id: 'silver',
      name: 'Platinum Silver',
      subtitle: 'Modern titanium luxury',
      hex: '#D1D0CD',
      borderHex: '#A8A6A0',
      badge: 'ARCHITECTURAL FINISH',
      description:
        'Inspired by modern architectural titanium, subtle warm champagne tones blend seamlessly with plush light-grey vegan leather cushions for an elegant lifestyle statement.',
      texture: 'Double-anodized brushed titanium sheen',
      accent: '#E6C687',
    },
    {
      id: 'navy',
      name: 'Midnight Navy',
      subtitle: 'Deep oceanic depth',
      hex: '#0E1726',
      borderHex: '#1E2F4C',
      badge: 'SPECIAL EDITION',
      description:
        'A multi-stage iridescent dark navy that subtly shifts under changing ambient light, complemented by deep electric cyan interior acoustic foam grilles.',
      texture: 'Deep iridescent metallic coat',
      accent: '#0050FF',
    },
  ];

  const current = colors[selectedColor];

  return (
    <section className="relative py-28 bg-[#050505] text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass-panel border border-white/10 mb-4">
            <Palette className="w-3.5 h-3.5 text-accent-cyan" />
            <span className="text-[11px] uppercase tracking-[0.2em] text-white/70 font-mono">
              Craftsmanship & Finishes
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Precision in three distinct moods.
          </h2>
          <p className="text-sm sm:text-base text-white/60">
            Coated with high-wear micro-particle finishes to ensure your headphones look as pristine in five years as they do on day one.
          </p>
        </div>

        {/* Color Display Card */}
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-white/10 max-w-4xl mx-auto relative overflow-hidden">
          {/* Subtle colored backlight */}
          <div
            className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-[100px] pointer-events-none transition-colors duration-700"
            style={{ backgroundColor: current.accent, opacity: 0.15 }}
          />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Color Swatch Visual Preview */}
            <div className="md:col-span-5 flex flex-col items-center justify-center p-8 rounded-2xl bg-[#09090C] border border-white/5 text-center">
              <div
                className="w-32 h-32 rounded-full border-4 shadow-2xl transition-all duration-500 relative flex items-center justify-center mb-6"
                style={{
                  backgroundColor: current.hex,
                  borderColor: current.borderHex,
                  boxShadow: `0 0 35px ${current.borderHex}44`,
                }}
              >
                <span className="text-[10px] font-mono tracking-widest uppercase opacity-40 text-white">
                  SONY
                </span>
              </div>
              <div className="text-xs font-mono uppercase tracking-widest text-accent-cyan">
                {current.badge}
              </div>
              <div className="text-lg font-bold text-white mt-1">
                {current.name}
              </div>
            </div>

            {/* Color Detail and Picker */}
            <div className="md:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-mono text-white/40 uppercase tracking-widest block mb-1">
                  Selected Finish
                </span>
                <h3 className="text-2xl font-bold text-white">
                  {current.name}
                </h3>
                <p className="text-xs text-white/50 font-mono mt-0.5">
                  {current.subtitle}
                </p>
              </div>

              <p className="text-sm text-white/70 leading-relaxed">
                {current.description}
              </p>

              <div className="p-3 bg-white/5 rounded-xl border border-white/5 font-mono text-xs text-white/60">
                <span className="text-white/40 block text-[10px] uppercase mb-0.5">Coating Standard</span>
                {current.texture}
              </div>

              {/* Swatches Picker */}
              <div className="pt-2">
                <div className="text-xs text-white/50 mb-3 font-mono">Choose finish:</div>
                <div className="flex items-center space-x-4">
                  {colors.map((c, index) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedColor(index)}
                      className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                        selectedColor === index
                          ? 'ring-2 ring-accent-cyan ring-offset-4 ring-offset-[#050505] scale-110'
                          : 'opacity-70 hover:opacity-100 hover:scale-105'
                      }`}
                      style={{
                        backgroundColor: c.hex,
                        border: `1px solid ${c.borderHex}`,
                      }}
                      title={c.name}
                    >
                      {selectedColor === index && (
                        <Check
                          className={`w-4 h-4 ${
                            c.id === 'silver' ? 'text-black' : 'text-accent-cyan'
                          }`}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA button */}
              <div className="pt-4">
                <button
                  onClick={() => onPreOrderClick && onPreOrderClick(current.name)}
                  className="px-6 py-3 rounded-full text-xs font-semibold bg-white text-black hover:bg-accent-cyan transition-colors"
                >
                  Pre-order in {current.name}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
