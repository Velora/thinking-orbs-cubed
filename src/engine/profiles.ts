export interface ModeOpts {
  [key: string]: number | undefined;
}

const COUNT_PAIRS: ReadonlyArray<readonly [string, string]> = [['lanes', 'segments']];
const GRID_KEYS = ['faceGrid'] as const;
const COUNT_KEYS = [
  'edgeDots',
  'particleCount',
  'trailDots',
  'nodeCount',
  'signalCount',
  'strandDots',
  'surfaceDots'
] as const;
const RADIUS_KEYS = [
  'rBase',
  'rDepth',
  'rActive',
  'trailR',
  'particleR',
  'particleDepthR',
  'nodeR',
  'nodeDepthR',
  'surfaceR',
  'dotR',
  'dotDepthR'
] as const;

export function scaleCounts(opts: ModeOpts, scale: number): ModeOpts {
  const out: ModeOpts = { ...opts };
  const done = new Set<string>();
  const root = Math.sqrt(scale);
  for (const [a, b] of COUNT_PAIRS) {
    const av = out[a];
    const bv = out[b];
    if (av != null && bv != null) {
      out[a] = Math.max(1, Math.round(av * root));
      out[b] = Math.max(4, Math.round(bv * root));
      done.add(a);
      done.add(b);
    }
  }
  for (const key of GRID_KEYS) {
    const value = out[key];
    if (value != null) out[key] = Math.max(2, Math.round(value * root));
  }
  for (const key of COUNT_KEYS) {
    const value = out[key];
    if (value != null && value !== 0 && !done.has(key)) out[key] = Math.max(1, Math.round(value * scale));
  }
  return out;
}

export function scaleRadii(opts: ModeOpts, scale: number): ModeOpts {
  const out: ModeOpts = { ...opts };
  for (const key of RADIUS_KEYS) {
    const value = out[key];
    if (value != null) out[key] = value * scale;
  }
  return out;
}

export const BASE_PROFILES: Record<string, ModeOpts> = {
  orbits: {
    edgeDots: 10,
    particleCount: 5,
    trailDots: 3,
    trailR: 0.75,
    trailA: 0.48,
    particleR: 1.45,
    particleDepthR: 1.2,
    rsPow: 0.6,
    rMin: 0.3
  },
  globe: {
    faceGrid: 9,
    rBase: 0.62,
    rDepth: 1.65,
    rBoost: 0.9,
    inkFar: 0.64,
    inkSpan: 0.54,
    scanRate: 1.35,
    scanWidth: 0.16,
    dimBase: 0.48,
    rsPow: 0.6,
    rMin: 0.3
  },
  rubik: {
    faceGrid: 8,
    moveCount: 12,
    rBase: 0.62,
    rDepth: 1.7,
    rActive: 0.38,
    inkFar: 0.64,
    inkSpan: 0.54,
    rsPow: 0.6,
    rMin: 0.3
  },
  wave: {
    faceGrid: 8,
    waveAmp: 0.055,
    rBase: 0.62,
    rDepth: 1.68,
    rsPow: 0.6,
    rMin: 0.3
  },
  web: {
    nodeCount: 30,
    linkDistance: 0.82,
    signalCount: 5,
    nodeR: 1.35,
    nodeDepthR: 1.75,
    lineW: 0.8,
    cubeScale: 1,
    rsPow: 0.6,
    rMin: 0.3
  },
  braid: {
    strandDots: 52,
    turns: 3,
    surfaceDots: 100,
    surfaceR: 0.72,
    rBase: 1.15,
    rDepth: 1.75,
    rsPow: 0.6,
    rMin: 0.3
  },
  ribbon: {
    lanes: 5,
    segments: 72,
    surfaceDots: 90,
    surfaceR: 0.7,
    rBase: 1.05,
    rDepth: 1.65,
    spin: 0,
    waveMul: 1,
    bandMul: 1,
    rsPow: 0.6,
    rMin: 0.3
  },
  ring: {
    edgeDots: 9,
    shells: 3,
    breathAmp: 0.075,
    rBase: 0.95,
    rDepth: 1.55,
    rsPow: 0.6,
    rMin: 0.3
  },
  morph: {
    edgeDots: 10,
    dotR: 1.25,
    dotDepthR: 0.9,
    shapeScale: 1,
    rsPow: 0.6,
    rMin: 0.25
  }
};