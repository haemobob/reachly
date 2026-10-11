export function shouldAnimate(
  reduced: boolean,
  paused: boolean,
  visible = true,
): boolean {
  return !reduced && !paused && visible;
}
