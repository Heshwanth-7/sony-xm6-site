'use client';

import React from 'react';
import { Cpu, BatteryCharging, Mic, ShieldCheck, Zap, Headphones, Compass, Sparkles } from 'lucide-react';

export default function FeatureGrid() {
  return (
    <section id="technology" className="relative py-32 bg-[#050505] text-white overflow-hidden border-t border-white/5">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] radial-hero-glow pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass-panel border border-white/10 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-accent-cyan" />
            <span className="text-[11px] uppercase tracking-[0.2em] text-white/70 font-mono">
              Engineering Feats
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-gradient-white mb-6">
            Pioneered to redefine acoustic limits.
          </h2>
          <p className="text-base sm:text-lg text-white/60 leading-relaxed">
            Every millimeter of the WH-1000XM6 is engineered with uncompromising precision. From the custom carbon-bio acoustic chamber to the dual-chip neural processing unit.
          </p>
        </div>

        {/* Bento Box Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {/* Card 1: Dual Processor (Large 2-col) */}
          <div className="md:col-span-2 glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden group hover:border-accent-cyan/40 transition-all duration-500">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/10 rounded-full blur-3xl pointer-events-none group-hover:bg-accent-blue/20 transition-all" />
            <div className="p-3 bg-white/5 w-fit rounded-2xl mb-6 text-accent-cyan">
              <Cpu className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono text-accent-cyan uppercase tracking-widest">
              Neural Processing Architecture
            </span>
            <h3 className="text-2xl font-bold text-white mt-2 mb-4">
              Integrated Processor V3 & HD QN3 Chipset
            </h3>
            <p className="text-sm text-white/60 leading-relaxed mb-6">
              Co-developed with Sony's Tokyo semiconductor laboratories, two dedicated processors work in parallel to compute 700,000 anti-noise inverse waveforms per second, creating unprecedented acoustic silence.
            </p>
            <div className="flex items-center space-x-6 pt-4 border-t border-white/5 font-mono text-xs">
              <div>
                <div className="text-white font-semibold text-base">0.18ms</div>
                <div className="text-white/40">Latency response</div>
              </div>
              <div>
                <div className="text-white font-semibold text-base">-42dB</div>
                <div className="text-white/40">Peak attenuation</div>
              </div>
              <div>
                <div className="text-white font-semibold text-base">8x</div>
                <div className="text-white/40">Faster AI adaptation</div>
              </div>
            </div>
          </div>

          {/* Card 2: 45-Hour Battery */}
          <div className="glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden group hover:border-accent-cyan/40 transition-all duration-500 flex flex-col justify-between">
            <div>
              <div className="p-3 bg-white/5 w-fit rounded-2xl mb-6 text-accent-cyan">
                <BatteryCharging className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono text-accent-cyan uppercase tracking-widest">
                Power Density
              </span>
              <h3 className="text-2xl font-bold text-white mt-2 mb-3">
                45 Hours Playback
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                High-density solid-electrolyte cell delivers nearly two full days of non-stop continuous ANC playback.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-white/5">
              <div className="text-xs text-white/50 font-mono">Quick Charge</div>
              <div className="text-white font-semibold text-sm mt-0.5">3 min charge = 5 hrs audio</div>
            </div>
          </div>

          {/* Card 3: Beamforming 8-Mic Array */}
          <div className="glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden group hover:border-accent-cyan/40 transition-all duration-500 flex flex-col justify-between">
            <div>
              <div className="p-3 bg-white/5 w-fit rounded-2xl mb-6 text-accent-cyan">
                <Mic className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono text-accent-cyan uppercase tracking-widest">
                Acoustic Pickup
              </span>
              <h3 className="text-2xl font-bold text-white mt-2 mb-3">
                8-Mic Beamforming
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Micro-mesh wind shielding and bone-conduction voice calibration isolate your vocals even in gale-force winds.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-white/5">
              <div className="text-xs text-white/50 font-mono">Wind Noise Reduction</div>
              <div className="text-white font-semibold text-sm mt-0.5">Up to 45 km/h rejection</div>
            </div>
          </div>

          {/* Card 4: 40mm Carbon-Bio Transducer */}
          <div className="glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden group hover:border-accent-cyan/40 transition-all duration-500">
            <div className="p-3 bg-white/5 w-fit rounded-2xl mb-6 text-accent-cyan">
              <Headphones className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono text-accent-cyan uppercase tracking-widest">
              Audio Drivers
            </span>
            <h3 className="text-2xl font-bold text-white mt-2 mb-3">
              40mm Carbon-Bio
            </h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Ultra-light carbon fiber dome paired with bio-cellulose surround provides lightning-fast transient response and bass authority down to 3Hz.
            </p>
          </div>

          {/* Card 5: Spatial Head Tracking (2-col) */}
          <div className="md:col-span-2 glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden group hover:border-accent-cyan/40 transition-all duration-500">
            <div className="p-3 bg-white/5 w-fit rounded-2xl mb-6 text-accent-cyan">
              <Compass className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono text-accent-cyan uppercase tracking-widest">
              Spatial Immersion
            </span>
            <h3 className="text-2xl font-bold text-white mt-2 mb-3">
              360 Reality Audio & Dynamic Head Tracking
            </h3>
            <p className="text-sm text-white/60 leading-relaxed mb-6">
              Precision 6-axis gyroscope and accelerometer sense microscopic head movements in real time, anchoring musical instruments and cinematic dialogues firmly in 3D acoustic space.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5 font-mono text-xs">
              <div>
                <span className="text-white/40 block">SAMPLING</span>
                <span className="text-white font-medium">96kHz / 24-bit Hi-Res</span>
              </div>
              <div>
                <span className="text-white/40 block">SPATIAL CHANNELS</span>
                <span className="text-white font-medium">Full Object-Based Sphere</span>
              </div>
            </div>
          </div>

          {/* Card 6: Seamless Multipoint */}
          <div className="glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden group hover:border-accent-cyan/40 transition-all duration-500">
            <div className="p-3 bg-white/5 w-fit rounded-2xl mb-6 text-accent-cyan">
              <Zap className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono text-accent-cyan uppercase tracking-widest">
              Connectivity
            </span>
            <h3 className="text-2xl font-bold text-white mt-2 mb-3">
              Bluetooth® 5.4 & Multipoint
            </h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Pair simultaneously to two devices. When a call arrives, the XM6 intelligently switches audio without missing a single syllable.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
