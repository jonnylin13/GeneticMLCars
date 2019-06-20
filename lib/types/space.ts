export type point = { x: number; y: number };

export type line = { origin: point; destination: point };

export type ray = { line: line; distance: number };
