import fs from 'fs';
import path from 'path';
import ProductPage from '@/components/ProductPage';

export const dynamic = 'force-dynamic';

function getFramesData() {
  const framesDir = path.join(process.cwd(), 'public', 'frames');
  
  if (!fs.existsSync(framesDir)) {
    return { frameCount: 0, frames: [] };
  }

  const files = fs.readdirSync(framesDir);
  const frameFiles = files
    .filter((file) => /^frame_\d+\.jpg$/i.test(file))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  return {
    frameCount: frameFiles.length,
    frames: frameFiles.map((file) => `/frames/${file}`),
  };
}

export default function Home() {
  const { frames, frameCount } = getFramesData();

  return <ProductPage frames={frames} frameCount={frameCount} />;
}
