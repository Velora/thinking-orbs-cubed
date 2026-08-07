import type { CSSProperties, CanvasHTMLAttributes } from 'react';

export type CubeState =
  | 'working'
  | 'searching'
  | 'solving'
  | 'listening'
  | 'connecting'
  | 'weaving'
  | 'composing'
  | 'breathing'
  | 'shaping';

export type CubeSize = 64 | 20;

export type CubeTheme = 'auto' | 'dark' | 'light';

export interface ThinkingCubeProps extends Omit<CanvasHTMLAttributes<HTMLCanvasElement>, 'style'> {
  state?: CubeState;
  size?: CubeSize;
  theme?: CubeTheme;
  speed?: number;
  paused?: boolean;
  style?: CSSProperties;
}

export type OrbState = CubeState;
export type OrbSize = CubeSize;
export type OrbTheme = CubeTheme;
export type ThinkingOrbProps = ThinkingCubeProps;