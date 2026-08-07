import type { Dot, ModeDraw } from './types';
import { hashD, paint, radiusScale } from './core';
import { cubeDepth, cubeFaceGrid, cubeRadius, makeCubeProj } from './cube';

interface Move {
  axis: 0 | 1 | 2;
  lo: number;
  hi: number;
  ang: number;
}

function solveCycle(time: number, count: number, slotDuration: number, rest: number) {
  const cycle = 2 * count * slotDuration + rest;
  const cycleTime = time % cycle;
  const amount = new Array<number>(count).fill(0);
  let active = -1;
  if (cycleTime < 2 * count * slotDuration) {
    const slot = Math.floor(cycleTime / slotDuration);
    const progress = (cycleTime - slot * slotDuration) / slotDuration;
    const clamped = Math.min(1, progress / 0.7);
    const eased = 1 - (1 - clamped) ** 3;
    if (slot < count) {
      for (let i = 0; i < slot; i++) amount[i] = 1;
      amount[slot] = eased;
      active = slot;
    } else {
      const reverse = 2 * count - 1 - slot;
      for (let i = 0; i < reverse; i++) amount[i] = 1;
      amount[reverse] = 1 - eased;
      active = reverse;
    }
  }
  return { amount, active };
}

function applyMoves(
  point: [number, number, number],
  moves: Move[],
  cycle: { amount: number[]; active: number }
): [number, number, number, boolean] {
  let [x, y, z] = point;
  let inActive = false;
  for (let i = 0; i < moves.length; i++) {
    if (cycle.amount[i] <= 0) continue;
    const move = moves[i];
    const coord = move.axis === 0 ? x : move.axis === 1 ? y : z;
    if (coord < move.lo || coord >= move.hi) continue;
    if (i === cycle.active) inActive = true;
    const angle = move.ang * cycle.amount[i];
    const cosine = Math.cos(angle);
    const sine = Math.sin(angle);
    if (move.axis === 0) {
      const y2 = y * cosine - z * sine;
      z = y * sine + z * cosine;
      y = y2;
    } else if (move.axis === 1) {
      const x2 = x * cosine + z * sine;
      z = -x * sine + z * cosine;
      x = x2;
    } else {
      const x2 = x * cosine - y * sine;
      y = x * sine + y * cosine;
      x = x2;
    }
  }
  return [x, y, z, inActive];
}

function makeMoves(count: number): Move[] {
  const moves: Move[] = [];
  for (let i = 0; i < count; i++) {
    const axis = Math.min(2, Math.floor(hashD(i, 2.3) * 3)) as 0 | 1 | 2;
    const lo = -1 + 0.5 * Math.min(3, Math.floor(hashD(i, 5.9) * 4));
    const direction = hashD(i, 7.7) < 0.5 ? 1 : -1;
    moves.push({ axis, lo, hi: lo + 0.5, ang: (direction * Math.PI) / 2 });
  }
  return moves;
}

export const drawGlobe: ModeDraw = (ctx, size, t, dark, o) => {
  const center = size / 2;
  const half = cubeRadius(size);
  const pt = makeCubeProj(Math.sin(t * 0.18) * 0.06, Math.sin(t * 0.13) * 0.03, center, center, half);
  const rs = radiusScale(size, o.rsPow ?? 0.6);
  const scan = Math.sin(t * (o.scanRate ?? 1.35));
  const scanWidth = o.scanWidth ?? 0.16;
  const dimBase = o.dimBase ?? 0.48;
  const dots: Dot[] = [];

  for (const sample of cubeFaceGrid(o.faceGrid ?? 9)) {
    const [x, y, z] = pt(sample.point[0], sample.point[1], sample.point[2]);
    const depth = cubeDepth(z, half);
    const distance = sample.point[0] - scan;
    const boost = Math.exp(-(distance * distance) / scanWidth) * (0.35 + depth * 0.65);
    dots.push({
      x,
      y,
      z,
      r: ((o.rBase ?? 0.62) + (o.rDepth ?? 1.65) * depth + (o.rBoost ?? 0.9) * boost) * rs,
      white: (o.inkFar ?? 0.64) - (o.inkSpan ?? 0.54) * depth,
      a: dimBase + (1 - dimBase) * Math.min(1, boost)
    });
  }

  paint(ctx, dots, dark, o.rMin);
};

export const drawRubik: ModeDraw = (ctx, size, t, dark, o) => {
  const center = size / 2;
  const half = cubeRadius(size, 0.96);
  const pt = makeCubeProj(Math.sin(t * 0.14) * 0.055, Math.sin(t * 0.19) * 0.025, center, center, half);
  const rs = radiusScale(size, o.rsPow ?? 0.6);
  const moveCount = Math.max(1, Math.round(o.moveCount ?? 12));
  const moves = makeMoves(moveCount);
  const cycle = solveCycle(t, moveCount, 0.42, 1.2);
  const dots: Dot[] = [];

  for (const sample of cubeFaceGrid(o.faceGrid ?? 8)) {
    const [px, py, pz, active] = applyMoves(sample.point, moves, cycle);
    const [x, y, z] = pt(px, py, pz);
    const depth = cubeDepth(z, half);
    dots.push({
      x,
      y,
      z,
      r: ((o.rBase ?? 0.62) + (o.rDepth ?? 1.7) * depth + (active ? (o.rActive ?? 0.38) : 0)) * rs,
      white: (o.inkFar ?? 0.64) - (o.inkSpan ?? 0.54) * depth - (active ? 0.14 : 0)
    });
  }

  paint(ctx, dots, dark, o.rMin);
};

export const drawWave: ModeDraw = (ctx, size, t, dark, o) => {
  const center = size / 2;
  const half = cubeRadius(size, 0.97);
  const pt = makeCubeProj(Math.sin(t * 0.1) * 0.045, Math.sin(t * 0.16) * 0.025, center, center, 1);
  const rs = radiusScale(size, o.rsPow ?? 0.6);
  const dots: Dot[] = [];

  for (const sample of cubeFaceGrid(o.faceGrid ?? 8)) {
    const p = sample.point;
    const wave = 0.62 * Math.sin(t * 2.05 - p[1] * 3.8) + 0.38 * Math.sin(t * 1.27 + p[1] * 5.2 + p[0]);
    const radial = half * (0.95 + wave * (o.waveAmp ?? 0.055));
    const [x, y, z] = pt(p[0] * radial, p[1] * radial, p[2] * radial);
    const depth = cubeDepth(z, half);
    const crest = Math.max(0, wave);
    dots.push({
      x,
      y,
      z,
      r: ((o.rBase ?? 0.62) + (o.rDepth ?? 1.68) * depth) * (1 + crest * 0.35) * rs,
      white: 0.66 - depth * 0.55 - crest * 0.09
    });
  }

  paint(ctx, dots, dark, o.rMin);
};