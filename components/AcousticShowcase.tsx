'use client';

import React, { useState } from 'react';
import { Volume2, VolumeX, Shield, Radio, CheckCircle2 } from 'lucide-react';

export default function AcousticShowcase() {
  const [activeMode, setActiveMode] = useState<'anc' | 'ambient' | 'off'>('anc');

  const modes = [
    {
      id: 'anc' as const,
      name: 'Active Noise Cancelling',
      badge: 'PROPRIETARY QN3 MATRIX',
      decibels: '-42 dB Attenuation',
      description:
        'Dual neural processors generate an inverse sound wave within 0.18ms, neutralizing jet engines, subway screeching, and office chatter.',
      ambientNoiseLevel: '2%',
      voiceClarity: 'Pure Music Isolation',
    },
    {
      id: 'ambient' as const,
      name: 'Adaptive Ambient Mode',
      badge: 'VOICE FOCUS PASS-THROUGH',
      decibels: 'Natural Acoustic Passthrough',
      description:
        'Microphones automatically isolate human vocal frequencies while suppressing background rumble, letting you order coffee or talk without removing the headset.',
      ambientNoiseLevel: '65%',
      voiceClarity: '100% Crisp Speech',
    },
    {
      id: 'off' as const,
      name: 'Passive Isolation Mode',
      badge: 'ACOUSTIC SEAL ONLY',
      decibels: '-18 dB Passive Seal',
      description:
        'Physical isolation powered by memory foam ear cushions and high-density acoustic chambers, maximizing battery life up to 55 hours.',
      ambientNoiseLevel: '40%',
      voiceClarity: 'Damped Acoustics',
    },
  ];

  const current = modes.find((m) => m.id === activeMode)!;

  return (
    <section id="noise-cancelling" className="relative py-32 bg-[#0A0A0C] text-white overflow-hidden border-t border-white/5">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] radial-accent-glow pointer-events-none opacity-40" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass-panel border border-white/10 mb-4">
            <Shield className="w-3.5 h-3.5 text-accent-cyan" />
            <span className="text-[11px] uppercase tracking-[0.2em] text-white/70 font-mono">
              Adaptive Noise Cancelling
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-6">
            Silence tuned to your reality.
          </h2>
          <p className="text-base sm:text-lg text-white/60 leading-relaxed">
            Experience how the dual-chip acoustic matrix analyzes cabin pressure, ear anatomy, and atmospheric changes to sculpt perfect acoustic isolation.
          </p>
        </div>

        {/* Interactive Mode Switcher Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1.5 rounded-2xl glass-panel border border-white/10 space-x-1">
            {modes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id)}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 ${
                  activeMode === mode.id
                    ? 'bg-gradient-to-r from-accent-blue to-accent-cyan text-white shadow-[0_0_20px_rgba(0,214,255,0.3)]'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {mode.name}
              </button>
            ))}
          </div>
        </div>

        {/* Acoustic Simulator Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Visualizer Box */}
          <div className="lg:col-span-7 glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10 font-mono text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-accent-cyan animate-ping" />
                <span className="text-white/80">{current.badge}</span>
              </div>
              <span className="text-accent-cyan font-bold">{current.decibels}</span>
            </div>

            {/* Simulated Animated Waveform Bars */}
            <div className="h-44 sm:h-52 flex items-center justify-between gap-1 sm:gap-1.5 px-4 bg-[#050505]/70 rounded-2xl border border-white/5 relative overflow-hidden">
              {Array.from({ length: 36 }).map((_, i) => {
                const heightMult =
                  activeMode === 'anc'
                    ? Math.sin(i * 0.3) * 8 + 12
                    : activeMode === 'ambient'
                    ? Math.sin(i * 0.5) * 35 + 45
                    : Math.sin(i * 0.4) * 20 + 25;

                return (
                  <div
                    key={i}
                    className="w-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      height: `${heightMult}%`,
                      backgroundColor:
                        activeMode === 'anc'
                          ? '#00D6FF'
                          : activeMode === 'ambient'
                          ? '#0050FF'
                          : 'rgba(255, 255, 255, 0.3)',
                      opacity: activeMode === 'anc' ? 0.9 : 0.6,
                      boxShadow:
                        activeMode === 'anc'
                          ? '0 0 10px rgba(0, 214, 255, 0.4)'
                          : 'none',
                    }}
                  />
                );
              })}

              {/* Center Status Tag */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="px-4 py-1.5 rounded-full glass-panel text-xs font-mono uppercase tracking-widest text-white/90 border border-white/20 shadow-xl">
                  {activeMode === 'anc'
                    ? 'Inverse Anti-Noise Wave Active'
                    : activeMode === 'ambient'
                    ? 'Environmental Microphones Active'
                    : 'DSP Inactive (Passive Foam)'}
                </span>
              </div>
            </div>

            {/* Realtime Indicators */}
            <div className="grid grid-cols-2 gap-4 mt-6 font-mono text-xs">
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <span className="text-white/40 block mb-1">CABIN / TRAIN NOISE</span>
                <span className="text-white font-semibold text-sm">
                  {activeMode === 'anc' ? '0.02% (Neutralized)' : activeMode === 'ambient' ? '30% (Controlled)' : '45% (Audible)'}
                </span>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <span className="text-white/40 block mb-1">CONVERSATION CLARITY</span>
                <span className="text-white font-semibold text-sm">
                  {activeMode === 'anc' ? 'Muted' : activeMode === 'ambient' ? 'Enhanced (Voice Passthrough)' : 'Attenuated'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="text-xs font-mono tracking-widest text-accent-cyan uppercase">
              Intelligent Adaptation
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              {current.name}
            </h3>
            <p className="text-base text-white/60 leading-relaxed">
              {current.description}
            </p>

            <div className="space-y-3 pt-4 border-t border-white/10">
              <div className="flex items-center space-x-3 text-sm text-white/80">
                <CheckCircle2 className="w-4 h-4 text-accent-cyan flex-shrink-0" />
                <span>Auto-optimizer calculates barometric pressure for flight cabin use</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-white/80">
                <CheckCircle2 className="w-4 h-4 text-accent-cyan flex-shrink-0" />
                <span>Speak-to-Chat pauses playback automatically when you start talking</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-white/80">
                <CheckCircle2 className="w-4 h-4 text-accent-cyan flex-shrink-0" />
                <span>Zero ear-pressure sensation via calibrated micro-relief vents</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
