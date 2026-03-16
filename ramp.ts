export interface Point {
  x: number;
  y: number;
}

export function toRamp(points: Point[]) {
  return toRampCC300(points);
}

export function toRampCC300(origPoints: Point[]) {
  const points = structuredClone(origPoints);
  for (let i = 1; i < points.length - 2; i = i + 2) {
    points[i + 1].x = points[i].x;
    points[i].y = points[i - 1].y;
  }
  points[points.length - 2].y = points[points.length - 3].y;

  return points;
}

/**
 * Converts a profile from a polyline to a manhattan path (staircase, "ramped" profile)
 */
export function toRamp2(origPoints: Point[]) {
  const points = structuredClone(origPoints);
  for (let i = 1; i < points.length - 2; i = i + 2) {
    points[i + 1].x = points[i].x;
    points[i].y = points[i - 1].y;
  }
  points[points.length - 1].y = points[points.length - 2].y;

  return points;
}

/**
 * Converts an ENGEL ramped path to a representation suitable for chart.js "stepped" dataset
 */
export function rampedToChartStepped(ramped: Point[], yoffset = 20) {
  return structuredClone(ramped)
    .filter((_p, i, a) => i % 2 === 0 || i === 0 || i === a.length - 1)
    .map((p) => ({ x: p.x, y: p.y + yoffset }));
}

/**
 * Converts an ENGEL ramped path to a representation suitable for chart.js "stepped" dataset
 */
export function chartSteppedToRamped(ramped: Point[]) {
  // TODO:
  // after each point insert an additional point with x = successor.x and y = predecessor.y
}
