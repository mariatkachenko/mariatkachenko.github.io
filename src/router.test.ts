import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { navigateWithTransition } from './router'

type TransitionDocument = Document & {
  startViewTransition?: (update: () => void | Promise<void>) => { finished: Promise<void> }
}

beforeEach(() => {
  window.history.replaceState({}, '', '/')
  delete document.documentElement.dataset.transitionRoute
  delete document.documentElement.dataset.transitionDirection
  Object.defineProperty(document, 'startViewTransition', {
    value: undefined,
    writable: true,
    configurable: true,
  })
})

afterEach(() => vi.restoreAllMocks())

describe('transition-aware navigation', () => {
  it('uses a view transition when the browser supports it', async () => {
    const requestAnimationFrame = vi.spyOn(window, 'requestAnimationFrame')
    const startViewTransition = vi.fn((update: () => void | Promise<void>) => {
      void update()
      return { finished: Promise.resolve() }
    })
    Object.defineProperty(document, 'startViewTransition', {
      value: startViewTransition,
      writable: true,
      configurable: true,
    })

    navigateWithTransition('/works')

    expect(startViewTransition).toHaveBeenCalledOnce()
    expect(document.documentElement.dataset.transitionRoute).toBe('works')
    expect(document.documentElement.dataset.transitionDirection).toBe('forward')
    expect(requestAnimationFrame).not.toHaveBeenCalled()
    expect(window.location.pathname).toBe('/works')
    await Promise.resolve()
    expect(document.documentElement.dataset.transitionRoute).toBeUndefined()
    expect(document.documentElement.dataset.transitionDirection).toBeUndefined()
  })

  it('marks navigation back to the home page separately from a forward dissolve', async () => {
    window.history.replaceState({}, '', '/works')
    const startViewTransition = vi.fn((update: () => void | Promise<void>) => {
      void update()
      return { finished: Promise.resolve() }
    })
    Object.defineProperty(document, 'startViewTransition', {
      value: startViewTransition,
      writable: true,
      configurable: true,
    })

    navigateWithTransition('/')

    expect(document.documentElement.dataset.transitionDirection).toBe('back')
    expect(window.location.pathname).toBe('/')
    await Promise.resolve()
    expect(document.documentElement.dataset.transitionDirection).toBeUndefined()
  })

  it('navigates immediately when view transitions are unavailable', () => {
    expect((document as TransitionDocument).startViewTransition).toBeUndefined()

    navigateWithTransition('/hackathons')

    expect(window.location.pathname).toBe('/hackathons')
  })

})
