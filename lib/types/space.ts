export type Point = { x: number; y: number };

export type Line = { origin: Point; destination: Point };

export type Ray = { line: Line; distance: number };
