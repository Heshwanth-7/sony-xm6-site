import fs from 'fs';
import path from 'path';
import ProductPage from '@/components/ProductPage';
import { getAssetPath } from '@/lib/basePath';

export const dynamic = 'force-static';

function getFramesData() {
  const countFrames = (dir: string) => {
    if (!fs.existsSync(dir)) return 0;
    return fs
      .readdirSync(dir)
      .filter((file) => /^frame_\d+\.webp$/i.test(file)).length;
  };

  const desktopDir = path.join(process.cwd(), 'public', 'frames');
  const mobileDir = path.join(process.cwd(), 'public', 'frames-mobile');

  const desktopCount = countFrames(desktopDir);
  const mobileCount = countFrames(mobileDir);

  return {
    desktopCount,
    desktopBasePath: getAssetPath('/frames'),
    mobileCount,
    mobileBasePath: getAssetPath('/frames-mobile'),
  };
}

export default function Home() {
  const framesData = getFramesData();

  return <ProductPage {...framesData} />;
}
