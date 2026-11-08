'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowDown, Loader2, Sparkles, ChevronDown } from 'lucide-react';
import { getAssetPath } from '@/lib/basePath';

interface CanvasSequenceProps {
  initialFrames: string[];
  frameCount: number;
  onPreOrderClick?: () => void;
}

export default function CanvasSequence({
  initialFrames,
  frameCount,
  onPreOrderClick,
}: CanvasSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Images cache
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentIndexRef = useRef<number>(0);
  const targetFrameRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);

  // Loading state
  const [loadedCount, setLoadedCount] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [bgMatchedColor, setBgMatchedColor] = useState<string>('#050505');

  // Total frames count
  const totalFrames = frameCount || initialFrames.length || 0;

  // Eyedrop exact background color from the first loaded frame
  const sampleFrameBackground = useCallback((img: HTMLImageElement) => {
    try {
      const offscreen = document.createElement('canvas');
      offscreen.width = 16;
      offscreen.height = 16;
      const ctx = offscreen.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, 16, 16);
        const pixel = ctx.getImageData(2, 2, 1, 1).data;
        const color = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
        setBgMatchedColor(color);
        document.documentElement.style.setProperty('--bg-primary', color);
      }
    } catch (e) {
      // Fallback
    }
  }, []);

  // Draw specific frame index onto canvas with cover scaling and devicePixelRatio
  const renderFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const img = imagesRef.current[index];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    // Ensure high quality smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    // Cover scaling calculation
    const imgRatio = iw / ih;
    const canvasRatio = cw / ch;

    let drawWidth: number;
    let drawHeight: number;
    let offsetX: number;
    let offsetY: number;

    if (canvasRatio > imgRatio) {
      drawWidth = cw;
      drawHeight = cw / imgRatio;
      offsetX = 0;
      offsetY = (ch - drawHeight) / 2;
    } else {
      drawHeight = ch;
      drawWidth = ch * imgRatio;
      offsetX = (cw - drawWidth) / 2;
      offsetY = 0;
    }

    // Do NOT clear before drawing! Drawing directly over eliminates any flicker or blinking.
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    currentIndexRef.current = index;
  }, []);

  // Resize canvas to match window dimensions multiplied by devicePixelRatio
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    const targetWidth = Math.floor(displayWidth * dpr);
    const targetHeight = Math.floor(displayHeight * dpr);

    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
    }

    // Redraw current frame immediately after resize
    if (imagesRef.current.length > 0) {
      renderFrame(currentIndexRef.current);
    }
  }, [renderFrame]);

  // Preload frames in batches and start experience once first 20% are loaded
  useEffect(() => {
    let isCancelled = false;
    let count = 0;
    let hasStarted = false;
    const images: HTMLImageElement[] = [];

    // Pre-allocate array
    for (let i = 0; i < totalFrames; i++) {
      images.push(new Image());
    }
    imagesRef.current = images;

    // Start experience once 20% of frames are loaded
    const readyThreshold = totalFrames > 0 ? Math.max(1, Math.ceil(totalFrames * 0.2)) : 0;

    const checkReady = () => {
      if (!hasStarted && (count >= readyThreshold || count === totalFrames)) {
        hasStarted = true;
        setIsLoaded(true);
        handleResize();
        renderFrame(0);
      }
    };

    if (totalFrames === 0) {
      checkReady();
      return;
    }

    const loadFrame = (index: number) => {
      if (isCancelled || index >= totalFrames) return;
      const img = images[index];
      const frameUrl =
        initialFrames[index] ||
        getAssetPath(`/frames/frame_${String(index + 1).padStart(4, '0')}.webp`);

      img.src = frameUrl;
      img.onload = () => {
        if (isCancelled) return;
        count++;
        setLoadedCount(count);

        if (index === 0) {
          sampleFrameBackground(img);
          // Initial draw of frame 0
          handleResize();
          renderFrame(0);
        }

        checkReady();

        if (index === targetFrameRef.current) {
          renderFrame(index);
        }
      };

      img.onerror = () => {
        if (isCancelled) return;
        count++;
        setLoadedCount(count);
        checkReady();
      };
    };

    // Concurrently load frames in batches for faster ready state
    const batchSize = 12;
    let currentBatchStart = 0;

    const pumpBatch = () => {
      const end = Math.min(currentBatchStart + batchSize, totalFrames);
      for (let i = currentBatchStart; i < end; i++) {
        loadFrame(i);
      }
      currentBatchStart = end;
      if (currentBatchStart < totalFrames && !isCancelled) {
        setTimeout(pumpBatch, 20);
      }
    };

    pumpBatch();

    return () => {
      isCancelled = true;
    };
  }, [totalFrames, initialFrames, sampleFrameBackground, handleResize, renderFrame]);

  // Window resize listener
  useEffect(() => {
    window.addEventListener('resize', handleResize, { passive: true });
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Scroll listener mapped to frame playback
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = containerRef.current.offsetHeight - window.innerHeight;

      if (totalScrollable <= 0) return;

      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));

      setScrollProgress(progress);

      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }

      rafIdRef.current = requestAnimationFrame(() => {
        // Map 0 -> 1 progress to 0 -> (totalFrames - 1)
        const targetFrame = Math.min(
          totalFrames - 1,
          Math.max(0, Math.floor(progress * (totalFrames - 1)))
        );

        targetFrameRef.current = targetFrame;

        if (targetFrame !== currentIndexRef.current) {
          renderFrame(targetFrame);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [totalFrames, renderFrame]);

  // Helper for storytelling beat opacity/transforms
  const getBeatStyle = (start: number, peakStart: number, peakEnd: number, end: number) => {
    let opacity = 0;
    let translateY = 20;

    if (scrollProgress >= start && scrollProgress <= end) {
      if (scrollProgress < peakStart) {
        const factor = (scrollProgress - start) / (peakStart - start);
        opacity = factor;
        translateY = 20 * (1 - factor);
      } else if (scrollProgress <= peakEnd) {
        opacity = 1;
        translateY = 0;
      } else {
        const factor = (end - scrollProgress) / (end - peakEnd);
        opacity = Math.max(0, factor);
        translateY = -20 * (1 - factor);
      }
    }

    return {
      opacity,
      transform: `translateY(${translateY}px)`,
      pointerEvents: opacity > 0.4 ? ('auto' as const) : ('none' as const),
      visibility: opacity > 0.01 ? ('visible' as const) : ('hidden' as const),
      transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
    };
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{
        height: '480vh',
        backgroundColor: bgMatchedColor,
      }}
    >
      {/* Loading Overlay */}
      {!isLoaded && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-700"
          style={{ backgroundColor: bgMatchedColor }}
        >
          {/* Subtle Radial Glow */}
          <div className="absolute inset-0 radial-hero-glow pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center px-6">
            <div className="flex items-center space-x-2.5 mb-4">
              <span className="text-xs uppercase tracking-[0.25em] font-medium text-white/80 font-mono">
                Loading
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
            </div>

            {/* Minimal thin progress bar with no numbers */}
            <div className="w-40 h-[2px] bg-white/10 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-accent-blue via-accent-cyan to-white transition-all duration-150 ease-out rounded-full"
                style={{
                  width:
                    totalFrames > 0
                      ? `${Math.min(100, Math.round((loadedCount / Math.max(1, Math.ceil(totalFrames * 0.2))) * 100))}%`
                      : '0%',
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Sticky Canvas Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Ambient Subtle Radial Glow */}
        <div className="absolute inset-0 radial-hero-glow pointer-events-none opacity-60" />

        {/* The HTML5 Canvas */}
        <canvas
          ref={canvasRef}
          className="block w-full h-full object-cover"
          style={{
            backgroundColor: bgMatchedColor,
            imageRendering: 'auto', // Strictly avoided pixelated or crisp-edges
          }}
        />

        {/* Vignette Overlay to blend seamlessly into outer void */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_120px_rgba(5,5,5,0.8)]" />

        {/* Scroll percentage indicator on the right edge */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center space-y-3 z-30 pointer-events-none">
          <div className="text-[10px] font-mono text-white/30 tracking-widest uppercase [writing-mode:vertical-rl] rotate-180">
            DISASSEMBLY SEQUENCE
          </div>
          <div className="w-[1px] h-24 bg-white/10 relative">
            <div
              className="w-full bg-gradient-to-b from-accent-blue to-accent-cyan transition-all duration-100"
              style={{ height: `${scrollProgress * 100}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-accent-cyan">
            {Math.round(scrollProgress * 100)}%
          </span>
        </div>

        {/* STORYTELLING OVERLAYS (Synchronized with 0-100% scroll beats) */}

        {/* BEAT 1: HERO / INTRO (0% - 15% scroll) */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-20"
          style={getBeatStyle(0, 0, 0.10, 0.16)}
        >
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass-panel border border-white/10 mb-6 shadow-2xl">
              <Sparkles className="w-3.5 h-3.5 text-accent-cyan" />
              <span className="text-[11px] uppercase tracking-[0.25em] text-white/80 font-medium">
                Next-Generation Acoustic Architecture
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-gradient-white mb-4">
              Sony WH-1000XM6
            </h1>

            <p className="text-xl sm:text-2xl md:text-3xl font-light tracking-tight text-gradient-cyan mb-6">
              Silence, perfected.
            </p>

            <p className="max-w-xl text-sm sm:text-base text-white/60 font-normal leading-relaxed mb-10">
              Flagship wireless noise cancelling, re‑engineered for a world that never stops.
            </p>

            {/* Scroll Indicator */}
            <div className="flex flex-col items-center space-y-2 animate-bounce">
              <span className="text-[11px] tracking-widest uppercase font-mono text-white/40">
                Scroll to Disassemble
              </span>
              <ChevronDown className="w-4 h-4 text-accent-cyan" />
            </div>
          </div>
        </div>

        {/* BEAT 2: ENGINEERING REVEAL (15% - 40% scroll) */}
        <div
          className="absolute inset-0 flex items-center justify-start px-8 sm:px-16 lg:px-24 z-20 pointer-events-none"
          style={getBeatStyle(0.16, 0.22, 0.34, 0.40)}
        >
          <div className="max-w-xl text-left pointer-events-auto">
            <div className="text-xs font-mono tracking-widest text-accent-cyan uppercase mb-3 flex items-center space-x-2">
              <span className="w-2 h-[1px] bg-accent-cyan" />
              <span>Phase 01 // Internal Architecture</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
              Precision-engineered for silence.
            </h2>

            <p className="text-base sm:text-lg text-white/70 font-normal leading-relaxed mb-4">
              Custom drivers, sealed acoustic chambers, and optimized airflow deliver studio-grade clarity.
            </p>

            <p className="text-sm sm:text-base text-white/50 font-normal leading-relaxed mb-8">
              Every component is tuned for balance, power, and comfort—hour after hour.
            </p>

            {/* Spec callout pills */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="glass-panel p-3.5 rounded-xl border border-white/10">
                <div className="text-accent-cyan font-mono text-xs mb-1">DRIVER SPEC</div>
                <div className="text-white text-sm font-semibold">40mm Carbon-Bio Composite</div>
                <div className="text-[11px] text-white/40 mt-0.5">Sub-harmonic distortion &lt;0.01%</div>
              </div>
              <div className="glass-panel p-3.5 rounded-xl border border-white/10">
                <div className="text-accent-cyan font-mono text-xs mb-1">ACOUSTIC CAVITY</div>
                <div className="text-white text-sm font-semibold">Aero-Acoustic Baffle</div>
                <div className="text-[11px] text-white/40 mt-0.5">Resonance damping matrix</div>
              </div>
            </div>
          </div>
        </div>

        {/* BEAT 3: NOISE CANCELLING & MICROPHONES (40% - 65% scroll) */}
        <div
          className="absolute inset-0 flex items-center justify-end px-8 sm:px-16 lg:px-24 z-20 pointer-events-none"
          style={getBeatStyle(0.40, 0.46, 0.58, 0.65)}
        >
          <div className="max-w-xl text-right pointer-events-auto">
            <div className="text-xs font-mono tracking-widest text-accent-cyan uppercase mb-3 flex items-center justify-end space-x-2">
              <span>Phase 02 // Neural Cancellation</span>
              <span className="w-2 h-[1px] bg-accent-cyan" />
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
              Adaptive noise cancelling, redefined.
            </h2>

            <div className="space-y-4 text-right mb-8">
              <div className="flex items-center justify-end space-x-3 text-white/80 text-sm sm:text-base">
                <span>Multi-microphone array listens in every direction.</span>
                <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
              </div>
              <div className="flex items-center justify-end space-x-3 text-white/80 text-sm sm:text-base">
                <span>Real-time noise analysis adjusts to your environment.</span>
                <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
              </div>
              <div className="flex items-center justify-end space-x-3 text-white/80 text-sm sm:text-base">
                <span>Your music stays pure—planes, trains, and crowds fade away.</span>
                <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
              </div>
            </div>

            {/* Neural chip callout */}
            <div className="inline-block glass-panel p-4 rounded-xl border border-white/10 text-right">
              <div className="text-xs font-mono text-accent-cyan">DUAL-CHIPSET ENGINE</div>
              <div className="text-white font-semibold text-sm mt-0.5">QN3 Noise Processor + V3 Audio SoC</div>
              <div className="text-[11px] text-white/50 mt-1">700,000 algorithmic calculations per second</div>
            </div>
          </div>
        </div>

        {/* BEAT 4: SOUND & UPSCALING (65% - 85% scroll) */}
        <div
          className="absolute inset-0 flex items-center justify-start px-8 sm:px-16 lg:px-24 z-20 pointer-events-none"
          style={getBeatStyle(0.65, 0.70, 0.80, 0.85)}
        >
          <div className="max-w-xl text-left pointer-events-auto">
            <div className="text-xs font-mono tracking-widest text-accent-cyan uppercase mb-3 flex items-center space-x-2">
              <span className="w-2 h-[1px] bg-accent-cyan" />
              <span>Phase 03 // Audiophile Transducers</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gradient-white mb-6">
              Immersive, lifelike sound.
            </h2>

            <p className="text-base sm:text-lg text-white/70 font-normal leading-relaxed mb-4">
              High-performance drivers unlock detail, depth, and texture in every track.
            </p>

            <p className="text-sm sm:text-base text-white/50 font-normal leading-relaxed mb-8">
              AI-enhanced upscaling restores clarity to compressed audio, so every note feels alive.
            </p>

            {/* Sound features tags */}
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 rounded-lg text-xs font-mono glass-panel border border-white/15 text-white/90">
                Hi-Res Audio Wireless
              </span>
              <span className="px-3 py-1.5 rounded-lg text-xs font-mono glass-panel border border-white/15 text-white/90">
                LDAC™ 990 kbps
              </span>
              <span className="px-3 py-1.5 rounded-lg text-xs font-mono glass-panel border border-white/15 text-white/90">
                DSEE Ultimate AI Engine
              </span>
              <span className="px-3 py-1.5 rounded-lg text-xs font-mono glass-panel border border-white/15 text-accent-cyan">
                360 Reality Audio
              </span>
            </div>
          </div>
        </div>

        {/* BEAT 5: REASSEMBLY & CTA (85% - 100% scroll) */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-20"
          style={getBeatStyle(0.85, 0.90, 1.0, 1.0)}
        >
          <div className="max-w-3xl mx-auto flex flex-col items-center">
            <div className="text-xs font-mono tracking-widest text-accent-cyan uppercase mb-4">
              WH-1000XM6 // Master Assembled
            </div>

            <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-4">
              Hear everything. Feel nothing else.
            </h2>

            <p className="text-lg sm:text-xl md:text-2xl font-light text-white/80 mb-3">
              WH‑1000XM6. Designed for focus, crafted for comfort.
            </p>

            <p className="text-xs sm:text-sm text-white/50 mb-8 max-w-lg">
              Engineered for airports, offices, and everything in between.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={onPreOrderClick}
                className="px-8 py-3.5 rounded-full text-sm font-semibold bg-gradient-to-r from-accent-blue via-accent-cyan to-accent-blue text-white shadow-[0_0_30px_rgba(0,80,255,0.4)] hover:shadow-[0_0_40px_rgba(0,214,255,0.6)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Experience WH-1000XM6
              </button>

              <a
                href="#specs"
                className="px-6 py-3.5 rounded-full text-sm font-medium glass-panel border border-white/15 text-white/80 hover:text-white hover:border-white/30 transition-all"
              >
                See full specs
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
