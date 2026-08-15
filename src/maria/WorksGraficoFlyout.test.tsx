import { render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import WorksGraficoFlyout from './WorksGraficoFlyout'

describe('WorksGraficoFlyout', () => {
  afterEach(() => vi.restoreAllMocks())

  it('restarts playback on center entry and pauses when the card leaves', () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue()
    const pause = vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
    const { container, rerender } = render(<WorksGraficoFlyout active={false} />)
    const video = container.querySelector<HTMLVideoElement>('.works-grafico-flyout')!

    expect(video).toHaveAttribute('src', '/assets/maria/grafico.webm')
    expect(video.muted).toBe(true)
    expect(video).toHaveAttribute('playsinline')
    expect(video).toHaveAttribute('loop')

    rerender(<WorksGraficoFlyout active />)
    expect(play).toHaveBeenCalledTimes(1)
    expect(video.currentTime).toBe(0)

    rerender(<WorksGraficoFlyout active={false} />)
    expect(pause).toHaveBeenCalled()
    expect(video.currentTime).toBe(0)
  })
})
