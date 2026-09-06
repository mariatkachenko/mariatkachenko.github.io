import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import MtsFlyoutOverlay from './MtsFlyoutOverlay'

describe('MtsFlyoutOverlay', () => {
  it('stays unmounted until the MTS flyout is activated', () => {
    const { container } = render(<MtsFlyoutOverlay activation={0} visible={false} />)
    expect(container.querySelector('.mts-flyout-overlay')).toBeNull()
  })

  it('renders both original flyout assets in an independent screen layer', () => {
    const { container } = render(<MtsFlyoutOverlay activation={1} visible />)
    const overlay = container.querySelector('.mts-flyout-overlay')

    expect(overlay).toHaveAttribute('data-activation', '1')
    expect(overlay).toHaveAttribute('aria-hidden', 'true')
    expect(container.querySelectorAll('.mts-flyout-overlay__logo')).toHaveLength(1)
    expect(container.querySelectorAll('.mts-flyout-overlay__butterfly')).toHaveLength(1)
    expect(container.querySelectorAll('img[src="/assets/maria/mts-pay-logo-flyout.webp"]')).toHaveLength(1)
    expect(container.querySelectorAll('img[src="/assets/maria/mts-pay-butterfly-flyout.webp"]')).toHaveLength(1)
    container.querySelectorAll('img').forEach((image) => {
      expect(image).toHaveAttribute('loading', 'eager')
      expect(image).toHaveAttribute('decoding', 'sync')
      expect(image).toHaveAttribute('fetchpriority', 'high')
    })
  })

  it('keeps inactive assets mounted for loading without activating their animations', () => {
    const { container, rerender } = render(<MtsFlyoutOverlay activation={1} visible />)
    rerender(<MtsFlyoutOverlay activation={1} visible={false} />)
    expect(container.querySelector('.mts-flyout-overlay')).toBeInTheDocument()
    expect(container.querySelector('.mts-flyout-overlay')).not.toHaveClass('is-active')
    expect(container.querySelectorAll('.mts-flyout-overlay img')).toHaveLength(2)
  })
})
