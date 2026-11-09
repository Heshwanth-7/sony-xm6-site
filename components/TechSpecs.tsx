'use client';

import React, { useState } from 'react';
import { Sliders, ChevronDown } from 'lucide-react';

export default function TechSpecs() {
  const [openCategory, setOpenCategory] = useState<string | null>('audio');

  const categories = [
    {
      id: 'audio',
      title: 'Acoustic Architecture & Drivers',
      specs: [
        { label: 'Driver Unit', value: '40mm Dome Type (Carbon-Bio Composite Diaphragm)' },
        { label: 'Frequency Response', value: '3 Hz – 40,000 Hz (JEITA Standard)' },
        { label: 'Frequency Response (Active)', value: '3 Hz – 40,000 Hz' },
        { label: 'Frequency Response (Bluetooth®)', value: '20 Hz – 40,000 Hz (LDAC 96 kHz sampling 990 kbps)' },
        { label: 'Impedance', value: '48 Ω (1 kHz) (when unit is on), 16 Ω (1 kHz) (when unit is off)' },
        { label: 'Sensitivity', value: '106 dB / mW (when unit is on), 101 dB / mW (when unit is off)' },
        { label: 'DSEE Ultimate', value: 'Edge-AI Audio Upscaling with Real-Time Acoustic Prediction' },
      ],
    },
    {
      id: 'nc',
      title: 'Noise Cancelling & Microphones',
      specs: [
        { label: 'Noise Cancelling Processor', value: 'Dedicated HD Noise Cancelling Processor QN3 + V3 SoC' },
        { label: 'Microphone Array', value: '8 Beamforming Mics (4 mics per ear cup)' },
        { label: 'Atmospheric Pressure Optimizer', value: 'Real-time barometer sensor adapts to high-altitude flight cabins' },
        { label: 'Personal NC Optimizer', value: 'Scans head shape, eyeglasses, and ear acoustic resonance' },
        { label: 'Ambient Sound Control', value: '20 levels of adjustable transparency with Voice Passthrough Focus' },
        { label: 'Quick Attention', value: 'Capacitive touch gesture instantly mutes audio for instant conversation' },
      ],
    },
    {
      id: 'bluetooth',
      title: 'Connectivity & Wireless Codecs',
      specs: [
        { label: 'Bluetooth® Version', value: 'Bluetooth Core Specification Version 5.4' },
        { label: 'Effective Range', value: 'Line of sight approx. 30 m (100 ft)' },
        { label: 'Supported Audio Formats', value: 'LDAC, LC3, AAC, SBC, Qualcomm® aptX Adaptive' },
        { label: 'Supported Profile', value: 'A2DP, AVRCP, HFP, HSP, TMAP, PBP' },
        { label: 'Multipoint Connection', value: 'Simultaneous 2-device active standby & auto-switching' },
        { label: 'Google Fast Pair / Swift Pair', value: 'Supported with one-tap Android and Windows 11 pairing' },
      ],
    },
    {
      id: 'battery',
      title: 'Battery & Power',
      specs: [
        { label: 'Battery Life (Continuous Playback with NC)', value: 'Up to 45 Hours' },
        { label: 'Battery Life (Continuous Playback NC Off)', value: 'Up to 55 Hours' },
        { label: 'Battery Life (Continuous Communication)', value: 'Up to 34 Hours' },
        { label: 'Quick Charge Capability', value: '3 minutes charge delivers up to 5 hours playback' },
        { label: 'Charging Method', value: 'USB Type-C® Fast Charge (Power Delivery compatible)' },
        { label: 'Full Charge Time', value: 'Approx. 2.5 hours from 0% to 100%' },
      ],
    },
    {
      id: 'physical',
      title: 'Ergonomics, Materials & Weight',
      specs: [
        { label: 'Weight', value: 'Approx. 248 grams (8.75 oz)' },
        { label: 'Ear Cushion Material', value: 'Ultra-plush pressure-relieving vegan thermo-memory foam' },
        { label: 'Headband Construction', value: 'Anodized aircraft-grade aluminum silent slider' },
        { label: 'Fold Mechanism', value: 'Flat swivel design with precision tension dampening' },
        { label: 'Wearing Style', value: 'Circumaural (Over-Ear Closed Dynamic)' },
      ],
    },
    {
      id: 'box',
      title: 'What’s In The Box',
      specs: [
        { label: 'Headphones', value: 'Sony WH-1000XM6 Wireless Noise Cancelling Headphones' },
        { label: 'Case', value: 'Magnetic slim-profile protective hardshell carrying case' },
        { label: 'Audio Cable', value: '1.2m Gold-plated oxygen-free stereo mini-plug cable' },
        { label: 'Charging Cable', value: 'Braided USB-C to USB-C charging cable (0.5m)' },
        { label: 'Flight Adapter', value: 'In-flight dual-prong plug adapter' },
        { label: 'Documentation', value: 'Reference guide, quick start manual, warranty card' },
      ],
    },
  ];

  return (
    <section id="specs" className="relative py-16 md:py-32 bg-[#0A0A0C] text-white border-t border-white/5">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-8 md:mb-16">
          <div className="inline-flex items-center space-x-1.5 md:space-x-2 px-2.5 py-1 md:px-3 md:py-1 rounded-full glass-panel border border-white/10 mb-2.5 md:mb-4">
            <Sliders className="w-3 h-3 md:w-3.5 md:h-3.5 text-accent-cyan" />
            <span className="text-[10px] md:text-[11px] uppercase tracking-wider md:tracking-[0.2em] text-white/70 font-mono">
              Complete Specifications
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-white mb-2 md:mb-4 leading-tight">
            Master Technical Datasheet
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-white/70 max-w-xl mx-auto leading-relaxed">
            Engineered down to the micrometer for uncompromising audiophile fidelity.
          </p>
        </div>

        {/* Expandable Accordion Categories */}
        <div className="space-y-3 md:space-y-4">
          {categories.map((cat) => {
            const isOpen = openCategory === cat.id;

            return (
              <div
                key={cat.id}
                className="glass-panel rounded-xl md:rounded-2xl border border-white/10 overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setOpenCategory(isOpen ? null : cat.id)}
                  className="w-full px-4 py-3.5 sm:px-6 sm:py-5 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
                >
                  <span className="text-sm sm:text-base md:text-lg font-semibold text-white/90">
                    {cat.title}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 md:w-5 md:h-5 text-accent-cyan transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 sm:px-6 sm:pb-6 sm:pt-2 border-t border-white/5">
                    <dl className="divide-y divide-white/5">
                      {cat.specs.map((item, idx) => (
                        <div
                          key={idx}
                          className="py-2.5 sm:py-3 sm:grid sm:grid-cols-3 sm:gap-4 flex flex-col justify-between"
                        >
                          <dt className="text-[11px] sm:text-sm font-medium text-white/50 font-mono">
                            {item.label}
                          </dt>
                          <dd className="mt-0.5 sm:mt-0 sm:col-span-2 text-xs sm:text-sm text-white/90 font-mono">
                            {item.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
