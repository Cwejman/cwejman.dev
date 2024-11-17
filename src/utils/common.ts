export const clamp = (min: number, max: number, val: number) =>
  Math.min(max, Math.max(min, val));

export const interpolate = (input: number, from: number, to: number) =>
  clamp(0, 1, (input - from) / (to - from));
