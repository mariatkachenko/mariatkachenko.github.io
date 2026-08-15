const FORWARD_FRAME_URLS = Array.from(
  { length: 16 },
  (_, index) => `/assets/maria/scroll/frame-${String(index + 1).padStart(3, '0')}.webp`,
)

export const SCROLL_FRAME_URLS = [
  ...FORWARD_FRAME_URLS,
  ...FORWARD_FRAME_URLS.slice(0, -1).reverse(),
]

export function frameIndexForProgress(progress: number, count: number) {
  if (count <= 1) return 0

  const clampedProgress = Math.min(1, Math.max(0, progress))
  return Math.round(clampedProgress * (count - 1))
}

export function nextFrameIndex(current: number, count: number) {
  if (count <= 1) return 0
  return (current + 1 + count) % count
}

export function frameIndexAfterDirection(current: number, count: number, direction: -1 | 1) {
  if (count <= 1) return 0
  return (current + direction + count) % count
}
