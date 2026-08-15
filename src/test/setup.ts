import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

Object.defineProperty(window, 'scrollTo', { value: () => undefined, writable: true })
Object.defineProperty(HTMLMediaElement.prototype, 'play', {
  value: () => Promise.resolve(),
  writable: true,
})
Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
  value: () => undefined,
  writable: true,
})

afterEach(cleanup)
