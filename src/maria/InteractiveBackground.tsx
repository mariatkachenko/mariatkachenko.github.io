import type { CSSProperties } from 'react'
import ModelBackground from './ModelBackground'
import ShimmerTrail from './ShimmerTrail'

export const MODEL_FLOAT_DURATION_SECONDS = 4.2
export const MODEL_FLOAT_AMPLITUDE_PX = 11
export const MODEL_POSE_SCALE = 1.06
export const MODEL_POSE_TILT_DEGREES = 0

type InteractiveBackgroundProps = {
  showModel?: boolean
  showShimmer?: boolean
}

export default function InteractiveBackground({
  showModel = true,
  showShimmer = true,
}: InteractiveBackgroundProps) {
  return <div className="maria-interactive-background">
    {showModel && <div
      className="maria-model-float"
      style={{
        '--model-float-duration': `${MODEL_FLOAT_DURATION_SECONDS}s`,
        '--model-float-amplitude': `${MODEL_FLOAT_AMPLITUDE_PX}px`,
      } as CSSProperties}
    >
      <div
        className="maria-model-pose"
        style={{
          '--model-pose-scale': MODEL_POSE_SCALE,
          '--model-pose-tilt': `${MODEL_POSE_TILT_DEGREES}deg`,
        } as CSSProperties}
      >
        <ModelBackground />
      </div>
    </div>}
    {showShimmer && <ShimmerTrail />}
  </div>
}
