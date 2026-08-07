import type { Dot, ModeDraw } from './types';
import { paint, radiusScale } from './core';
import { cubeDepth, cubeRadius, cubeWirePoints, makeCubeProj } from './cube';

const SHAPES: ReadonlyArray<readonly [number, number, number]> = [
  [1, 1, 1],
  [0.78, 1.16, 0.9],
  [1.15, 0.82, 1]
];

function smooth(value: number): number {
  return value * value * (3 - 2 * value);
}

export const drawMorph: ModeDraw = (ctx, size, t, dark, o) => {
  const hold = 1.35;
  const transition = 0.9;
  const segment = hold + transition;
  const cycleTime = t % (segment * SHAPES.length);
  const shapeIndex = Math.floor(cycleTime / segment);
  const local = cycleTime - shapeIndex * segment;
  const blend = local > hold ? smooth((local - hold) / transition) : 0;
  const from = SHAPES[shapeIndex];
  const to = SHAPES[(shapeIndex + 1) % SHAPES.length];
  const scales = [
    from[0] + (to[0] - from[0]) * blend,
    from[1] + (to[1] - from[1]) * blend,
    from[2] + (to[2] - from[2]) * blend
  ];
  const center = size / 2;
  const half = cubeRadius(size, 0.86 * (o.shapeScale ?? 1));
  const pt = makeCubeProj(Math.sin(t * 0.15) * 0.055, Math.sin(t * 0.1) * 0.025, center, center, 1);
  const rs = radiusScale(size, o.rsPow ?? 0.6);
  const pulse = 1 + 0.018 * Math.sin(local * 3.1);
  const dots: Dot[] = [];

  for (const point of cubeWirePoints(o.edgeDots ?? 10, half)) {
    const [x, y, z] = pt(point[0] * scales[0] * pulse, point[1] * scales[1] * pulse, point[2] * scales[2] * pulse);
    const depth = cubeDepth(z, half * 1.2);
    dots.push({
      x,
      y,
      z,
      r: ((o.dotR ?? 1.25) + depth * (o.dotDepthR ?? 0.9)) * rs,
      white: 0.58 - depth * 0.48,
      a: 0.42 + depth * 0.58
    });
  }

  paint(ctx, dots, dark, o.rMin);
};