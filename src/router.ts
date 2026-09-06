import { flushSync } from 'react-dom'

export type RoutePath = '/' | '/works' | '/hackathons' | '/archive' | '/article' | '/about'
export type ActiveRoutePath = '/' | '/works' | '/hackathons'
export type RouteViewTransition = { ready?: Promise<void>; finished: Promise<void> }
type TransitionDocument = Document & {
  startViewTransition?: (update: () => void | Promise<void>) => RouteViewTransition
}
const routes: ActiveRoutePath[] = ['/', '/works', '/hackathons']
export const ROUTE_TRANSITION_READY_EVENT = 'maria-route-transition-ready'

export const normalizePath = (path: string): ActiveRoutePath => routes.includes(path as ActiveRoutePath) ? path as ActiveRoutePath : '/'

export function routeTransitionDirection(
  from: ActiveRoutePath,
  to: ActiveRoutePath,
): 'forward' | 'back' | null {
  if (from === to) return null
  return to === '/' ? 'back' : 'forward'
}

function shouldSkipNativeTransition(from: ActiveRoutePath, to: ActiveRoutePath) {
  return (from === '/' && to === '/works') || (from === '/works' && to === '/')
}

export function navigate(path: RoutePath) {
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
  window.scrollTo?.({ top: 0 })
}

export function navigateWithTransition(path: RoutePath): RouteViewTransition | null {
  const transitionDocument = document as TransitionDocument
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  if (!transitionDocument.startViewTransition || reduceMotion) {
    navigate(path)
    return null
  }

  const currentPath = normalizePath(window.location.pathname)
  const targetPath = normalizePath(path)
  if (shouldSkipNativeTransition(currentPath, targetPath)) {
    navigate(path)
    return null
  }

  const transitionDirection = routeTransitionDirection(currentPath, targetPath)
  const activePath = path === '/' ? currentPath : normalizePath(path)
  const transitionRoute = activePath === '/works' ? 'works' : activePath === '/hackathons' ? 'hackathons' : ''
  if (transitionRoute) document.documentElement.dataset.transitionRoute = transitionRoute
  if (transitionDirection) document.documentElement.dataset.transitionDirection = transitionDirection

  const transition = transitionDocument.startViewTransition(() => {
    flushSync(() => navigate(path))
  })
  void transition.finished.then(() => {
    document.dispatchEvent(new Event(ROUTE_TRANSITION_READY_EVENT))
  }).catch(() => undefined)
  void transition.finished.finally(() => {
    if (document.documentElement.dataset.transitionRoute === transitionRoute) {
      delete document.documentElement.dataset.transitionRoute
    }
    if (document.documentElement.dataset.transitionDirection === transitionDirection) {
      delete document.documentElement.dataset.transitionDirection
    }
  })
  return transition
}
