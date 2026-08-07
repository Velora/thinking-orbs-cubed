import type { ModeKey } from '../presets';
import { drawBraid } from './braid';
import { drawGlobe, drawRubik, drawWave } from './lattice';
import { drawMorph } from './morph';
import { drawOrbits } from './orbits';
import { drawBreathingCube, drawRibbon } from './ribbon';
import type { ModeDraw } from './types';
import { drawWeb } from './web';

export const CUBE_DRAWS: Record<ModeKey, ModeDraw> = {
  orbits: drawOrbits,
  globe: drawGlobe,
  rubik: drawRubik,
  wave: drawWave,
  web: drawWeb,
  braid: drawBraid,
  ribbon: drawRibbon,
  ring: drawBreathingCube,
  morph: drawMorph
};

export const MODE_DRAWS = CUBE_DRAWS;