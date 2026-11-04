'use client';

import React from 'react';

export default function Footer() {
  return (
    <footer className="relative bg-[#050505] text-white/50 text-xs border-t border-white/10 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Top Badges / Certifications */}
        <div className="flex flex-wrap items-center justify-between gap-6 pb-12 border-b border-white/5">
          <div className="flex items-center space-x-3">
            <span className="font-semibold tracking-[0.25em] text-white/90 text-sm">SONY</span>
            <span className="h-3 w-[1px] bg-white/20" />
            <span className="text-white/70 font-mono text-xs">Flagship 1000X Series</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono text-white/40">
            <span className="px-2.5 py-1 rounded border border-white/10">HI-RES AUDIO WIRELESS</span>
            <span className="px-2.5 py-1 rounded border border-white/10">LDAC™</span>
            <span className="px-2.5 py-1 rounded border border-white/10">360 REALITY AUDIO</span>
            <span className="px-2.5 py-1 rounded border border-white/10">DSEE ULTIMATE</span>
          </div>
        </div>

        {/* Environmental Commitment Notice */}
        <div className="py-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-white/80 font-medium">Road to Zero Commitment</span>
            <span className="text-white/40 hidden sm:inline">— 100% plastic-free packaging, recycled ocean-bound materials.</span>
          </div>
          <span className="text-white/40 font-mono text-[11px]">Sony Environmental Plan 2050</span>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 text-xs">
          <div>
            <h4 className="font-semibold text-white/90 tracking-wider uppercase mb-4 text-[11px] font-mono">
              Explore 1000X
            </h4>
            <ul className="space-y-2.5">
              <li><a href="#overview" className="hover:text-white transition-colors">Overview</a></li>
              <li><a href="#technology" className="hover:text-white transition-colors">Acoustic Architecture</a></li>
              <li><a href="#noise-cancelling" className="hover:text-white transition-colors">Adaptive Noise Cancelling</a></li>
              <li><a href="#specs" className="hover:text-white transition-colors">Technical Specifications</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white/90 tracking-wider uppercase mb-4 text-[11px] font-mono">
              Acoustic Innovation
            </h4>
            <ul className="space-y-2.5">
              <li><span className="text-white/40">Integrated Processor V3</span></li>
              <li><span className="text-white/40">HD QN3 Noise Engine</span></li>
              <li><span className="text-white/40">Carbon-Bio Transducers</span></li>
              <li><span className="text-white/40">Edge-AI Audio Upscaling</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white/90 tracking-wider uppercase mb-4 text-[11px] font-mono">
              Support & Service
            </h4>
            <ul className="space-y-2.5">
              <li><span className="text-white/40">Sony Headphones Connect App</span></li>
              <li><span className="text-white/40">Firmware Updates</span></li>
              <li><span className="text-white/40">Warranty & Protection Plan</span></li>
              <li><span className="text-white/40">Find Authorized Retailers</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white/90 tracking-wider uppercase mb-4 text-[11px] font-mono">
              Corporate
            </h4>
            <ul className="space-y-2.5">
              <li><span className="text-white/40">Sony Group Portal</span></li>
              <li><span className="text-white/40">Design Philosophy</span></li>
              <li><span className="text-white/40">Sustainability</span></li>
              <li><span className="text-white/40">Press & News Releases</span></li>
            </ul>
          </div>
        </div>

        {/* Legal Bottom */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-white/40">
          <p>© 2026 Sony Corporation. All rights reserved. "SONY" and "WH-1000XM6" are registered trademarks.</p>
          <div className="flex items-center space-x-6">
            <span className="hover:text-white/70 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white/70 cursor-pointer">Terms of Use</span>
            <span className="hover:text-white/70 cursor-pointer">Cookie Preferences</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
