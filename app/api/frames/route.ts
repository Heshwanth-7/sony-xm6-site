import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const framesDir = path.join(process.cwd(), 'public', 'frames');
    
    if (!fs.existsSync(framesDir)) {
      return NextResponse.json({ error: 'Frames directory not found' }, { status: 404 });
    }

    const files = fs.readdirSync(framesDir);
    const frameFiles = files
      .filter((file) => /^frame_\d+\.jpg$/i.test(file))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    return NextResponse.json({
      frameCount: frameFiles.length,
      frames: frameFiles.map((file) => `/frames/${file}`),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read frames' }, { status: 500 });
  }
}
