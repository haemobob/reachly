const curves = [
  [
    180, 720, 480, 680, 690, 560, 820, 350, 960, 80, 1220, 70, 1290, 270, 1440,
    660, 910, 680, 980, 350, 1020, 100, 1200, 240, 1430, 300,
  ],
  [
    -160, 740, 160, 680, 230, 300, 520, 230, 760, 150, 1240, 120, 1320, 350,
    1420, 660, 1030, 780, 660, 650, 350, 560, 980, 420, 1500, 540,
  ],
  [
    300, 760, 530, 680, 640, 280, 790, 240, 1030, 150, 1440, 160, 1250, 400,
    1050, 650, 700, 540, 1000, 490, 1300, 440, 950, 740, 1510, 760,
  ],
  [
    -120, 760, 120, 720, 340, 290, 600, 360, 780, 460, 760, 740, 970, 540, 1220,
    250, 1000, 140, 1310, 210, 1550, 270, 1400, 570, 1680, 580,
  ],
  [
    -240, 850, 80, 800, 170, 430, 610, 340, 970, 260, 1190, 490, 1210, 290,
    1210, 30, 1440, 40, 1510, 180, 1600, 360, 1510, 520, 1690, 680,
  ],
  [
    -140, 900, 210, 820, 430, 580, 850, 480, 1140, 430, 1000, 140, 1270, 160,
    1540, 180, 1430, 540, 1130, 390, 1340, 270, 1450, 230, 1660, 140,
  ],
];
export function worldPose(phase: number) {
  const k = Math.max(0, Math.min(5, Number.isFinite(phase) ? phase : 0));
  const i = Math.min(4, Math.floor(k));
  const t = k - i;
  const ease = t * t * (3 - 2 * t);
  const smooth = (value: number) => {
    const v = Math.max(0, Math.min(1, value));
    return v * v * (3 - 2 * v);
  };
  const coords = curves[i].map((v, j) => v + (curves[i + 1][j] - v) * ease);
  let path = `M ${coords[0].toFixed(2)} ${coords[1].toFixed(2)}`;
  for (let j = 2; j < coords.length; j += 6)
    path += ` C ${coords
      .slice(j, j + 6)
      .map((n) => n.toFixed(2))
      .join(" ")}`;
  return {
    coords,
    path,
    readingOpacity:
      1 - 0.68 * smooth((k - 2.65) / 0.35) * (1 - smooth((k - 3.75) / 0.35)),
    plateOpacity: Math.max(0, 1 - k * 0.9),
    passageOpacity: Math.max(0, 1 - Math.abs(k - 3.8)) * 0.2,
    branch: Math.max(0, 1 - Math.abs(k - 2)),
    pointX: coords.at(-2)!,
    pointY: coords.at(-1)!,
  };
}

export function worldPhase(scroll: number, landmarks: number[]): number {
  if (
    landmarks.length < 2 ||
    !Number.isFinite(scroll) ||
    scroll <= landmarks[0]
  )
    return 0;
  for (let i = 0; i < landmarks.length - 1; i++) {
    if (scroll < landmarks[i + 1])
      return (
        i +
        Math.max(
          0,
          Math.min(
            1,
            (scroll - landmarks[i]) /
              Math.max(1, landmarks[i + 1] - landmarks[i]),
          ),
        )
      );
  }
  return landmarks.length - 1;
}
