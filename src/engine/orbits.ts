import type { Dot, ModeDraw } from './types';
import { frac, hashD, paint, radiusScale } from './core';
import { CUBE_EDGE_COUNT, cubeDepth, cubeEdgePoint, cubeRadius, makeCubeProj } from './cube';

export const drawOrbits: ModeDraw = (ctx, size, t, dark, o) => {
  const center = size / 2;
  const half = cubeRadius(size, 0.98);
  const pt = makeCubeProj(Math.sin(t * 0.15) * 0.07, Math.sin(t * 0.11) * 0.035, center, center, 1);
  const rs = radiusScale(size, o.rsPow ?? 0.6);
  const dots: Dot[] = [];
  const edgeDots = Math.max(2, Math.round(o.edgeDots ?? 10));

  for (let edge = 0; edge < CUBE_EDGE_COUNT; edge++) {
    for (let i = 0; i < edgeDots; i++) {
      const p = cubeEdgePoint(edge, i / (edgeDots - 1), half);
      const [x, y, z] = pt(p[0], p[1], p[2]);
      const depth = cubeDepth(z, half);
      dots.push({
        x,
        y,
        z,
        r: (o.trailR ?? 0.75) * (0.72 + depth * 0.38) * rs,
        white: 0.76 - depth * 0.12,
        a: (o.trailA ?? 0.48) * (0.45 + depth * 0.55)
      });
    }
  }

  const particles = Math.max(1, Math.round(o.particleCount ?? 5));
  const trailDots = Math.max(0, Math.round(o.trailDots ?? 3));
  for (let i = 0; i < particles; i++) {
    const edge = Math.floor(hashD(i, 3.7) * CUBE_EDGE_COUNT);
    const forward = edge % 2 === 0;
    const phase = frac(t * (0.22 + hashD(i, 8.1) * 0.13) + hashD(i, 1.9));
    const travel = forward ? phase : 1 - phase;
    for (let trail = trailDots; trail >= 0; trail--) {
      const f = travel + (forward ? -1 : 1) * trail * 0.065;
      if (f < 0 || f > 1) continue;
      const p = cubeEdgePoint(edge, f, half);
      const [x, y, z] = pt(p[0], p[1], p[2]);
      const depth = cubeDepth(z, half);
      const strength = 1 - trail / Math.max(1, trailDots + 1);
      dots.push({
        x,
        y,
        z: z + trail * 0.001,
        r: ((o.particleR ?? 1.45) + (o.particleDepthR ?? 1.2) * depth) * (0.55 + strength * 0.45) * rs,
        white: 0.34 - depth * 0.27,
        a: 0.3 + strength * 0.7
      });
    }
  }

  paint(ctx, dots, dark, o.rMin);
};