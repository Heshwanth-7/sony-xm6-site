'use client';

import React, { useState } from 'react';
import Navbar from './Navbar';
import CanvasSequence from './CanvasSequence';
import FeatureGrid from './FeatureGrid';
import AcousticShowcase from './AcousticShowcase';
import ColorSelector from './ColorSelector';
import TechSpecs from './TechSpecs';
import PreOrderModal from './PreOrderModal';
import Footer from './Footer';

interface ProductPageProps {
  frames: string[];
  frameCount: number;
}

export default function ProductPage({ frames, frameCount }: ProductPageProps) {
  const [isPreOrderOpen, setIsPreOrderOpen] = useState(false);
  const [preOrderColor, setPreOrderColor] = useState('Matte Obsidian Black');

  const handleOpenPreOrder = (colorName?: string) => {
    if (colorName) setPreOrderColor(colorName);
    setIsPreOrderOpen(true);
  };

  return (
    <main className="relative min-h-screen bg-[#050505] text-white">
      {/* Apple-style sticky top nav */}
      <Navbar onPreOrderClick={() => handleOpenPreOrder()} />

      {/* Anchor for top of page */}
      <div id="overview" className="h-0" />

      {/* Main sticky canvas scrollytelling image sequence */}
      <CanvasSequence
        initialFrames={frames}
        frameCount={frameCount}
        onPreOrderClick={() => handleOpenPreOrder()}
      />

      {/* Bento box features section */}
      <FeatureGrid />

      {/* Interactive ANC / Acoustic simulation */}
      <AcousticShowcase />

      {/* Color finishes showcase */}
      <ColorSelector onPreOrderClick={(c) => handleOpenPreOrder(c)} />

      {/* Master technical specs matrix */}
      <TechSpecs />

      {/* Luxury tech editorial footer */}
      <Footer />

      {/* Pre-order modal / drawer */}
      <PreOrderModal
        isOpen={isPreOrderOpen}
        onClose={() => setIsPreOrderOpen(false)}
        initialColor={preOrderColor}
      />
    </main>
  );
}
