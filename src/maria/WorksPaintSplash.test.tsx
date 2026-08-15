import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import WorksPaintSplash, { shouldTriggerWorksPaintSplash } from './WorksPaintSplash'

describe('WorksPaintSplash', () => {
  it('triggers only when the marked placeholder newly enters the center', () => {
    expect(shouldTriggerWorksPaintSplash(7, 8)).toBe(true)
    expect(shouldTriggerWorksPaintSplash(8, 8)).toBe(false)
    expect(shouldTriggerWorksPaintSplash(9, 8)).toBe(true)
    expect(shouldTriggerWorksPaintSplash(8, 9)).toBe(false)
  })

  it('renders a decorative vector layer and restarts for a new activation', () => {
    const { container, rerender } = render(<WorksPaintSplash activation={1} />)
    const splash = container.querySelector('.works-paint-splash')
    const svg = container.querySelector('svg')

    expect(splash).toHaveAttribute('aria-hidden', 'true')
    expect(splash).toHaveAttribute('data-activation', '1')
    expect(svg).toHaveAttribute('focusable', 'false')
    expect(container.querySelectorAll('.works-paint-splash__edge')).toHaveLength(4)
    expect(container.querySelectorAll('.works-paint-splash__graffiti-outline')).toHaveLength(4)
    expect(container.querySelectorAll('.works-paint-splash__spray-dot')).toHaveLength(12)
    expect(container.querySelectorAll('.works-paint-splash__tag-stroke')).toHaveLength(2)
    expect(container.querySelector('.works-paint-splash__impact')).toBeNull()
    expect(container.querySelector('.works-paint-splash__drips')).toBeNull()
    expect(container.querySelector('.works-paint-splash__soft-pool')).toBeNull()

    rerender(<WorksPaintSplash activation={2} />)
    expect(container.querySelector('.works-paint-splash')).toHaveAttribute('data-activation', '2')
  })

  it('does not mount before the first activation', () => {
    const { container } = render(<WorksPaintSplash activation={0} />)
    expect(container).toBeEmptyDOMElement()
  })
})
