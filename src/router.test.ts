import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { navigateWithTransition, ROUTE_TRANSITION_READY_EVENT } from './router'

type TransitionDocument = Document & {
  startViewTransition?: (update: () => void | Promise<void>) => { ready?: Promise<void>; finished: Promise<void> }
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

    navigateWithTransition('/hackathons')

    expect(startViewTransition).toHaveBeenCalledOnce()
    expect(document.documentElement.dataset.transitionRoute).toBe('hackathons')
    expect(document.documentElement.dataset.transitionDirection).toBe('forward')
    expect(requestAnimationFrame).not.toHaveBeenCalled()
    expect(window.location.pathname).toBe('/hackathons')
    await Promise.resolve()
    expect(document.documentElement.dataset.transitionRoute).toBeUndefined()
    expect(document.documentElement.dataset.transitionDirection).toBeUndefined()
  })

  it('keeps home and works navigation live to avoid native snapshot flicker', () => {
    const startViewTransition = vi.fn((update: () => void | Promise<void>) => {
      void update()
      return { finished: Promise.resolve() }
    })
    Object.defineProperty(document, 'startViewTransition', {
      value: startViewTransition,
      writable: true,
      configurable: true,
    })

    expect(navigateWithTransition('/works')).toBeNull()
    expect(startViewTransition).not.toHaveBeenCalled()
    expect(window.location.pathname).toBe('/works')
    expect(document.documentElement.dataset.transitionRoute).toBeUndefined()
    expect(document.documentElement.dataset.transitionDirection).toBeUndefined()

    expect(navigateWithTransition('/')).toBeNull()
    expect(startViewTransition).not.toHaveBeenCalled()
    expect(window.location.pathname).toBe('/')
    expect(document.documentElement.dataset.transitionRoute).toBeUndefined()
    expect(document.documentElement.dataset.transitionDirection).toBeUndefined()
  })

  it('marks navigation back to the home page separately from a forward dissolve', async () => {
    window.history.replaceState({}, '', '/hackathons')
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

  it('announces when the native transition has finished covering the live scene', async () => {
    let resolveReady!: () => void
    let resolveFinished!: () => void
    const ready = new Promise<void>((resolve) => { resolveReady = resolve })
    const finished = new Promise<void>((resolve) => { resolveFinished = resolve })
    const listener = vi.fn()
    document.addEventListener(ROUTE_TRANSITION_READY_EVENT, listener, { once: true })
    Object.defineProperty(document, 'startViewTransition', {
      value: (update: () => void | Promise<void>) => {
        void update()
        return { ready, finished }
      },
      writable: true,
      configurable: true,
    })

    navigateWithTransition('/hackathons')
    expect(listener).not.toHaveBeenCalled()
    resolveReady()
    await ready
    await Promise.resolve()
    expect(listener).not.toHaveBeenCalled()
    resolveFinished()
    await finished
    await Promise.resolve()
    expect(listener).toHaveBeenCalledOnce()
  })

  it('navigates immediately when view transitions are unavailable', () => {
    expect((document as TransitionDocument).startViewTransition).toBeUndefined()

    navigateWithTransition('/hackathons')

    expect(window.location.pathname).toBe('/hackathons')
  })

})
