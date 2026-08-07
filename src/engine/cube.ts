import type { Projector } from './core';
import { fibDir, makeProj } from './core';

export type Vec3 = [number, number, number];

export interface CubeSample {
  point: Vec3;
  face: number;
  u: number;
  v: number;
}

const YAW = Math.PI / 4;
const TILT = Math.PI / 6;
const DEPTH_EXTENT = Math.sqrt(3);

const VERTICES: ReadonlyArray<readonly [number, number, number]> = [
  [-1, -1, -1],
  [1, -1, -1],
  [1, 1, -1],
  [-1, 1, -1],
  [-1, -1, 1],
  [1, -1, 1],
  [1, 1, 1],
  [-1, 1, 1]
];

const EDGES: ReadonlyArray<readonly [number, number]> = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 4],
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7]
];

export const CUBE_EDGE_COUNT = EDGES.length;

export function cubeRadius(size: number, scale = 1): number {
  return (size / 2) * 0.52 * scale;
}

export function makeCubeProj(
  yawOffset: number,
  tiltOffset: number,
  cx: number,
  cy: number,
  scale: number
): Projector {
  return makeProj(YAW + yawOffset, TILT + tiltOffset, cx, cy, scale);
}

export function cubeDepth(z: number, halfExtent = 1): number {
  return Math.max(0, Math.min(1, (z / (halfExtent * DEPTH_EXTENT) + 1) / 2));
}

export function cubeSurface(point: readonly [number, number, number], halfExtent = 1): Vec3 {
  const m = Math.max(Math.abs(point[0]), Math.abs(point[1]), Math.abs(point[2]));
  if (m < 1e-6) return [0, 0, 0];
  const scale = halfExtent / m;
  return [point[0] * scale, point[1] * scale, point[2] * scale];
}

export function cubeSurfaceSamples(count: number, halfExtent = 1): Vec3[] {
  const points: Vec3[] = [];
  for (let i = 0; i < count; i++) points.push(cubeSurface(fibDir(i, count), halfExtent));
  return points;
}

export function cubeFaceGrid(divisions: number): CubeSample[] {
  const n = Math.max(2, Math.round(divisions));
  const samples: CubeSample[] = [];
  for (let face = 0; face < 6; face++) {
    for (let yi = 0; yi < n; yi++) {
      const v = -1 + (yi / (n - 1)) * 2;
      for (let xi = 0; xi < n; xi++) {
        const u = -1 + (xi / (n - 1)) * 2;
        let point: Vec3;
        if (face === 0) point = [1, u, v];
        else if (face === 1) point = [-1, u, v];
        else if (face === 2) point = [u, 1, v];
        else if (face === 3) point = [u, -1, v];
        else if (face === 4) point = [u, v, 1];
        else point = [u, v, -1];
        samples.push({ point, face, u, v });
      }
    }
  }
  return samples;
}

export function cubeEdgePoint(edgeIndex: number, f: number, halfExtent = 1): Vec3 {
  const edge = EDGES[((edgeIndex % EDGES.length) + EDGES.length) % EDGES.length];
  const a = VERTICES[edge[0]];
  const b = VERTICES[edge[1]];
  const t = Math.max(0, Math.min(1, f));
  return [
    (a[0] + (b[0] - a[0]) * t) * halfExtent,
    (a[1] + (b[1] - a[1]) * t) * halfExtent,
    (a[2] + (b[2] - a[2]) * t) * halfExtent
  ];
}

export function cubeWirePoints(perEdge: number, halfExtent = 1): Vec3[] {
  const n = Math.max(2, Math.round(perEdge));
  const points: Vec3[] = [];
  for (let edge = 0; edge < EDGES.length; edge++) {
    for (let i = 0; i < n; i++) points.push(cubeEdgePoint(edge, i / (n - 1), halfExtent));
  }
  return points;
}