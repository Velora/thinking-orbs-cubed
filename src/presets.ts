import type { ModeOpts } from './engine/profiles';
import { BASE_PROFILES, scaleCounts, scaleRadii } from './engine/profiles';
import type { CubeSize, CubeState } from './types';

export type ModeKey =
  | 'orbits'
  | 'globe'
  | 'rubik'
  | 'wave'
  | 'web'
  | 'braid'
  | 'ribbon'
  | 'ring'
  | 'morph';

export const STATE_TO_MODE: Record<CubeState, ModeKey> = {
  working: 'orbits',
  searching: 'globe',
  solving: 'rubik',
  listening: 'wave',
  connecting: 'web',
  weaving: 'braid',
  composing: 'ribbon',
  breathing: 'ring',
  shaping: 'morph'
};

export const CUBE_STATE_TO_MODE = STATE_TO_MODE;

interface Preset {
  speed: number;
  count: number;
  size: number;
  extra?: ModeOpts;
}

const PRESETS: Record<ModeKey, Record<CubeSize, Preset>> = {
  orbits: {
    64: { speed: 1.9, count: 1, size: 1 },
    20: { speed: 3.4, count: 0.45, size: 1.75 }
  },
  globe: {
    64: { speed: 1.8, count: 0.55, size: 1.1 },
    20: { speed: 2.55, count: 0.14, size: 1.7, extra: { dimBase: 0.54, scanWidth: 0.24 } }
  },
  rubik: {
    64: { speed: 1.7, count: 0.55, size: 1.05 },
    20: { speed: 1.9, count: 0.14, size: 1.75, extra: { moveCount: 8 } }
  },
  wave: {
    64: { speed: 3.7, count: 0.55, size: 1 },
    20: { speed: 3.4, count: 0.14, size: 1.58, extra: { waveAmp: 0.045 } }
  },
  web: {
    64: { speed: 3.1, count: 1.15, size: 0.95 },
    20: { speed: 5.8, count: 0.3, size: 1.5, extra: { linkDistance: 1.05 } }
  },
  braid: {
    64: { speed: 1.55, count: 0.65, size: 1 },
    20: { speed: 2.5, count: 0.18, size: 1.38 }
  },
  ribbon: {
    64: { speed: 2.2, count: 0.48, size: 0.9, extra: { bandMul: 1.35 } },
    20: { speed: 2.9, count: 0.14, size: 1.28, extra: { bandMul: 1.5 } }
  },
  ring: {
    64: { speed: 2.8, count: 0.9, size: 0.95 },
    20: { speed: 3.3, count: 0.45, size: 1.5, extra: { shells: 2, breathAmp: 0.065 } }
  },
  morph: {
    64: { speed: 2.2, count: 0.9, size: 0.9 },
    20: { speed: 2, count: 0.45, size: 1.5 }
  }
};

export interface Resolved {
  mode: ModeKey;
  speed: number;
  opts: ModeOpts;
}

const cache = new Map<string, Resolved>();

export function resolvePreset(state: CubeState, size: CubeSize): Resolved {
  const key = `${state}-${size}`;
  const cached = cache.get(key);
  if (cached) return cached;
  const mode = STATE_TO_MODE[state];
  const preset = PRESETS[mode][size];
  let opts: ModeOpts = { ...BASE_PROFILES[mode] };
  if (preset.count !== 1) opts = scaleCounts(opts, preset.count);
  if (preset.size !== 1) opts = scaleRadii(opts, preset.size);
  if (preset.extra) opts = { ...opts, ...preset.extra };
  const resolved: Resolved = { mode, speed: preset.speed, opts };
  cache.set(key, resolved);
  return resolved;
}