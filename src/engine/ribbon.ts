import type { Dot, ModeDraw } from './types';
import { paint, radiusScale } from './core';
import { cubeDepth, cubeRadius, cubeSurface, cubeSurfaceSamples, cubeWirePoints, makeCubeProj } from './cube';

export const drawRibbon: ModeDraw = (ctx, size, t, dark, o) => {
  const center = size / 2;
  const half = cubeRadius(size, 0.96);
  const spin = o.spin ?? 0;
  const pt = makeCubeProj(t * 0.08 * spin + Math.sin(t * 0.12) * 0.045, Math.sin(t * 0.1) * 0.025, center, center, 1);
  const rs = radiusScale(size, o.rsPow ?? 0.6);
  const dots: Dot[] = [];
  const surfaceDots = Math.max(0, Math.round(o.surfaceDots ?? 90));

  for (const point of cubeSurfaceSamples(surfaceDots, half)) {
    const [x, y, z] = pt(point[0], point[1], point[2]);
    const depth = cubeDepth(z, half);
    dots.push({
      x,
      y,
      z,
      r: (o.surfaceR ?? 0.7) * rs,
      white: 0.79,
      a: 0.07 + 0.19 * depth
    });
  }

  const planeYaw = t * 0.18 * spin;
  const planeTilt = 0.55 + 0.12 * Math.sin(t * 0.18);
  const ux = Math.cos(planeYaw);
  const uy = 0;
  const uz = Math.sin(planeYaw);
  const vx = -uz * Math.sin(planeTilt);
  const vy = Math.cos(planeTilt);
  const vz = ux * Math.sin(planeTilt);
  const nx = uy * vz - uz * vy;
  const ny = uz * vx - ux * vz;
  const nz = ux * vy - uy * vx;
  const lanes = Math.max(1, Math.round((o.lanes ?? 5) * (o.bandMul ?? 1)));
  const segments = Math.max(8, Math.round(o.segments ?? 72));

  for (let lane = 0; lane < lanes; lane++) {
    const laneOffset = (lane - (lanes - 1) / 2) * 0.07;
    const edge = Math.abs(lane - (lanes - 1) / 2) / Math.max(1, (lanes - 1) / 2);
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const wave =
        (0.15 * Math.sin(angle * 3 - t * 1.7 + lane * 0.22) + 0.07 * Math.sin(angle * 5 + t * 1.1)) *
        (o.waveMul ?? 1);
      const point = cubeSurface(
        [
          ux * Math.cos(angle) + vx * Math.sin(angle) + nx * (laneOffset + wave),
          uy * Math.cos(angle) + vy * Math.sin(angle) + ny * (laneOffset + wave),
          uz * Math.cos(angle) + vz * Math.sin(angle) + nz * (laneOffset + wave)
        ],
        half * (1 + wave * 0.025)
      );
      const [x, y, z] = pt(point[0], point[1], point[2]);
      const depth = cubeDepth(z, half);
      dots.push({
        x,
        y,
        z,
        r: ((o.rBase ?? 1.05) + (o.rDepth ?? 1.65) * depth) * (1 - 0.24 * edge) * rs,
        white: 0.52 - 0.44 * depth + 0.18 * edge,
        a: 0.38 + 0.62 * depth
      });
    }
  }

  paint(ctx, dots, dark, o.rMin);
};

export const drawBreathingCube: ModeDraw = (ctx, size, t, dark, o) => {
  const center = size / 2;
  const half = cubeRadius(size, 0.91);
  const pt = makeCubeProj(Math.sin(t * 0.16) * 0.045, Math.sin(t * 0.12) * 0.025, center, center, 1);
  const rs = radiusScale(size, o.rsPow ?? 0.6);
  const edgeDots = Math.max(2, Math.round(o.edgeDots ?? 9));
  const shells = Math.max(1, Math.round(o.shells ?? 3));
  const pulse = 1 + (o.breathAmp ?? 0.075) * (0.65 * Math.sin(t * 1.25) + 0.35 * Math.sin(t * 0.72 + 1.1));
  const dots: Dot[] = [];

  for (let shell = 0; shell < shells; shell++) {
    const offset = (shell - (shells - 1) / 2) * 0.038;
    for (const point of cubeWirePoints(edgeDots, half * (pulse + offset))) {
      const [x, y, z] = pt(point[0], point[1], point[2]);
      const depth = cubeDepth(z, half * 1.12);
      dots.push({
        x,
        y,
        z,
        r: ((o.rBase ?? 0.95) + (o.rDepth ?? 1.55) * depth) * rs,
        white: 0.57 - 0.47 * depth + Math.abs(offset) * 2,
        a: 0.38 + 0.62 * depth
      });
    }
  }

  paint(ctx, dots, dark, o.rMin);
};