import type { Dot, ModeDraw } from './types';
import { frac, paint, radiusScale } from './core';
import { cubeDepth, cubeRadius, cubeSurface, cubeSurfaceSamples, makeCubeProj } from './cube';

export const drawBraid: ModeDraw = (ctx, size, t, dark, o) => {
  const center = size / 2;
  const half = cubeRadius(size, 0.96);
  const pt = makeCubeProj(Math.sin(t * 0.16) * 0.065, Math.sin(t * 0.12) * 0.03, center, center, 1);
  const rs = radiusScale(size, o.rsPow ?? 0.6);
  const dots: Dot[] = [];
  const surfaceDots = Math.max(0, Math.round(o.surfaceDots ?? 100));

  for (const point of cubeSurfaceSamples(surfaceDots, half)) {
    const [x, y, z] = pt(point[0], point[1], point[2]);
    const depth = cubeDepth(z, half);
    dots.push({
      x,
      y,
      z,
      r: (o.surfaceR ?? 0.72) * rs,
      white: 0.79,
      a: 0.08 + 0.2 * depth
    });
  }

  const strandDots = Math.max(4, Math.round(o.strandDots ?? 52));
  const turns = o.turns ?? 3;
  for (let strand = 0; strand < 3; strand++) {
    const phase = (strand / 3) * Math.PI * 2;
    for (let i = 0; i < strandDots; i++) {
      const u = (frac(i / strandDots + t * 0.045) * 2 - 1) * 0.96;
      const surface = Math.sqrt(Math.max(0, 1 - u * u));
      const endFade = Math.min(1, (1 - Math.abs(u)) / 0.1);
      const angle = u * Math.PI * turns + phase;
      const weave = 1 + 0.055 * Math.sin(u * Math.PI * turns * 2 + phase * 2 + t * 0.8);
      const point = cubeSurface([Math.cos(angle) * surface, u, Math.sin(angle) * surface], half * weave);
      const [x, y, z] = pt(point[0], point[1], point[2]);
      const depth = cubeDepth(z, half);
      dots.push({
        x,
        y,
        z,
        r: ((o.rBase ?? 1.15) + (o.rDepth ?? 1.75) * depth) * rs,
        white: 0.55 - 0.45 * depth,
        a: endFade * (0.42 + 0.58 * depth)
      });
    }
  }

  paint(ctx, dots, dark, o.rMin);
};