import type { Dot, Line, ModeDraw } from './types';
import { fibDir, frac, hashD, lerp, paint, paintLines, radiusScale, vnoise } from './core';
import { cubeDepth, cubeRadius, cubeSurface, makeCubeProj } from './cube';

export const drawWeb: ModeDraw = (ctx, size, t, dark, o) => {
  const center = size / 2;
  const half = cubeRadius(size, 0.98 * (o.cubeScale ?? 1));
  const pt = makeCubeProj(Math.sin(t * 0.12) * 0.06, Math.sin(t * 0.09) * 0.03, center, center, half);
  const rs = radiusScale(size, o.rsPow ?? 0.6);
  const nodeCount = Math.max(4, Math.round(o.nodeCount ?? 30));
  const linkDistance = o.linkDistance ?? 0.82;
  const nodeR = o.nodeR ?? 1.35;
  const nodeDepthR = o.nodeDepthR ?? 1.75;
  const nodes: Array<[number, number, number]> = [];

  for (let i = 0; i < nodeCount; i++) {
    const direction = fibDir(i, nodeCount);
    const point: [number, number, number] = [
      direction[0] + 0.24 * (vnoise(i * 0.31 + 9, t * 0.24) - 0.5) * 2,
      direction[1] + 0.24 * (vnoise(i * 0.53 + 27, t * 0.21) - 0.5) * 2,
      direction[2] + 0.24 * (vnoise(i * 0.77 + 55, t * 0.27) - 0.5) * 2
    ];
    nodes.push(cubeSurface(point));
  }

  const lines: Line[] = [];
  const dots: Dot[] = [];

  for (let i = 0; i < nodeCount; i++) {
    for (let j = i + 1; j < nodeCount; j++) {
      const dx = nodes[i][0] - nodes[j][0];
      const dy = nodes[i][1] - nodes[j][1];
      const dz = nodes[i][2] - nodes[j][2];
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (distance >= linkDistance) continue;
      const [x1, y1, z1] = pt(nodes[i][0], nodes[i][1], nodes[i][2]);
      const [x2, y2, z2] = pt(nodes[j][0], nodes[j][1], nodes[j][2]);
      const depth = cubeDepth((z1 + z2) / 2, half);
      lines.push({
        x1,
        y1,
        x2,
        y2,
        white: 0.42,
        a: (1 - distance / linkDistance) * (0.28 + 0.58 * depth),
        w: Math.max(0.55, (o.lineW ?? 0.8) * rs)
      });
    }
  }

  for (let i = 0; i < nodeCount; i++) {
    const [x, y, z] = pt(nodes[i][0], nodes[i][1], nodes[i][2]);
    const depth = cubeDepth(z, half);
    const pulse = 1 + 0.22 * Math.sin(t * 1.4 + i * 2.7);
    dots.push({
      x,
      y,
      z,
      r: (nodeR + nodeDepthR * depth) * pulse * rs,
      white: 0.55 - 0.45 * depth
    });
  }

  const signalCount = Math.max(1, Math.round(o.signalCount ?? 5));
  for (let signal = 0; signal < signalCount; signal++) {
    const segment = Math.floor(t * 0.55 + signal * 7.31);
    const a = Math.floor(hashD(segment, signal * 3.1 + 1.7) * nodeCount);
    const b = Math.floor(hashD(segment, signal * 5.7 + 4.2) * nodeCount);
    if (a === b) continue;
    const f = frac(t * 0.55 + signal * 7.31);
    const point = cubeSurface([
      lerp(nodes[a][0], nodes[b][0], f),
      lerp(nodes[a][1], nodes[b][1], f),
      lerp(nodes[a][2], nodes[b][2], f)
    ]);
    const [x, y, z] = pt(point[0], point[1], point[2]);
    const depth = cubeDepth(z, half);
    dots.push({
      x,
      y,
      z,
      r: (nodeR * 1.5 + nodeDepthR * depth) * rs,
      white: 0.05,
      a: 0.5 + 0.5 * depth
    });
  }

  paintLines(ctx, lines, dark);
  paint(ctx, dots, dark, o.rMin);
};