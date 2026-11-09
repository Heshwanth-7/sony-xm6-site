'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowDown, Loader2, Sparkles, ChevronDown } from 'lucide-react';
import { getAssetPath } from '@/lib/basePath';

const MOBILE_ZOOM = 1.25;
const LERP_FACTOR = 0.2; // Easing factor between 0.15 and 0.25

const isMobileScreen = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768 || window.innerHeight > window.innerWidth;
};

interface CanvasSequenceProps {
  desktopCount?: number;
  desktopBasePath?: string;
  mobileCount?: number;
  mobileBasePath?: string;
  initialFrames?: string[];
  frameCount?: number;
  onPreOrderClick?: () => void;
}

export default function CanvasSequence({
  desktopCount,
  desktopBasePath = '/frames',
  mobileCount,
  mobileBasePath = '/frames-mobile',
  initialFrames,
  frameCount,
  onPreOrderClick,
}: CanvasSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Images cache
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentSetRef = useRef<'mobile' | 'desktop'>('desktop');
  const currentIndexRef = useRef<number>(0);
  const currentFrameFloatRef = useRef<number>(0);
  const targetFrameRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const cancelLoadRef = useRef<(() => void) | null>(null);

  // Loading state
  const [loadedCount, setLoadedCount] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [bgMatchedColor, setBgMatchedColor] = useState<string>('#050505');

  // Total frames for active set
  const [totalFrames, setTotalFrames] = useState<number>(() => {
    return desktopCount || mobileCount || frameCount || initialFrames?.length || 0;
  });
  const totalFramesRef = useRef<number>(totalFrames);

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

  // Draw specific frame index onto canvas
  const renderFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const img = imagesRef.current[index];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    // High quality smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const imgRatio = iw / ih;

    const isMobile = isMobileScreen();

    let drawWidth: number;
    let drawHeight: number;
    let offsetX: number;
    let offsetY: number;

    if (isMobile) {
      // On mobile & portrait: fill canvas with #050505, scale to fit screen width with MOBILE_ZOOM
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, cw, ch);

      drawWidth = cw * MOBILE_ZOOM;
      drawHeight = drawWidth / imgRatio;
      offsetX = (cw - drawWidth) / 2;

      // Vertically center strictly inside the IMAGE ZONE (top 48% under the navbar)
      const dpr = cw / (canvas.clientWidth || window.innerWidth || 1);
      const navHeight = 48 * dpr;
      const imageZoneBottom = ch * 0.48;
      const availableHeight = Math.max(0, imageZoneBottom - navHeight);
      offsetY = navHeight + (availableHeight - drawHeight) / 2;
    } else {
      // On desktop and landscape: cover scaling
      const canvasRatio = cw / ch;

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
    }

    // Never clear canvas before the next frame is ready - draw directly
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    currentIndexRef.current = index;
  }, []);

  // Resize canvas to match window dimensions multiplied by devicePixelRatio (capped at 2 on mobile & desktop)
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const displayWidth = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
    const displayHeight = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight;

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

  // Load a single frame set (mobile or desktop). Never load both.
  const loadFrameSet = useCallback(
    (setType: 'mobile' | 'desktop', isInitial: boolean) => {
      // Cancel any ongoing batch
      if (cancelLoadRef.current) {
        cancelLoadRef.current();
        cancelLoadRef.current = null;
      }

      let isCancelled = false;
      cancelLoadRef.current = () => {
        isCancelled = true;
      };

      const targetCount =
        setType === 'mobile'
          ? mobileCount || desktopCount || frameCount || initialFrames?.length || 0
          : desktopCount || mobileCount || frameCount || initialFrames?.length || 0;

      const basePath =
        setType === 'mobile'
          ? mobileBasePath || '/frames-mobile'
          : desktopBasePath || '/frames';

      totalFramesRef.current = targetCount;
      setTotalFrames(targetCount);

      if (targetCount === 0) {
        if (isInitial) setIsLoaded(true);
        return;
      }

      const images: HTMLImageElement[] = [];
      for (let i = 0; i < targetCount; i++) {
        images.push(new Image());
      }

      if (isInitial) {
        imagesRef.current = images;
        currentSetRef.current = setType;
      }

      let count = 0;
      let hasStarted = false;
      const readyThreshold = Math.max(1, Math.ceil(targetCount * 0.2));

      const checkReady = () => {
        if (!hasStarted && (count >= readyThreshold || count === targetCount)) {
          hasStarted = true;
          if (isInitial) {
            setIsLoaded(true);
            handleResize();
            renderFrame(0);
          }
        }
      };

      const loadSingleFrame = (index: number) => {
        if (isCancelled || index >= targetCount) return;
        const img = images[index];
        const filename = `frame_${String(index + 1).padStart(4, '0')}.webp`;
        img.src = getAssetPath(`${basePath}/${filename}`);

        img.onload = () => {
          if (isCancelled) return;
          count++;
          if (isInitial) {
            setLoadedCount(count);
          }

          if (index === 0 && isInitial) {
            sampleFrameBackground(img);
            handleResize();
            renderFrame(0);
          }

          checkReady();

          // If switching set after resize, swap once the active frame is ready to avoid blank flash
          if (!isInitial && currentSetRef.current !== setType) {
            const desiredFrame = Math.min(targetCount - 1, currentIndexRef.current);
            if (images[desiredFrame]?.complete && images[desiredFrame]?.naturalWidth > 0) {
              imagesRef.current = images;
              currentSetRef.current = setType;
              handleResize();
              renderFrame(desiredFrame);
            }
          } else if (
            index === currentIndexRef.current ||
            index === Math.round(targetFrameRef.current)
          ) {
            renderFrame(index);
          }
        };

        img.onerror = () => {
          if (isCancelled) return;
          count++;
          if (isInitial) {
            setLoadedCount(count);
          }
          checkReady();
        };
      };

      // Load in small batches so devices aren't asked to decode everything at once
      const batchSize = setType === 'mobile' ? 6 : 10;
      const batchDelay = setType === 'mobile' ? 35 : 20;
      let currentBatchStart = 0;

      // Prioritize loading current frame index if switching sets
      if (!isInitial && currentIndexRef.current > 0 && currentIndexRef.current < targetCount) {
        loadSingleFrame(currentIndexRef.current);
      }

      const pumpBatch = () => {
        if (isCancelled) return;
        const end = Math.min(currentBatchStart + batchSize, targetCount);
        for (let i = currentBatchStart; i < end; i++) {
          loadSingleFrame(i);
        }
        currentBatchStart = end;
        if (currentBatchStart < targetCount && !isCancelled) {
          setTimeout(pumpBatch, batchDelay);
        }
      };

      pumpBatch();
    },
    [
      desktopCount,
      desktopBasePath,
      mobileCount,
      mobileBasePath,
      frameCount,
      initialFrames,
      sampleFrameBackground,
      handleResize,
      renderFrame,
    ]
  );

  // Initial load: choose mobile set when window.innerWidth < 768 or portrait, otherwise desktop set
  useEffect(() => {
    const isMobile = isMobileScreen();
    const initialSet = isMobile ? 'mobile' : 'desktop';
    loadFrameSet(initialSet, true);

    return () => {
      if (cancelLoadRef.current) {
        cancelLoadRef.current();
        cancelLoadRef.current = null;
      }
    };
  }, [loadFrameSet]);

  // Handle window resize and orientation change
  useEffect(() => {
    const handleResizeOrOrientation = () => {
      handleResize();

      const isMobile = isMobileScreen();
      const expectedSet = isMobile ? 'mobile' : 'desktop';

      if (expectedSet !== currentSetRef.current) {
        loadFrameSet(expectedSet, false);
      }
    };

    window.addEventListener('resize', handleResizeOrOrientation, { passive: true });
    window.addEventListener('orientationchange', handleResizeOrOrientation, { passive: true });
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResizeOrOrientation);
      window.removeEventListener('orientationchange', handleResizeOrOrientation);
    };
  }, [handleResize, loadFrameSet]);

  // Smooth scroll-to-frame easing loop (lerp factor between 0.15 and 0.25)
  const updateFrame = useCallback(() => {
    const total = totalFramesRef.current;
    if (total <= 0) return;

    const target = targetFrameRef.current;
    const current = currentFrameFloatRef.current;
    const diff = target - current;

    if (Math.abs(diff) > 0.01) {
      currentFrameFloatRef.current = current + diff * LERP_FACTOR;
      const frameToRender = Math.min(
        total - 1,
        Math.max(0, Math.round(currentFrameFloatRef.current))
      );

      if (frameToRender !== currentIndexRef.current) {
        renderFrame(frameToRender);
      }

      rafIdRef.current = requestAnimationFrame(updateFrame);
    } else {
      currentFrameFloatRef.current = target;
      const frameToRender = Math.min(
        total - 1,
        Math.max(0, Math.round(target))
      );

      if (frameToRender !== currentIndexRef.current) {
        renderFrame(frameToRender);
      }

      rafIdRef.current = null;
    }
  }, [renderFrame]);

  // Scroll listener mapped to frame playback with lerp smoothing
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = containerRef.current.offsetHeight - window.innerHeight;

      if (totalScrollable <= 0) return;

      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));

      setScrollProgress(progress);

      const total = totalFramesRef.current;
      if (total <= 0) return;

      // Target frame reaches total - 1 at 100% scroll
      targetFrameRef.current = progress * (total - 1);

      if (!rafIdRef.current) {
        rafIdRef.current = requestAnimationFrame(updateFrame);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [updateFrame]);

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

          <div className="relative z-10 flex flex-col items-center text-center px-5 sm:px-6">
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

      {/* Sticky Canvas Viewport (100svh on mobile, h-screen on desktop) */}
      <div className="sticky top-0 h-[100svh] md:h-screen w-full overflow-hidden flex items-center justify-center">
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
          className="absolute inset-x-0 top-[48%] bottom-0 md:inset-0 flex flex-col items-center justify-start md:justify-center pt-2 sm:pt-4 md:pt-0 px-4 sm:px-6 md:px-6 z-20"
          style={getBeatStyle(0, 0, 0.10, 0.16)}
        >
          <div className="w-full max-w-[360px] md:max-w-4xl mx-auto flex flex-col items-center text-center p-3 sm:p-4 md:p-0 rounded-xl md:rounded-none bg-black/50 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none border border-white/5 md:border-transparent">
            <div className="inline-flex items-center space-x-1.5 md:space-x-2 px-2 py-0.5 md:px-3 md:py-1 rounded-full glass-panel border border-white/10 mb-2 md:mb-6 shadow-2xl">
              <Sparkles className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 text-accent-cyan" />
              <span className="text-[9px] md:text-[11px] uppercase tracking-wider md:tracking-[0.25em] text-white/80 font-medium">
                Next-Generation Acoustic Architecture
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-7xl lg:text-8xl font-bold tracking-tight md:tracking-tighter text-gradient-white mb-1 md:mb-4 leading-tight">
              Sony WH-1000XM6
            </h1>

            <p className="text-sm sm:text-lg md:text-3xl font-light tracking-tight text-gradient-cyan mb-1.5 md:mb-6">
              Silence, perfected.
            </p>

            <p className="max-w-xs md:max-w-xl text-xs sm:text-sm md:text-base text-white/70 font-normal leading-relaxed mb-3 md:mb-10">
              Flagship wireless noise cancelling, re‑engineered for a world that never stops.
            </p>

            {/* Scroll Indicator */}
            <div className="flex flex-col items-center space-y-1 animate-bounce">
              <span className="text-[9px] md:text-[11px] tracking-wider md:tracking-widest uppercase font-mono text-white/40">
                Scroll to Disassemble
              </span>
              <ChevronDown className="w-3 h-3 md:w-4 md:h-4 text-accent-cyan" />
            </div>
          </div>
        </div>

        {/* BEAT 2: ENGINEERING REVEAL (15% - 40% scroll) */}
        <div
          className="absolute inset-x-0 top-[48%] bottom-0 md:inset-0 flex flex-col items-center md:items-center justify-start md:justify-start pt-2 sm:pt-4 md:pt-0 px-4 sm:px-5 md:px-16 md:lg:px-24 z-20 pointer-events-none"
          style={getBeatStyle(0.16, 0.22, 0.34, 0.40)}
        >
          <div className="w-full max-w-[360px] md:max-w-xl text-left pointer-events-auto p-3 sm:p-4 md:p-0 rounded-xl md:rounded-none bg-black/50 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none border border-white/5 md:border-transparent">
            <div className="text-[10px] md:text-xs font-mono tracking-wider md:tracking-widest text-accent-cyan uppercase mb-1.5 md:mb-3 flex items-center space-x-2">
              <span className="w-2 h-[1px] bg-accent-cyan" />
              <span>Phase 01 // Internal Architecture</span>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-5xl font-bold tracking-tight text-white mb-1.5 md:mb-6 leading-tight">
              Precision-engineered for silence.
            </h2>

            <p className="text-xs sm:text-sm md:text-lg text-white/70 font-normal leading-relaxed mb-2 md:mb-4 max-w-sm md:max-w-lg">
              Custom drivers, sealed acoustic chambers, and optimized airflow deliver studio-grade clarity.
            </p>

            <p className="hidden md:block text-xs sm:text-sm md:text-base text-white/50 font-normal leading-relaxed mb-3 md:mb-8 max-w-sm md:max-w-lg">
              Every component is tuned for balance, power, and comfort—hour after hour.
            </p>

            {/* Spec callout pills */}
            <div className="grid grid-cols-2 gap-2 md:gap-3 pt-1 md:pt-2">
              <div className="glass-panel p-2 md:p-3.5 rounded-lg md:rounded-xl border border-white/10">
                <div className="text-accent-cyan font-mono text-[9px] md:text-xs mb-0.5 md:mb-1 tracking-wider">DRIVER SPEC</div>
                <div className="text-white text-xs md:text-sm font-semibold leading-tight">40mm Carbon-Bio</div>
                <div className="text-[9px] md:text-[11px] text-white/40 mt-0.5 leading-snug">Distortion &lt;0.01%</div>
              </div>
              <div className="glass-panel p-2 md:p-3.5 rounded-lg md:rounded-xl border border-white/10">
                <div className="text-accent-cyan font-mono text-[9px] md:text-xs mb-0.5 md:mb-1 tracking-wider">ACOUSTIC CAVITY</div>
                <div className="text-white text-xs md:text-sm font-semibold leading-tight">Aero-Acoustic Baffle</div>
                <div className="text-[9px] md:text-[11px] text-white/40 mt-0.5 leading-snug">Resonance damping</div>
              </div>
            </div>
          </div>
        </div>

        {/* BEAT 3: NOISE CANCELLING & MICROPHONES (40% - 65% scroll) */}
        <div
          className="absolute inset-x-0 top-[48%] bottom-0 md:inset-0 flex flex-col items-center md:items-center justify-start md:justify-end pt-2 sm:pt-4 md:pb-0 px-4 sm:px-5 md:px-16 md:lg:px-24 z-20 pointer-events-none"
          style={getBeatStyle(0.40, 0.46, 0.58, 0.65)}
        >
          <div className="w-full max-w-[360px] md:max-w-xl text-left md:text-right pointer-events-auto p-3 sm:p-4 md:p-0 rounded-xl md:rounded-none bg-black/50 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none border border-white/5 md:border-transparent">
            <div className="text-[10px] md:text-xs font-mono tracking-wider md:tracking-widest text-accent-cyan uppercase mb-1.5 md:mb-3 flex items-center justify-start md:justify-end space-x-2">
              <span>Phase 02 // Neural Cancellation</span>
              <span className="w-2 h-[1px] bg-accent-cyan" />
            </div>

            <h2 className="text-xl sm:text-2xl md:text-5xl font-bold tracking-tight text-white mb-1.5 md:mb-6 leading-tight">
              Adaptive noise cancelling, redefined.
            </h2>

            <div className="space-y-1 md:space-y-4 text-left md:text-right mb-2 md:mb-8">
              <div className="flex items-center justify-start md:justify-end space-x-2 md:space-x-3 text-white/80 text-xs md:text-base leading-relaxed">
                <span>Multi-microphone array listens in every direction.</span>
                <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan flex-shrink-0" />
              </div>
              <div className="flex items-center justify-start md:justify-end space-x-2 md:space-x-3 text-white/80 text-xs md:text-base leading-relaxed">
                <span>Real-time noise analysis adjusts to your environment.</span>
                <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan flex-shrink-0" />
              </div>
              <div className="hidden sm:flex md:flex items-center justify-start md:justify-end space-x-2 md:space-x-3 text-white/80 text-xs md:text-base leading-relaxed">
                <span>Your music stays pure—external noise fades away.</span>
                <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan flex-shrink-0" />
              </div>
            </div>

            {/* Neural chip callout */}
            <div className="inline-block w-full md:w-auto glass-panel p-2 md:p-4 rounded-lg md:rounded-xl border border-white/10 text-left md:text-right">
              <div className="text-[9px] md:text-xs font-mono text-accent-cyan tracking-wider">DUAL-CHIPSET ENGINE</div>
              <div className="text-white font-semibold text-xs md:text-sm mt-0.5 leading-tight">QN3 Noise Processor + V3 Audio SoC</div>
              <div className="text-[9px] md:text-[11px] text-white/50 mt-0.5">700,000 anti-noise calculations/sec</div>
            </div>
          </div>
        </div>

        {/* BEAT 4: SOUND & UPSCALING (65% - 85% scroll) */}
        <div
          className="absolute inset-x-0 top-[48%] bottom-0 md:inset-0 flex flex-col items-center md:items-center justify-start md:justify-start pt-2 sm:pt-4 md:pt-0 px-4 sm:px-5 md:px-16 md:lg:px-24 z-20 pointer-events-none"
          style={getBeatStyle(0.65, 0.70, 0.80, 0.85)}
        >
          <div className="w-full max-w-[360px] md:max-w-xl text-left pointer-events-auto p-3 sm:p-4 md:p-0 rounded-xl md:rounded-none bg-black/50 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none border border-white/5 md:border-transparent">
            <div className="text-[10px] md:text-xs font-mono tracking-wider md:tracking-widest text-accent-cyan uppercase mb-1.5 md:mb-3 flex items-center space-x-2">
              <span className="w-2 h-[1px] bg-accent-cyan" />
              <span>Phase 03 // Audiophile Transducers</span>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-5xl font-bold tracking-tight text-gradient-white mb-1.5 md:mb-6 leading-tight">
              Immersive, lifelike sound.
            </h2>

            <p className="text-xs sm:text-sm md:text-lg text-white/70 font-normal leading-relaxed mb-1.5 md:mb-4 max-w-sm md:max-w-lg">
              High-performance drivers unlock detail, depth, and texture in every track.
            </p>

            <p className="hidden md:block text-xs sm:text-sm md:text-base text-white/50 font-normal leading-relaxed mb-3 md:mb-8 max-w-sm md:max-w-lg">
              AI-enhanced upscaling restores clarity to compressed audio, so every note feels alive.
            </p>

            {/* Sound features tags */}
            <div className="flex flex-wrap gap-1.5 md:gap-2 pt-1 md:pt-0">
              <span className="px-2 py-0.5 md:px-3 md:py-1.5 rounded-md md:rounded-lg text-[9px] md:text-xs font-mono glass-panel border border-white/15 text-white/90">
                Hi-Res Wireless
              </span>
              <span className="px-2 py-0.5 md:px-3 md:py-1.5 rounded-md md:rounded-lg text-[9px] md:text-xs font-mono glass-panel border border-white/15 text-white/90">
                LDAC™ 990 kbps
              </span>
              <span className="px-2 py-0.5 md:px-3 md:py-1.5 rounded-md md:rounded-lg text-[9px] md:text-xs font-mono glass-panel border border-white/15 text-white/90">
                DSEE Ultimate AI
              </span>
              <span className="px-2 py-0.5 md:px-3 md:py-1.5 rounded-md md:rounded-lg text-[9px] md:text-xs font-mono glass-panel border border-white/15 text-accent-cyan">
                360 Reality Audio
              </span>
            </div>
          </div>
        </div>

        {/* BEAT 5: REASSEMBLY & CTA (85% - 100% scroll) */}
        <div
          className="absolute inset-x-0 top-[48%] bottom-0 md:inset-0 flex flex-col items-center justify-start md:justify-center pt-2 sm:pt-4 md:pt-0 px-4 sm:px-6 md:px-6 z-20"
          style={getBeatStyle(0.85, 0.90, 1.0, 1.0)}
        >
          <div className="w-full max-w-[360px] md:max-w-3xl mx-auto flex flex-col items-center text-center p-3 sm:p-4 md:p-0 rounded-xl md:rounded-none bg-black/50 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none border border-white/5 md:border-transparent">
            <div className="text-[10px] md:text-xs font-mono tracking-wider md:tracking-widest text-accent-cyan uppercase mb-1 md:mb-4">
              WH-1000XM6 // Master Assembled
            </div>

            <h2 className="text-xl sm:text-2xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-1 md:mb-4 leading-tight">
              Hear everything. Feel nothing else.
            </h2>

            <p className="text-xs sm:text-sm md:text-2xl font-light text-white/80 mb-1 md:mb-3">
              WH‑1000XM6. Designed for focus, crafted for comfort.
            </p>

            <p className="hidden md:block text-xs md:text-sm text-white/50 mb-5 md:mb-8 max-w-xs md:max-w-lg leading-relaxed">
              Engineered for airports, offices, and everything in between.
            </p>

            {/* CTAs */}
            <div className="flex flex-row items-center justify-center gap-2 md:gap-4 w-full sm:w-auto mt-2 md:mt-0">
              <button
                onClick={onPreOrderClick}
                className="flex-1 sm:flex-none px-4 py-2.5 md:px-8 md:py-3.5 rounded-full text-xs md:text-sm font-semibold bg-gradient-to-r from-accent-blue via-accent-cyan to-accent-blue text-white shadow-[0_0_20px_rgba(0,80,255,0.3)] hover:shadow-[0_0_40px_rgba(0,214,255,0.6)] transition-all whitespace-nowrap"
              >
                Experience XM6
              </button>

              <a
                href="#specs"
                className="flex-1 sm:flex-none px-3.5 py-2.5 md:px-6 md:py-3.5 rounded-full text-xs md:text-sm font-medium glass-panel border border-white/15 text-white/80 hover:text-white hover:border-white/30 transition-all text-center whitespace-nowrap"
              >
                Full specs
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
