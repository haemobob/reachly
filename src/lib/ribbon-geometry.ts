type Point = [number, number, number];

// Equal-length, hand-drawn spines: coil, aperture, service folds, handoff, reach, exit.
const spines: Point[][] = [
  [
    [-1.8, -2.4, 0.4],
    [-2.4, -0.9, 0.2],
    [-2.2, 1.3, -0.4],
    [-1.2, 2.6, -0.5],
    [0.7, 2.9, 0],
    [2.1, 1.7, 0.7],
    [2.2, -0.3, 0.9],
    [1.2, -1.8, 0.4],
    [-0.4, -1.7, -0.7],
    [-1.1, -0.4, -1],
    [0, 0.7, -0.2],
    [1.1, 0.2, 1],
    [1.8, -1.1, 1.5],
  ],
  [
    [-2.8, -1.9, 0.5],
    [-3, -0.1, 0.2],
    [-2.7, 1.9, -0.3],
    [-1.4, 2.6, -0.5],
    [0.6, 2.6, -0.2],
    [2.4, 1.9, 0.2],
    [3, 0.3, 0.6],
    [2.9, -1.6, 0.9],
    [1.5, -2.3, 0.4],
    [-0.2, -2.3, -0.4],
    [-1.6, -2, -0.5],
    [-2.4, -1.2, 0.3],
    [-2.2, -0.4, 1],
  ],
  [
    [-2.7, -2.4, 0.4],
    [-2.8, -0.6, 0.2],
    [-1.7, 0.3, -0.4],
    [-1.8, 2.3, -0.7],
    [-0.5, 2.8, 0],
    [0.3, 1, 0.9],
    [-0.4, -0.4, 1.3],
    [0.7, -1.4, 0.5],
    [2.1, -0.7, -0.6],
    [1.4, 1.1, -1],
    [2.2, 2.1, 0],
    [3.2, 0.6, 1],
    [2.8, -2.1, 1.4],
  ],
  [
    [-4, -0.8, -0.4],
    [-3, -1.4, -0.4],
    [-1.9, -1.3, 0],
    [-1, -0.2, 0.7],
    [-1, 1.1, 0.9],
    [0.2, 1.8, 0.4],
    [1.4, 1.3, -0.5],
    [1.5, 0.1, -0.9],
    [0.7, -0.9, -0.3],
    [1.8, -1.5, 0.6],
    [3, -0.8, 0.9],
    [3.6, 0.5, 0.3],
    [4.1, 1.4, 0],
  ],
  [
    [-4.2, -2, -0.5],
    [-3.3, -1.3, -0.3],
    [-2.5, -0.2, 0.1],
    [-1.9, 1.3, 0.7],
    [-0.5, 2.2, 0.8],
    [1, 2.1, 0.1],
    [2.1, 1.2, -0.7],
    [1.7, -0.2, -0.5],
    [0.8, -1.1, 0.2],
    [1.6, -1.8, 0.9],
    [3, -1.3, 1.1],
    [3.7, 0.1, 0.5],
    [4.3, 2.1, 0],
  ],
  [
    [-4, -1.8, -0.5],
    [-3, -1.7, -0.2],
    [-2, -1.1, 0.4],
    [-0.7, -0.5, 0.6],
    [0.7, 0.1, 0.3],
    [2, 1.1, -0.2],
    [2.9, 2.3, 0],
    [2.4, 2.9, 0.5],
    [1.5, 2.1, 1],
    [2.1, 0.9, 1.2],
    [3.2, 1.2, 0.7],
    [4, 2.2, 0.2],
    [3.4, 3.1, 0],
  ],
];

const clamp = (value: number, max: number) =>
  Math.min(max, Math.max(0, Number.isFinite(value) ? value : 0));
const smooth = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

function curve(points: Point[], t: number): Point {
  const location = clamp(t, 1) * (points.length - 1);
  const i = Math.min(points.length - 2, Math.floor(location));
  const u = location - i;
  const a = points[Math.max(0, i - 1)],
    b = points[i],
    c = points[i + 1],
    d = points[Math.min(points.length - 1, i + 2)];
  return [0, 1, 2].map(
    (axis) =>
      0.5 *
      (2 * b[axis] +
        (-a[axis] + c[axis]) * u +
        (2 * a[axis] - 5 * b[axis] + 4 * c[axis] - d[axis]) * u * u +
        (-a[axis] + 3 * b[axis] - 3 * c[axis] + d[axis]) * u * u * u),
  ) as Point;
}

export function sampleRibbon(phase: number, t: number): Point {
  const p = clamp(phase, 5),
    i = Math.min(4, Math.floor(p)),
    blend = smooth(p - i);
  const a = curve(spines[i], t),
    b = curve(spines[i + 1], t);
  return a.map((value, axis) => value + (b[axis] - value) * blend) as Point;
}

export function buildRibbonGeometry(phase: number, segments = 180) {
  segments = Math.min(
    512,
    Math.max(16, Math.floor(Number.isFinite(segments) ? segments : 180)),
  );
  const positions = new Float32Array((segments + 1) * 8 * 3);
  const indices: number[] = [],
    groups: { start: number; count: number; materialIndex: number }[] = [];
  const p = clamp(phase, 5);
  for (let i = 0; i <= segments; i++) {
    const t = i / segments,
      center = sampleRibbon(p, t);
    const before = sampleRibbon(p, t - 0.0005),
      after = sampleRibbon(p, t + 0.0005);
    const tangent = after.map((v, axis) => v - before[axis]) as Point;
    const length = Math.hypot(...tangent) || 1;
    tangent.forEach((v, axis) => (tangent[axis] = v / length));
    // A fixed reference frame avoids accumulated Frenet-frame flips at inflections.
    let side: Point = [-tangent[1], tangent[0], 0];
    let sideLength = Math.hypot(...side);
    if (sideLength < 0.00001) {
      side = [1, 0, 0];
      sideLength = 1;
    }
    side = side.map((v) => v / sideLength) as Point;
    const normal: Point = [
      tangent[1] * side[2] - tangent[2] * side[1],
      tangent[2] * side[0] - tangent[0] * side[2],
      tangent[0] * side[1] - tangent[1] * side[0],
    ];
    const twist =
      0.62 * Math.sin(t * Math.PI * 3 + p * 0.5) +
      0.35 * Math.sin(t * Math.PI * 7);
    const cos = Math.cos(twist),
      sin = Math.sin(twist);
    const width =
      0.87 +
      0.18 * Math.sin(Math.PI * t) +
      (p > 4
        ? 0.28 * smooth(p - 4) * Math.exp(-(((t - 0.88) / 0.07) ** 2))
        : 0);
    const half = width / 2,
      h = 0.075,
      bevel = 0.045;
    const section = [
      [-half + bevel, h],
      [half - bevel, h],
      [half, h - bevel],
      [half, -h + bevel],
      [half - bevel, -h],
      [-half + bevel, -h],
      [-half, -h + bevel],
      [-half, h - bevel],
    ];
    section.forEach(([x, y], j) => {
      const sx = x * cos - y * sin,
        sy = x * sin + y * cos;
      for (let axis = 0; axis < 3; axis++)
        positions[(i * 8 + j) * 3 + axis] =
          center[axis] + side[axis] * sx + normal[axis] * sy;
    });
  }
  for (let face = 0; face < 8; face++) {
    const start = indices.length;
    for (let i = 0; i < segments; i++) {
      const a = i * 8 + face,
        b = i * 8 + ((face + 1) % 8),
        c = a + 8,
        d = b + 8;
      indices.push(a, c, b, b, c, d);
    }
    groups.push({
      start,
      count: indices.length - start,
      materialIndex: face === 0 || face === 4 ? 0 : 1,
    });
  }
  const start = indices.length;
  for (let j = 1; j < 7; j++) {
    indices.push(0, j, j + 1);
    const end = segments * 8;
    indices.push(end, end + j + 1, end + j);
  }
  groups.push({ start, count: indices.length - start, materialIndex: 1 });
  return { positions, indices: new Uint32Array(indices), groups };
}
