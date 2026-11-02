/** Wraps a position into one period of a repeated sequence; the visible image is unchanged. */
export function ribbonPhase(position: number, period: number): number {
  if (!Number.isFinite(position) || !Number.isFinite(period) || period <= 0) return 0;
  return ((position % period) + period) % period;
}
